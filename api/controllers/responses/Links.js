require("dotenv").config();

//customs stmt is kostyl for filtering, sorry for that, no time to fix
async function GenerateLinks(url, Q, customStmt = null, filter = undefined, sort = undefined, order = undefined) {
    const { page, limit } = Q.pgdbOffsetParams;

    if (filter === undefined) filter = ''
    if (sort === undefined) sort = ''
    if (order === undefined) order = ''

    if(filter !== '') filter = `&filter=${filter}`
    if(sort !== '') sort = `&sort=${sort}`
    if(order !== '') order = `&order=${order}`

    let dbResp = await Q.New().Count(customStmt).Execute();
    
    if(dbResp.error)
        throw new Error(`Failed to generate links: ${dbResp.error_message}`);

    const { count } = dbResp;
    const lastPage = count % limit == 0 ? count / limit : Math.floor(count / limit + 1);
    
    let curLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page}&limit=${limit}${filter}${sort}${order}`;
    let firstLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${1}&limit=${limit}${filter}${sort}${order}`;
    let nextLink = lastPage < page + 1 ? '': `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page + 1}&limit=${limit}${filter}${sort}${order}`;
    let prevLink;
    let lastLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${lastPage}&limit=${limit}${filter}${sort}${order}`;


    if(curLink === firstLink)
        prevLink = '';
    else {
        prevLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page - 1}&limit=${limit}${filter}${sort}${order}`
    }
    
    
    return {
        first: firstLink,
        current: curLink,
        next: nextLink,
        prev: prevLink,
        last: lastLink
    }
}

module.exports = GenerateLinks;