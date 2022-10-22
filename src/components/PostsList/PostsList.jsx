import './PostsList.scss'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import { usePosts } from '@/hooks'
import { TriangleLoader, Modal } from '@/common'
import { Post } from '@/components'
import { CreatePostForm } from '@/forms'

import { getPagesAmount, loadPage } from '@/helpers'

import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import PostAddIcon from '@mui/icons-material/PostAdd';

import { useDispatch } from 'react-redux';
import { setList } from '@/store';


export default function PostsList() {
    const { loadPosts } = usePosts();
    const dispatch = useDispatch()

    const createPostRef = useRef(null)
    const [isCreatingPost, setIsCreatingPost] = useState(false)

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
                <div className='posts-list__create-post'>
                    <Button
                        fullWidth
                        variant='contained'
                        size="large"
                        color="primary_light"
                        endIcon={<PostAddIcon />}
                        onClick={() => setIsCreatingPost(true)}>
                        Create post
                    </Button>
                </div>

                {postsList.posts.map(post => <Post post={post} key={post.id} />)}
                { (postsList.links.next || postsList.links.prev) && 
                <Pagination 
                    page={getPagesAmount(postsList.links.current)}
                    shape="rounded"
                    count={getPagesAmount(postsList.links.last)} 
                    onChange={handlePagination}/>}
                </>
            }   
            
            <div className='posts-list__end'>Blank space</div>
            <Modal 
                ref={ createPostRef } 
                isShown={ isCreatingPost } 
                setIsShown={ setIsCreatingPost }
                isCloseByClickOutside={false}>
                <CreatePostForm closeForm={ () => setIsCreatingPost(false) }/>
            </Modal>
        </section>
    )
}