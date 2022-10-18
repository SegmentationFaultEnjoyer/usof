const { NotFoundError } = require('../controllers/errors/components/classes');

const usersQ = require('../data/pg/UsersQ');
const commentsQ = require('../data/pg/CommentsQ');
const postsQ = require('../data/pg/PostsQ');

const actionType = require('./types/ratingAction');

async function handleRating(action, qType, id) {
    let dbResp;

    switch (qType) {
        case 'post':
            dbResp = await postsQ.New().Get().WhereID(id).Execute();

            if(dbResp.error)
                throw new NotFoundError(`Unable to find author: ${dbResp.error_message}`);

            break;
        case 'comment':
            dbResp = await new commentsQ().New().Get().WhereID(id).Execute();

            if(dbResp.error)
                throw new NotFoundError(`Unable to find author: ${dbResp.error_message}`);

            break;

        default:
            throw new Error('Unknown entity type passed to handleRating')
    }
        
    const user_id = dbResp.author;

    dbResp = await usersQ.New().Get().WhereID(user_id).Execute();

    if(dbResp.error)
        throw new NotFoundError(`No such user: ${dbResp.error_message}`);

    const { rating } = dbResp;

    dbResp = await usersQ
        .New()
        .Update(
            {
                rating: action === actionType.DECREASE ? rating - 1 : rating + 1
            })
        .WhereID(user_id)
        .Execute()

    if(dbResp.error)
        throw new Error(`Error updating rating: ${dbResp.error_message}`);

}

module.exports = {
    handleRating
}