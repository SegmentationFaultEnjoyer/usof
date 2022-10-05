import { ErrorHandler } from '@/helpers';
import { useState } from 'react';

import { api } from '@/api';
import Mutex from '@/api/mutex'

export function usePosts() {
    const [isLoading, setIsLoading] = useState(true);

    const loadPosts = async () => {
        try {
            const lockToken = new Date().toISOString();

            Mutex.lock(lockToken);
            const resp = await api.get('/posts?limit=20&sort=likes', { lockToken });
            Mutex.releaseLock(lockToken);

            setIsLoading(false);

            return resp.data;

        } catch (error) {
            ErrorHandler.process(error);
            // setIsLoading(false);
            return null;
        }

        
    }

    return {
        isLoading,
        loadPosts
    }
}