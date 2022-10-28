const { BadRequestError, UnauthorizedError, NotFoundError } = require('./errors/components/classes');
const ProcessError = require('./errors/handler');

const { join } = require('path')
const { unlinkSync } = require('fs')
const convertImg = require('../helpers/convertImage');

const {
    parseCreatePostRequest,
    parseUpdatePostRequest,
    parseCreateLikeRequest
} = require('./requests/PostsRequests');

const { parseCreateCommentRequest } = require('./requests/CommentsRequests');

const {
    PostResponse,
    PostListResponse,
    PostLikeResponse,
    PostLikesListResponse
} = require('./responses/PostsResponses');

const { CommentResponse, CommentsListResponse } = require('./responses/CommentResponses');
const { CategoriesListResponse } = require('./responses/CategoriesResponses');
const GenerateLinks = require('./responses/Links');

const usersQ = require('../data/pg/UsersQ');
const postsQ = require('../data/pg/PostsQ');
const commentsQ = require('../data/pg/CommentsQ');
const categoriesQ = require('../data/pg/CategoriesQ');
const likesQ = require('../data/pg/PostLikesQ');
const mediaQ = require('../data/pg/MediaQ');

const includeHandler = require('./include/handler');
const sortHandler = require('./sort/handler');
const filterHandler = require('./filter/handler');

const type = require('../helpers/types/posts');
const roles = require('../helpers/types/roles');
const httpStatus = require('../helpers/types/httpStatus');
const action = require('../helpers/types/ratingAction');

const { handleRating } = require('../helpers/rating');

