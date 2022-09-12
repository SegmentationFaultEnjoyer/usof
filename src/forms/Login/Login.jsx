import './Login.scss'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/userSlice';

export default function SignIn() {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		console.log({
			login: data.get('login')
		});

		dispatch(setUser({
			name: data.get('login'),
		}))
	};

	const testLabel = useSelector(state => state.user.info.name);
	const dispatch = useDispatch();

	return (
		<div className='login-page'>
			<h1>LOgin page</h1>
			<p>{testLabel}</p>
			<form onSubmit={handleSubmit}>
				<TextField
					name='login'
					variant='outlined'
					label='login'
					required />
				<Button variant='contained' type='submit' size="large">
					Submit
				</Button>
			</form>
			
		</div>
	);
}