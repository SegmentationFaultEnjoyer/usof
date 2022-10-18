import './PostsList.scss'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { usePosts } from '@/hooks'
import { TriangleLoader } from '@/common'
import { Post } from '@/components'
import { getPagesAmount, loadPage } from '@/helpers'

import Pagination from '@mui/material/Pagination';

import { useDispatch } from 'react-redux';
import { setList } from '@/store';


export default function PostsList() {
    const { loadPosts } = usePosts();
    const dispatch = useDispatch()

    console.log('post list render');

    const postsList = useSelector(state => state.posts)

    useEffect(() => {
        const getPosts = async () => {
            await loadPosts()
        }
        getPosts()
    }, [])

    const postSet = (data) => {
        dispatch(setList(data))
    }

    const handlePagination = async (e, value) => {
        await loadPage(value, postsList.links, postSet)
        
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
                { (postsList.links.next || postsList.links.prev) && 
                <Pagination 
                    shape="rounded"
                    count={getPagesAmount(postsList.links.last)} 
                    onChange={handlePagination}/>}
                </>
            }   
            
            <div className='posts-list__end'>Blank space</div>
        </section>
    )
}