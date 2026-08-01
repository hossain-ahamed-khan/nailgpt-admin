"use client";

import { useState } from "react";
import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/features/forgotPassword/forgotPasswordApi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const [forgotPassword, { isLoading: isSubmitting }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await forgotPassword({ email }).unwrap();
            toast.success(response.detail);
            router.push(`/admin-login/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            toast.error(error?.data?.detail || "Something went wrong. Please try again.");
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
                        Forget Password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Please enter your email to get verification code
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm text-gray-600"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="esteban_schiller@gmail.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md border border-amber-500 bg-amber-400 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Sending..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}