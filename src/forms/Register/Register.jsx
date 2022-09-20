import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Notificator } from '@/common/main'

import { useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/userSlice';

import { useForm, useFormValidation } from '@/hooks/main';
import { maxLength, minLength } from '@/helpers/main';

import { api } from '@/api/main';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
    const dispatch = useDispatch();
	const navigate = useNavigate();

	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('');


	const { isFormDisabled, disableForm, enableForm } = useForm();
	const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
		{ password, name },
		{
			name: { minLength: minLength(2), maxLength: maxLength(32) },
			password: { minLength: minLength(4), maxLength: maxLength(32) },
		},
	)

	const handleSubmit = async (event) => {
		event.preventDefault();
		
		if(!isFormValid()) return;
		
		disableForm()

		try {
			await api.post('/auth/register', {
				data: {
					type: "register-data",
					attributes: {
					  email: login,
					  name,
					  password
					 }
				  }
			})

			Notificator.success('Welcome!');
			cleanForm();

			navigate('/main');
			
		} catch (error) {
			let error_msg = error.message;

			if(error.response) {
				const { title, detail } = error.response.data.errors;
				console.error(title, detail, error);
				error_msg = detail;
			}
			
			Notificator.error(error_msg);
		}

		enableForm()
	};

	const cleanForm = () => {
		setLogin('');
		setPassword('');
		setName('');
	}


	return (
		<section className='form-container'>
			<h1>Register form</h1>
			<form onSubmit={handleSubmit}>
				<TextField
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
					Register
				</Button>
			</form>
		</section>
	);
}