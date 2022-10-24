import './UserPage.scss'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useUserInfo, usePosts } from '@/hooks'
import { Post, NavBar, AuthorAvatar } from '@/components'
import { TriangleLoader } from '@/common'
import { roles } from '@/types'
import { getPagesAmount, loadPage } from '@/helpers'
import { setList } from '@/store'

import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import AdminIcon from '@mui/icons-material/Fingerprint';
import Pagination from '@mui/material/Pagination';

export default function UserPage() {
    const { id } = useParams()

    const { loadUser, getUserInfo } = useUserInfo()
    const { loadUsersPosts } = usePosts()

    const [user, setUser] = useState(null)

    const dispatch = useDispatch()

    const postsList = useSelector(state => state.posts)
    const isAdmin = useMemo(() => user?.role === roles.ADMIN)

    useEffect(() => {
        const initPage = async () => {
            await getUserInfo()
            const resp = await loadUser(id)
            await loadUsersPosts(id)

            console.log(resp.data);
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
        </div>
    )
}