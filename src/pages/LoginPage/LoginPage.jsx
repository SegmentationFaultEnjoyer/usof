import './LoginPage.scss'

import LoginForm from '@/forms/Login/Login'
import RegisterForm from '@/forms/Register/Register'

import { useState, useEffect } from 'react'

import { AnimatedBackground } from '@/common/main'

import { getCookie } from '@/helpers/main'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const navigate = useNavigate();

	const [isRegistering, setIsRegistering] = useState(false);
	const [regButtonLabel, setRegButtonLabel] = useState('Not registered yet?');

	const token = getCookie('token');

	useEffect(() => {
		if(token) navigate('/main');
	}, [token])

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
				{!isRegistering ? <LoginForm /> : <RegisterForm afterActionCallback={handleRegClick}/>}
				<p onClick={handleRegClick} >{regButtonLabel}</p>
			</div>
		</div>
    )
}