import './LoginPage.scss'

import { LoginForm, RegisterForm, ForgotPasswordForm } from '@/forms'

import { useState, useEffect, useRef } from 'react'

import { AnimatedBackground, Modal } from '@/common'

import { getCookie } from '@/helpers'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const navigate = useNavigate();

	const [isRegistering, setIsRegistering] = useState(false);
	const [regButtonLabel, setRegButtonLabel] = useState('Not registered yet?');

	const remindPasswordModal = useRef(null);
	const [isModalShown, setIsModalShown] = useState(false);

	const token = getCookie('token');

	useEffect(() => {
		if (token) navigate('/main');
	}, [])

	const handleRegClick = () => {
		setIsRegistering(!isRegistering);

		const buttonText = regButtonLabel === 'Not registered yet?' ? 'Back' : 'Not registered yet?';
		setRegButtonLabel(buttonText);
	}

	

	return (
		<div className='login-page'>
			<section className='background-container'>
				<AnimatedBackground>
					<h1>USOF</h1>
				</AnimatedBackground>
			</section>
			<div className='login-page_actions'>
				{!isRegistering ? <LoginForm /> : <RegisterForm afterActionCallback={handleRegClick} />}
				<p onClick={handleRegClick} >{regButtonLabel}</p>
				<p onClick={() => setIsModalShown(true)}>Forgot your password?</p>
			</div>
			
			<Modal
				ref={remindPasswordModal}
				isShown={isModalShown}
				setIsShown={setIsModalShown}
			>
				<ForgotPasswordForm closeModal={() => setIsModalShown(false)}/>
			</Modal>
		</div>
	)
}