"use client";

import { useState } from "react";
import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/features/forgotPassword/forgotPasswordApi";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("reset_token") ?? "";

    const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await resetPassword({
                reset_token: resetToken,
                password: newPassword,
                confirm_password: confirmPassword,
            }).unwrap();
            toast.success(response.detail);
            router.push("/password-updated");
        } catch (error: any) {
            setError(error?.data?.detail || "Failed to reset password. Please try again.");
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
                        Set a new password
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Create a new password. Ensure it differs from
                        previous ones for security
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="mb-1.5 block text-sm text-gray-600"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1.5 block text-sm text-gray-600"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md border border-amber-500 bg-amber-400 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}