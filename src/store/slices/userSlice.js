import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    info: {
        name: 'undefined',
        email: '',
        id: ''
    }
   
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.info = {...state.info, ...action.payload};
        }
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;