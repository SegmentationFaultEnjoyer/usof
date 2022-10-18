import { api } from "@/api";

import { useState } from "react";
import { loadPage as pageLoader } from '@/helpers'

export function useComments() {
    const [comments, setComments] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const loadComments = async (postID) => {
        try {   
            let resp = await api.get(`/posts/${postID}/comments?limit=5&sort=id`)

            console.log(resp.data);
            setComments(resp.data)
            
        } catch (error) {}

        setIsLoading(false)
    }

    const loadPage = async (page, links) => {
        // setIsLoading(true)
        await pageLoader(page, links, setComments)
        // setIsLoading(false)
    }

    return {
        comments,
        isLoading,
        loadComments,
        loadPage,
        setComments
    }
}