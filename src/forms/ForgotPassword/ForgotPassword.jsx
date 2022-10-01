import './ForgotPassword.scss';

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Notificator } from '@/common'

import { useForm, } from '@/hooks';
import { ErrorHandler } from '@/helpers';

import { api } from '@/api';

export default function ForgotPasswordForm({ closeModal }) {
    const [email, setEmail] = useState('')

    const { isFormDisabled, disableForm, enableForm } = useForm();


    const handleSubmit = async (event) => {
        event.preventDefault();

        disableForm()

        try {
            await api.post('/auth/reset-password', {
                data: {
                    type: "password-reset",
                    attributes: {
                        email
                    }
                }
            })

            Notificator.success('Check your email!');
            closeModal();
            cleanForm();

        } catch (error) {
            ErrorHandler.process(error);
        }

        enableForm()
    };

    const cleanForm = () => {
        setEmail('')
    }


    return (
        <section>
            <h1 className='forgot-password-form__title'>Forgot password form</h1>
            <form className='forgot-password-form' onSubmit={handleSubmit}>
                <TextField
                    variant='outlined' label='email'
                    type='text' color="primary_light"
                    value={email}
                    onChange={e => { setEmail(e.target.value) }}
                    disabled={isFormDisabled}
                    required
                />
                <div className='forgot-password-form__actions'>
                    <Button
                        variant='contained'
                        type='reset'
                        size="large"
                        color="primary_main"
                        disabled={isFormDisabled}
                        onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        type='submit'
                        size="large"
                        color="primary_light"
                        disabled={isFormDisabled}
                        >
                        Reset password
                    </Button>
                </div>

            </form>
        </section>
    );
}