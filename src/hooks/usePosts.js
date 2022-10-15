import { ErrorHandler } from '@/helpers';
import { useState } from 'react';

import { api } from '@/api';
import Mutex from '@/api/mutex'

import { useDispatch } from 'react-redux';
import { setList } from '@/store/slices/postsSlice';

const LIMIT = 6

export function usePosts() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()

    const loadPosts = async () => {
        try {
            const lockToken = new Date().toISOString();

            Mutex.lock(lockToken);
            const resp = await api.get(`/posts?limit=${LIMIT}&sort=likes`, { lockToken });
            Mutex.releaseLock(lockToken);

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
        }
        setIsLoading(false);
    }

    const loadPage = async (page, links) => {
        let link = null;
        for (let [key, value] of Object.entries(links)) {
            if(value.includes(`page=${page}`)) {
                link = links[key]
                break;
            }
        }

        if (!link) return

        try {   
            const resp = await api.get(link)

            dispatch(setList(resp.data))
            
        } catch (error) {
            ErrorHandler.process(error);
        }
        
    }

    const filterPosts = async (filterValue) => {
        setIsLoading(true)
        try {
            const lockToken = new Date().toISOString();
            
            Mutex.lock(lockToken);
            const resp = await api.get(`/posts?limit=${LIMIT}&filter=${filterValue}`, { lockToken });
            Mutex.releaseLock(lockToken);

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
        }
        setIsLoading(false)
    }

    return {
        isLoading,
        loadPosts,
        loadPage,
        filterPosts
    }
}