import './CommentsList.scss'

import { Collapse, DotsLoader } from "@/common"
import { useEffect, useContext } from 'react'

import { PostContext } from '@/context'

import { useComments } from '@/hooks'
import { Comment } from '@/components'
import { CreateCommentForm } from '@/forms'

import { getPagesAmount } from '@/helpers'
import Pagination from '@mui/material/Pagination';

export default function Comments({ isOpen }) {
    const { comments, isLoading, loadComments, loadPage, deleteComment } = useComments()
    const { postID } = useContext(PostContext)

    useEffect(() => { loadComments(postID) }, [])

    const handlePagination = async (_, value) => {
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
                comments.data.map(comment =>
                     <Comment 
                        comment={ comment } 
                        key={ comment.id }
                        deleteComment={ deleteComment }/>)
                }
                <CreateCommentForm loadComments={ loadComments }/>
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