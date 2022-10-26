import { useState } from 'react';

import { useForm, useFormValidation } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';

import { TextField, Button } from '@mui/material'
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material'

export default function CommentEdit({ comment, toggleEdit, updateComment }) {
    const [content, setContent] = useState(comment.attributes.content)

    const { isFormDisabled, disableForm, enableForm } = useForm()
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { content },
        {
            content: { minLength: minLength(3), maxLength: maxLength(600) },
        },
    )

    const handleSubmit = async (event) => {
        if (!isFormValid()) return

        event.preventDefault();

        disableForm()

        try {
            await updateComment(comment.id, content)

            toggleEdit(false)

        } catch (error) {
            ErrorHandler.process(error);
        }

        enableForm()
    };

    return (
        <form onSubmit={handleSubmit} className='comment-edit'>
            <section className='comment-edit__container'>
                <TextField
                    fullWidth
                    variant='outlined' label='Changed your mind?'
                    type='text' color="secondary_light"
                    value={content}
                    onChange={e => { setContent(e.target.value) }}
                    disabled={isFormDisabled}
                    onBlur={() => touchField('content')}
                    error={getFieldErrorMessage('content') !== ''}
                    helperText={getFieldErrorMessage('content')}
                    required
                    multiline
                />
                <div className='comment-edit__actions'>
                    <Button
                        className='create-comment__button'
                        variant='contained'
                        type='reset'
                        size="large"
                        color="secondary_main"
                        disabled={isFormDisabled}
                        endIcon={<ClearIcon />}
                        onClick={() => toggleEdit(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='create-comment__button'
                        variant='contained'
                        type='submit'
                        size="large"
                        color="secondary_light"
                        disabled={isFormDisabled}
                        endIcon={<CheckIcon />}
                    >
                        Apply
                    </Button>
                </div>

            </section>

        </form>
    )
}