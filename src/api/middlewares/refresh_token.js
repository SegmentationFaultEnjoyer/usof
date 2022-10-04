import { api } from '@/api'
import { getCookie } from '@/helpers'
import { ErrorHandler } from '@/helpers'
import { AxiosError } from 'axios'

import { isExcluded } from '@/api/helpers/urlMatch'

const excludeRoutes = ['auth/login', 'auth/register', 'auth/reset-password', 'auth/refresh']

export async function refreshTokenMiddleWare(config) {
    const URL = config.url;
    
    if(isExcluded(URL, excludeRoutes)) return config;

    const access_token = getCookie('token');

    if(!access_token) {
        try {
            const refresh_token = getCookie('refresh');

            if(!refresh_token) throw new Error('Tokens expired');

            await api.post('auth/refresh', {
                data: {
                    type: 'refresh-token',
                    attributes: {
                        token: refresh_token
                    }
                }
            })

            return config;

        } catch (error) {
            ErrorHandler.clearTokens();
            return Promise.reject(error)
        }
    }
    else
        return config;

}