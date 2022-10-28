const { BadRequestError } = require("../errors/components/classes");

function parseFilter(filter) {
    let raw = filter.split('-->');
    
    return {
        filterParam: raw[0].slice(1, -1),
        filterValue: raw[1]
    }
}

function FilterHandler(filter, Q) {
    const { filterParam, filterValue } = parseFilter(filter);

    switch(filterParam) {
        case 'category': 
            return {
                Q: Q.WhereCategory(filterValue),
                filterStmt: `WHERE CATEGORIES @> ARRAY['${filterValue}']::varchar[]`
            }
        case 'status':
            return {
                Q: Q.WhereStatus(JSON.parse(filterValue.toLowerCase())),
                filterStmt: `WHERE status=${filterValue}`
            }
        case 'date': //posible cases: ['day', 'week', 'month', 'year']
            return {
                Q: Q.WherePublishDateGreaterThan(filterValue),
                filterStmt: `WHERE publish_date >= (NOW() - '1 ${filterValue}'::interval)`
            }
        case 'author':
            return {
                Q: Q.WhereAuthor(filterValue),
                filterStmt: `WHERE author=${filterValue}`
            }
        default:
            throw new BadRequestError('Invalid filter parametr');
    }
}

module.exports = FilterHandler;