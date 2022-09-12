const type = require('../../helpers/types/request');
const { validateRequest } = require('./helpers/validate');

exports.parseCreateCategoryRequest = function(requestBody) {
    validateRequest(requestBody, type.CREATE_CATEGORY);

    return {
        title: requestBody.data.attributes.title,
        description: requestBody.data.attributes.description
    }
}

exports.parseUpdateCategoryRequest = function(requestBody) {
    validateRequest(requestBody, type.UPDATE_CATEGORY);

    let rawRequest = {
        title: requestBody.data.attributes.title,
        description: requestBody.data.attributes.description
    }

    for (let [key, value] of Object.entries(rawRequest)) {
        if (value === undefined)
            delete rawRequest[key];
    }

    return rawRequest;
}