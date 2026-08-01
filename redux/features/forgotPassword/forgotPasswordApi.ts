import { baseApi } from "@/redux/api/baseApi";

interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponse {
    detail: string;
}

interface VerifyResetOtpRequest {
    email: string;
    code: string;
}

interface VerifyResetOtpResponse {
    reset_token: string;
}

interface ResetPasswordRequest {
    reset_token: string;
    password: string;
    confirm_password: string;
}

interface ResetPasswordResponse {
    detail: string;
}

const authResetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (body) => ({
                url: "/api/auth/forgot-password/",
                method: "POST",
                body,
            }),
        }),
        verifyResetOtp: builder.mutation<VerifyResetOtpResponse, VerifyResetOtpRequest>({
            query: (body) => ({
                url: "/api/auth/verify-reset-otp/",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (body) => ({
                url: "/api/auth/reset-password/",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useForgotPasswordMutation,
    useVerifyResetOtpMutation,
    useResetPasswordMutation,
} = authResetApi;