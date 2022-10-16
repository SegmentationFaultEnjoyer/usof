import './PostsFilter.scss'
import { Collapse, DotsLoader } from '@/common'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFilter as setCurrentFilter } from '@/store'

import { prepareToAnimate, useDidUpdateEffect } from '@/helpers'
import { roles } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'

import { useCategories, usePosts } from '@/hooks'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import ArrowDown from '@mui/icons-material/KeyboardArrowDownOutlined';
import ArrowUp from '@mui/icons-material/KeyboardArrowUpOutlined';
import ArrowLeft from '@mui/icons-material/ChevronLeftOutlined';
import ArrowRight from '@mui/icons-material/ChevronRightOutlined';
import CloseIcon from '@mui/icons-material/ClearOutlined';

export default function PostsFilter() {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isDateOpen, setIsDateOpen] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)

    const [isFilterShown, setIsFilterShown] = useState(false)
    const [filter, setFilter] = useState(' ');

    const dateIntervals = useMemo(() => ['day', 'week', 'month', 'year'], [])

    const menuRef = useRef()

    const dispatch = useDispatch()
    const currentFilter = useSelector(state => state.posts.filter)
    const role = useSelector(state => state.user.info.role)

    const isAdmin = useMemo(() => role === roles.ADMIN, [role])

    const { isLoading, categories, loadCategories } = useCategories()
    const { filterPosts } = usePosts()

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    useEffect(() => {
        const getCategories = async () => {
            await loadCategories()
        }
        getCategories()
    }, [])

    useDidUpdateEffect(() => {
        prepareToAnimate(menuRef, 'posts-filter')

        if (!isFilterShown)
            menuRef.current.classList.add('posts-filter--hidden')
        else
            menuRef.current.classList.add('posts-filter--shown')

    }, [isFilterShown])

    const pickCategory = async (title) => {
        await filterPosts(`[category]-->${title}`)
        dispatch(setCurrentFilter(title))
    }

    const pickDate = async (date) => {
        await filterPosts(`[date]-->${date}`)
        dispatch(setCurrentFilter(date))
    }

    const pickStatus = async (status) => {
        await filterPosts(`[status]-->${status}`)
        dispatch(setCurrentFilter(status ? 'active' : 'inactive'))
    }

    console.log(currentFilter, isFilterShown);

    return (
        <section className='posts-filter' ref={menuRef}>
            <AnimatePresence mode='wait'>
                <div
                    className='posts-filter__switcher'
                    onClick={() => setIsFilterShown(prev => !prev)}>
                    {isFilterShown ? <ArrowRight /> : <ArrowLeft />}
                    {isFilterShown &&
                        <motion.div
                            className='switcher__delim'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                        </motion.div>}
                </div>
            </AnimatePresence>
            {currentFilter && <div className='posts-filter__current-filter'>
                <FilterFolder currentFilter={ currentFilter }/>
            </div>}
            {currentFilter && !isFilterShown && 
            <div className='posts-filter__current-filter posts-filter__current-filter--pop-up'>
                <FilterFolder currentFilter={ currentFilter }/>
            </div>}
            <FormControl>
                <RadioGroup 
                    value={filter} 
                    onChange={handleFilterChange} 
                    style={{  gap: '10px' }}>
                    <h3 className='posts-filter__title'>Filters</h3>
                    <div
                        className='posts-filter__type'
                        onClick={() => setIsCategoryOpen(prev => !prev)}>
                        <p>Categories</p>
                        {isCategoryOpen ? <ArrowUp /> : <ArrowDown />}
                    </div>
                    <Collapse isOpen={isCategoryOpen}>
                        {isLoading ?
                        <div className='posts-filter__loader'>
                            <DotsLoader />
                        </div>
                        :
                        <ul className='posts-filter__categories'>
                        {categories.map(category =>
                            <li key={category.id} className='filter-categories__item'>
                                <FormControlLabel
                                    value={category.attributes.title}
                                    label={category.attributes.title}
                                    control={
                                        <Radio
                                            size='small'
                                            style={{ color: 'var(--secondary-main)' }}
                                            onClick={() => pickCategory(category.attributes.title)} />} />
                            </li>)}
                        </ul>
                        }
                    </Collapse>
                    <div
                        className='posts-filter__type'
                        onClick={() => setIsDateOpen(prev => !prev)}>
                        <p>Date</p>
                        {isDateOpen ? <ArrowUp /> : <ArrowDown />}
                    </div>
                    <Collapse isOpen={isDateOpen}>
                        <ul className='posts-filter__categories'>
                        {dateIntervals.map(date =>                             
                            <li className='filter-categories__item' key={date}>
                                <FormControlLabel 
                                    value={date}
                                    label={date}
                                    control={
                                        <Radio
                                            size='small'
                                            style={{ color: 'var(--secondary-main)' }}
                                            onClick={() => pickDate(date)} />} />
                            </li>)}

                        </ul>
                    </Collapse>
                    {isAdmin && 
                    <>
                        <div
                            className='posts-filter__type'
                            onClick={() => setIsStatusOpen(prev => !prev)}>
                            <p>Status</p>
                            {isStatusOpen ? <ArrowUp /> : <ArrowDown />}
                        </div>
                        <Collapse isOpen={isStatusOpen}>
                        <ul className='posts-filter__categories'>
                            <li className='filter-categories__item'>
                                <FormControlLabel 
                                    value='active'
                                    label='active'
                                    control={
                                        <Radio
                                            size='small'
                                            style={{ color: 'var(--secondary-main)' }}
                                            onClick={() => pickStatus(true)} />} />
                            </li>
                            <li className='filter-categories__item'>
                                <FormControlLabel 
                                    value='inactive'
                                    label='inactive'
                                    control={
                                        <Radio
                                            size='small'
                                            style={{ color: 'var(--secondary-main)' }}
                                            onClick={() => pickStatus(false)} />} />
                            </li>
                        </ul>
                    </Collapse>
                    </>}
                </RadioGroup>
            </FormControl>
        </section>
    )
}

function FilterFolder({ currentFilter }) {
    const dispatch = useDispatch()
    const { loadPosts } = usePosts()

    const resetFilter = async () => {
        await loadPosts()
        dispatch(setCurrentFilter(''))
    }
        
    return (
        <>
            <p>{ currentFilter }</p>
                <div onClick={resetFilter} className='current-filter__icon'>
                    <CloseIcon fontSize='small' />
            </div>
         </>
    )
}