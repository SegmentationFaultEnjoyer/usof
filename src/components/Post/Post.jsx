import './Post.scss'
import { useEffect, useState } from 'react';
import { api } from '@/api'
import { ErrorHandler } from '@/helpers';
import { useSelector } from 'react-redux';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikeToggledIcon from '@mui/icons-material/Favorite';
import DislikeToggledIcon from '@mui/icons-material/HeartBroken';
import DislikeIcon from '@mui/icons-material/HeartBrokenOutlined';

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

    const userID = useSelector(state => state.user.info.id)

    const handleLikeClick = async (type) => {
        let like = false, dislike = false;
        let likeSmashProp = null;

        try {
            if (type === 'like') {
                like = !ratingState.isLikeSmashed
                if (like) likeSmashProp = false
            }
            else {
                dislike = !ratingState.isDisLikeSmashed
                if(dislike) likeSmashProp = true
            }

            if(likeSmashProp !== null) {
                await api.post(`/posts/${post.id}/like`, {
                    data: {
                        type: 'create-like',
                        attributes: {
                            liked_on: 'post',
                            is_dislike: likeSmashProp
                        }
                    }
                })
                //TODO likes number showing
                
                // if(!likeSmashProp) //if it is like
                //     setRating({...rating, likes: rating.likes + 1})
                // else 
                //     setRating({...rating, dislikes: rating.dislikes + 1})
            }
            else {
                await api.delete(`/posts/${post.id}/like`)
            }
        } catch (error) {
            ErrorHandler.process(error)
        }

        setRatingState({
            isLikeSmashed: like,
            isDisLikeSmashed: dislike
        })


    }

    const countLikes = (likesEntitiesArr) => {
        return likesEntitiesArr.reduce((prev, { attributes: { is_dislike } }) => {
            return !is_dislike ? prev + 1 : prev;
        }, 0)
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


    return (
        <article className='post'>
            <h2 className='post__title'>{title}</h2>
            <p className='post__content'>{content}</p>
            <div className='post__footer'>
                <ul className='post__categories'>
                    {categories.map(
                        (category, i) => <li className='categories__item' key={i}>{category}</li>
                    )}
                </ul>
                <section className='post__rating'>
                    <div className='rating__container'>
                        <p className='rating__label'> {rating.likes} </p>
                        <div className='rating__icon' onClick={() => handleLikeClick('like')}>
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

            </div>

        </article>
    )
}