import './NavBar.scss';
import LogoutIcon from '@mui/icons-material/Logout';

import { api } from '@/api';
import { useNavigate } from 'react-router-dom';
import { Notificator } from '@/common';
import { ErrorHandler } from '@/helpers';

export default function NavBar() {
    const navigate = useNavigate();

    const LogOut = async () => {
        try {
            await api.get('/auth/logout');

        } catch (error) {
            ErrorHandler.process(new Error('Your token expired, but anyway you leaving:)'));
            ErrorHandler.clearTokens();
        }
        
        navigate('/');
    }

    return (
        <nav className='nav-bar'>
            <div className='nav-bar__icon' onClick={LogOut}>
                <LogoutIcon color='tertiary_main'/>
            </div>
        </nav>
    )
}