import './CommentsList.scss'

import { Collapse, DotsLoader } from "@/common"
import { useEffect } from 'react'

import { useComments } from '@/hooks'
import { Comment } from '@/components'

export default function Comments({ isOpen, postId }) {
    const { comments, isLoading, loadComments } = useComments()

    useEffect(() => { loadComments(postId) }, [])


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
            </div>}
        </Collapse>
        
    )
}