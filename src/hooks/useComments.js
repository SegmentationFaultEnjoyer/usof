import { api } from "@/api";
import { ErrorHandler } from "@/helpers";

import { useState } from "react";

export function useComments() {
    const [comments, setComments] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const loadComments = async (postID) => {
        try {   
            let resp = await api.get(`/posts/${postID}/comments?limit=7`)

            setComments(resp.data)
            console.log(resp.data);
            
        } catch (error) {}

        setIsLoading(false)
    }

    return {
        comments,
        isLoading,
        loadComments
    }
}