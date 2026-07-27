"use client";

import React, { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type KeyStatus = "Active" | "Revoked";

interface ApiKey {
  id: number;
  prefix: string;
  suffix: string;
  created: string;
  lastUsed: string;
  status: KeyStatus;
  revealed: boolean;
}

// ── Data ────────────────────────────────────────────────────────────────────

const initialKeys: ApiKey[] = [
  { id: 1, prefix: "sk-live", suffix: "4f2a", created: "Oct 1, 2025",  lastUsed: "2 mins ago", status: "Active", revealed: false },
  { id: 2, prefix: "sk-test", suffix: "9b1c", created: "Sep 15, 2025", lastUsed: "1 day ago",  status: "Active", revealed: false },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: KeyStatus }) => {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
      Revoked
    </span>
  );
};

const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
);

// ── Main Component ───────────────────────────────────────────────────────────

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);

  const toggleReveal = (id: number) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, revealed: !k.revealed } : k))
    );
  };

  const handleDelete = (id: number) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleNewKey = () => {
    const newKey: ApiKey = {
      id: Date.now(),
      prefix: "sk-live",
      suffix: Math.random().toString(16).slice(2, 6),
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Just now",
      status: "Active",
      revealed: false,
    };
    setKeys((prev) => [newKey, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage keys used to integrate with AI services.</p>
        </div>
        <button
          onClick={handleNewKey}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Key
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 font-medium text-gray-500">Secret Key</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Created</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Last Used</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                {/* Secret Key */}
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm text-gray-700">
                    <span>
                      {key.prefix}-
                      {key.revealed
                        ? <span className="text-amber-500">••••••••••••{key.suffix}</span>
                        : <span>············{key.suffix}</span>
                      }
                    </span>
                    <button
                      onClick={() => toggleReveal(key.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={key.revealed ? "Hide key" : "Show key"}
                    >
                      <EyeIcon open={key.revealed} />
                    </button>
                  </div>
                </td>

                {/* Created */}
                <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{key.created}</td>

                {/* Last Used */}
                <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{key.lastUsed}</td>

                {/* Status */}
                <td className="px-6 py-5">
                  <StatusBadge status={key.status} />
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="text-red-300 hover:text-red-500 transition-colors p-1"
                    aria-label="Delete key"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}