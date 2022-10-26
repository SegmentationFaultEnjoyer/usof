import { useState } from "react"
import { api } from "@/api"
import { ErrorHandler, loadPage as pageLoader } from '@/helpers'
import { Notificator } from "@/common";

const DEFAULT_LIMIT = 100;

export function useCategories() {
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState({})

    const loadCategories = async (limit = null) => {
        if(!limit) limit = DEFAULT_LIMIT

        setIsLoading(true)

        try {
            let { data } = await api.get(`/categories?limit=${limit}&sort=id`)

            setCategories(data)

            console.log(data);

        } catch (error) {
            ErrorHandler.process(error)
        }
        setIsLoading(false)
    }

    const loadPage = async (page, links) => {
        await pageLoader(page, links, setCategories)
    }

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`)

            Notificator.success('Category deleted!')

            await loadCategories()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const editCategory = async (id, title, description) => {
        try {
            const { data } = await api.patch(`/categories/${id}`, {
                data: {
                    type: "update-category",
                    attributes: {
                        title,
                        description
                    }
                }
            })

            const index = categories.data.findIndex(cat => cat.id === id)

            if(!~index) return

            setCategories(prev => {
                let newCategories = {...prev}
                newCategories.data[index] = data.data
                return newCategories
            })

            Notificator.success('Category updated!');

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const createCategory = async (title, description) => {
        try {
            await api.post('/categories', {
                data: {
                    type: 'create-category',
                    attributes: {
                        title,
                        description
                    }
                }
            })

            Notificator.success('Category created')
            
            await loadCategories(7)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return {
        categories,
        loadCategories,
        loadPage,
        deleteCategory,
        editCategory,
        createCategory,
        isLoading
    }
}