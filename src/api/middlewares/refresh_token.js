import { api } from '@/api'
import { getCookie, ErrorHandler, isExcluded } from '@/helpers'
import { AxiosError } from 'axios'

const excludeRoutes = ['auth/login', 'auth/register', 'auth/reset-password', 'auth/refresh']

let IS_REFRESHING = false

export async function refreshTokenMiddleWare(config) {
    if(IS_REFRESHING) return config

    const URL = config.url;
    
    if(isExcluded(URL, excludeRoutes)) return config;

    const access_token = getCookie('token');

    if(!access_token) {
        try {
            const refresh_token = getCookie('refresh');

            if(!refresh_token) throw new AxiosError('Tokens expired', null, config);

            IS_REFRESHING = true

            await api.post('auth/refresh', {
                data: {
                    type: 'refresh-token',
                    attributes: {
                        token: refresh_token
                    }
                }
            })

            IS_REFRESHING = false

            return config;

        } catch (error) {
            IS_REFRESHING = false

            ErrorHandler.clearTokens();
            return Promise.reject(error)
        }
    }
    else
        return config;

}