import { configureStore } from '@reduxjs/toolkit'; 

import userReducer from './slices/userSlice';
import postReducer from './slices/postsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer,
    }
})