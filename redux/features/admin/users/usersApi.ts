import { baseApi } from "@/redux/api/baseApi";

export interface ApiUser {
    id: string;
    full_name: string;
    email: string;
    mobile_number: string;
    role: string;
    is_email_verified: boolean;
    is_banned: boolean;
    date_joined: string;
    last_active: string | null;
    plan: string;
    subscription_status: string | null;
    questions_count: number;
}

interface ApiUsersResponse {
    next: string | null;
    previous: string | null;
    results: ApiUser[];
}

interface BanUnbanResponse {
    id: string;
    is_banned: boolean;
    message: string;
}

const allUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<ApiUsersResponse, void>({
            query: () => ({
                url: "/api/admin/users/",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllUsersQuery } = allUsersApi;



const individualUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getIndividualUser: builder.query<ApiUser, string>({
            query: (userId) => ({
                url: `/api/admin/users/${userId}/`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetIndividualUserQuery } = individualUsersApi;



const banUnbanUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        banUnbanUser: builder.mutation<BanUnbanResponse, string>({
            query: (userId) => ({
                url: `/api/admin/users/${userId}/ban/`,
                method: "POST",
            }),
        }),
    }),
});

export const { useBanUnbanUserMutation } = banUnbanUserApi;