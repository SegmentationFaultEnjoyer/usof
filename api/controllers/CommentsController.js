const { BadRequestError, UnauthorizedError, NotFoundError } = require('./errors/components/classes');
const ProcessError = require('./errors/handler');

const commentsQ = require('../data/pg/CommentsQ');
const likesQ = require('../data/pg/CommentLikesQ');

const includeHandler = require('./include/handler');
const sortHandler = require('./sort/handler');

const {
    CommentLikeResponse,
    CommentLikesListResponse,
    CommentResponse
} = require('./responses/CommentResponses');
const GenerateLinks = require('./responses/Links');


const { parseCreateLikeRequest } = require('./requests/PostsRequests');
const { parseUpdateCommentRequest } = require('./requests/CommentsRequests');

const roles = require('../helpers/types/roles');
const httpStatus = require('../helpers/types/httpStatus');
const action = require('../helpers/types/ratingAction');

const { handleRating } = require('../helpers/rating');

exports.GetComment = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { include } = req.query;

        let includeResp = null;

        let dbResp = await new commentsQ().New().Get().WhereID(comment_id).Execute();

        if (dbResp.error)
            throw new NotFoundError(`No such comment: ${dbResp.error_message}`);

        if (include !== undefined)
            includeResp = await includeHandler(include, { comment_id });

        resp.status(httpStatus.OK).json(CommentResponse(dbResp, includeResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeleteComment = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { id, role } = req.decoded;

        let dbResp = await new commentsQ().New().Get().WhereID(comment_id).Execute();

        if (dbResp.error)
            throw new NotFoundError(`No such comment: ${dbResp.error_message}`);

        const { author } = dbResp;

        if (id !== author && role !== roles.ADMIN)
            throw new UnauthorizedError(`No permission for that action`);

        dbResp = await new commentsQ().New().Delete().WhereID(comment_id).Execute();

        if (dbResp.error)
            throw new Error(`Error deleting comment: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UpdateComment = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { id } = req.decoded;

        let dbResp = await new commentsQ().New().Get().WhereID(comment_id).Execute();

        if (dbResp.error)
            throw new NotFoundError(`No such comment: ${dbResp.error_message}`);

        const { author } = dbResp;

        if (author !== id)
            throw new UnauthorizedError('No permissions for that action');

        const { content } = parseUpdateCommentRequest(req.body);

        dbResp = await new commentsQ()
            .New()
            .Update(
                {
                    content,
                    is_edited: true
                }
            )
            .WhereID(comment_id)
            .Returning()
            .Execute();

        if (dbResp.error)
            throw new Error(`Error updating comment: ${dbResp.error_message}`);

        resp.status(httpStatus.OK).json(CommentResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.CreateLike = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { id } = req.decoded;
        const { is_dislike, liked_on } = parseCreateLikeRequest(req.body);

        let dbResp = await likesQ.New().Get().WhereAuthor(id).WhereCommentID(comment_id).Execute();

        if (!dbResp.error && dbResp.is_dislike === is_dislike)
            throw new BadRequestError('You already did that action to this post');


        await likesQ.Transaction(async () => {
            //if no such like entity exists
            if (dbResp.error) {
                dbResp = await likesQ
                    .New()
                    .Insert(
                        {
                            author: id,
                            publish_date: new Date().toISOString(),
                            liked_on,
                            is_dislike,
                            comment_id
                        }
                    )
                    .Returning()
                    .Execute();

                if (dbResp.error)
                    throw new Error(`Error creating like: ${dbResp.error_message}`);
            }

            //probably this will be triggered when you smashing dislike instead of like and vice versa
            else {
                dbResp = await likesQ.New()
                    .Update(
                        {
                            is_dislike: !dbResp.is_dislike,
                            publish_date: new Date().toISOString()
                        }
                    )
                    .WhereAuthor(id)
                    .WhereCommentID(comment_id)
                    .Returning()
                    .Execute();

                if (dbResp.error)
                    throw new Error(`Error changing like ${error.error_message}`);
            }

            const actionType = is_dislike ? action.DECREASE : action.INCREASE;
            await handleRating(actionType, liked_on, comment_id);
        })

        resp.status(httpStatus.CREATED).json(CommentLikeResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeleteLike = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { id } = req.decoded;

        let dbResp = await likesQ.New().Delete().WhereAuthor(id).WhereCommentID(comment_id).Execute();

        if (dbResp.error)
            throw new Error(`Error deleting like: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetLikesList = async function (req, resp) {
    try {
        const { comment_id } = req.params;
        const { page, limit, sort, order } = req.query;

        let Q = likesQ.New().Get().WhereCommentID(comment_id);

        if(sort !== undefined) Q = sortHandler(sort, order, Q);

        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if (dbResp.error)
            throw new NotFoundError(`No likes found: ${dbResp.error_message}`);

        const links = await GenerateLinks(`comments/${comment_id}/like`, likesQ, `WHERE comment_id=${comment_id}`);

        resp.status(httpStatus.OK).json(CommentLikesListResponse(dbResp, links));

    } catch (error) {
        ProcessError(resp, error);
    }
}