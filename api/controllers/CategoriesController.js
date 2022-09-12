const { UnauthorizedError, NotFoundError } = require('./errors/components/classes');
const ProcessError = require('./errors/handler');

const roles = require('../helpers/types/roles');
const httpStatus = require('../helpers/types/httpStatus');

const categoriesQ = require('../data/pg/CategoriesQ');
const postsQ = require('../data/pg/PostsQ');

const { parseCreateCategoryRequest, parseUpdateCategoryRequest } = require('./requests/CategoriesRequests');
const { CategoryResponse, CategoriesListResponse } = require('./responses/CategoriesResponses');
const { PostListResponse } = require('./responses/PostsResponses');

const GenerateLinks = require('./responses/Links');
const sortHandler = require('./sort/handler')

exports.CreateCategory = async function (req, resp) {
    try {
        const { role } = req.decoded;

        if(role !== roles.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        const { title, description } = parseCreateCategoryRequest(req.body);

        let dbResp = await categoriesQ
            .New()
            .Insert(
                {title, description}
            )
            .Returning()
            .Execute();

        if(dbResp.error)
            throw new Error(`Error creating category: ${dbResp.error_message}`);

        resp.status(httpStatus.CREATED).json(CategoryResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetCategory = async function (req, resp) {
    try {
        const { category_id } = req.params;

        let dbResp = await categoriesQ.New().Get().WhereID(category_id).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such category: ${dbResp.error_message}`);

        resp.status(httpStatus.FOUND).json(CategoryResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetCategoriesList = async function (req, resp) {
    try {
        const { page, limit, sort, order } = req.query;

        let Q = categoriesQ.New().Get();

        if(sort !== undefined) Q = sortHandler(sort, order, Q);
        
        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if(dbResp.error)
            throw new NotFoundError(`No categories found: ${dbResp.error_message}`);

        
        const links = await GenerateLinks('categories', categoriesQ);

        resp.status(httpStatus.FOUND).json(CategoriesListResponse(dbResp, links));


    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeleteCategory = async function (req, resp) {
    try {
        const { category_id } = req.params;
        const { role } = req.decoded;

        if(role !== roles.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        let dbResp = await categoriesQ.New().Delete().WhereID(category_id).Execute();

        if(dbResp.error)
            throw new Error(`Error deleting category: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UpdateCategory = async function (req, resp) {
    try {
        const { category_id } = req.params;
        const { role } = req.decoded;

        if(role !== roles.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        const parsedReq = parseUpdateCategoryRequest(req.body);            

        let dbResp = await categoriesQ
            .New()
            .Update(parsedReq)
            .WhereID(category_id)
            .Returning()
            .Execute()

        if(dbResp.error)
            throw new Error(`Error updating category: ${dbResp.error_message}`);

        resp.status(httpStatus.OK).json(CategoryResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetPostsList = async function (req, resp) {
    try {
        const { category_id } = req.params;

        let dbResp = await categoriesQ.New().Get().WhereID(category_id).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such category: ${dbResp.error_message}`);

        const { title } = dbResp;

        dbResp = await postsQ.New().Get().WhereCategory(title).Execute(true);

        if(dbResp.error)
            throw new NotFoundError(`No posts found: ${dbResp.error_message}`);

        resp.status(httpStatus.FOUND).json(PostListResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}