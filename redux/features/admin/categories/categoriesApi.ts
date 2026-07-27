import { baseApi } from "@/redux/api/baseApi";

const getCategoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: '/api/services/list/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetCategoriesQuery } = getCategoriesApi;





const createCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: '/api/services/admin/categories/',
                method: 'POST',
                body: categoryData
            })
        }),
    })
})

export const { useCreateCategoryMutation } = createCategoryApi;





const updateCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateCategory: builder.mutation({
            query: ({ id, categoryData }) => ({
                url: `/api/services/admin/categories/${id}/`,
                method: 'PATCH',
                body: categoryData
            })
        }),
    })
})

export const { useUpdateCategoryMutation } = updateCategoryApi;




const deleteCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/api/services/admin/categories/${id}/`,
                method: 'DELETE'
            })
        }),
    })
})

export const { useDeleteCategoryMutation } = deleteCategoryApi;