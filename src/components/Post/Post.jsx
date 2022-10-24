import './Post.scss'
import { useState } from 'react';

import PostInfo from './PostInfo';
import PostEdit from './PostEdit';

export default function Post({ post }) {
   const [isEditing, setIsEditing] = useState(false)

    return (
        <>
        {!isEditing ? 
            <PostInfo post={ post } toggleEdit={ setIsEditing }/> :
            <PostEdit post={ post } toggleEdit={ setIsEditing }/>}
        </>
    )
}