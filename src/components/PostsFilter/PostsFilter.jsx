import './PostsFilter.scss'
import { Collapse, TriangleLoader } from '@/common'
import { useState, useRef, useEffect } from 'react'

import { prepareToAnimate, useDidUpdateEffect } from '@/helpers'

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

export default function PostsFilter() {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    const [isFilterShown, setIsFilterShown] = useState(false)
    const [filter, setFilter] = useState('female');

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    const menuRef = useRef()
    const caregoriesRef = useRef()

    const { isLoading, categories, loadCategories } = useCategories()
    const { filterPosts, loadPosts } = usePosts()

    useDidUpdateEffect(() => {
        prepareToAnimate(menuRef, 'posts-filter')

        if (!isFilterShown)
            menuRef.current.classList.add('posts-filter--hidden')
        else
            menuRef.current.classList.add('posts-filter--shown')

    }, [isFilterShown])

    useEffect(() => { loadCategories() }, [])

    const pickCategory = (title) => {
        filterPosts(`[category]-->${title}`)
    }

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
            <h3 className='posts-filter__title'>Filters</h3>
            <div
                className='posts-filter__type'
                onClick={() => setIsCategoryOpen(prev => !prev)}>
                <p>Categories</p>
                {isCategoryOpen ? <ArrowUp /> : <ArrowDown />}
            </div>
            <Collapse isOpen={isCategoryOpen}>
                {isLoading ? 
                <TriangleLoader /> : 
                <FormControl>
                    <RadioGroup value={filter} onChange={handleFilterChange}>
                        <ul ref={caregoriesRef} className='posts-filter__categories'>
                            {categories.map(category => 
                            <li key={category.id} className='filter-categories__item'>
                                <FormControlLabel 
                                    value={category.attributes.title}
                                    label={category.attributes.title}
                                    control={
                                        <Radio 
                                        size='small'
                                        style={{color: 'var(--secondary-main)'}}
                                        onClick={() => pickCategory(category.attributes.title)} />}/>
                            </li>)}
                        </ul>
                    </RadioGroup>
                </FormControl>}
            </Collapse>
        </section>
    )
}