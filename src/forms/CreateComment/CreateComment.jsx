import './CreateComment.scss'

import { useState, useContext } from 'react';
import { PostContext } from '@/context';

import { useForm } from '@/hooks';

import { ErrorHandler } from '@/helpers';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SendCommentIcon from '@mui/icons-material/Send'

export default function CreateComment({ createComment }) {
    const [comment, setComment] = useState('')

    const { postID, updateCounter } = useContext(PostContext)

    const { isFormDisabled, disableForm, enableForm } = useForm()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        disableForm()

        try {
            await createComment(postID, comment)
            updateCounter(prev => prev + 1)

        } catch (error) {
            ErrorHandler.process(error);
        }

        enableForm()
        setComment('')
    };

    return (
        <form onSubmit={ handleSubmit } className='create-comment'>
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