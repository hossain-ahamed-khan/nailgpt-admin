import { baseApi } from "@/redux/api/baseApi";

const allUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: '/api/admin/users/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAllUsersQuery } = allUsersApi;




const individualUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getIndividualUser: builder.query({
            query: (userId: string) => ({
                url: `/api/admin/users/${userId}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useGetIndividualUserQuery } = individualUsersApi;