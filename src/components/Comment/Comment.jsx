import './Comment.scss'

import { useEffect, useState } from 'react'
import { useUserInfo } from '@/hooks'

export default function Comment({ comment }) {
    const { content, is_edited, publish_date } = comment.attributes
    const { author, post } = comment.relationships

    const [authorInfo, setAuthorInfo] = useState(null)

    const { loadUser } = useUserInfo()

    useEffect(() => {
        const getUser = async () => {
            const resp = await loadUser(author.id)

            if (!resp) return

            setAuthorInfo(resp.data)
        }
        getUser()
    }, [])

    return (
        <section className='comment'>
            <div className='comment__header'>
                {authorInfo && <h4 className='comment__author'>{authorInfo.attributes.name}</h4>}
                <p className='comment__publish-date'>{new Date(publish_date).toLocaleString()}</p>
            </div>
            <p className='comment__content'> {content}</p>
        </section>
    )
}