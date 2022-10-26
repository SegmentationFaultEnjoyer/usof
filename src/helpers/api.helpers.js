import { ErrorHandler } from "./error-handler";
import { api } from "@/api";

export function getPagesAmount(link) {
    if (!link) return

    const i = link.indexOf('page');
    
    return Number(link.charAt(i + 'page'.length + 1));
}

export async function loadPage(page, links, setFunction) {
    let link = null;
    for (let [key, value] of Object.entries(links)) {
        if (value.includes(`page=${page}`)) {
            link = links[key]
            break;
        }
    }
    
    if (!link) return

    try {
        const resp = await api.get(link)

        setFunction(resp.data)

    } catch (error) {
        ErrorHandler.process(error);
    }
}

export function formatQuery(queryParam) {
    queryParam = queryParam.toLowerCase()
    
    switch (queryParam) {
        case 'date':
            return 'publish_date'
        case 'rating':
            return 'likes'
        case 'alphabetic':
            return 'title'
        case 'status':
        case 'author':
        default:
            return queryParam;
    }
}