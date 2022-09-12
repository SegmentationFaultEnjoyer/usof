const type = require('../../helpers/types/request');
const { validateRequest } = require('./helpers/validate');

exports.parseUpdateCommentRequest = function(requestBody) {
    validateRequest(requestBody, type.UPDATE_COMMENT);

    return {
        content: requestBody.data.attributes.content
    };
}

exports.parseCreateCommentRequest = function(requestBody) {
    validateRequest(requestBody, type.CREATE_COMMENT);

    return {
        content: requestBody.data.attributes.content
    }
}