exports.CreatePost = async function (req, resp) {
    try {
        const { title, content, categories } = await parseCreatePostRequest(req.body);
        const { id } = req.decoded;

        let dbResp = await new postsQ()
            .New()
            .Insert(
                {
                    author: id,
                    title,
                    publish_date: new Date().toISOString(),
                    status: type.ACTIVE,
                    content,
                    categories
                }
            )
            .Returning()
            .Execute()

        if (dbResp.error)
            throw new Error(`Error creating post: ${dbResp.error_message}`);

        resp.status(httpStatus.CREATED).json(PostResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UploadPostMedia = async function (req, resp) {
    try {
        if (!req.file && !req.files)
            throw new BadRequestError('File corrupted');

        const filePath = join(__dirname, '..', 'user_data');
        const pathToSavedPhoto = join(filePath, 'media');

        const { post_id } = req.params

        for (let file of req.files) {
            const newName = await convertImg(filePath, file.filename, pathToSavedPhoto);

            let dbResp = await new mediaQ()
                .New()
                .Insert({ post_id, path: newName })
                .Execute()

            if (dbResp.error)
                throw new Error(`Failed to add media path to db: ${dbResp.error_message}`);
        }
        
        resp.status(httpStatus.CREATED).end();
    } catch (error) {
        ProcessError(resp, error)
    }
}

exports.CreateComment = async function (req, resp) {
    try {
        const { content } = parseCreateCommentRequest(req.body);
        const { post_id } = req.params;
        const { id } = req.decoded;

        let dbResp = await new commentsQ()
            .New()
            .Insert(
                {
                    author: id,
                    post_id,
                    content,
                    publish_date: new Date().toISOString()
                }
            )
            .Returning()
            .Execute()

        if (dbResp.error)
            throw new Error(`Error adding comment : ${dbResp.error_message}`);

        resp.status(httpStatus.CREATED).json(CommentResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.CreateLike = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { id } = req.decoded;
        const { is_dislike, liked_on } = parseCreateLikeRequest(req.body);

        let dbResp = await new likesQ().New().Get().WhereAuthor(id).WherePostID(post_id).Execute();

        if (!dbResp.error && dbResp.is_dislike === is_dislike)
            throw new BadRequestError('You already did that action to this post');


        await new likesQ().Transaction(async () => {
            //if no such like entity exists
            if (dbResp.error) {
                dbResp = await new likesQ().New().Insert(
                    {
                        author: id,
                        publish_date: new Date().toISOString(),
                        liked_on,
                        is_dislike,
                        post_id
                    }
                )
                    .Returning()
                    .Execute()

                if (dbResp.error)
                    throw new Error(`Error creating like: ${dbResp.error_message}`);

            }

            //probably this will be triggered when you smashing dislike instead of like and vice versa
            else {
                dbResp = await new likesQ().New()
                    .Update(
                        {
                            is_dislike: !dbResp.is_dislike,
                            publish_date: new Date().toISOString()
                        }
                    )
                    .WhereAuthor(id)
                    .WherePostID(post_id)
                    .Returning()
                    .Execute();

                if (dbResp.error)
                    throw new Error(`Error changing like ${error.error_message}`);
            }


            const actionType = is_dislike ? action.DECREASE : action.INCREASE;
            await handleRating(actionType, liked_on, post_id);
        })

        resp.status(httpStatus.CREATED).json(PostLikeResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetPost = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { include } = req.query;

        let includeResp = null;


        let dbResp = await new postsQ().New().Get().WhereID(post_id).Execute();

        if (dbResp.error)
            throw new BadRequestError(`Error getting post: ${dbResp.error_message}`);

        if (include !== undefined)
            includeResp = await includeHandler(include, { post_id });

        const owner = await new usersQ().New().Get().WhereID(dbResp.author).Execute()

        if (owner.error)
            throw new NotFoundError(`Error getting owner: ${owner.error_message}`);

        const media = await new mediaQ().New().Get().WherePostID(post_id).Execute(true)

        if (!media.error)
            Object.assign(dbResp, { media })

        resp.status(httpStatus.OK).json(PostResponse(dbResp, includeResp, owner));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetPostsList = async function (req, resp) {
    try {
        const { role } = req.decoded;
        const { page, limit, sort, order, filter } = req.query;

        let Q = new postsQ().New().Get();

        let customStmt = null;
        //TODO find out better solution for that
        if (filter !== undefined) {
            const filterResp = filterHandler(filter, Q);
            customStmt = filterResp.filterStmt;
            Q = filterResp.Q;
        }

        if (role !== roles.ADMIN) {
            Q = Q.WhereStatus(true);

            if (customStmt === null)
                customStmt = 'WHERE status=true'
            else
                customStmt = `${customStmt} and status=true`
        }

        if (sort !== undefined) Q = sortHandler(sort, order, Q);

        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if (dbResp.error)
            throw new NotFoundError(`No posts found: ${dbResp.error_message}`);

        const links = await GenerateLinks('posts', Q, customStmt, filter, sort, order);

        resp.status(httpStatus.OK).json(PostListResponse(dbResp, links));

    } catch (error) {
        ProcessError(resp, error);
    }
}


exports.GetCommentsList = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { page, filter, limit, sort, order } = req.query;

        let Q = new commentsQ().New().Get().WherePostID(post_id);

        if (sort !== undefined) Q = sortHandler(sort, order, Q);

        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if (dbResp.error)
            throw new NotFoundError(`No comments found: ${dbResp.error_message}`);

        const links = await GenerateLinks(
            `posts/${post_id}/comments`,
            Q,
            `WHERE post=${post_id}`,
            filter,
            sort,
            order);

        resp.status(httpStatus.OK).json(CommentsListResponse(dbResp, links));

    } catch (error) {
        ProcessError(resp, error);
    }
}


exports.GetLikesList = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { page, limit, sort, order } = req.query;

        let Q = new likesQ().New().Get().WherePostID(post_id);

        if (sort !== undefined) Q = sortHandler(sort, order, Q);

        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if (dbResp.error)
            throw new NotFoundError(`No likes found: ${dbResp.error_message}`);

        const links = await GenerateLinks(`posts/${post_id}/like`, Q, `WHERE post_id=${post_id}`);

        resp.status(httpStatus.OK).json(PostLikesListResponse(dbResp, links));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetCategories = async function (req, resp) {
    try {
        const { post_id } = req.params;

        let dbResp = await new postsQ().New().Get().WhereID(post_id).Execute();

        if (dbResp.error)
            throw new NotFoundError(`No such post ${dbResp.error_message}`);

        const { categories } = dbResp;

        let categoriesList = [];

        for (let category of categories) {
            dbResp = await new categoriesQ().New().Get().WhereTitle(category).Execute();

            if (dbResp.error)
                throw new Error(`Such category doesn't seem to exist ${dbResp.error_message}`);

            categoriesList.push(dbResp);
        }

        resp.status(httpStatus.OK).json(CategoriesListResponse(categoriesList))

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UpdatePost = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { id, role } = req.decoded;

        let dbResp = await new postsQ().New().Get().WhereID(post_id).Execute();

        if (dbResp.error)
            throw new BadRequestError(`Error getting post: ${dbResp.error_message}`);

        const { author } = dbResp;

        if (author !== id && role !== roles.ADMIN)
            throw new UnauthorizedError('Access denied for that operation');

        const parsedReq = await parseUpdatePostRequest(req.body);

        dbResp = await new postsQ()
            .New()
            .Update(parsedReq)
            .WhereID(post_id)
            .Returning()
            .Execute()

        if (dbResp.error)
            throw new Error(`Error updating post: ${dbResp.error_message}`);

        //DELETING PHOTOS FROM POST
        if(req.body.data.media) {
            for(let img of req.body.data.media) {
                let imgResp = await new mediaQ().New().Delete().WhereID(img.id).Execute()

                if(imgResp.error)
                    throw new Error(`Failed to delete photo: ${imgResp.error_message}`)
                
                unlinkSync(join(__dirname, '..', 'user_data', 'media', img.path))
            }
        }

        const owner = await new usersQ().New().Get().WhereID(dbResp.author).Execute()

        if (owner.error)
            throw new NotFoundError(`Error getting owner: ${owner.error_message}`);

        resp.json(PostResponse(dbResp, null, owner));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeletePost = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { id, role } = req.decoded;

        let dbResp = await new postsQ().New().Get().WhereID(post_id).Execute();

        if (dbResp.error)
            throw new NotFoundError(`No such post: ${dbResp.error_message}`);

        const { author } = dbResp;

        if (id !== author && role !== roles.ADMIN)
            throw new UnauthorizedError('No permission for deleting that post')

        dbResp = await new mediaQ().New().Get().WherePostID(post_id).Execute(true);

        if(!dbResp.error) {
            for (let img of dbResp)
                unlinkSync(join(__dirname, '..', 'user_data', 'media', img.path))
        }

        dbResp = await new postsQ().New().Delete().WhereID(post_id).Execute();

        if (dbResp.error)
            throw new BadRequestError(`Error deleting post: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeleteLike = async function (req, resp) {
    try {
        const { post_id } = req.params;
        const { id } = req.decoded;

        let dbResp = await new likesQ().New().Delete().WherePostID(post_id).WhereAuthor(id).Execute();

        if (dbResp.error)
            throw new Error(`Error deliting like: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}