import './CreateComment.scss'

import { useState, useMemo } from 'react';

import { api } from '@/api';
import { useForm } from '@/hooks';

import { ErrorHandler } from '@/helpers';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SendCommentIcon from '@mui/icons-material/Send'

//TODO different color for my post

export default function CreateComment({ postID, loadComments, updateCounter }) {
    const [comment, setComment] = useState('')

   
    const { isFormDisabled, disableForm, enableForm } = useForm()

    const handleSubmit = async (event) => {
        event.preventDefault();

        disableForm()

        try {
            await api.post(`/posts/${postID}/comments`, {
                data: {
                    type: "create-comment",
                    attributes: {
                        content: comment
                    }
                }
            })

        } catch (error) {
            ErrorHandler.process(error);
        }

        await loadComments(postID)
        updateCounter(prev => prev + 1)

        enableForm()
        setComment('')
    };

    return (
        <form onSubmit={handleSubmit} className='create-comment'>
            <section className='create-comment__container'>
                <TextField
                    fullWidth
                    variant='filled' label='Leave a comment...'
                    type='text' color="secondary_light"
                    value={comment}
                    onChange={e => { setComment(e.target.value) }}
                    disabled={isFormDisabled}
                    required
                    multiline
                />
                <Button
                    className='create-comment__button'
                    variant='contained'
                    type='submit'
                    size="large"
                    color="secondary_light"
                    disabled={isFormDisabled}
                    endIcon={<SendCommentIcon />}
                    >
                    Send
                </Button>
            </section>
            
        </form>
    )
}