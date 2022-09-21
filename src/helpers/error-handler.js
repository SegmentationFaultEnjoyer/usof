import { AxiosError } from 'axios';
import { Notificator } from '@/common/main';
import { setCookie } from '@/helpers/main';

function getErrorMessage(error) {
    if(error instanceof AxiosError) {
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
