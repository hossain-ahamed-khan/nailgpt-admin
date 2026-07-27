import { baseApi } from "@/redux/api/baseApi";

const forgotPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/api/auth/forgot-password/',
                method: 'POST',
                body: { email }
            })
        })
    })
})

export const { useForgotPasswordMutation } = forgotPasswordApi;





const verifyResetOtpApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        verifyResetOtp: builder.mutation({
            query: (otpData) => ({
                url: '/api/auth/verify-reset-otp/',
                method: 'POST',
                body: otpData
            })
        })
    })
})

export const { useVerifyResetOtpMutation } = verifyResetOtpApi;





const resetPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        resetPassword: builder.mutation({
            query: (passwordData) => ({
                url: '/api/auth/reset-password/',
                method: 'POST',
                body: passwordData
            })
        })
    })
})

export const { useResetPasswordMutation } = resetPasswordApi;