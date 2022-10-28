import './Categories.scss'

import { useEffect, useState, useRef } from 'react';
import { getPagesAmount, minLength, maxLength } from '@/helpers';

import { useCategories, useForm, useFormValidation } from '@/hooks';
import { DotsLoader, ConfirmationModal, Modal } from '@/common';
import { CreateCategoryForm } from '@/forms';

import { Chip, Pagination, TextField, IconButton  } from '@mui/material'
import {
    Check as CheckIcon,
    DeleteForever as DeleteIcon,
    Settings as EditIcon,
    Clear as ClearIcon,
    AddBox as AddIcon
} from '@mui/icons-material'

export default function CategoriesModule() {
    const { 
        categories, 
        isLoading, 
        loadCategories, 
        deleteCategory,
        createCategory, 
        loadPage, 
        editCategory } = useCategories()
    const [isDeletingCategory, setIsDeletingCategory] = useState(false)
    const [idToDelete, setIdToDelete] = useState(null)
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)

    const createCategoryRef = useRef(null)

    const handleCategoriesPagination = async (_, value) => {
        await loadPage(value, categories.links)
    }

    const startCategoryDelete = (id) => {
        setIsDeletingCategory(true)
        setIdToDelete(id)
    }

    useEffect(() => { loadCategories(7) }, [])

    return (
        <>
            {isLoading ? <div className='admin-page__loader'><DotsLoader /></div> :
                <section className='admin-page__categories-list'>
                    <h1 className='categories-list__title'>Categories</h1>
                    <ul className='categories-list'>
                        {categories?.data?.length && categories.data.map(cat =>
                            <Category
                                key={cat.id}
                                id={cat.id}
                                title={cat.attributes.title}
                                description={cat.attributes.description}
                                handleDelete={ startCategoryDelete }
                                handleEdit={ editCategory } />
                        )}
                        <div className='categories-list__add-icon' onClick={ () => setIsCreatingCategory(true) }>
                            <AddIcon fontSize='large'/>
                        </div>
                        {categories.links && (categories.links.next || categories.links.prev) &&
                            <section className='admin-page__categories-pages'>
                                <Pagination
                                    page={getPagesAmount(categories.links.current)}
                                    shape="rounded"
                                    count={getPagesAmount(categories.links.last)}
                                    onChange={handleCategoriesPagination} />
                            </section>
                        }
                    </ul>
                </section>}

            <ConfirmationModal
                isOpen={isDeletingCategory}
                setIsOpen={setIsDeletingCategory}
                action={() => deleteCategory(idToDelete)} />
            <Modal
                ref={ createCategoryRef }
                isShown={ isCreatingCategory }
                setIsShown={ setIsCreatingCategory }>
                <CreateCategoryForm 
                    closeForm={() => setIsCreatingCategory(false)}
                    createCategory={ createCategory }/>
            </Modal>
            
        </>
    )
}

function Category({ title, description, id, handleDelete, handleEdit }) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
            {isEditing ? 
            <CategoryEdit 
                toggleEdit={ setIsEditing }
                handleEdit={ handleEdit }
                title={ title }
                description={ description }
                id= { id }/> : 
            <li className='categories-list__item'>
                <Chip
                    label={title}
                    variant="outlined"
                    deleteIcon={<EditIcon />}
                    onDelete={() => { setIsEditing(true) }} 
                    sx={{
                        borderColor: 'var(--secondary-light)',
                        color: 'var(--primary-light)'
                    }}/>
                <p>{description}</p>
                <div
                    className='categories-list__delete-icon'
                    onClick={() => handleDelete(id)}>
                    <DeleteIcon />
                </div>
            </li>
            }
        </>
    )
}

function CategoryEdit({ title, description, id, toggleEdit, handleEdit }) {
    const [catTitle, setTitle] = useState(title)
    const [desc, setDesc] = useState(description)

    const { isFormDisabled, disableForm, enableForm } = useForm()
    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
        { catTitle, desc },
        {
            catTitle: { minLength: minLength(3), maxLength: maxLength(15) },
            desc: { minLength: minLength(10), maxLength: maxLength(40) }
        },
    )

    const submit = async (e) => {
        if(!isFormValid()) return

        e.preventDefault()

        disableForm()
        await handleEdit(id, catTitle, desc)
        enableForm()

        toggleEdit(false)
    }

    return (
        <form className='category-edit' onSubmit={ submit }>
            <TextField
                variant="standard" label='title'
                type='text' color="secondary_light"
                value={ catTitle }
                onChange={e => { setTitle(e.target.value) }}
                disabled={isFormDisabled}
                onBlur={() => touchField('catTitle')}
                error={getFieldErrorMessage('catTitle') !== ''}
                helperText={getFieldErrorMessage('catTitle')}
                required
            />
            <TextField
                variant="standard" label='title'
                type='text' color="secondary_light"
                value={ desc }
                onChange={e => { setDesc(e.target.value) }}
                disabled={isFormDisabled}
                onBlur={() => touchField('desc')}
                error={getFieldErrorMessage('desc') !== ''}
                helperText={getFieldErrorMessage('desc')}
                required
                multiline
            />
            <section className='category-edit__actions'>
                <IconButton onClick={ () => toggleEdit(false) }>
                    <ClearIcon />
                </IconButton>
                <IconButton type='submit'>
                    <CheckIcon />
                </IconButton>
            </section>
        </form>
    )
}