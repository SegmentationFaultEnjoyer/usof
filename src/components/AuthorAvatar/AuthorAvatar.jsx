import './AuthorAvatar.scss'
import Avatar from '@mui/material/Avatar';

import { useNavigate } from 'react-router-dom';
import { avatarFromString } from '@/helpers'

const DEFAULT_SIZE = 42

export default function AuthorAvatar({ id, name, email, profile_picture, size, disableClick }) {
    const navigate = useNavigate()

    const handleClick = () => {
        if(disableClick) return

        navigate(`/user/${id}`)
    }

    if(!size) size = DEFAULT_SIZE

    const styles = disableClick ? 'author-avatar' : 'author-avatar author-avatar--hoverable'

    return (
        <div className={ styles } onClick={ handleClick }>
            {profile_picture ?
            <Avatar 
                alt='avatar' 
                src={ `/images/avatar/${profile_picture}` } 
                sx={{
                    width: size,
                    height: size
                }} /> :
            <Avatar {...avatarFromString(`${name.toUpperCase()} ${email.toUpperCase()}`, size)} 
            />
            }
        </div>
    )
}