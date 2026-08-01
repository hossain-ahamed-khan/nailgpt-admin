"use client";

import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from "next/image";
import Link from "next/link";

export default function PasswordUpdatedPage() {
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
                        Password Updated
                        <br />
                        Successfully!
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Your new password has been saved. You can now
                        continue securely.
                    </p>
                </div>

                <Link
                    href="/admin-login"
                    className="block w-full rounded-md border border-amber-500 bg-amber-400 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-amber-500 cursor-pointer"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}