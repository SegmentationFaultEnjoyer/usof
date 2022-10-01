import { AxiosError } from 'axios';
import { Notificator } from '@/common';
import { setCookie } from '@/helpers';

function getErrorMessage(error) {
    if(error instanceof AxiosError) {
        if(!error.response.data.errors) return error.message
        
        const { title, detail } = error.response.data.errors;
        console.error(title, detail, error);
        return detail;
    }
    else 
        return error.message;
}

export class ErrorHandler {
    static process(error) {
        Notificator.error(getErrorMessage(error));
    }

    static clearTokens() {
        setCookie('token', '', 0);
        setCookie('refresh', '', 0);
    }
}
