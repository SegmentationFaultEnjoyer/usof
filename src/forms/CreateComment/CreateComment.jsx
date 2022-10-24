import './CreateComment.scss'

import { useState, useContext } from 'react';
import { PostContext } from '@/context';

import { useForm, useFormValidation, useComments } from '@/hooks';

import { ErrorHandler, minLength, maxLength } from '@/helpers';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SendCommentIcon from '@mui/icons-material/Send'

export default function CreateComment({ loadComments }) {
    const [comment, setComment] = useState('')

    const { postID, updateCounter } = useContext(PostContext)

    const { isFormDisabled, disableForm, enableForm } = useForm()
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { comment },
        {
            comment: { minLength: minLength(3), maxLength: maxLength(600) },
        },
    )
    const { createComment } = useComments()

    const handleSubmit = async (event) => {
        if(!isFormValid()) return

        event.preventDefault();

        disableForm()

        try {
            await createComment(postID, comment)

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
                    onBlur={() => touchField('comment')}
                    error={getFieldErrorMessage('comment') !== ''}
                    helperText={getFieldErrorMessage('comment')}
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