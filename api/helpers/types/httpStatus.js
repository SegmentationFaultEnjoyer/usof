const statusTypes = Object.freeze({
    CREATED: 201,
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_ERROR: 500,
    UNAUTHORIZED: 403,
    NO_CONTENT: 204,
    FOUND: 302,
    NOT_FOUND: 404
})

module.exports = statusTypes;