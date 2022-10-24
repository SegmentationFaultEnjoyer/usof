import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   posts: [],
   links: {},
   isLoading: true,
   filter: ''
}

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setList(state, action) {
            const { data, links } = action.payload
            state.posts = data
            state.links = links
        },
        startLoading(state) {
            state.isLoading = true
        },
        updatePostInfo(state, action) {
            const { id, newInfo } = action.payload

            const index = state.posts.findIndex(post => post.id === id)

            if(!~index) return

            state.posts[index] = newInfo
        },
        finishLoading(state) {
            state.isLoading = false
        },
        setFilter(state, action) {
            state.filter = action.payload
        }
    }
})

export const { 
    setList, 
    startLoading, 
    finishLoading,
    updatePostInfo,
    setFilter } = postsSlice.actions;

export default postsSlice.reducer;