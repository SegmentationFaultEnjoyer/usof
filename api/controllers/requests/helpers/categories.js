const categoriesQ = require('../../../data/pg/CategoriesQ');
const { BadRequestError } = require('../../errors/components/classes');

async function validateCategories(list) {
    for(let category of list) {
        let dbResp = await new categoriesQ().New().Get().WhereTitle(category).Execute();

        if(dbResp.error)
            throw new BadRequestError(`Such category doesn't seem to exist ${dbResp.error_message}`);
    }
}

module.exports = {
    validateCategories
}