import './Sort.scss'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useDidUpdateEffect, formatQuery } from '@/helpers'
import { usePosts } from '@/hooks'

import { roles } from '@/types'
import { SingleSelect } from '@/fields'

export default function Sort() {
    const [picked, setPicked] = useState('Rating');
    const [order, setOrder] = useState('DESC')

    const { sortPosts } = usePosts()

    const isAdmin = useSelector(state => state.user.info.role === roles.ADMIN)

    let sortPropsRaw = ['Date', 'Author', 'Rating', 'Alphabetic']

    if(isAdmin) sortPropsRaw = [...sortPropsRaw, 'Status']

    const sortProps = useMemo(() => sortPropsRaw, [sortPropsRaw])
    const orderProps = useMemo(() => ['ASC', 'DESC'], [])

    useDidUpdateEffect(() => {
        sortPosts(formatQuery(picked), order)
    }, [picked, order])

    return (
        <section className='sort'>
            <SingleSelect 
                choices={ sortProps }
                value={ picked }
                setValue= { setPicked }
                label='sort'/>
            <SingleSelect 
                choices={ orderProps }
                value={ order }
                setValue= { setOrder }
                label='order'/>
        </section>
    )
}