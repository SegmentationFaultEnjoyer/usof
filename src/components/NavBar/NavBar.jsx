import './NavBar.scss';

import { 
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminPanel
} from '@mui/icons-material'

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
            <h1 className='nav-bar__logo' onClick={ toHomePage }>USOF</h1>
            <section className='nav-bar__actions'>
                {isAdmin && <div className='nav-bar__icon' onClick={ toAdminPage }>
                    <AdminPanel color='tertiary_main'/>
                </div>}
                <div className='nav-bar__icon' onClick={ toUserPage }>
                    <PersonIcon color='tertiary_main'/>
                </div>
                <div className='nav-bar__icon' onClick={ logOut }>
                    <LogoutIcon color='tertiary_main'/>
                </div>
            </section>
            
        </nav>
    )
}