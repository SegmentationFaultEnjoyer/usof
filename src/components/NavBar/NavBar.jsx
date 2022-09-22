import './NavBar.scss';
import LogoutIcon from '@mui/icons-material/Logout';

import { api } from '@/api/main';
import { useNavigate } from 'react-router-dom';
import { Notificator } from '@/common/main';
import { ErrorHandler } from '@/helpers/main';

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
        <nav className='top_nav__bar'>
            <div className='icon__container' onClick={LogOut}>
                <LogoutIcon color='tertiary_main'/>
            </div>
        </nav>
    )
}