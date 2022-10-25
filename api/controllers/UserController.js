const { BadRequestError, UnauthorizedError, NotFoundError } = require('./errors/components/classes');
const ProcessError = require('./errors/handler');

const usersQ = require('../data/pg/UsersQ');

const httpStatus = require('../helpers/types/httpStatus');
const roleType = require('../helpers/types/roles');

const includeHandler = require('./include/handler');
const sortHandler = require('./sort/handler');

const { parseRegisterUserRequest, parseUpdateUserRequest } = require('./requests/UserRequests');
const { UsersListResponse, UserResponse } = require('./responses/UsersResponses');
const GenerateLinks = require('./responses/Links');

const { hash, isMatch } = require('../helpers/hashing');
const convertImg = require('../helpers/convertImage');
const { join } = require('path');

exports.GetUser = async function (req, resp) {
    try {
        const { user_id } = req.params;
        const { include } = req.query;

        let includeResp = null;

        let dbResp = await new usersQ().New().Get().WhereID(user_id).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such user: ${dbResp.error_message}`);

        if (include !== undefined)
            includeResp = await includeHandler(include, { user_id });

        resp.status(httpStatus.OK).json(UserResponse(dbResp, includeResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetUsersList = async function (req, resp) {
    try {
        const { page, limit, sort, order } = req.query;

        let Q = new usersQ().New().Get();

        if(sort !== undefined) Q = sortHandler(sort, order, Q);

        let dbResp = await Q.Paginate(limit, page).Execute(true);

        if(dbResp.error)
            throw new NotFoundError(`No users found: ${dbResp.error_message}`);

        const links = await GenerateLinks('users', Q, null, null, sort, order);

        resp.status(httpStatus.OK).json(UsersListResponse(dbResp, links));

    } catch (error) {   
        ProcessError(resp, error);
    }
}

exports.CreateUser = async function (req, resp) {
    try {
        const { role } = req.decoded;

        if(role !== roleType.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        const { email, name, password, role: RoleType } = parseRegisterUserRequest(req.body);

        const hashed_password = await hash(password);
        let dbResp = await new usersQ()
            .New()
            .Insert(
            {
                name, email,
                password: hashed_password,
                role: RoleType,
                rating: 0
            })
            .Returning()
            .Execute()

        if (dbResp.error)  
            throw new Error(`Error while adding user to data base: ${dbResp.error_message}`);

        resp.status(httpStatus.CREATED).json(UserResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.DeleteUser = async function (req, resp) {
    try {
        const { user_id } = req.params;
        const { id, role } = req.decoded;

        let dbResp = await new usersQ().New().Get().WhereID(user_id).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such user: ${dbResp.error_message}`);
        
        const { id: user_id_from_db } = dbResp;

        if(id !== user_id_from_db && role !== roleType.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        dbResp = await new usersQ().New().Delete().WhereID(user_id).Execute();

        if(dbResp.error)
            throw new Error(`Error deleting user: ${dbResp.error_message}`);

        resp.status(httpStatus.NO_CONTENT).end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UpdateUser = async function (req, resp) {
    try {
        const { user_id } = req.params;
        const { id, role } = req.decoded;

        let dbResp = await new usersQ().New().Get().WhereID(user_id).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such user: ${dbResp.error_message}`);

        const { id: user_id_from_db, password_hash } = dbResp;

        if(id !== user_id_from_db && role !== roleType.ADMIN)
            throw new UnauthorizedError('No permission for that action');

        const parsedReq = parseUpdateUserRequest(req.body);

        //if password is changing
        if(parsedReq.new_password && parsedReq.old_password) {
            const isPasswordValid = await isMatch(parsedReq.old_password, password_hash);

            if(!isPasswordValid)
                throw new BadRequestError('Password mismatch');

            let new_password_hash = await hash(parsedReq.new_password);

            delete parsedReq['old_password'];
            delete parsedReq['new_password'];

            parsedReq.password_hash = new_password_hash;
        }

        //TODO role changing

        dbResp = await new usersQ()
            .New()
            .Update(parsedReq)
            .WhereID(user_id)
            .Returning()
            .Execute()

        if(dbResp.error)
            throw new Error(`Error update user info: ${dbResp.error_message}`);

        resp.status(httpStatus.OK).json(UserResponse(dbResp));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.UploadUserAvatar = async function (req, resp) {
    try {
        if(!req.file && !req.files)
            throw new BadRequestError('File corrupted');

        const filePath = join(__dirname, '..', 'user_data');
        const pathToSavedPhoto = join(filePath, 'avatars');

        const newName = await convertImg(filePath, req.file.filename, pathToSavedPhoto);

        const { id } = req.decoded;

        let dbResp = await new usersQ()
            .New()
            .Update({profile_picture: newName})
            .WhereID(id)
            .Execute();

        if(dbResp.error)
            throw new Error(`Failed to add avatar path to db: ${dbResp.error_message}`);

        //TODO normal response
        resp.status(httpStatus.CREATED).json({
            data: {
                img_url: `/images/avatar/${newName}`
            }
        });
        
    } catch (error) {
        ProcessError(resp, error);
    }
}