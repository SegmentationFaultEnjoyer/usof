require("dotenv").config();

//customs stmt is kostyl for filtering, sorry for that, no time to fix
async function GenerateLinks(url, Q, customStmt = null) {
    const { page, limit } = Q.pgdbOffsetParams;

    let dbResp = await Q.New().Count(customStmt).Execute();
    
    if(dbResp.error)
        throw new Error(`Failed to generate links: ${dbResp.error_message}`);

    const { count } = dbResp;
    const lastPage = count % limit == 0 ? count / limit : Math.floor(count / limit + 1);
    
    let curLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page}&limit=${limit}`;
    let firstLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${1}&limit=${limit}`;
    let nextLink = lastPage < page + 1 ? '': `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page + 1}&limit=${limit}`;
    let prevLink;
    let lastLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${lastPage}&limit=${limit}`;


    if(curLink === firstLink)
        prevLink = '';
    else {
        prevLink = `http://${process.env.HOST}:${process.env.PORT}/${url}?page=${page - 1}&limit=${limit}`
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