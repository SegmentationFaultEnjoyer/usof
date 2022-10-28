import './Post.scss'
import { useState, useEffect } from 'react';
import { usePosts } from '@/hooks';

import PostInfo from './PostInfo';
import PostEdit from './PostEdit';

export default function Post({ post, disabled }) {
    const [isEditing, setIsEditing] = useState(false)

    const [commentsAmount, setCommentsAmount] = useState(0)
    const [postExtended, setPostExtended] = useState(post)
    const [postChanged, setPostChanded] = useState(false)

    const { loadPost } = usePosts()

    useEffect(() => {
        const getPostInfo = async () => {
            const {
                data: {
                    relationships: { author },
                    attributes: { media } },
                include
            } = await loadPost(post.id)

            setPostExtended({...post, attributes: { ...post.attributes, author, media }})

            if (include.error) return

            setCommentsAmount(include.length)
        }

        getPostInfo()
    }, [postChanged])

    return (
        <>
            {!isEditing ?
                <PostInfo 
                    post={postExtended}
                    commentsAmount={commentsAmount}
                    setCommentsAmount={setCommentsAmount}
                    toggleEdit={setIsEditing} 
                    disabled={disabled} /> :
                <PostEdit 
                    triggerChange={() => setPostChanded(prev => !prev)}
                    post={postExtended} 
                    toggleEdit={setIsEditing} 
                    />}
        </>
    )
}