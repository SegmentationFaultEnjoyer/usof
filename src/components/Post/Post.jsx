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

    const dispatch = useDispatch()
    const { filterPosts } = usePosts()

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

            try {
                let resp = await api.get(`posts/${post.id}/like?limit=1000`)
                const { data } = resp.data;

                likes = countLikes(data)
                dislikes = data.length - likes

                handleMyLikeExistance(data)  

            } catch (error) {}

            setRating({ likes, dislikes })
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
                <p className='post__publish-date'>{ new Date(publish_date).toLocaleString() }</p>
            </div>
            {is_edited && <div className='post__label post__label--edited'> 
                <EditedIcon color='primary_light'/>    
            </div>}
            {!status && <div className='post__label post__label--hidden'>
                <HiddenIcon color='primary_light' />
            </div>}
            <p className='post__content'>{ content }</p>
            <div className='post__footer'>
                <ul className='post__categories'>
                    {categories.map(
                        (category, i) => 
                        <li 
                            className='categories__item' 
                            key={i}
                            onClick={ () => {handleOnCategoryClick(category) }}>
                            { category }
                        </li>
                    )}
                </ul>
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

        </article>
    )
}