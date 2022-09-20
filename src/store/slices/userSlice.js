import { createSlice } from '@reduxjs/toolkit';
import { roles } from '@/types/main';

const initialState = {
    info: {
        name: 'undefined',
        email: '',
        id: '',
        rating: -1,
        role: roles.PEASANT
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.info = {...state.info, ...action.payload};
        },
        increaseRating(state) {
            state.info.rating++;
        },
        decreaseRating(state) {
            state.info.rating--;
        }
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;