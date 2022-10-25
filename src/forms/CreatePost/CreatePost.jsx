import './CreatePost.scss'

import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useForm, useFormValidation, useCategories, usePosts } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';
import { DotsLoader } from '@/common';
import { MultipleSelect } from '@/fields';

export default function CreatePost({ closeForm }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { title, content },
        {
            title: { minLength: minLength(4), maxLength: maxLength(32) },
            content: { minLength: minLength(10), maxLength: maxLength(600) }
        },
    )

    const { categories, isLoading, loadCategories } = useCategories()
    const { createPost } = usePosts()

    useEffect(() => {
        loadCategories()
    }, [])

    const onSubmit = async (event) => {
        if (!isFormValid()) return

        event.preventDefault();
        disableForm();
        try {
            await createPost(title, content, category)
            closeForm()
        } catch (error) {
            ErrorHandler.process(error)
        }
        enableForm();
    }

    return (
        <form className='create-post' onSubmit={ onSubmit }>
            <h1>Create post form</h1>
            <section className='create-post__fields'>
                <TextField
                    className='create-post__title'
                    fullWidth
                    variant='outlined' label='Enter title'
                    color="primary_light"
                    value={title}
                    onChange={e => { setTitle(e.target.value) }}
                    onBlur={() => touchField('title')}
                    disabled={isFormDisabled}
                    error={getFieldErrorMessage('title') !== ''}
                    helperText={getFieldErrorMessage('title')}
                    required />
                <TextField
                    multiline
                    fullWidth
                    variant='outlined' label='Post details'
                    color="primary_light"
                    value={content}
                    onChange={e => { setContent(e.target.value) }}
                    onBlur={() => touchField('content')}
                    disabled={isFormDisabled}
                    error={getFieldErrorMessage('content') !== ''}
                    helperText={getFieldErrorMessage('content')}
                    required />
                {isLoading ? <div className='create-post__loader'><DotsLoader /></div> :
                    <div className='create-post__categories'>
                        {categories?.data?.length && 
                        <MultipleSelect 
                            label='Categories'
                            choices={ categories.data }
                            picked={ category }
                            setPicked={ setCategory }/>}
                    </div>}
            </section>
            <section className='create-post__actions'>
                <Button
                    variant='contained'
                    type='reset'
                    size="large"
                    color="primary_main"
                    disabled={isFormDisabled}
                    onClick={ closeModal }>
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    type='submit'
                    size="large"
                    color="primary_light"
                    disabled={isFormDisabled}>
                    Create post
                </Button>
            </section>
        </form>
    )
}