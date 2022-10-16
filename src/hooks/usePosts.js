import { ErrorHandler } from '@/helpers';
import { useState } from 'react';

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

    const loadPage = async (page, links) => {
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

            dispatch(setList(resp.data))

        } catch (error) {
            ErrorHandler.process(error);
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
        loadPage,
        filterPosts
    }
}