import './CreatePost.scss'

import { useState, useEffect, useRef } from 'react';

import { TextField, Button, IconButton, Portal } from '@mui/material'
import { 
    AddPhotoAlternateOutlined as AddPhotoIcon, 
    DownloadDoneOutlined as PhotoChosenIcon 
} from '@mui/icons-material'

import { useForm, useFormValidation, useCategories, usePosts } from '@/hooks';
import { maxLength, minLength, ErrorHandler, useDidUpdateEffect } from '@/helpers';
import { DotsLoader } from '@/common';
import { MultipleSelect } from '@/fields';

export default function CreatePost({ closeForm }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])

    const [postID, setPostID] = useState(null)
    const [isPhotoChosen, setIsPhotoChosen] = useState(false)

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { title, content },
        {
            title: { minLength: minLength(4), maxLength: maxLength(32) },
            content: { minLength: minLength(10), maxLength: maxLength(600) }
        },
    )

    const { categories, isLoading, loadCategories } = useCategories()
    const { createPost, uploadMedia, loadPosts } = usePosts()

    useEffect(() => {
        loadCategories()
    }, [])

    useDidUpdateEffect(() => {
        triggerForm()
    }, [postID])

    const onSubmit = async (event) => {
        if (!isFormValid()) return event.preventDefault();

        event.preventDefault();
        disableForm();
        try {
            const { id } = await createPost(title, content, category)

            setPostID(id)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const uploadForm = useRef()
    const portalUploadFormRef = useRef()

    const triggerForm = () => {
        uploadForm.current.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true } )
        )
    }

    const imageUpload = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);

        if(formData.get('img'))
            await uploadMedia(postID, formData)
            
        enableForm();
        closeForm()
        await loadPosts()
    }

    return (
        <>
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
                    <div ref={ portalUploadFormRef }/>
            </section>
            <section className='create-post__actions'>
                <Button
                    variant='contained'
                    type='reset'
                    size="large"
                    color="primary_main"
                    disabled={isFormDisabled}
                    onClick={ closeForm }>
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

        <Portal container={portalUploadFormRef.current}>
            <form 
                className='create-post__upload-media' 
                onSubmit={ imageUpload } 
                ref={ uploadForm }>
                <IconButton 
                    // disabled={ isPhotoChosen }
                    sx={{ color: 'var(--primary-light)'}}
                    aria-label="upload picture" 
                    component="label">
                    <input 
                        hidden accept="image/*" 
                        multiple
                        type="file" 
                        onChange={() => setIsPhotoChosen(true)}
                        name='img' />
                    {isPhotoChosen ? <PhotoChosenIcon /> : <AddPhotoIcon />}
                </IconButton>
            </form>
        </Portal>
        </>
    )
}