import { useSelector } from 'react-redux';

export function handleRatingPoints(
    like, 
    dislike, 
    dislikeSmashState,
    rating, 
    ratingState, 
    ratingSetter) {

    let likeAmount = rating.likes, dislikeAmount = rating.dislikes;

    if(ratingState.isLikeSmashed !== like && dislikeSmashState === false)
        likeAmount++
    if(ratingState.isDisLikeSmashed !== dislike && dislikeSmashState === true)
        dislikeAmount++

    if(ratingState.isLikeSmashed !== like && (dislikeSmashState === true || dislikeSmashState === null))
        likeAmount--  
    if(ratingState.isDisLikeSmashed !== dislike && (dislikeSmashState === false || dislikeSmashState === null))
        dislikeAmount--
    
    ratingSetter({
        likes: likeAmount,
        dislikes: dislikeAmount
    })
}

export function countLikes (likesEntitiesArr) {
    return likesEntitiesArr.reduce((prev, { attributes: { is_dislike } }) => {
        return !is_dislike ? prev + 1 : prev;
    }, 0)
}