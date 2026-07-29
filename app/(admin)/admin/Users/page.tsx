"use client";

import {
  useGetAllUsersQuery,
  useGetIndividualUserQuery,
  useBanUnbanUserMutation,
  type ApiUser,
} from "@/redux/features/admin/users/usersApi";
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

// ── View Types ───────────────────────────────────────────────────────────────

type UserStatus = "Active" | "Refunded" | "Inactive";

interface User {
  id: string;
  name: string;
  plan: string;
  status: UserStatus;
  isBanned: boolean;
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
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.full_name,
  plan: resolvePlanLabel(apiUser.plan),
  status: resolveStatus(apiUser),
  isBanned: apiUser.is_banned,
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

const ViewButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
    aria-label="View user"
  >
    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>
);

const BanUnbanButton = ({
  isBanned,
  isLoading,
  onClick,
}: {
  isBanned: boolean;
  isLoading: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${isBanned ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
      }`}
    aria-label={isBanned ? "Unban user" : "Ban user"}
  >
    {isBanned ? (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M6 6l12 12" />
      </svg>
    )}
  </button>
);

// ── User Detail Modal ───────────────────────────────────────────────────────

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

const UserDetailModal = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { data: user, isLoading, isError } = useGetIndividualUserQuery(userId);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-400">User Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading && <p className="text-sm text-gray-400 py-6 text-center">Loading user...</p>}
        {isError && <p className="text-sm text-red-500 py-6 text-center">Failed to load user.</p>}

        {user && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg font-semibold">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.full_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <DetailRow label="Mobile" value={user.mobile_number || "—"} />
            <DetailRow label="Role" value={user.role} />
            <DetailRow label="Plan" value={resolvePlanLabel(user.plan)} />
            <DetailRow label="Email Verified" value={user.is_email_verified ? "Yes" : "No"} />
            <DetailRow label="Status" value={<StatusBadge status={resolveStatus(user)} />} />
            <DetailRow label="Joined" value={formatJoined(user.date_joined)} />
            <DetailRow label="Last Active" value={formatRelative(user.last_active)} />
            <DetailRow label="Questions Asked" value={user.questions_count} />
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function Users() {
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery();
  const [banUnbanUser, { isLoading: isTogglingBan }] = useBanUnbanUserMutation();

  const [search, setSearch] = useState("");
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const users: User[] = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map(mapApiUserToUser);
  }, [data]);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  const handleBanUnban = async (user: User) => {
    const willBan = !user.isBanned;

    const result = await Swal.fire({
      title: `${willBan ? "Ban" : "Unban"} ${user.name}?`,
      text: willBan
        ? "This user will lose access to the platform."
        : "This user will regain access to the platform.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F5A623",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: `Yes, ${willBan ? "ban" : "unban"}`,
    });

    if (!result.isConfirmed) return;

    setPendingUserId(user.id);
    try {
      const res = await banUnbanUser(user.id).unwrap();
      toast.success(res.message);
      refetch();
    } catch {
      toast.error(`Failed to ${willBan ? "ban" : "unban"} user.`);
    } finally {
      setPendingUserId(null);
    }
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
                    <button
                      onClick={() => setViewingUserId(user.id)}
                      className="flex items-center gap-3 text-left"
                    >
                      <Avatar name={user.name} index={i} />
                      <span className="font-medium text-amber-400 hover:underline">{user.name}</span>
                    </button>
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
                    <div className="flex items-center gap-2">
                      <ViewButton onClick={() => setViewingUserId(user.id)} />
                      <BanUnbanButton
                        isBanned={user.isBanned}
                        isLoading={isTogglingBan && pendingUserId === user.id}
                        onClick={() => handleBanUnban(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {viewingUserId && (
        <UserDetailModal userId={viewingUserId} onClose={() => setViewingUserId(null)} />
      )}
    </div>
  );
}