import { baseApi } from "@/redux/api/baseApi";

export interface ApiKeyItem {
    id: string;
    name: string;
    provider: string;
    model: string;
    key_type: "live" | "test";
    masked_key: string;
    status: "active" | "revoked" | "inactive";
    last_used_at: string | null;
    created_at: string;
}

export type ApiKeyListResponse = ApiKeyItem[];

const apiKeyListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        apiKeyList: builder.query<ApiKeyListResponse, void>({
            query: () => ({
                url: "/api/admin/api-keys/",
                method: "GET",
            }),
        }),
    }),
});

export const { useApiKeyListQuery } = apiKeyListApi;





const createApiKeyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createApiKey: builder.mutation({
            query: (formData) => ({
                url: '/api/admin/api-keys/',
                method: 'POST',
                body: formData,
            })
        })
    })
})

export const { useCreateApiKeyMutation } = createApiKeyApi;




const deleteApiKeyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteApiKey: builder.mutation({
            query: (apiKeyId) => ({
                url: `/api/admin/api-keys/${apiKeyId}/`,
                method: 'DELETE',
            })
        })
    })
})

export const { useDeleteApiKeyMutation } = deleteApiKeyApi;