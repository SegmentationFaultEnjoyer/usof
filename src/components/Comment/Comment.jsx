import './Comment.scss'

import { useEffect, useState, useMemo, useContext } from 'react'

import CommentInfo from './CommentInfo'
import CommentEdit from './CommentEdit'

export default function Comment({ comment, deleteComment, updateComment }) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
         {!isEditing ? 
            <CommentInfo comment={ comment } deleteComment={ deleteComment } toggleEdit={ setIsEditing }/> :
            <CommentEdit comment={ comment } updateComment={ updateComment } toggleEdit={ setIsEditing }/>}
        </>
    )
}