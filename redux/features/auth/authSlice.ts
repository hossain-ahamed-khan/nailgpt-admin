import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TUser = {
    id: string;
    full_name: string;
    email: string;
    mobile_number: string;
    is_email_verified: boolean;
    date_joined: string;
};

type TSetUserPayload = {
    user: TUser;
    access: string;
    refresh: string;
};

// Define a type for the slice state
interface IAuthState {
    token: string | null;
    refreshToken: string | null;
    user: TUser | null;
}

// Define the initial state using that type
const initialState: IAuthState = {
    token: null,
    refreshToken: null,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
        },
        setUser: (state, action: PayloadAction<TSetUserPayload>) => {
            const { user, access, refresh } = action.payload
            state.user = user
            state.token = access
            state.refreshToken = refresh
        },
    },
})

export const { login, logout, setUser } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectToken = (state: RootState) => state.auth.token
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer