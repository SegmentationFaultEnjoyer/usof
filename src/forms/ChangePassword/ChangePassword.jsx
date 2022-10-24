import './ChangePassword.scss'

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useForm, useUserInfo } from '@/hooks';
import { ErrorHandler } from '@/helpers';
import { Notificator } from '@/common';

export default function ChangePassword({ closeModal, userID }) {
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { changePassword } = useUserInfo()

    const submit = async (e) => {
        e.preventDefault()

        if (newPass !== confirmPass) {
            ErrorHandler.process(new Error('Fields dont match'))
            return
        }

        disableForm()
        try {
            await changePassword(userID, oldPass, newPass)

            Notificator.success('Password changed!')
            closeModal()
        } catch (error) {
            ErrorHandler.process(error)
        }

        enableForm()
    }

    return (
        <form className='change-password' onSubmit={submit}>
            <h1 className='change-password__title'>Change password form</h1>
            <TextField
                variant='outlined' label='Old password'
                type='password' color="primary_light"
                value={oldPass}
                onChange={e => { setOldPass(e.target.value) }}
                disabled={isFormDisabled}
                required
            />
            <TextField
                variant='outlined' label='New password'
                type='password' color="primary_light"
                value={newPass}
                onChange={e => { setNewPass(e.target.value) }}
                disabled={isFormDisabled}
                required
            />
            <TextField
                variant='outlined' label='Confirm new password'
                type='password' color="primary_light"
                value={confirmPass}
                onChange={e => { setConfirmPass(e.target.value) }}
                disabled={isFormDisabled}
                required
            />
            <section className='change-password__actions'>
                <Button
                    variant='contained'
                    type='reset'
                    size="large"
                    color="primary_main"
                    disabled={isFormDisabled}
                    onClick={ closeModal }>
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    type='submit'
                    size="large"
                    color="primary_light"
                    disabled={isFormDisabled}
                >
                    Change password
                </Button>
            </section>
        </form>
    )
}