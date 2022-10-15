import { useState } from "react"
import { api } from "@/api"
import { ErrorHandler } from "@/helpers"

export function useCategories() {
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const loadCategories = async () => {
        setIsLoading(true)

        try {
            let { data } = await api.get('/categories?limit=100')
            
            console.log(data.data);

            setCategories(data.data)

        } catch (error) {
            ErrorHandler.process(error)
        }
        setIsLoading(false)
    }

    return {
        categories,
        loadCategories,
        isLoading
    }
}