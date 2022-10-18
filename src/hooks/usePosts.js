import { ErrorHandler } from '@/helpers';

import { api } from '@/api';
import Mutex from '@/api/mutex'

import { useDispatch } from 'react-redux';
import { setList, startLoading, finishLoading } from '@/store';

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
        loadPostLikes,
        filterPosts
    }
}