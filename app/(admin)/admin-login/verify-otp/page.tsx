"use client";

import { useRef, useState } from "react";
import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useForgotPasswordMutation, useVerifyResetOtpMutation } from "@/redux/features/forgotPassword/forgotPasswordApi";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [verifyResetOtp, { isLoading: isSubmitting }] = useVerifyResetOtpMutation();
    const [forgotPassword] = useForgotPasswordMutation();

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const next = [...otp];
        next[index] = value;
        setOtp(next);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => (next[i] = char));
        setOtp(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) return;

        try {
            const response = await verifyResetOtp({ email, code }).unwrap();
            router.push(
                `/admin-login/reset-password?email=${encodeURIComponent(email)}&reset_token=${encodeURIComponent(response.reset_token)}`
            );
        } catch (error: any) {
            toast.error(error?.data?.detail || "Invalid or expired code");
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            const response = await forgotPassword({ email }).unwrap();
            toast.success(response.detail);
        } catch (error: any) {
            toast.error(error?.data?.detail || "Failed to resend code");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2">
                    <Image
                        src={mainLogo}
                        alt="NailGPT Logo"
                        width={200}
                        height={40}
                        className="object-contain"
                    />
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Check your email
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        We sent a code to your email address {email}. Please check
                        your email for the {OTP_LENGTH} digit code.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="h-12 w-12 rounded-md border border-gray-200 bg-white text-center text-lg font-medium text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md border border-amber-500 bg-amber-400 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                        {isSubmitting ? "Verifying..." : "Verify"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    You have not received the email?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-amber-600 hover:text-amber-700 disabled:opacity-60 cursor-pointer"
                    >
                        {isResending ? "Resending..." : "Resend"}
                    </button>
                </p>
            </div>
        </div>
    );
}