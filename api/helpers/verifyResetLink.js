require("dotenv").config();

const jwt = require("jsonwebtoken");
const usersQ = require('../data/pg/UsersQ');

async function verifyLink(req) {
    const { user_id, token } = req.params;

    let dbResp = await new usersQ().New().Get().WhereID(user_id).Execute();

    if(dbResp.error)
        throw new NotFoundError(`No such user: ${dbResp.error_message}`);

    const { email } = dbResp;
    const SECRET = process.env.JWT_TOKEN + email;

    const decoded = jwt.verify(token, SECRET);

    return decoded;
}

module.exports = {
    verifyLink
}