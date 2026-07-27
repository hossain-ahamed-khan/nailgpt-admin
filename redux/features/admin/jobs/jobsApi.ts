import { baseApi } from "@/redux/api/baseApi";

const allJobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllJobs: builder.query({
            query: () => ({
                url: '/api/services/admin/jobs/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAllJobsQuery } = allJobsApi;





const jobStatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getJobStats: builder.query({
            query: () => ({
                url: '/api/services/admin/jobs/stats/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetJobStatsQuery } = jobStatsApi;






const specificJobDetailsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSpecificJobDetails: builder.query({
            query: (jobId) => ({
                url: `/api/services/admin/jobs/${jobId}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useGetSpecificJobDetailsQuery } = specificJobDetailsApi;





const cancelJobApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cancelJob: builder.mutation({
            query: (jobId) => ({
                url: `/api/services/admin/jobs/${jobId}/cancel/`,
                method: 'POST',
            })
        }),
    })
})

export const { useCancelJobMutation } = cancelJobApi;