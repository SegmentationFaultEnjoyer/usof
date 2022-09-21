import { setCookie, getCookie, ErrorHandler } from '@/helpers/main';
import { useState } from 'react';

import { api } from '@/api/main';
import { Notificator } from '@/common/main';

import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/userSlice';

export function useUserInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const getUserInfo = () => {
        const token = getCookie('token');

        if (!token) navigate('/');

        else {
            const fetchInfo = async () => {
                try {
                    let resp = await api.get('/auth');

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

            setIsLoading(true);
            fetchInfo();

        }
    }

    return {
        isLoading,
        getUserInfo
    }
    
}