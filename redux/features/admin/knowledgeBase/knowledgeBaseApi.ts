import { DocumentListResponse, KBDocument } from "@/app/(admin)/admin/Knowledge-Base/page";
import { baseApi } from "@/redux/api/baseApi";

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