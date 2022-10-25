import { useState, useEffect } from 'react'

import { useForm, useFormValidation, useCategories, usePosts } from '@/hooks';
import { maxLength, minLength, ErrorHandler } from '@/helpers';
import { DotsLoader } from '@/common';
import { MultipleSelect } from '@/fields';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function PostEdit({ post, toggleEdit }) {
    const [title, setTitle] = useState(post.attributes.title)
    const [content, setContent] = useState(post.attributes.content)
    const [category, setCategory] = useState(post.attributes.categories)
    const [isVisible, setIsVisible] = useState(post.attributes.status)

    const { isFormDisabled, disableForm, enableForm } = useForm();
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { title, content },
        {
            title: { minLength: minLength(4), maxLength: maxLength(32) },
            content: { minLength: minLength(10), maxLength: maxLength(600) }
        },
    )

    const { categories, isLoading, loadCategories } = useCategories()
    const { updatePost } = usePosts()

    useEffect(() => { loadCategories() }, [])

    const onSubmit = async (event) => {
        if (!isFormValid()) return

        event.preventDefault();
        disableForm();
        try {
            await updatePost(post.id, {
                title, 
                content, 
                categories: category,
                status: isVisible
            })

            toggleEdit(false)
        } catch (error) {
            ErrorHandler.process(error)
        }
        enableForm();
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
        </article>
    )
}