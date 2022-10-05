import './PostsList.scss'

import { useEffect, useState } from 'react'

import { usePosts } from '@/hooks'
import { TriangleLoader } from '@/common'
import { Post } from '@/components'

export default function PostsList() {
    const { isLoading, loadPosts } = usePosts();
    const [postsList, setPostsList] = useState({})

    useEffect(() => {
        const getPosts = async () => {
            const posts = await loadPosts()
            if(posts) setPostsList(posts)
        }

        getPosts()
    }, [])

    return (
        <section className='posts-list'>
            {isLoading ? 
            <div className="posts-list__loader-container">
                <TriangleLoader />
            </div> :
                postsList.data.map(post => <Post post={post} key={post.id} />)
            }
            <div className='post-list__end'>Blank space</div>
        </section>
    )
}