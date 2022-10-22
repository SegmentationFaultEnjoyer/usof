import './Rating.scss'

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import LikeToggledIcon from '@mui/icons-material/Favorite';
import DislikeToggledIcon from '@mui/icons-material/HeartBroken';
import DislikeIcon from '@mui/icons-material/HeartBrokenOutlined';

import { api } from '@/api';
import { ErrorHandler, handleRatingPoints, countLikes } from '@/helpers';


export default function Rating({ endpoint, entity, id, loadLikes, centered }) {
    const [rating, setRating] = useState({ likes: 0, dislikes: 0 })
    const [ratingState, setRatingState] = useState({
        isLikeSmashed: false,
        isDisLikeSmashed: false
    })

    const userID = useSelector(state => state.user.info.id)

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
                await api.post(`/${endpoint}/${id}/like`, {
                    data: {
                        type: 'create-like',
                        attributes: {
                            liked_on: entity,
                            is_dislike: dislikeSmashState
                        }
                    }
                })
            }
            else {
                await api.delete(`/${endpoint}/${id}/like`)
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

    useEffect(() => {
        const initRating = async () => {
            const resp = await loadLikes(id)

            if (!resp) return

            let likes = 0, dislikes = 0;

            likes = countLikes(resp.data)
            dislikes = resp.data.length - likes

            handleMyLikeExistance(resp.data)

            setRating({ likes, dislikes })
        }

        initRating()
    }, [])

    const ratingStyles = useMemo(() => 
        centered ? 'rating rating--centered' : 'rating'
    , [])

    return (
        <section className={ ratingStyles }>
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
    )
}