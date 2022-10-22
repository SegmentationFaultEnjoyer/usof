import './Post.scss'
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { formatDate } from '@/helpers';
import { usePosts } from '@/hooks';
import { setFilter } from '@/store';
import { PostContext } from '@/context';

import HiddenIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/HighlightOff';

import CommentIcon from '@mui/icons-material/MessageOutlined';

import { CommentsList, Rating } from '@/components'
import { ConfirmationModal } from '@/common';
import { roles } from '@/types';

export default function Post({ post }) {
    const {
        title,
        status,
        publish_date,
        is_edited,
        content,
        categories } = post.attributes;

    const [commentsAmount, setCommentsAmount] = useState(0)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const dispatch = useDispatch()
    const { filterPosts, loadPost, loadPostLikes, deletePost } = usePosts()

    const userID = useSelector(state => state.user.info.id)
    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)

    const isBelongToMe = useMemo(() => userID === post.relationships.author.id, [userID])

    const postClass = useMemo(() => !isBelongToMe ? 'post' : 'post post--my', [userID])

    useEffect(() => {
        const getPostInfo = async () => {
            const resp = await loadPost(post.id)

            if (resp.include.error) return

            setCommentsAmount(resp.include.length)
        }

        getPostInfo()
    }, [])

    const handleOnCategoryClick = async (title) => {
        await filterPosts(`[category]-->${title}`)
        dispatch(setFilter(title))
    }

    const handlePostDelete = async () => { await deletePost(post.id) }

    const sharedData = useMemo(() => ({
        updateCounter: setCommentsAmount,
        postID: post.id
    }), [post.id])

    return (
        <PostContext.Provider value={sharedData}>
            <article className={postClass}>
                <div className='post__header'>
                    <h2 className='post__title'>{title}</h2>
                    <p className='post__publish-date'>{formatDate(publish_date)}</p>
                </div>
                {(isBelongToMe || isAdmin) &&
                    <div className='post__delete' onClick={() => setIsDeleting(true)}>
                        <DeleteIcon color='primary_light' />
                    </div>}
                {is_edited && <div className='post__label post__label--edited'>
                    <EditedIcon color='primary_light' />
                </div>}
                {!status && <div className='post__label post__label--hidden'>
                    <HiddenIcon color='primary_light' />
                </div>}
                <div
                    className='post__label post__label--comments'
                    onClick={() => setIsCommentsOpen(prev => !prev)}>
                    {commentsAmount > 0 && <div className='post__label__comments-amount'>
                        <span>{commentsAmount}</span>
                    </div>}
                    <CommentIcon color='primary_light' />
                </div>
                <p className='post__content'>{content}</p>
                <div className='post__footer'>
                    <ul className='post__categories'>
                        {categories.map(
                            (category, i) =>
                                <li
                                    className='categories__item'
                                    key={i}
                                    onClick={() => { handleOnCategoryClick(category) }}>
                                    {category}
                                </li>
                        )}
                    </ul>
                    <Rating 
                        endpoint='post' 
                        entity='post' 
                        id={ post.id } 
                        loadLikes={ loadPostLikes } />
                </div>
                <CommentsList isOpen={ isCommentsOpen } />
                <ConfirmationModal 
                    isOpen={ isDeleting } 
                    setIsOpen={ setIsDeleting }
                    action={ handlePostDelete }
                    message='Post successfuly deleted'/>
            </article>
        </PostContext.Provider>
    )
}