import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/Providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <main className="flex-1 overflow-auto">{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
