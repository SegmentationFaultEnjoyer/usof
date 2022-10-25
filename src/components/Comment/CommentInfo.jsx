import { useEffect, useState, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux'

import { useUserInfo, useComments } from '@/hooks'
import { PostContext } from '@/context'
import { roles } from '@/types'

import { Rating, AuthorAvatar } from '@/components'
import { ConfirmationModal } from '@/common'

import DeleteIcon from '@mui/icons-material/DeleteForever';
import StartEditIcon from '@mui/icons-material/BorderColorOutlined';

import { formatDate } from '@/helpers'

export default function CommentInfo({ comment, deleteComment, toggleEdit }) {
    const { content, is_edited, publish_date } = comment.attributes
    const { author, post } = comment.relationships

    const { updateCounter } = useContext(PostContext)

    const [authorInfo, setAuthorInfo] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const { loadUser } = useUserInfo()
    const { loadCommentLikes } = useComments()

    const userID = useSelector(state => state.user.info.id)

    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)
    const isBelongToMe = useMemo(() => author.id === userID, [userID])

    const handleCommentDelete = async () => {
        await deleteComment(comment.id, post.id)
        updateCounter(prev => prev - 1)
    }

    useEffect(() => {
        const getUser = async () => {
            let resp = await loadUser(author.id)

            if (!resp) return

            setAuthorInfo(resp.data)
        }
        getUser()
    }, [])

    return (
        <section className='comment'>
            {authorInfo &&
                <div className='comment__header'>
                    <AuthorAvatar
                        id={authorInfo.id}
                        name={authorInfo.attributes.name}
                        email={authorInfo.attributes.email}
                        profile_picture={authorInfo.attributes.profile_picture} />
                    <div className='header__info'>
                        <div className='comment__toggle-edit'>
                            <h4>{authorInfo.attributes.name}</h4>
                            {isBelongToMe &&
                                <div className='comment__edit-icon' onClick={() => toggleEdit(true)}>
                                    <StartEditIcon fontSize='small' />
                                </div>}
                        </div>
                        <p className='comment__publish-date'>{formatDate(publish_date)}</p>
                    </div>
                </div>}
            {(isBelongToMe || isAdmin) && <div className='comment__delete' onClick={() => setIsDeleting(true)}>
                <DeleteIcon color='primary_light' />
            </div>}
            <p className='comment__content'> {content}</p>
            <Rating
                centered
                endpoint='comments'
                entity='comment'
                id={comment.id}
                loadLikes={loadCommentLikes} />
            <ConfirmationModal
                isOpen={isDeleting}
                setIsOpen={setIsDeleting}
                action={handleCommentDelete}
                message='Comment successfuly deleted' />
        </section>
    )
}