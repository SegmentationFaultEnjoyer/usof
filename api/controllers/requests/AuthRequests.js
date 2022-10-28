// {
//     "data": {
//       "type": "log-in",
//       "attributes": {
//         email: -,
//         password: -,
//       }
//     }
// }
const type = require('../../helpers/types/request');
const { validateRequest } = require('./helpers/validate');

exports.parseLoginRequest = function(requestBody) {
    validateRequest(requestBody, type.LOG_IN);

    return {
        email: requestBody.data.attributes.email,
        password: requestBody.data.attributes.password,
    }
}

exports.parseRegisterRequest = function(requestBody) {
    validateRequest(requestBody, type.REGISTER);

    return {
        name: requestBody.data.attributes.name,
        email: requestBody.data.attributes.email,
        password: requestBody.data.attributes.password,
    }
}

exports.parseRefreshRequest = function(requestBody) {
    validateRequest(requestBody, type.REFRESH_TOKEN);

    return {
        token: requestBody.data.attributes.token
    }
}

exports.parseResetPasswordRequest = function(requestBody) {
    validateRequest(requestBody, type.RESET_PASSWORD);

    return {
        email: requestBody.data.attributes.email
    }
}

exports.parseNewPasswordRequest = function(requestBody) {
    validateRequest(requestBody, type.NEW_PASSWORD);

    return {
        password: requestBody.data.attributes.password
    }
}


