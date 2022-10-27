import { ErrorHandler } from '@/helpers';

import { api } from '@/api';

import { useDispatch, useSelector } from 'react-redux';
import { setList, startLoading, finishLoading, updatePostInfo, setFilter } from '@/store';
import { Notificator } from '@/common';

const LIMIT = 6

export function usePosts() {
    const dispatch = useDispatch()
    const filter = useSelector(state => state.posts.filter)

    const loadPosts = async (noFilter = false) => {
        dispatch(startLoading())
        try {
            let endpoint = `/posts?limit=${LIMIT}`

            if (filter.param && !noFilter)
                endpoint = endpoint.concat(`&filter=[${filter.param}]-->${filter.value}`)
            else {
                dispatch(setFilter({ param: '', value: '' }))
                endpoint = endpoint.concat('&sort=likes')
            }
               
            const resp = await api.get(endpoint);

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
            dispatch(setFilter({ param: 'author', value: userID}))

        } catch (error) {
            dispatch(setList({ data: [], links: {} }))
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

            dispatch(updatePostInfo({ id, newInfo: data.data }))

            Notificator.success('Post updated!')

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

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
            const { data } = await api.post('/posts', {
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

            return data.data

        } catch (error) {
            ErrorHandler.process(error)
            return null
        }
    }

    const filterPosts = async (filterValue) => {
        try {
            const resp = await api.get(`/posts?limit=${LIMIT}&filter=${filterValue}`);

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
        }
    }

    const sortPosts = async (sort, order) => {
        try {
            const resp = await api.get(`/posts?limit=${LIMIT}&sort=${sort}&order=${order}`);

            dispatch(setList(resp.data))
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const uploadMedia = async (postID, media) => {
        try {
            await api.post(`/posts/${postID}/media`, media)
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return {
        loadPosts,
        loadUsersPosts,
        loadPost,
        uploadMedia,
        deletePost,
        createPost,
        updatePost,
        loadPostLikes,
        filterPosts,
        sortPosts
    }
}