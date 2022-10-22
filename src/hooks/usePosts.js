import { ErrorHandler } from '@/helpers';

import { api } from '@/api';
import Mutex from '@/api/mutex'

import { useDispatch, useSelector  } from 'react-redux';
import { setList, startLoading, finishLoading } from '@/store';
import { Notificator } from '@/common';

const LIMIT = 6

export function usePosts() {
    const dispatch = useDispatch()
    const links = useSelector(state => state.posts.links)

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

    const loadPostLikes = async (id) => {
        try {
            const resp = await api.get(`posts/${id}/like?limit=1000`)

            return resp.data
        } catch (error) {
            return null
        }
    }

    const loadPost = async (id) => {
        try {
            const resp = await api.get(`posts/${id}?include=post_comments`)

            return resp.data
        } catch (error) {
            ErrorHandler.process(error)
            return null
        }
    }

    const deletePost = async (id) => {
        try {
            await api.delete(`posts/${id}`)
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
            // if(!links || !links.last) return 

            // const { data } = await api.get(links.last)
            // dispatch(setList(data))

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
        loadPost,
        deletePost,
        createPost,
        loadPostLikes,
        filterPosts
    }
}