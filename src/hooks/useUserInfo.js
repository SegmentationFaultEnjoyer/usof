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

    const getUserInfo = () => {
        const fetchInfo = async () => {
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

        fetchInfo();
    }

    return {
        isLoading,
        getUserInfo
    }

}