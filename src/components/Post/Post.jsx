import './Post.scss'
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/api'
import { ErrorHandler, handleRatingPoints, countLikes } from '@/helpers';
import { useSelector, useDispatch } from 'react-redux';

import { usePosts } from '@/hooks';
import { setFilter } from '@/store';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikeToggledIcon from '@mui/icons-material/Favorite';
import DislikeToggledIcon from '@mui/icons-material/HeartBroken';
import DislikeIcon from '@mui/icons-material/HeartBrokenOutlined';

import HiddenIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditedIcon from '@mui/icons-material/EditOutlined';

import CommentIcon from '@mui/icons-material/MessageOutlined';

import { CommentsList } from '@/components'

import dayjs from 'dayjs';

function formatDate(date) {
    const days = dayjs(Date.now()).diff(date, 'days')

    if(!days) return 'today'

    if(days <= 31) 
        return `${days} ${days > 1 ? 'days' : 'day'} ago`
    
    const months = dayjs(Date.now()).diff(date, 'months')

    if(months <= 12)
        return `more than ${months} months ago`

    const years = dayjs(Date.now()).diff(date, 'years')
    
    return `more than ${years} years ago`
}

export default function Post({ post }) {
    const {
        title,
        status,
        publish_date,
        is_edited,
        content,
        categories } = post.attributes;

    const [rating, setRating] = useState({ likes: 0, dislikes: 0 })
    const [ratingState, setRatingState] = useState({
        isLikeSmashed: false,
        isDisLikeSmashed: false
    })
    const [commentsAmount, setCommentsAmount] = useState(0)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)

    const dispatch = useDispatch()
    const { filterPosts, loadPost, loadPostLikes } = usePosts()

    const userID = useSelector(state => state.user.info.id)

    const postClass = useMemo(() => userID !== post.relationships.author.id ? 
    'post' : 'post post--my', [userID])
   

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
                if(dislike) dislikeSmashState = true
            }

            if(dislikeSmashState !== null) {
                await api.post(`/posts/${post.id}/like`, {
                    data: {
                        type: 'create-like',
                        attributes: {
                            liked_on: 'post',
                            is_dislike: dislikeSmashState
                        }
                    }
                })
            }
            else {
                await api.delete(`/posts/${post.id}/like`)
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

    const handleMyLikeExistance = (data) => {
        const myLike = data.find(({ relationships: { author } }) => author.id === userID)

        if(myLike) {
            if(myLike.attributes.is_dislike)
                setRatingState({...ratingState, isDisLikeSmashed: true})
            else
                setRatingState({...ratingState, isLikeSmashed: true})
        }
    }

    useEffect(() => {
        const getPostInfo = async () => {
            let likes = 0, dislikes = 0;

            let resp = await loadPostLikes(post.id)

            if(!resp) return 

            const { data } = resp;

            likes = countLikes(data)
            dislikes = data.length - likes

            handleMyLikeExistance(data)  

            setRating({ likes, dislikes })

            resp = await loadPost(post.id)

            if(resp.include.error) return

            setCommentsAmount(resp.include.length)
        }

        getPostInfo()
    }, [])

    const handleOnCategoryClick = async (title) => {
        await filterPosts(`[category]-->${title}`)
        dispatch(setFilter(title))
    }

    return (
        <article className={postClass}>
            <div className='post__header'>
                <h2 className='post__title'>{ title }</h2>
                <p className='post__publish-date'>{ formatDate(publish_date) }</p>
            </div>
            {is_edited && <div className='post__label post__label--edited'> 
                <EditedIcon color='primary_light'/>    
            </div>}
            {!status && <div className='post__label post__label--hidden'>
                <HiddenIcon color='primary_light' />
            </div>}
            <div 
                className='post__label post__label--comments'
                onClick={() => setIsCommentsOpen(prev => !prev)}>
                {commentsAmount > 0 &&  <div className='post__label__comments-amount'>
                    <span>{ commentsAmount }</span>
                </div>}
                <CommentIcon color='primary_light'/>
            </div>
            <p className='post__content'>{ content }</p>
            <div className='post__footer'>
                <ul className='post__categories'>
                    {categories.map(
                        (category, i) => 
                        <li 
                            className='categories__item' 
                            key={i}
                            onClick={ () => { handleOnCategoryClick(category) }}>
                            { category }
                        </li>
                    )}
                </ul>
                {/* TODO: seperate rating component */}
                <section className='post__rating'>
                    <div className='rating__container'>
                        <p className='rating__label'> { rating.likes } </p>
                        <div className='rating__icon' onClick={() => handleLikeClick('like')}>
                            {ratingState.isLikeSmashed ?
                                <LikeToggledIcon color='error_light' />
                                :
                                <LikeIcon color='error_light' />
                            }
                        </div>
                    </div>
                    <div className='rating__container'>
                        <p className='rating__label'> { rating.dislikes }</p>
                        <div className='rating__icon' onClick={() => handleLikeClick('dislike')}>
                            {ratingState.isDisLikeSmashed ?
                                <DislikeToggledIcon color='error_light' />
                                :
                                <DislikeIcon color='error_light' />
                            }
                        </div>
                    </div>
                </section>
            </div>
            <CommentsList 
                isOpen={ isCommentsOpen } 
                postId={ post.id } 
                updateCounter={ setCommentsAmount } />
        </article>
    )
}