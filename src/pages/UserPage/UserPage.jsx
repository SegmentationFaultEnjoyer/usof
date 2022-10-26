import './UserPage.scss'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useUserInfo, usePosts } from '@/hooks'
import { Post, NavBar, AuthorAvatar } from '@/components'
import { TriangleLoader, Modal } from '@/common'
import { ChangePasswordForm, ChangeEmailForm } from '@/forms'

import { roles } from '@/types'
import { getPagesAmount, loadPage } from '@/helpers'
import { setList } from '@/store'

import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import StarIcon from '@mui/icons-material/Star';
import AdminIcon from '@mui/icons-material/Fingerprint';
import CameraIcon from '@mui/icons-material/PhotoCamera';

export default function UserPage() {
    const { id } = useParams()

    const { loadUser, getUserInfo, changeAvatar } = useUserInfo()
    const { loadUsersPosts } = usePosts()

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userID = useSelector(state => state.user.info.id)
    const postsList = useSelector(state => state.posts)

    const isAdmin = useMemo(() => user?.role === roles.ADMIN)
    const isBelongToMe = useMemo(() => id === userID, [userID])

    const changePassRef = useRef(null)
    const changeEmailRef = useRef(null)
    const [isChangingPass, setIsChangingPass] = useState(false)
    const [isChangingEmail, setIsChangingEmail] = useState(false)

    useEffect(() => {
        const initPage = async () => {
            await getUserInfo()
            const resp = await loadUser(id)

            if(!resp) navigate('/main')

            await loadUsersPosts(id)

            setUser(resp.data.attributes)

            setIsLoading(false)
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

    const imageUpload = async (e) => {
        const formData = new FormData(e.target);
        await changeAvatar(formData)
        window.location.reload(false);
    }

    const uploadForm = useRef()

    const triggerForm = () => {
        uploadForm.current.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true } )
        )
    }

    return (
        <div className='user-page'>
            <NavBar />
            {isLoading ?
                <div className='user-page__loader'>
                    <TriangleLoader />
                </div> :
                <div className='user-page__main'>
                    <div className='user-page__main-wrapper'>
                        <section className='user-page__user-info'>
                            <div
                                className='user-page__upload-trigger'>
                                <AuthorAvatar
                                    id={id}
                                    name={user.name}
                                    email={user.email}
                                    profile_picture={user.profile_picture}
                                    size={80}
                                    disableClick />
                            </div>
                            
                            {isBelongToMe &&
                                <form 
                                    className='user-page__upload-avatar' 
                                    onSubmit={ imageUpload } 
                                    ref={ uploadForm }>
                                    <IconButton 
                                        sx={{ color: 'var(--secondary-main)'}}
                                        aria-label="upload picture" 
                                        component="label">
                                        <input 
                                            hidden accept="image/*" 
                                            type="file" 
                                            name='img' 
                                            onChange={ triggerForm }/>
                                        <CameraIcon />
                                    </IconButton>
                                </form>}
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
                                color="primary_light"
                                onClick={() => setIsChangingEmail(true)}>
                                Change info
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
                ref={changePassRef}
                isShown={isChangingPass}
                setIsShown={setIsChangingPass}>
                <ChangePasswordForm
                    closeModal={() => setIsChangingPass(false)}
                    userID={id} />
            </Modal>
            <Modal
                ref={changeEmailRef}
                isShown={isChangingEmail}
                setIsShown={setIsChangingEmail}>
                <ChangeEmailForm
                    closeModal={() => setIsChangingEmail(false) }
                    user={ user }
                    userID={ id } />
            </Modal>
        </div>
    )
}