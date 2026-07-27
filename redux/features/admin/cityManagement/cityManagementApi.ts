import { baseApi } from "@/redux/api/baseApi";

const allCitiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCities: builder.query({
            query: () => ({
                url: '/api/services/admin/cities/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAllCitiesQuery } = allCitiesApi;





const cityDetailsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCityDetails: builder.query({
            query: (cityId) => ({
                url: `/api/services/admin/cities/${cityId}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useGetCityDetailsQuery } = cityDetailsApi;





const addNewCityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addNewCity: builder.mutation({
            query: (cityInfo) => ({
                url: '/api/services/admin/cities/',
                method: 'POST',
                body: cityInfo
            })
        }),
    })
})

export const { useAddNewCityMutation } = addNewCityApi;





const updateCityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateCity: builder.mutation({
            query: ({ cityInfo, cityId }) => ({
                url: `/api/services/admin/cities/${cityId}/`,
                method: 'PATCH',
                body: cityInfo
            })
        }),
    })
})

export const { useUpdateCityMutation } = updateCityApi;





const deleteCityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteCity: builder.mutation({
            query: (cityId) => ({
                url: `/api/services/admin/cities/${cityId}/`,
                method: 'DELETE'
            })
        }),
    })
})

export const { useDeleteCityMutation } = deleteCityApi;