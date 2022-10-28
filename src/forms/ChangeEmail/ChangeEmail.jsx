import './ChangeEmail.scss'

import { useState } from 'react';

import { TextField, Button } from '@mui/material'

import { useForm, useUserInfo } from '@/hooks';
import { ErrorHandler } from '@/helpers';

export default function ChangeEmail({ closeModal, userID, user }) {
    const [email, setEmail] = useState(user.email)
    const [name, setName] = useState(user.name)

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { changePersonalInfo } = useUserInfo()

    const submit = async () => {
        disableForm()

        try {
            await changePersonalInfo(userID, email, name)

            closeModal()
        } catch (error) {
            ErrorHandler.process(error)
        }

        enableForm()
    }

    return (
        <form className='forgot-password-form' onSubmit={ submit }>
            <h1 className='change-password__title'>Change personal info form</h1>
            <TextField
                variant='outlined' label='name'
                type='text' color="primary_light"
                value={name}
                onChange={e => { setName(e.target.value) }}
                disabled={isFormDisabled}
                required
            />
             <TextField
                variant='outlined' label='email'
                type='email' color="primary_light"
                value={email}
                onChange={e => { setEmail(e.target.value) }}
                disabled={isFormDisabled}
                required
            />
            <div className='change-email__actions'>
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
                    Apply
                </Button>
            </div>

        </form>
    )
}