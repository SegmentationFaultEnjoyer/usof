const type = require('../../helpers/types/request');
const { validateRequest } = require('./helpers/validate');

exports.parseRegisterUserRequest = function(requestBody) {
    validateRequest(requestBody, type.REGISTER_ADMIN);

    return {
        name: requestBody.data.attributes.name,
        email: requestBody.data.attributes.email,
        password: requestBody.data.attributes.password,
        role: requestBody.data.attributes.role
    }
}

exports.parseUpdateUserRequest = function(requestBody) {
    validateRequest(requestBody, type.UPDATE_USER);
    
    let rawRequest = {
        name: requestBody.data.attributes.name,
        email: requestBody.data.attributes.email,
        old_password: requestBody.data.attributes.old_password,
        new_password: requestBody.data.attributes.new_password,
        role: requestBody.data.attributes.role
    }

    for (let [key, value] of Object.entries(rawRequest)) {
        if (value === undefined)
            delete rawRequest[key];
    }

    return rawRequest;
}