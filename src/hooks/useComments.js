import { api } from "@/api";

import { useState } from "react";
import { ErrorHandler, loadPage as pageLoader } from '@/helpers'

export function useComments() {
    const [comments, setComments] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const loadComments = async (postID) => {
        try {
            let resp = await api.get(`/posts/${postID}/comments?limit=5&sort=id`)

            console.log(resp.data);
            setComments(resp.data)

        } catch (error) { }

        setIsLoading(false)
    }

    const loadPage = async (page, links) => {
        // setIsLoading(true)
        await pageLoader(page, links, setComments)
        // setIsLoading(false)
    }

    const loadCommentLikes = async (commentID) => {
        try {
            const resp = await api.get(`/comments/${commentID}/like`)

            return resp.data

        } catch (error) {
            return null
        }
    }

    const deleteComment = async (commentID, postID) => {
        try {
            await api.delete(`/comments/${commentID}`)

            await loadComments(postID)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return {
        comments,
        isLoading,
        loadComments,
        loadCommentLikes,
        deleteComment,
        loadPage,
        setComments
    }
}