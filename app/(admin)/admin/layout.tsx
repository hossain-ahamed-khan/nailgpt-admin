"use client";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
