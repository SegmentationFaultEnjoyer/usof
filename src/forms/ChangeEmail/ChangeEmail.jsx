import './ChangeEmail.scss'

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Notificator } from '@/common'

import { useForm, useUserInfo } from '@/hooks';
import { ErrorHandler } from '@/helpers';

export default function ChangeEmail({ closeModal, userID }) {
    const [email, setEmail] = useState('')

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { changeEmail } = useUserInfo()

    const submit = async () => {
        disableForm()

        try {
            await changeEmail(userID, email)

            closeModal()
        } catch (error) {
            ErrorHandler.process(error)
        }

        enableForm()
    }

    return (
        <form className='forgot-password-form' onSubmit={ submit }>
            <h1 className='change-password__title'>Change email form</h1>
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
                    Change email
                </Button>
            </div>

        </form>
    )
}