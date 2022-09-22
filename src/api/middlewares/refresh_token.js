import { api } from '@/api/main'
import { getCookie } from '@/helpers/main'
import { ErrorHandler } from '@/helpers/main'
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
            return Promise.reject(new AxiosError(`Tokens are invalid: ${error.message}`, undefined, config))
        }
    }
    else
        return config;

}