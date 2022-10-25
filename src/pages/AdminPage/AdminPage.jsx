import './AdminPage.scss'

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roles } from '@/types'

import { useUserInfo } from '@/hooks';

import { NavBar } from '@/components'
import { CategoriesModule, UsersModule } from '@/pages/AdminPage/modules';

export default function AdminPage() {
    const navigate = useNavigate()

    const { getUserInfo } = useUserInfo()
   

    useEffect(() => {
        const initPage = async () => {
            const role = await getUserInfo()

            if (role !== roles.ADMIN) navigate('/main')
        }
        initPage()
    }, [])

    return (
        <>
            <NavBar />
            <div className='admin-page'>
                <CategoriesModule />
                <UsersModule />
            </div>
        </>
    )
}

