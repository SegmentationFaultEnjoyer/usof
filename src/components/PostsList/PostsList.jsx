import './PostsList.scss'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { usePosts } from '@/hooks'
import { TriangleLoader } from '@/common'
import { Post } from '@/components'

import Pagination from '@mui/material/Pagination';


export default function PostsList() {
    const { loadPosts, loadPage } = usePosts();

    console.log('post list render');

    const postsList = useSelector(state => state.posts)

    function getPagesAmount(link) {
        if(!link) return

        const i = link.indexOf('page');
        return Number(link.charAt(i + 'page'.length + 1));
    }

    useEffect(() => {
        const getPosts = async () => {
            await loadPosts()
        }
        getPosts()
    }, [])

    const handlePagination = async (e, value) => {
        await loadPage(value, postsList.links)
        
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        })
        
    }

    return (
        <section className='posts-list'>
            {postsList.isLoading ? 
            <div className="posts-list__loader-container">
                <TriangleLoader />
            </div> :
                <>
                {postsList.posts.map(post => <Post post={post} key={post.id} />)}
                <Pagination 
                    shape="rounded"
                    count={getPagesAmount(postsList.links.last)} 
                    onChange={handlePagination}/>
                </>
            }   
            
            <div className='posts-list__end'>Blank space</div>
        </section>
    )
}