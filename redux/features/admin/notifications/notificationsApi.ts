import { baseApi } from "@/redux/api/baseApi";

const allAnnouncementsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnnouncements: builder.query({
            query: () => ({
                url: '/api/services/admin/announcements/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAllAnnouncementsQuery } = allAnnouncementsApi;





const sendAnnouncementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendAnnouncement: builder.mutation({
            query: (formData) => ({
                url: `/api/services/admin/announcements/`,
                method: 'POST',
                body: formData,
            })
        }),
    })
})

export const { useSendAnnouncementMutation } = sendAnnouncementApi;