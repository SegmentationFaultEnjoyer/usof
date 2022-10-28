import './Users.scss'

import { useState, useEffect, useRef } from 'react'

import { DotsLoader, ConfirmationModal, Modal, SwitchIOS } from '@/common'
import { AuthorAvatar } from '@/components'
import { CreateUserForm } from '@/forms'

import { useUserInfo } from '@/hooks'
import { useMemo } from 'react'
import { roles } from '@/types'
import { getPagesAmount } from '@/helpers'

import { Chip, Pagination } from '@mui/material'
import { 
    Star as StarIcon, 
    DeleteForever as DeleteIcon, 
    AddBox as AddIcon 
} from '@mui/icons-material'

export default function Users() {
    const { isLoading, loadUserList, users, deleteUser, loadPage, createUser, changeRole } = useUserInfo()

    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const createUserRef = useRef()

    useEffect(() => {
        loadUserList()
    }, [])

    const handleUsersPagination = async (_, value) => {
        await loadPage(value, users.links)
    }

    return (
        <>
            {isLoading ? <div className='users__loader'><DotsLoader /></div> :
                <div className='users'>
                    <h1 className='users__title'>Users</h1>
                    <ul className='users__list'> 
                        {users?.data?.length && users.data.map(user =>
                            <User 
                                user={user} 
                                key={user.id} 
                                handleDelete={ deleteUser }
                                handleRoleChange={ changeRole }/>
                        )}
                        <div className='users__add-icon' onClick={() => setIsCreatingUser(true)}>
                            <AddIcon fontSize='large'/>
                        </div>
                        {users.links && (users.links.next || users.links.prev) &&
                            <section className='admin-page__categories-pages'>
                                <Pagination
                                    page={getPagesAmount(users.links.current)}
                                    shape="rounded"
                                    count={getPagesAmount(users.links.last)}
                                    onChange={handleUsersPagination} />
                            </section>
                        }
                    </ul>
                </div>
              }

              <Modal
                ref={ createUserRef }
                isShown={ isCreatingUser }
                setIsShown={ setIsCreatingUser }>
                <CreateUserForm 
                    closeForm={ () => setIsCreatingUser(false) }    
                    createUser={ createUser }
                />
              </Modal>
        </>
    )
}

function User({ user, handleDelete, handleRoleChange }) {
    const { email, name, profile_picture, rating, role } = user.attributes

    const [isDeleting, setIsDeleting] = useState(false)
    const [isAdmin, setIsAdmin] = useState(role === roles.ADMIN)

    const onSwitchClick = async (e) => {
        setIsAdmin(e.target.checked)
        await handleRoleChange(user.id, e.target.checked ? roles.ADMIN : roles.PEASANT)
    }

    const roleString = useMemo(() => role === roles.ADMIN ? 'Admin' : 'Mortal', [role])

    return (
        <li className='users__item'>
            <AuthorAvatar 
                id={ user.id }
                email={ email }
                name={ name }
                profile_picture={ profile_picture }/>
            <p>{name}</p>
            <p>{email}</p>
            <div className='users__admin-switch'>
                <SwitchIOS 
                    checked={ isAdmin }
                    onChange={ onSwitchClick }/>
                <p>{roleString}</p>
            </div>
            
            <Chip icon={<StarIcon />} label={rating} variant='outlined'
                sx={{
                    borderColor: 'var(--secondary-light)',
                    color: 'var(--primary-light)'
                }} />
            <div className='users__delete-icon' onClick={ () => setIsDeleting(true) }>
                <DeleteIcon />
            </div>
            <ConfirmationModal 
                isOpen={ isDeleting }
                setIsOpen= { setIsDeleting }
                action={ () => handleDelete(user.id) }/>
        </li>
    )
}