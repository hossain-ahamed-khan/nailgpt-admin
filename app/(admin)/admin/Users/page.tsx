"use client";

import { useGetAllUsersQuery } from "@/redux/features/admin/users/usersApi";
import React, { useMemo, useState } from "react";

// ── API Types ────────────────────────────────────────────────────────────────

interface ApiUser {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  role: string;
  is_email_verified: boolean;
  is_banned: boolean;
  date_joined: string;
  last_active: string | null;
  plan: string;
  subscription_status: string | null;
  questions_count: number;
}

interface ApiUsersResponse {
  next: string | null;
  previous: string | null;
  results: ApiUser[];
}

// ── View Types ───────────────────────────────────────────────────────────────

type UserStatus = "Active" | "Refunded" | "Inactive";

interface User {
  id: string;
  name: string;
  plan: string;
  status: UserStatus;
  joined: string;
  lastActive: string;
  questions: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatJoined = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatRelative = (dateStr: string | null): string => {
  if (!dateStr) return "Never";

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return `${months} month${months === 1 ? "" : "s"} ago`;
};

const resolveStatus = (user: ApiUser): UserStatus => {
  if (user.is_banned) return "Inactive";
  if (user.subscription_status === "refunded") return "Refunded";
  return "Active";
};

const resolvePlanLabel = (plan: string): string => {
  if (!plan || plan.toLowerCase() === "free") return "Free";
  // Capitalize e.g. "lifetime" -> "Lifetime"
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.full_name,
  plan: resolvePlanLabel(apiUser.plan),
  status: resolveStatus(apiUser),
  joined: formatJoined(apiUser.date_joined),
  lastActive: formatRelative(apiUser.last_active),
  questions: apiUser.questions_count,
});

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
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
      Inactive
    </span>
  );
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
  const { data, isLoading, isError, error } = useGetAllUsersQuery(undefined) as {
    data: ApiUsersResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };

  const [search, setSearch] = useState("");
  const [revokedIds, setRevokedIds] = useState<Set<string>>(new Set());

  const users: User[] = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map(mapApiUserToUser);
  }, [data]);

  const filtered = users.filter(
    (u) => !revokedIds.has(u.id) && u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = (id: string) => {
    // TODO: replace with a mutation call (e.g. useBanUserMutation) once the
    // revoke/ban endpoint is available. For now this just hides the row.
    setRevokedIds((prev) => new Set(prev).add(id));
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
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            )}

            {isError && !isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-red-500">
                  Failed to load users. {error && typeof error === "object" && "status" in error
                    ? `(Error ${(error as { status: unknown }).status})`
                    : ""}
                </td>
              </tr>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              filtered.map((user, i) => (
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