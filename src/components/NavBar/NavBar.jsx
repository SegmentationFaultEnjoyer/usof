import './NavBar.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

import { api } from '@/api';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '@/helpers';

export default function NavBar() {
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await api.get('/auth/logout');

        } catch (error) {
            ErrorHandler.process(new Error('Your token expired, but anyway you leaving:)'));
            ErrorHandler.clearTokens();
        }
        
        navigate('/');
    }

    const toHomePage = () => {
        navigate('/main');
    }

    return (
        <nav className='nav-bar'>
            <div className='nav-bar__icon' onClick={ toHomePage }>
                <HomeIcon color='tertiary_main'/>
            </div>
            <div className='nav-bar__icon' onClick={ logOut }>
                <LogoutIcon color='tertiary_main'/>
            </div>
        </nav>
    )
}