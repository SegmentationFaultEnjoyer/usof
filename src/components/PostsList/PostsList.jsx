import './PostsList.scss'

import { useEffect, useState } from 'react'
import { api } from '@/api'

import { usePosts } from '@/hooks'
import { TriangleLoader } from '@/common'

export default function PostsList() {
    const { isLoading, loadPosts } = usePosts();
    const [postsList, setPostsList] = useState({})

    useEffect(() => {
        const getPosts = async () => {
            const posts = await loadPosts()
            console.log(posts);
            setPostsList(posts)
        }

        getPosts()
    }, [])

    return (
        <section className='posts-list'>
            {isLoading ? <TriangleLoader /> :
                postsList.data.map(post => <Post title={post.attributes.title} key={post.id}/>)
            }
        </section>
    )
}


function Post({ title }) {
    return (
        <article>
            {title}
        </article>
    )
}