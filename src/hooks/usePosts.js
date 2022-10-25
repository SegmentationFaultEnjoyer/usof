import { ErrorHandler } from '@/helpers';

import { api } from '@/api';
import Mutex from '@/api/mutex'

import { useDispatch, useSelector } from 'react-redux';
import { setList, startLoading, finishLoading, updatePostInfo } from '@/store';
import { Notificator } from '@/common';

const LIMIT = 6

export function usePosts() {
    const dispatch = useDispatch()

    const loadPosts = async () => {
        dispatch(startLoading())
        try {
            const lockToken = new Date().toISOString();

            Mutex.lock(lockToken);
            const resp = await api.get(`/posts?limit=${LIMIT}&sort=likes`, { lockToken });
            Mutex.releaseLock(lockToken);

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
        }
        dispatch(finishLoading())
    }

    const loadUsersPosts = async (userID) => {
        try {
            const resp = await api.get(`/posts?limit=${LIMIT}&filter=[author]-->${userID}`)

            dispatch(setList(resp.data))
        } catch (error) {
            
        }
    }

    const loadPostLikes = async (id) => {
        try {
            const resp = await api.get(`/posts/${id}/like?limit=1000`)

            return resp.data
        } catch (error) {
            return null
        }
    }

    const loadPost = async (id) => {
        try {
            const resp = await api.get(`/posts/${id}?include=post_comments`)

            return resp.data
        } catch (error) {
            ErrorHandler.process(error)
            return null
        }
    }

    const updatePost = async (id, newInfo) => {
        try {
            const { data } = await api.patch(`/posts/${id}`, {
                data: {
                    type: "update-post",
                    attributes: newInfo
                }
            })

            console.log(data);
            dispatch(updatePostInfo({id, newInfo: data.data}))

            Notificator.success('Post updated!')

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    //TODO fix loading all posts when on user page
    const deletePost = async (id) => {
        try {
            await api.delete(`/posts/${id}`)
            await loadPosts()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const createPost = async (title, content, categories) => {
        try {
            await api.post('/posts', {
                data: {
                    type: 'create-post',
                    attributes: {
                        title,
                        content,
                        categories,
                        status: true
                    }
                }
            })

            Notificator.success('Post created!')

            await loadPosts()

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const filterPosts = async (filterValue) => {
        try {
            const lockToken = new Date().toISOString();

            Mutex.lock(lockToken);
            const resp = await api.get(`/posts?limit=${LIMIT}&filter=${filterValue}`, { lockToken });
            Mutex.releaseLock(lockToken);

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
        }
    }

    return {
        loadPosts,
        loadUsersPosts,
        loadPost,
        deletePost,
        createPost,
        updatePost,
        loadPostLikes,
        filterPosts
    }
}