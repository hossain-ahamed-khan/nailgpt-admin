"use client";

import { selectUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Data ────────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", value: 180000 },
  { month: "Feb", value: 200000 },
  { month: "Mar", value: 90000 },
  { month: "Apr", value: 100000 },
  { month: "May", value: 270000 },
  { month: "Jun", value: 100000 },
  { month: "Jul", value: 180000 },
  { month: "Sep", value: 80000 },
  { month: "Oct", value: 260000 },
  { month: "Nov", value: 280000 },
];

const subscriberData = [
  { month: "Jan", value: 1700 },
  { month: "Feb", value: 500 },
  { month: "Mar", value: 2000 },
  { month: "Apr", value: 600 },
  { month: "May", value: 400 },
  { month: "Jun", value: 300 },
  { month: "Jul", value: 1900 },
];

const topQuestions = [
  { text: "How do I announce a price increase?", count: 142 },
  { text: "What should I post on Instagram today?", count: 98 },
  { text: "Client is 20 minutes late, what do I say?", count: 76 },
  { text: "How to calculate my hourly rate?", count: 65 },
  { text: "Should I hire an assistant or booth renter?", count: 43 },
];

const recentSignups = [
  { name: "Jessica T.", time: "2 hours ago", plan: "Lifetime" },
  { name: "Amanda R.", time: "5 hours ago", plan: "Lifetime" },
  { name: "Chloe M.", time: "1 day ago", plan: "Free" },
  { name: "Sarah J.", time: "1 day ago", plan: "Lifetime" },
  { name: "Brittany W.", time: "2 days ago", plan: "Lifetime" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  badge,
  value,
  label,
}: {
  icon: React.ReactNode;
  badge: string;
  value: string;
  label: string;
}) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate">
        {badge}
      </span>
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-amber-400 leading-tight">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-amber-400 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
        <p>Sales</p>
        <p>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const avatarColors = [
  "bg-amber-400 text-white",
  "bg-gray-800 text-white",
  "bg-amber-300 text-white",
  "bg-gray-400 text-white",
  "bg-gray-700 text-white",
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const user = useAppSelector(selectUser);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto font-sans">
      <div className="w-full h-full flex flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">
            Welcome back, {user?.full_name} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Here's what's happening in your app today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-6">
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            badge="+12% this month"
            value="1,247"
            label="Total Members"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            badge="+18% this month"
            value="$24,580"
            label="Monthly Revenue"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
            badge="71% of total"
            value="892"
            label="Active This Week"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
            badge="All time"
            value="18.4k"
            label="Questions Answered"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-6">
          {/* Revenue Overview */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FBBF24"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#FBBF24", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#FBBF24" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subscriber Growth */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Subscribers Growth</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subscriberData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#fef9ee" }} />
                <Bar dataKey="value" fill="#FBBF24" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Top Questions */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-y-auto max-h-80 sm:max-h-96">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-5 sticky top-0 bg-white">Top Questions This Week</h2>
            <div className="flex flex-col gap-3">
              {topQuestions.map((q, i) => (
                <div key={i} className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm text-amber-400 font-medium leading-snug flex-1">{q.text}</span>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-md min-w-[40px] sm:min-w-[48px] text-center shrink-0">
                    {q.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-y-auto max-h-80 sm:max-h-96">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-5 sticky top-0 bg-white">Recent Signups</h2>
            <div className="flex flex-col gap-3 sm:gap-4">
              {recentSignups.map((user, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${avatarColors[i]}`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-amber-400 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.time}</p>
                  </div>
                  {user.plan !== "Free" ? (
                    <span className="text-xs font-medium text-gray-700 border border-gray-200 px-2 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
                      {user.plan}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 shrink-0 whitespace-nowrap">{user.plan}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}