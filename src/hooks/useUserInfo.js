import { ErrorHandler } from '@/helpers';
import { useState } from 'react';

import { api } from '@/api';
import Mutex from '@/api/mutex'

import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux'
import { setUser } from '@/store';

export function useUserInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const getUserInfo = async () => {
        try {
            const lockToken = new Date().toISOString();

            Mutex.lock(lockToken);
            let resp = await api.get('/auth', { lockToken });
            Mutex.releaseLock(lockToken);

            dispatch(setUser({
                ...resp.data.data.attributes,
                id: resp.data.data.id
            }));

        } catch (error) {
            ErrorHandler.process(error);
            ErrorHandler.clearTokens();

            navigate('/');
        }

        setIsLoading(false);
    }

    const loadUser = async (userID) => {
        try {
            const resp = await api.get(`/users/${userID}`)

            return resp.data
        } catch (error) {
            ErrorHandler.process(error)
            return null
        }
    }

    return {
        isLoading,
        getUserInfo,
        loadUser
    }

}