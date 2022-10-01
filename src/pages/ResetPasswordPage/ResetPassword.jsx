import './ResetPassword.scss';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Notificator } from '@/common'

import { useForm, useFormValidation } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';

import { api } from '@/api';

export default function ResetPasswordPage() {
	const redirect = useNavigate()
	const {id, token} = useParams()

	const [new_password, setNewPassword] = useState('')
	const [confirm_password, setConfirmPassword] = useState('')

	const { isFormDisabled, disableForm, enableForm } = useForm();
	const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
		{ new_password, confirm_password },
		{
			new_password: { minLength: minLength(4), maxLength: maxLength(32) },
			confirm_password: { minLength: minLength(4), maxLength: maxLength(32) },
		},
	)

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!isFormValid()) return;

		if(new_password !== confirm_password) {
			Notificator.info('Fields must be the same')
			return
		}
			

		disableForm()

		try {
			await api.post(`/auth/reset-password/${id}/${token}`, {
				data: {
					type: "password",
					attributes: {
					  password: new_password
					 }
				  }
			})

			Notificator.success('Password changed!');
			cleanForm();

		} catch (error) {
			ErrorHandler.process(error);
		}

		enableForm()
		redirect('/')
	};

	const cleanForm = () => {
		setNewPassword('');
		setConfirmPassword('');
	}


	return (
		<section className='reset-page'>
			<h1>Reset password form</h1>
			<form onSubmit={handleSubmit} className='reset-page__form'>
				<TextField
					variant='outlined' label='password'
					type='password' color="primary_light"
					value={new_password}
					onChange={e => { setNewPassword(e.target.value) }}
					onBlur={() => touchField('new_password')}
					error={getFieldErrorMessage('new_password') !== ''}
					helperText={getFieldErrorMessage('new_password')}
					disabled={isFormDisabled}
					required
				/>
				<TextField
					variant='outlined' label='confirm password'
					type='password' color="primary_light"
					value={confirm_password}
					onChange={e => { setConfirmPassword(e.target.value) }}
					onBlur={() => touchField('confirm_password')}
					error={getFieldErrorMessage('confirm_password') !== ''}
					helperText={getFieldErrorMessage('confirm_password')}
					disabled={isFormDisabled}
					required
				/>
				<div className='reset-page__actions'>
					<Button
						variant='contained'
						type='submit'
						size="large"
						color="primary_light"
						disabled={isFormDisabled}>
						Change password
					</Button>
				</div>
			</form>
		</section>
	);
}
