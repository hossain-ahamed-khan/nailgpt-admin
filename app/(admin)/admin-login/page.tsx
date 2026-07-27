"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from "next/image";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading: isSubmitting }] = useLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberPassword, setRememberPassword] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login({ email, password }).unwrap();

            dispatch(
                setUser({
                    user: response.user,
                    access: response.access,
                    refresh: response.refresh,
                })
            );

            toast.success("Logged in successfully");
            router.push("/admin");
        } catch (error: any) {
            toast.error(error?.data?.detail || "Invalid email or password");
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
                        Login to Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Please enter your email and password to continue
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

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm text-gray-600"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-500">
                            <input
                                type="checkbox"
                                checked={rememberPassword}
                                onChange={(e) => setRememberPassword(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                            />
                            Remember Password
                        </label>
                        <a href="admin-login/forgot-password" className="text-gray-500 hover:text-amber-600">
                            Forget Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md border border-amber-500 bg-amber-400 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}