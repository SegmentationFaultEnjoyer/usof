const { BadRequestError } = require('../errors/components/classes');

function SortHandler(sort, order, Q) {
    if(order === undefined) order = 'DESC';

    if(order !== 'ASC' && order !== 'DESC') 
        throw new BadRequestError('Invalid order: Expected "ASC" or "DESC');

    switch(sort) {
        case 'id':
            return Q.OrderByID(order);
        case 'publish_date':
            return Q.OrderByPublishDate(order);
        case 'status':
            return Q.OrderByStatus(order);
        case 'author':
            return Q.OrderByAuthor(order);
        case 'role':
            return Q.OrderByRole(order);
        case 'rating':
            return Q.OrderByRating(order);
        case 'title':
            return Q.OrderByTitle(order);
        case 'likes':
            return Q.OrderByNumberOfLikes(order);
        default:
            throw new BadRequestError('Invalid sort property');
    }
}

module.exports = SortHandler;