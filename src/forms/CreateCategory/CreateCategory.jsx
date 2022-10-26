import './CreateCategory.scss'

import { useState } from 'react';

import { TextField, Button } from '@mui/material'

import { useForm, useFormValidation } from '@/hooks';
import { maxLength, minLength } from '@/helpers';

export default function CreateCategory({ closeForm, createCategory }) {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    const { isFormDisabled, disableForm, enableForm } = useForm()
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { title, desc },
        {
            title: { minLength: minLength(3), maxLength: maxLength(15) },
            desc: { minLength: minLength(10), maxLength: maxLength(40) }
        },
    )

    const submit = async (e) => {
        if (!isFormValid()) return

        e.preventDefault()

        disableForm()
        await createCategory(title, desc)
        enableForm()

        closeForm()
    }


    return (
        <form className='create-category' onSubmit={submit}>
            <h1>Create category form</h1>
            <TextField
                fullWidth
                variant='outlined' label='Title'
                color="primary_light"
                value={ title }
                onChange={e => { setTitle(e.target.value) }}
                onBlur={() => touchField('title')}
                disabled={isFormDisabled}
                error={getFieldErrorMessage('title') !== ''}
                helperText={getFieldErrorMessage('title')}
                required />
            <TextField
                multiline
                fullWidth
                variant='outlined' label='Description'
                color="primary_light"
                value={ desc }
                onChange={e => { setDesc(e.target.value) }}
                onBlur={() => touchField('desc')}
                disabled={isFormDisabled}
                error={getFieldErrorMessage('desc') !== ''}
                helperText={getFieldErrorMessage('desc')}
                required />
            
            <section className='create-category__actions'>
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
                    Create category
                </Button>
            </section>
        </form>
    )
}