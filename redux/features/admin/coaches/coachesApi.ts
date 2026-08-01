import { baseApi } from "@/redux/api/baseApi";

export interface Coach {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    icon: string;
    accent_color: string;
    system_prompt: string;
    rules: string[];
    temperature: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export type CoachListResponse = Coach[];

const coachListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoachList: builder.query<CoachListResponse, void>({
            query: () => ({
                url: "/api/admin/coaches/",
                method: "GET",
            }),
            providesTags: ["CoachList"],
        }),
    }),
});

export const { useGetCoachListQuery } = coachListApi;




const individualCoachApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getIndividualCoach: builder.query<Coach, string>({
            query: (id) => ({
                url: `/api/admin/coaches/${id}/`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetIndividualCoachQuery } = individualCoachApi;




const createCoachApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCoach: builder.mutation<Coach, Partial<Coach>>({
            query: (coachData) => ({
                url: '/api/admin/coaches/',
                method: 'POST',
                body: coachData
            }),
            invalidatesTags: ["CoachList"],
        }),
    }),
});

export const { useCreateCoachMutation } = createCoachApi;




export interface UpdateCoachArgs {
    coachId: string;
    coachData: Partial<Coach>;
}

const updateCoachApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateCoach: builder.mutation<Coach, UpdateCoachArgs>({
            query: ({ coachId, coachData }) => ({
                url: `/api/admin/coaches/${coachId}/`,
                method: 'PATCH',
                body: coachData
            }),
            invalidatesTags: ["CoachList"],
        }),
    }),
});

export const { useUpdateCoachMutation } = updateCoachApi;




const deleteCoachApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteCoach: builder.mutation<void, string>({
            query: (coachId) => ({
                url: `/api/admin/coaches/${coachId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ["CoachList"],
        }),
    }),
});

export const { useDeleteCoachMutation } = deleteCoachApi;