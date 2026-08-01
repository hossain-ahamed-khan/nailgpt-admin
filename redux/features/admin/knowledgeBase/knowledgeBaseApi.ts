import { DocumentListResponse, KBDocument } from "@/app/(admin)/admin/Knowledge-Base/page";
import { baseApi } from "@/redux/api/baseApi";

interface UpdateDocumentCoachesPayload {
    documentId: string;
    coachIds: string[];
    isAllCoaches: boolean;
}

const documentListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDocumentList: builder.query<DocumentListResponse, void>({
            query: () => ({
                url: "/api/admin/knowledge-base/",
                method: "GET",
            }),
            providesTags: ["DocumentList"],
        }),
    }),
});

export const { useGetDocumentListQuery } = documentListApi;




const singleDocumentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleDocument: builder.query<KBDocument, string>({
            query: (documentId) => ({
                url: `/api/admin/knowledge-base/${documentId}/`,
                method: "GET",
            }),
            providesTags: (result, error, documentId) => [{ type: "DocumentList", id: documentId }],
        }),
    }),
});

export const { useGetSingleDocumentQuery } = singleDocumentApi;




const uploadDocumentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadDocument: builder.mutation<KBDocument, FormData>({
            query: (documentData) => ({
                url: '/api/admin/knowledge-base/',
                method: 'POST',
                body: documentData
            }),
            invalidatesTags: ["DocumentList"],
        }),
    }),
});

export const { useUploadDocumentMutation } = uploadDocumentApi;




const updateDocumentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateDocument: builder.mutation<KBDocument, UpdateDocumentCoachesPayload>({
            query: ({ documentId, coachIds, isAllCoaches }) => ({
                url: `/api/admin/knowledge-base/${documentId}/`,
                method: 'PATCH',
                body: {
                    coach_ids: coachIds,
                    is_all_coaches: isAllCoaches,
                },
            }),
            invalidatesTags: ["DocumentList"],
        }),
    }),
});

export const { useUpdateDocumentMutation } = updateDocumentApi;




const deleteDocumentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteDocument: builder.mutation<void, string>({
            query: (documentId) => ({
                url: `/api/admin/knowledge-base/${documentId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ["DocumentList"],
        }),
    }),
});

export const { useDeleteDocumentMutation } = deleteDocumentApi;