import './Comment.scss'

import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useUserInfo, useComments } from '@/hooks'

import { roles } from '@/types'

import Avatar from '@mui/material/Avatar';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikeToggledIcon from '@mui/icons-material/Favorite';
import DislikeToggledIcon from '@mui/icons-material/HeartBroken';
import DislikeIcon from '@mui/icons-material/HeartBrokenOutlined';

import DeleteIcon from '@mui/icons-material/DeleteForever';

import { 
    ErrorHandler, 
    countLikes, 
    handleRatingPoints, 
    avatarFromString,
    formatDate } from '@/helpers'
import { api } from '@/api'

export default function Comment({ comment, deleteComment, updateCounter }) {
    const { content, is_edited, publish_date, profile_picture } = comment.attributes
    const { author, post } = comment.relationships

    const [authorInfo, setAuthorInfo] = useState(null)
    const [rating, setRating] = useState({ likes: 0, dislikes: 0 })
    const [ratingState, setRatingState] = useState({
        isLikeSmashed: false,
        isDisLikeSmashed: false
    })

    const { loadUser } = useUserInfo()
    const { loadCommentLikes } = useComments()

    const userID = useSelector(state => state.user.info.id)

    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)
    const isBelongToMe = useMemo(() => author.id === userID, [userID])

    const handleMyLikeExistance = (data) => {
        const myLike = data.find(({ relationships: { author } }) => author.id === userID)

        if (myLike) {
            if (myLike.attributes.is_dislike)
                setRatingState({ ...ratingState, isDisLikeSmashed: true })
            else
                setRatingState({ ...ratingState, isLikeSmashed: true })
        }
    }

    const handleLikeClick = async (type) => {
        let like = false, dislike = false;
        let dislikeSmashState = null;

        try {
            if (type === 'like') {
                like = !ratingState.isLikeSmashed
                if (like) dislikeSmashState = false
            }
            else {
                dislike = !ratingState.isDisLikeSmashed
                if (dislike) dislikeSmashState = true
            }

            if (dislikeSmashState !== null) {
                await api.post(`/comments/${comment.id}/like`, {
                    data: {
                        type: 'create-like',
                        attributes: {
                            liked_on: 'comment',
                            is_dislike: dislikeSmashState
                        }
                    }
                })
            }
            else {
                await api.delete(`/comments/${comment.id}/like`)
            }
        } catch (error) {
            ErrorHandler.process(error)
        }

        handleRatingPoints(like, dislike, dislikeSmashState, rating, ratingState, setRating)

        setRatingState({
            isLikeSmashed: like,
            isDisLikeSmashed: dislike
        })
    }

    const handleCommentDelete = async () => { 
        await deleteComment(comment.id, post.id)
        updateCounter(prev => prev - 1)
    }

    useEffect(() => {
        const getUser = async () => {
            let resp = await loadUser(author.id)

            if (!resp) return

            setAuthorInfo(resp.data)

            let likes = 0, dislikes = 0

            resp = await loadCommentLikes(comment.id)

            if (!resp) return

            likes = countLikes(resp.data)
            dislikes = resp.data.length - likes

            handleMyLikeExistance(resp.data)

            setRating({ likes, dislikes })
        }
        getUser()
    }, [])

    return (
        <section className='comment'>
            <div className='comment__header'>
                {authorInfo &&
                    <div className='comment__author'>
                        {profile_picture ? 
                        //TODO picture showing
                        <Avatar alt='avatar' src={`/api/user_data/avatars/${profile_picture}`} /> :
                        <Avatar { ...avatarFromString(`${authorInfo.attributes.name.toUpperCase()} ${authorInfo.attributes.email.toUpperCase()}`)}/>
                    }
                        
                        <h4>{authorInfo.attributes.name}</h4>
                    </div>}
                <p className='comment__publish-date'>{ formatDate(publish_date) }</p>
            </div>
            {(isBelongToMe || isAdmin) && <div className='comment__delete' onClick={ handleCommentDelete }>
                <DeleteIcon color='primary_light'/>
            </div>}
            <p className='comment__content'> {content}</p>
            <section className='comment__rating'>
                <div className='rating__container'>
                    <p className='rating__label'> {rating.likes} </p>
                    <div className='rating__icon' onClick={() => handleLikeClick('like')} >
                        {ratingState.isLikeSmashed ?
                            <LikeToggledIcon color='error_light' />
                            :
                            <LikeIcon color='error_light' />
                        }
                    </div>
                </div>
                <div className='rating__container'>
                    <p className='rating__label'> {rating.dislikes}</p>
                    <div className='rating__icon' onClick={() => handleLikeClick('dislike')}>
                        {ratingState.isDisLikeSmashed ?
                            <DislikeToggledIcon color='error_light' />
                            :
                            <DislikeIcon color='error_light' />
                        }
                    </div>
                </div>
            </section>
        </section>
    )
}