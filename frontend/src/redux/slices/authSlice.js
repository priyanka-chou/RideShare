import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },

        clearCredentials: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },

        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setCredentials,
    clearCredentials,
    setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;