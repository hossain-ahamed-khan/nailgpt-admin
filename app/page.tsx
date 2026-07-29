// app/welcome/page.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
            <div className="mx-auto max-w-xl">
                <span className="inline-block rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium tracking-wide text-slate-400">
                    Welcome
                </span>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                    Glad you&apos;re here
                </h1>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                    >
                        Go to Admin Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}