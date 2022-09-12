const jwt = require('jsonwebtoken');
const { Unauthorized, InternalError, BadRequest, NotFound } = require('./components/errors');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('./components/classes');
const RenderError = require('./components/RenderError');

function ProcessError(resp, error) {
    if (error instanceof BadRequestError)
        RenderError(resp, BadRequest(error.message));

    else if (error instanceof UnauthorizedError)
        RenderError(resp, Unauthorized(error.message));

    else if (error instanceof NotFoundError)
        RenderError(resp, NotFound(error.message));

    else if (error instanceof jwt.JsonWebTokenError)
        RenderError(resp, BadRequest('Invalid Token'));

    else if (error instanceof jwt.TokenExpiredError)
        RenderError(resp, Unauthorized('Token expired'));

    else
        RenderError(resp, InternalError(error.message));

    if(error.message)
        console.error(error.message);
}

module.exports = ProcessError;