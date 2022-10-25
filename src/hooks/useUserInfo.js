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

            setIsLoading(false);

            return resp.data.data.attributes.role

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

    const changePassword = async (userID, oldPass, newPass) => {
        try {
            await api.patch(`/users/${userID}`, {
                data: {
                    type: "update-user",
                    attributes: {
                        old_password: oldPass,
                        new_password: newPass
                    }
                }
            })
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const changeEmail = async (userID, email) => {
        try {
            await api.patch(`/users/${userID}`, {
                data: {
                    type: 'update-user',
                    attributes: {
                        email
                    }
                }
            })
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const changeAvatar = async (photo) => {
        try {
            await api.patch('/users/avatar', photo)
            
        } catch (error) {
            ErrorHandler.process(error)
            
        }
    }

    return {
        isLoading,
        getUserInfo,
        changePassword,
        changeEmail,
        changeAvatar,
        loadUser
    }

}