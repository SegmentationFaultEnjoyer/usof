import './CommentsList.scss'

import { Collapse, DotsLoader } from "@/common"
import { useEffect } from 'react'

import { useComments } from '@/hooks'
import { Comment } from '@/components'
import { CreateCommentForm } from '@/forms'

import { getPagesAmount } from '@/helpers'
import Pagination from '@mui/material/Pagination';

export default function Comments({ isOpen, postId, updateCounter }) {
    const { comments, isLoading, loadComments, loadPage } = useComments()

    useEffect(() => { loadComments(postId) }, [])

    const handlePagination = async (e, value) => {
        await loadPage(value, comments.links)
    }


    return (
        <Collapse isOpen={ isOpen }>
            {isLoading ? 
            <div className='comments-list__loader'>
                <DotsLoader />
            </div> :
            <div className='comments-list'>
                {
                comments.data && 
                comments.data.map(comment => <Comment comment={ comment } key={comment.id}/>)
                }
                <CreateCommentForm 
                    postID={ postId } 
                    loadComments={ loadComments }
                    updateCounter={ updateCounter }/>
            </div>}
            
            {comments.links && (comments.links.next || comments.links.prev) &&
            <div className='comments-list__pages'>
                <Pagination 
                    shape="rounded"
                    count={getPagesAmount(comments.links.last)} 
                    onChange={handlePagination}/>
            </div>
           }
           
        </Collapse>
        
    )
}