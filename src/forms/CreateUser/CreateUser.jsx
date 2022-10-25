import './CreateUser.scss'

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import { useForm, useFormValidation } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';
import { roles } from '@/types';

export default function CreateUser({ closeForm, createUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState(roles.PEASANT)

    const { isFormDisabled, disableForm, enableForm } = useForm();
	const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
		{ password, name, email },
		{
			name: { minLength: minLength(2), maxLength: maxLength(32) },
            email: { minLength: minLength(10), maxLength: maxLength(32) },
			password: { minLength: minLength(4), maxLength: maxLength(32) },
		},
	)

    const submit = async (e) => {
        if(!isFormValid()) return

        e.preventDefault()

        disableForm()
        await createUser(name, email, password, role)
        enableForm()

        closeForm()
    }

    return (
        <form onSubmit={ submit } className='create-user'>
            <h1>Create user form</h1>
            <TextField
                fullWidth
                variant='outlined' label='name'
                type='text' color="primary_light"
                value={name}
                onChange={ e => { setName(e.target.value) }}
                onBlur={() => touchField('name')}
                error={getFieldErrorMessage('name') !== ''}
                helperText={getFieldErrorMessage('name')}
                disabled={isFormDisabled}
                required
                    />
            <TextField
                fullWidth
                variant='outlined' label='email'
                type='email' color="primary_light"
                value={email}
                onChange={ e => { setEmail(e.target.value) }}
                onBlur={() => touchField('email')}
                error={getFieldErrorMessage('email') !== ''}
                helperText={getFieldErrorMessage('email')}
                disabled={isFormDisabled}
                required
                    />
            <TextField
                fullWidth
                variant='outlined' label='password'
                type='password' color="primary_light"
                value={password}
                onChange={ e => { setPassword(e.target.value) }}
                onBlur={() => touchField('password')}
                error={getFieldErrorMessage('password') !== ''}
                helperText={getFieldErrorMessage('password')}
                disabled={isFormDisabled}
                required
                    />
            <FormControlLabel
                value="end"
                control={<Checkbox
                    sx={{
                        color: 'var(--primary-light)',
                        '&.Mui-checked': {
                            color: 'var(--primary-main)',
                        }
                    }}
                    checked={role === roles.ADMIN}
                    onChange={(e) => setRole(e.target.checked ? roles.ADMIN : roles.PEASANT)} />}
                label="Admin"
                labelPlacement="end"
                    />
            <section className='create-user__actions'>
                <Button
					variant='contained'
					type='reset'
					size="large"
					color="primary_main"
                    onClick={ closeForm }
					disabled={isFormDisabled}>
					Cancel
				</Button>
                <Button
					variant='contained'
					type='submit'
					size="large"
					color="primary_light"
					disabled={isFormDisabled}>
					Create
				</Button>
            </section>
        </form>
    )
}