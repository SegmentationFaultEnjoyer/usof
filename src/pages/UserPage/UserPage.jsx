import './UserPage.scss'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useUserInfo, usePosts } from '@/hooks'
import { Post, NavBar, AuthorAvatar } from '@/components'
import { TriangleLoader, Modal } from '@/common'
import { ChangePasswordForm } from '@/forms'

import { roles } from '@/types'
import { getPagesAmount, loadPage } from '@/helpers'
import { setList } from '@/store'

import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import AdminIcon from '@mui/icons-material/Fingerprint';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';

export default function UserPage() {
    const { id } = useParams()

    const { loadUser, getUserInfo } = useUserInfo()
    const { loadUsersPosts } = usePosts()

    const [user, setUser] = useState(null)

    const dispatch = useDispatch()

    const userID = useSelector(state => state.user.info.id)
    const postsList = useSelector(state => state.posts)

    const isAdmin = useMemo(() => user?.role === roles.ADMIN)
    const isBelongToMe = useMemo(() => id === userID, [userID])

    const changePassRef = useRef(null)
    const [isChangingPass, setIsChangingPass] = useState(false)

    useEffect(() => {
        const initPage = async () => {
            await getUserInfo()
            const resp = await loadUser(id)
            await loadUsersPosts(id)

            setUser(resp.data.attributes)
        }
        initPage()
    }, [id])

    const postSet = (data) => {
        dispatch(setList(data))
    }

    const handlePagination = async (e, value) => {
        await loadPage(value, postsList.links, postSet)

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className='user-page'>
            <NavBar />
            {!user || !postsList.posts.length ?
                <div className='user-page__loader'>
                    <TriangleLoader />
                </div> :
                <div className='user-page__main'>
                    <div className='user-page__main-wrapper'>
                        <section className='user-page__user-info'>
                            <AuthorAvatar
                                id={id}
                                name={user.name}
                                email={user.email}
                                profile_picture={user.profile_picture}
                                size={80}
                                disableClick />
                            <section className='user-info__header'>
                                <h1>{user.name}</h1>
                                <Chip
                                    sx={{
                                        borderColor: 'var(--secondary-light)',
                                        color: 'var(--primary-main)'
                                    }}
                                    icon={<StarIcon />}
                                    label={user.rating}
                                    variant="outlined" />
                                {isAdmin && <AdminIcon className='user-info__admin' />}
                            </section>
                            <p>{user.email}</p>
                        </section>
                        {isBelongToMe && <section className='user-page__actions'>
                            <Button
                                variant='contained'
                                size="medium"
                                color="primary_light"
                                onClick={() => setIsChangingPass(true)}>
                                Change password
                            </Button>
                            <Button
                                variant='contained'
                                size="medium"
                                color="primary_light">
                                Change email
                            </Button>
                        </section>}
                    </div>
                    <section className='user-page__posts'>
                        {postsList.posts.map(post => <Post post={post} key={post.id} />)}

                        {(postsList.links.next || postsList.links.prev) &&
                            <Pagination
                                page={getPagesAmount(postsList.links.current)}
                                shape="rounded"
                                count={getPagesAmount(postsList.links.last)}
                                onChange={handlePagination} />}
                        <div className='posts-list__end'>Blank space</div>
                    </section>
                </div>}
            <Modal 
                ref={ changePassRef }
                isShown={ isChangingPass } 
                setIsShown={ setIsChangingPass }>
                <ChangePasswordForm 
                    closeModal={() => setIsChangingPass(false)}
                    userID={ id } />
            </Modal>
        </div>
    )
}