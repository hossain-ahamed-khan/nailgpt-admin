"use client";

import React, { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type UserStatus = "Active" | "Refunded" | "Inactive";

interface User {
  id: number;
  name: string;
  plan: string;
  status: UserStatus;
  joined: string;
  lastActive: string;
  questions: number;
}

// ── Data ────────────────────────────────────────────────────────────────────

const initialUsers: User[] = [
  { id: 1, name: "Sarah Jenkins",   plan: "Lifetime $197", status: "Active",   joined: "May 12, 2026", lastActive: "2 hours ago",  questions: 42  },
  { id: 2, name: "Amanda Riley",    plan: "Lifetime $197", status: "Active",   joined: "May 10, 2026", lastActive: "5 hours ago",  questions: 18  },
  { id: 3, name: "Chloe Martinez",  plan: "Free",          status: "Active",   joined: "May 01, 2026", lastActive: "1 day ago",    questions: 156 },
  { id: 4, name: "Jessica Taylor",  plan: "Lifetime $197", status: "Active",   joined: "Apr 28, 2026", lastActive: "2 days ago",   questions: 89  },
  { id: 5, name: "Brittany Woods",  plan: "Lifetime $197", status: "Inactive", joined: "Apr 15, 2026", lastActive: "2 weeks ago",  questions: 5   },
  { id: 6, name: "Ashley Chen",     plan: "Lifetime $197", status: "Refunded", joined: "Mar 22, 2026", lastActive: "1 month ago",  questions: 2   },
  { id: 7, name: "Michelle Davis",  plan: "",              status: "Active",   joined: "Mar 10, 2026", lastActive: "3 hours ago",  questions: 210 },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const avatarColors = [
  "bg-amber-100 text-amber-600",
  "bg-orange-100 text-orange-600",
  "bg-yellow-100 text-yellow-600",
  "bg-lime-100 text-lime-600",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-violet-100 text-violet-600",
];

const Avatar = ({ name, index }: { name: string; index: number }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColors[index % avatarColors.length]}`}
  >
    {name.charAt(0)}
  </div>
);

const PlanBadge = ({ plan }: { plan: string }) => {
  if (!plan) return null;
  if (plan === "Free") {
    return <span className="text-sm text-gray-500">{plan}</span>;
  }
  return (
    <span className="text-sm font-medium text-amber-400 bg-amber-50 px-2 py-0.5 rounded-md">
      {plan}
    </span>
  );
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
  if (status === "Active") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Active
      </span>
    );
  }
  if (status === "Refunded") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        Refunded
      </span>
    );
  }
  return null;
};

const RevokeButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shrink-0"
    aria-label="Revoke access"
  >
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M6 6l12 12" />
    </svg>
  </button>
);

// ── Main Component ───────────────────────────────────────────────────────────

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-400">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your mentees and their access.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 w-56 text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-400 text-xs font-medium text-white">
              <th className="text-left px-5 py-3 font-medium">User</th>
              <th className="text-left px-5 py-3 font-medium">Plan</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Joined</th>
              <th className="text-left px-5 py-3 font-medium">Last Active</th>
              <th className="text-left px-5 py-3 font-medium">Questions</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user, i) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* User */}
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} index={i} />
                    <span className="font-medium text-amber-400">{user.name}</span>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-5 py-5">
                  <PlanBadge plan={user.plan} />
                </td>

                {/* Status */}
                <td className="px-5 py-5">
                  <StatusBadge status={user.status} />
                </td>

                {/* Joined */}
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">{user.joined}</td>

                {/* Last Active */}
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">{user.lastActive}</td>

                {/* Questions */}
                <td className="px-5 py-5 text-gray-700">{user.questions}</td>

                {/* Action */}
                <td className="px-5 py-5">
                  <RevokeButton onClick={() => handleRevoke(user.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}