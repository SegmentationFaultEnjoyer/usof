const type = require('../../helpers/types/request');
const { validateRequest } = require('./helpers/validate');
const { validateCategories } = require('./helpers/categories');

exports.parseCreatePostRequest = async function(requestBody) {
    validateRequest(requestBody, type.CREATE_POST);
    await validateCategories(requestBody.data.attributes.categories);

    return {
        title: requestBody.data.attributes.title,
        content: requestBody.data.attributes.content,
        categories: requestBody.data.attributes.categories
    }
}

exports.parseCreateLikeRequest = function(requestBody) {
    validateRequest(requestBody, type.CREATE_LIKE);

    return {
        liked_on: requestBody.data.attributes.liked_on,  //post or comment
        is_dislike: requestBody.data.attributes.is_dislike
    }
}

exports.parseUpdatePostRequest = async function(requestBody) {
    validateRequest(requestBody, type.UPDATE_POST);

    let rawRequest = {
        title: requestBody.data.attributes.title,
        content: requestBody.data.attributes.content,
        categories: requestBody.data.attributes.categories,
        status: requestBody.data.attributes.status,
        is_edited: true
    }

    if(rawRequest.categories !== undefined)
        await validateCategories(rawRequest.categories);

    for (let [key, value] of Object.entries(rawRequest)) {
        if (value === undefined)
            delete rawRequest[key];
    }

    return rawRequest;
}
