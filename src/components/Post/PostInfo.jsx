import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { formatDate } from '@/helpers';
import { usePosts } from '@/hooks';
import { setFilter } from '@/store';
import { PostContext } from '@/context';

import {
    VisibilityOffOutlined as HiddenIcon,
    VisibilityOutlined as ShownIcon,
    EditOutlined as EditedIcon,
    HighlightOff as DeleteIcon,
    MessageOutlined as CommentIcon,
    BorderColorOutlined as StartEditIcon
} from '@mui/icons-material'

import { CommentsList, Rating, AuthorAvatar } from '@/components'
import { ConfirmationModal } from '@/common';
import { roles } from '@/types';

export default function PostInfo({ post, toggleEdit, disabled }) {
    const {
        title,
        status,
        publish_date,
        is_edited,
        content,
        categories } = post.attributes;

    const [commentsAmount, setCommentsAmount] = useState(0)
    const [author, setAuthor] = useState(null)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isFullDateShown, setIsFullDateShown] = useState(false)

    const dispatch = useDispatch()
    const { filterPosts, loadPost, loadPostLikes, deletePost, updatePost } = usePosts()

    const userID = useSelector(state => state.user.info.id)
    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)

    const isBelongToMe = useMemo(() => userID === post.relationships.author.id, [userID])

    useEffect(() => {
        const getPostInfo = async () => {
            const { data: { relationships: { author } }, include } = await loadPost(post.id)

            setAuthor(author)

            if (include.error) return

            setCommentsAmount(include.length)
        }

        getPostInfo()
    }, [])

    const handleOnCategoryClick = async (title) => {
        if (disabled) return 
        
        await filterPosts(`[category]-->${title}`)
        dispatch(setFilter({ param: 'category', value: title }))
    }

    const handlePostDelete = async () => { await deletePost(post.id) }

    const handleStatusChange = async () => {
        await updatePost(post.id, { status: !status })
    }

    const sharedData = useMemo(() => ({
        updateCounter: setCommentsAmount,
        postID: post.id
    }), [post.id])

    return (
        <PostContext.Provider value={sharedData}>
            <article className='post'>
                <div className='post__header'>
                    {author && <section className='post__author'>
                        <AuthorAvatar
                            id={author.id}
                            name={author.name}
                            email={author.email}
                            profile_picture={author.profile_picture} />
                        <div className='header__post-info'>
                            <p className='author__name'> {author.name} </p>
                            <div className='post__toggle-edit'>
                                <h2 className='post__title'>{title}</h2>
                                {isBelongToMe && 
                                <div className='post__edit-icon' onClick={() => toggleEdit(true)}>
                                    <StartEditIcon fontSize='small' />
                                </div> }
                            </div>
                            
                        </div>
                    </section>}
                    <div className='post__trigger'
                        onMouseEnter={() => setIsFullDateShown(true)}
                        onMouseLeave={() => setIsFullDateShown(false)}>
                        <p className='post__publish-date'>
                            {formatDate(publish_date)}
                        </p>
                    </div>

                    {isFullDateShown &&
                        <div className='post__publish-date post__publish-date--full'>
                            <p>{new Date(publish_date).toLocaleString()}</p>
                        </div>}

                </div>

                {(isBelongToMe || isAdmin) &&
                    <div className='post__delete' onClick={() => setIsDeleting(true)}>
                        <DeleteIcon color='primary_light' />
                    </div>}

                {is_edited && <div className='post__label post__label--edited'>
                    <EditedIcon color='primary_light' />
                </div>}

                {isAdmin && <div className='post__label post__label--hidden' onClick={ handleStatusChange }>
                    {!status ? 
                    <HiddenIcon color='primary_light' /> : 
                    <ShownIcon color='primary_light'/>}
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
                        endpoint='posts'
                        entity='post'
                        id={post.id}
                        loadLikes={loadPostLikes} />
                </div>

                <CommentsList isOpen={isCommentsOpen} />

                <ConfirmationModal
                    isOpen={isDeleting}
                    setIsOpen={setIsDeleting}
                    action={handlePostDelete}
                    message='Post successfuly deleted' />
            </article>
        </PostContext.Provider>
    )
}