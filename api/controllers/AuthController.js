require("dotenv").config();
const jwt = require("jsonwebtoken");

const usersQ = require('../data/pg/UsersQ');
const refreshQ = require('../data/pg/RefreshQ');

const { hash, isMatch } = require('../helpers/hashing');
const { UpdateTokens } = require('../helpers/tokens');
const { verifyLink } = require('../helpers/verifyResetLink');
const sendToMail = require('../helpers/sendToMail');
const type = require('../helpers/types/roles');

const { BadRequestError, UnauthorizedError, NotFoundError } = require('./errors/components/classes');
const ProcessError = require('./errors/handler');

const {
    parseLoginRequest,
    parseRefreshRequest,
    parseRegisterRequest,
    parseResetPasswordRequest,
    parseNewPasswordRequest
} = require('./requests/AuthRequests');

const { LoginResponse } = require('./responses/AuthResponses');

exports.LogIn = async function (req, resp) {
    try {
        const { email, password } = parseLoginRequest(req.body);

        let dbResp = await usersQ.New().Get().WhereEmail(email).Execute();

        if (dbResp.error)  
            throw new UnauthorizedError('Login or password are incorrect');
        

        const { password_hash, role, id } = dbResp;

        let isCorrectPas = await isMatch(password, password_hash);

        if (!isCorrectPas) 
            throw new UnauthorizedError('Login or password are incorrect');

        const { access_token, refresh_token, tokenLifeSpan } = await UpdateTokens({ email, role, id }, { id });

        dbResp = await refreshQ.New().Get().WhereOwnerID(id).Execute();

        //if no token found
        if(dbResp.error) {
            dbResp = await refreshQ
            .New()
            .Insert(
                {
                    token: refresh_token,
                    owner_id: id,
                    due_date: tokenLifeSpan
                })
            .Execute();

            if(dbResp.error)
                throw new Error(`Error adding refresh token: ${dbResp.error_message}`);
        }
        //if token exists --> replacing it
        else {
            dbResp = await refreshQ
                .New()
                .Update(
                    {
                        token: refresh_token,
                        due_date: tokenLifeSpan
                    }
                )
                .WhereOwnerID(id)
                .Execute()
            
            if(dbResp.error)
                throw new Error(`Error updating refresh token: ${dbResp.error_message}`);
        }

        

        resp.cookie("refresh", refresh_token);
        resp.cookie("token", access_token);

        resp.json(LoginResponse({ access_token, refresh_token }));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.LogOut = async function (req, resp) {
    try {
        const { id } = req.decoded;
        
        let dbResp = await refreshQ.New().Delete().WhereOwnerID(id).Execute();

        if(dbResp.error) 
            throw new Error(`Error while deleting token: ${dbResp.error_message}`);
        
        resp.cookie("refresh", '');
        resp.cookie("token", '');

        resp.end();
    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.Register = async function (req, resp) {
    try {
        const { name, email, password } = parseRegisterRequest(req.body);
        
        const hashed_password = await hash(password);
        
        let dbResp = await usersQ
            .New()
            .Insert(
            {
                name, email,
                password: hashed_password,
                role: type.PEASANT,
                rating: 0
            })
            .Returning()
            .Execute()

        if (dbResp.error)  
            throw new Error(`Error while adding user to data base: ${dbResp.error_message}`);

        const { role, id } = dbResp;

        const { access_token, refresh_token } = await UpdateTokens({ email, role, id }, { id });

        resp.cookie("refresh", refresh_token);
        resp.cookie("token", access_token);

        resp.json(LoginResponse({ access_token, refresh_token }));

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.Refresh = async function (req, resp) {
    try {
        const { token } = parseRefreshRequest(req.body);
        const { id } = jwt.verify(token, process.env.JWT_TOKEN, { subject: 'refresh-token' });

        let dbResp = await usersQ.New().Get().WhereID(id).Execute();

        if (dbResp.error) 
            throw new BadRequestError(`No such user: ${dbResp.error_message}`);

        const { email, role } = dbResp;

        dbResp = await refreshQ.New().Get().WhereOwnerID(id).Execute();

        if(dbResp.error) 
            throw new Error(`No token found: ${dbResp.error_message}`);

        if (dbResp.token !== token) 
            throw new jwt.JsonWebTokenError();
        

        await refreshQ.Transaction(async () => {
            const { access_token, refresh_token, tokenLifeSpan } = await UpdateTokens({ email, role, id }, { id });

            dbResp = await refreshQ
                .New()
                .Update({ token: refresh_token, due_date: tokenLifeSpan })
                .WhereOwnerID(id)
                .Execute();

            if(dbResp.error) 
                throw new Error(`Error while updating token: ${dbResp.error_message}`);

            resp.cookie("refresh", refresh_token);
            resp.cookie("token", access_token);

            resp.json(LoginResponse({ access_token, refresh_token }));
        })

    } catch (error) {
        ProcessError(resp, error);
    }
}


exports.ResetPassword = async function (req, resp) {
    try {
        const { email } = parseResetPasswordRequest(req.body);

        let dbResp = await usersQ.New().Get().WhereEmail(email).Execute();

        if(dbResp.error)
            throw new NotFoundError(`No such user: ${dbResp.error_message}`);
        
        const { id } = dbResp;

        const SECRET = process.env.JWT_TOKEN + email;
        const token = jwt.sign({email, id}, SECRET, {expiresIn: '15m'})

        const link = `http://${process.env.HOST}:${process.env.PORT}/auth/reset-password/${id}/${token}`;

        console.log(link);

        await sendToMail(email, "USOF password reset", link);

        resp.end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.GetResetForm = async function (req, resp) {
    try {
        const decoded = await verifyLink(req);

        //TODO on front sent form here
        resp.send("<h1>HERE WILL BE RESET FORM</h1>")

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.ChangePassword = async function (req, resp) {
    try {
        const { id } = await verifyLink(req);

        const { password } = parseNewPasswordRequest(req.body);

        const password_hash = await hash(password);

        let dbResp = await usersQ.New().Update({password_hash}).WhereID(id).Execute();

        if(dbResp.error)
            throw new Error(`Error changing password: ${dbResp.error_message}`);

        resp.end();

    } catch (error) {
        ProcessError(resp, error);
    }
}

exports.CheckAuth = function (req, resp, next) {
    const token = req.body.token || req.cookies.token || req.headers['x-access-token'];
    let decoded;

    try {
        if (!token) throw new UnauthorizedError('No token provided');
        
        decoded = jwt.verify(token, process.env.JWT_TOKEN, { subject: 'access-token' });
        
    } catch (error) {
        ProcessError(resp, error);
        return;
    }

    req.decoded = decoded;

    next();
}
