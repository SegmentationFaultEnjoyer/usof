import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   posts: [],
   links: {}
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
    }
})

export const { setList } = postsSlice.actions;

export default postsSlice.reducer;