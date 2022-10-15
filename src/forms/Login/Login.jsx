import './Login.scss'

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Notificator } from '@/common'

import { useForm, useFormValidation } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';

import { api } from '@/api';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
	const navigate = useNavigate();

	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')


	const { isFormDisabled, disableForm, enableForm } = useForm();
	const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
		{ password },
		{
			password: { minLength: minLength(4), maxLength: maxLength(32) },
		},
	)

	const handleSubmit = async (event) => {
		event.preventDefault();
		
		if(!isFormValid()) return;
		
		disableForm()

		try {
			await api.post('/auth/login', {
				data: {
					type: "login-data",
					attributes: {
					  email: login,
					  password: password
					 }
				  }
			})

			Notificator.success('Access granted');
			cleanForm();

			navigate('/main');
			
		} catch (error) {
			ErrorHandler.process(error);
		}

		enableForm()
	};

	const cleanForm = () => {
		setLogin('');
		setPassword('');
	}


	return (
		<section className='form-container'>
			<h1>Login form</h1>
			<form onSubmit={handleSubmit}>
				<TextField
					variant='outlined' label='login'
					type='email' color="primary_light"
					value={login}
					onChange={ e => { setLogin(e.target.value) }}
					disabled={isFormDisabled}
					required
						/>
				<TextField
					variant='outlined' label='password' 
					type='password' color="primary_light"
					value={password}
					onChange={ e => { setPassword(e.target.value) }}
					onBlur={() => touchField('password')}
					disabled={isFormDisabled}
					error={getFieldErrorMessage('password') !== ''}
					helperText={getFieldErrorMessage('password')}
					required/>
				<Button
					variant='contained'
					type='submit'
					size="large"
					color="primary_light"
					disabled={isFormDisabled}>
					Sign In
				</Button>
			</form>
		</section>
	);
}