const { BadRequestError } = require('../../errors/components/classes');

function validateRequest(req, expected_requestBody_type) {
    if(!req.data || !req.data.attributes) throw new BadRequestError(`Invalid request body structure`);

    if(req.data.type !== expected_requestBody_type) throw new BadRequestError(`Invalid request type, expected: ${expected_requestBody_type}`);
}

module.exports = {
    validateRequest
}