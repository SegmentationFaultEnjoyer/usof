import './Post.scss'
import { useState } from 'react';

import PostInfo from './PostInfo';
import PostEdit from './PostEdit';

export default function Post({ post, disabled }) {
   const [isEditing, setIsEditing] = useState(false)

    return (
        <>
        {!isEditing ? 
            <PostInfo post={ post } toggleEdit={ setIsEditing } disabled={disabled}/> :
            <PostEdit post={ post } toggleEdit={ setIsEditing }/>}
        </>
    )
}