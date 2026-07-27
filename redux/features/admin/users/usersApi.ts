import { baseApi } from "@/redux/api/baseApi";

const allUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: '/api/auth/admin/users/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAllUsersQuery } = allUsersApi;