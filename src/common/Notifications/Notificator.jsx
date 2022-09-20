import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss'

const options = Object.freeze({
    autoClose: 3000,
    style: {
        backgroundColor: 'var(--primary-main)'
    }
}) 

class Notificator {
    static success(payload) {
        toast.success(payload, {...options, 
            progressStyle: {backgroundColor: 'var(--success-light)'},
            className: 'icon-success'
        });
    }

    static info(payload) {
        toast.info(payload, {
            ...options,
            progressStyle: {backgroundColor: 'var(--tertiary-dark)'},
            className: 'icon-info'
        })
    }

    static error(payload) {
        toast.error(payload, {
            ...options,
            progressStyle: {backgroundColor: 'var(--error-dark)'},
            className: 'icon-error'
        })
    }

    static warning(payload) {
        toast.warn(payload, {
            ...options

        })
    }
}

export { Notificator, ToastContainer }
