import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store";

const PUBLIC_ENDPOINTS = ["forgotPassword", "verifyResetOtp", "resetPassword"];

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    // credentials: 'include',
    prepareHeaders: (headers, { getState, endpoint }) => {
        if (PUBLIC_ENDPOINTS.includes(endpoint)) {
            return headers;
        }

        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers;
    }
});

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    tagTypes: ['DocumentList', 'CoachList'],
    endpoints: () => ({})
})