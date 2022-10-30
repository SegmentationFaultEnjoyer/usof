import { useState, useEffect, useRef } from 'react'

import { useForm, useFormValidation, useCategories, usePosts } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';
import { DotsLoader } from '@/common';
import { MultipleSelect } from '@/fields';

import { TextField, Button, Checkbox, FormControlLabel, Portal, IconButton } from '@mui/material'
import { 
    CloseOutlined as DeleteImageIcon, 
    AddBox as AddIcon,
    CheckBox as AddedIcon 
} from '@mui/icons-material';

export default function PostEdit({ post, toggleEdit, triggerChange }) {
    const [title, setTitle] = useState(post.attributes.title)
    const [content, setContent] = useState(post.attributes.content)
    const [category, setCategory] = useState(post.attributes.categories)
    const [isVisible, setIsVisible] = useState(post.attributes.status)
    const [mediaList, setMediaList] = useState({
        list: post.attributes.media,
        toDelete: []
    })

    const [isAdded, setIsAdded] = useState(false)
    const portalUploadFormRef = useRef()
    const uploadForm = useRef()

    const triggerForm = () => {
        uploadForm.current.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true } )
        )
    }

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { title, content },
        {
            title: { minLength: minLength(4), maxLength: maxLength(32) },
            content: { minLength: minLength(10), maxLength: maxLength(600) }
        },
    )

    const { categories, isLoading, loadCategories } = useCategories()
    const { updatePost, uploadMedia } = usePosts()

    useEffect(() => { loadCategories() }, [])

    const deletePicture = ({ id, path }) => {
        setMediaList(({ list, toDelete }) => ({
            list: list.filter(img => img.id !== id),
            toDelete: [...toDelete, { id, path }]
        }))
    }

    const imageUpload = async (e) => {
        e.preventDefault()
        
        const formData = new FormData(e.target);

        if(formData.get('img'))
            await uploadMedia(post.id, formData)

        enableForm()

        toggleEdit(false)
        triggerChange()
    }

    const onSubmit = async (event) => {
        if (!isFormValid()) return event.preventDefault();

        event.preventDefault();
        disableForm();

        try {
            await updatePost(post.id, {
                title, 
                content, 
                categories: category,
                status: isVisible
            }, mediaList.toDelete)
            
            triggerForm()
           
        } catch (error) {
            ErrorHandler.process(error)
        }
    }


    return (
        <article className="post post--edit">
            <form className='post-edit' onSubmit={ onSubmit }>
                <section className='create-post__fields'>
                    <TextField
                        className='create-post__title'
                        fullWidth
                        variant="standard" label='Title'
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
                        variant="standard" label='Post details'
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
                                choices={categories.data}
                                picked={category}
                                setPicked={setCategory} />}
                        </div>}
                    <FormControlLabel
                        value="end"
                        control={<Checkbox
                            sx={{
                                color: 'var(--primary-light)',
                                '&.Mui-checked': {
                                    color: 'var(--primary-main)',
                                }
                            }}
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)} />}
                        label="Visible"
                        labelPlacement="end"
                    />
                    <section className='post-edit__media'>
                        {mediaList.list && mediaList.list.map(img => 
                            <div key={ img.id } className='media__container'>
                                <img 
                                    src={`/images/media/${img.path}`} 
                                    alt='media'/>
                                <div onClick={() => deletePicture(img)}>   
                                    <DeleteImageIcon className='media__delete' fontSize='small'/>
                                </div>
                            </div>
                           )}
                        <div ref={ portalUploadFormRef } />
                    </section>
                    
                </section>
                <section className='create-post__actions'>
                    <Button
                        variant='contained'
                        type='reset'
                        size="large"
                        color="primary_main"
                        disabled={isFormDisabled}
                        onClick={() => toggleEdit(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        type='submit'
                        size="large"
                        color="primary_light"
                        disabled={isFormDisabled}>
                        Apply Changes
                    </Button>
                </section>
            </form>
            
            <Portal container={portalUploadFormRef.current}>
                <form className='media__add' onSubmit={ imageUpload } ref={ uploadForm }>
                    <IconButton 
                        sx={{ color: 'var(--primary-light)'}}
                        aria-label="upload picture" 
                        component="label">
                        <input 
                            hidden accept="image/*" 
                            multiple
                            type="file" 
                            onChange={() => setIsAdded(true)}
                            name='img' />
                        {isAdded ? 
                            <AddedIcon color='primary_light' fontSize='large'/> :
                            <AddIcon color='primary_light' fontSize='large'/> }
                    </IconButton> 
                </form>
            </Portal>
        </article>
    )
}