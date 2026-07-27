import { baseApi } from "@/redux/api/baseApi";

const pendingVerificationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPendingVerifications: builder.query({
            query: () => ({
                url: '/api/auth/admin/verifications/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetPendingVerificationsQuery } = pendingVerificationsApi;





const approveVerificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        approveVerification: builder.mutation({
            query: (id) => ({
                url: `/api/auth/admin/verifications/${id}/approve/`,
                method: 'POST',
            })
        }),
    })
})

export const { useApproveVerificationMutation } = approveVerificationApi;





const rejectVerificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        rejectVerification: builder.mutation({
            query: (id) => ({
                url: `/api/auth/admin/verifications/${id}/reject/`,
                method: 'POST',
            })
        }),
    })
})

export const { useRejectVerificationMutation } = rejectVerificationApi;