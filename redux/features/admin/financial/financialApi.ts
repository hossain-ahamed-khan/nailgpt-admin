import { baseApi } from "@/redux/api/baseApi";

const financialStatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFinancialStats: builder.query({
            query: () => ({
                url: '/api/pro/admin/financial/stats/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetFinancialStatsQuery } = financialStatsApi;





const financialTransactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFinancialTransactions: builder.query({
            query: () => ({
                url: '/api/pro/admin/financial/transactions/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetFinancialTransactionsQuery } = financialTransactionApi;





const financialPendingPayoutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFinancialPendingPayouts: builder.query({
            query: () => ({
                url: '/api/pro/admin/financial/pending-payouts/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetFinancialPendingPayoutsQuery } = financialPendingPayoutApi;