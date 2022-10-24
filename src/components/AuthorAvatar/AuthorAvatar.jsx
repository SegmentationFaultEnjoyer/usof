import './AuthorAvatar.scss'
import Avatar from '@mui/material/Avatar';

import { useNavigate } from 'react-router-dom';
import { avatarFromString } from '@/helpers'

export default function AuthorAvatar({ id, name, email, profile_picture, size, disableClick }) {
    const navigate = useNavigate()

    const handleClick = () => {
        if(disableClick) return

        navigate(`/user/${id}`)
    }

    return (
        <div className='author-avatar' onClick={ handleClick }>
            {profile_picture ?
                //TODO picture showing
            <Avatar alt='avatar' src={`/api/user_data/avatars/${profile_picture}`} /> :
            <Avatar {...avatarFromString(`${name.toUpperCase()} ${email.toUpperCase()}`, size)} 
            />
            }
        </div>
    )
}