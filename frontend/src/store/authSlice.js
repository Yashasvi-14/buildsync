import {createSlice} from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
    user: user ? user: null,
    token: token ? token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const {token, ...user}=action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.user=null;
            state.token=null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const {loginSuccess, logout} = authSlice.actions;

export default authSlice.reducer;