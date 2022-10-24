import { api } from "@/api";

import { useState } from "react";
import { ErrorHandler, loadPage as pageLoader } from '@/helpers'
import { Notificator } from "@/common";

export function useComments() {
    const [comments, setComments] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const loadComments = async (postID) => {
        try {
            let resp = await api.get(`/posts/${postID}/comments?limit=5&sort=id`)

            setComments(resp.data)

        } catch (error) {  setComments({}) }

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

    const createComment = async (postID, content) => {
        try {
            await api.post(`/posts/${postID}/comments`, {
                data: {
                    type: "create-comment",
                    attributes: {
                        content
                    }
                }
            })
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const updateComment = async (commentID, content) => {
        try {
            const { data } = await api.patch(`comments/${commentID}`, {
                data: {
                    type: "update-comment",
                    attributes: {
                        content
                    }
                }
            })
            
            const index = comments.data.findIndex(comment => comment.id === commentID)

            if(!~index) return

            setComments(prev => {
                let newComments = {...prev}
                newComments.data[index] = data.data
                return newComments
            })

            Notificator.success('Comment updated!');
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const deleteComment = async (commentID, postID) => {
        try {
            await api.delete(`/comments/${commentID}`)
            //TODO loading certain page not the first
            await loadComments(postID)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return {
        comments,
        isLoading,
        loadComments,
        createComment,
        loadCommentLikes,
        deleteComment,
        updateComment,
        loadPage,
        setComments
    }
}