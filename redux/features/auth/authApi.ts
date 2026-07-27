import { baseApi } from "@/redux/api/baseApi";
import type { TUser } from "./authSlice";

export type TLoginRequest = {
    email: string;
    password: string;
};

export type TLoginResponse = {
    access: string;
    refresh: string;
    user: TUser;
};

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TLoginResponse, TLoginRequest>({
            query: (userInfo) => ({
                url: '/api/auth/signin/',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useLoginMutation } = authApi;