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
        }),
    }),
});

export const { useGetCoachListQuery } = coachListApi;