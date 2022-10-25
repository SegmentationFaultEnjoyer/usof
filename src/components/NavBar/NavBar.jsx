import './NavBar.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanel from '@mui/icons-material/AdminPanelSettings';

import { api } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ErrorHandler } from '@/helpers';
import { roles } from '@/types'

export default function NavBar() {
    const navigate = useNavigate();

    const userID = useSelector(state => state.user.info.id)
    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)

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

    const toUserPage = () => {
        navigate(`/user/${userID}`)
    }

    const toAdminPage = () => {
        navigate('/admin')
    }

    return (
        <nav className='nav-bar'>
            {isAdmin && <div className='nav-bar__icon' onClick={ toAdminPage }>
                <AdminPanel color='tertiary_main'/>
            </div>}
            <div className='nav-bar__icon' onClick={ toUserPage }>
                <PersonIcon color='tertiary_main'/>
            </div>
            <div className='nav-bar__icon' onClick={ toHomePage }>
                <HomeIcon color='tertiary_main'/>
            </div>
            <div className='nav-bar__icon' onClick={ logOut }>
                <LogoutIcon color='tertiary_main'/>
            </div>
        </nav>
    )
}