import './AuthorAvatar.scss'
import Avatar from '@mui/material/Avatar';

import { avatarFromString } from '@/helpers'

export default function AuthorAvatar({ name, email, profile_picture }) {

    return (
        <div className='author-avatar'>
        {profile_picture ?
            //TODO picture showing
        <Avatar alt='avatar' src={`/api/user_data/avatars/${profile_picture}`} /> :
        <Avatar {...avatarFromString(`${name.toUpperCase()} ${email.toUpperCase()}`)} />
        }
        </div>
    )
}