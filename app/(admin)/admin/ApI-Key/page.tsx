"use client";

import { ApiKeyItem, useApiKeyListQuery, useCreateApiKeyMutation, useDeleteApiKeyMutation } from "@/redux/features/admin/apiKey/apiKeyApi";
import React, { useState } from "react";
import { toast } from "sonner";

// ── Create Key Types ─────────────────────────────────────────────────────────

interface CreateApiKeyPayload {
  provider: string;
  model: string;
  key: string;
  name: string;
}

interface CreateApiKeyFieldErrors {
  provider?: string[];
  model?: string[];
  key?: string[];
  name?: string[];
  detail?: string;
}

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "mistral", label: "Mistral" },
];

const EMPTY_FORM: CreateApiKeyPayload = {
  provider: "openai",
  model: "",
  key: "",
  name: "",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatRelativeTime = (iso: string | null) => {
  if (!iso) return "Never";

  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return formatDate(iso);
};

// ── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: ApiKeyItem["status"] }) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Active
      </span>
    );
  }

  const label = status === "revoked" ? "Revoked" : "Inactive";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
      {label}
    </span>
  );
};

const KeyTypeBadge = ({ keyType }: { keyType: ApiKeyItem["key_type"] }) => (
  <span
    className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${keyType === "live"
      ? "bg-amber-50 text-amber-600 border border-amber-200"
      : "bg-blue-50 text-blue-600 border border-blue-200"
      }`}
  >
    {keyType}
  </span>
);

const TableSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-5">
      <div className="h-4 w-40 bg-gray-100 rounded" />
    </td>
    <td className="px-6 py-5">
      <div className="h-4 w-32 bg-gray-100 rounded" />
    </td>
    <td className="px-6 py-5">
      <div className="h-4 w-24 bg-gray-100 rounded" />
    </td>
    <td className="px-6 py-5">
      <div className="h-4 w-24 bg-gray-100 rounded" />
    </td>
    <td className="px-6 py-5">
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </td>
    <td className="px-6 py-5">
      <div className="h-4 w-8 bg-gray-100 rounded" />
    </td>
  </tr>
);

// ── New Key Modal ─────────────────────────────────────────────────────────────

interface NewKeyModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const NewKeyModal = ({ onClose, onCreated }: NewKeyModalProps) => {
  const [form, setForm] = useState<CreateApiKeyPayload>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<CreateApiKeyFieldErrors>({});
  const [createApiKey, { isLoading }] = useCreateApiKeyMutation();

  const handleChange =
    (field: keyof CreateApiKeyPayload) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear the field-level error as the user edits it
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      await createApiKey(form).unwrap();
      toast.success("API key created successfully.");
      onCreated();
      onClose();
    } catch (err) {
      const errorData = (err as { data?: CreateApiKeyFieldErrors })?.data;

      if (errorData) {
        setFieldErrors(errorData);
        const firstMessage =
          errorData.key?.[0] ??
          errorData.name?.[0] ??
          errorData.provider?.[0] ??
          errorData.model?.[0] ??
          errorData.detail ??
          "Failed to create API key.";
        toast.error(firstMessage);
      } else {
        toast.error("Failed to create API key. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">New API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. OpenAI Production"
              required
              className={`w-full text-sm rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-200 ${fieldErrors.name ? "border-red-300" : "border-gray-200"
                }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Provider */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Provider</label>
            <select
              value={form.provider}
              onChange={handleChange("provider")}
              className={`w-full text-sm rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-200 bg-white ${fieldErrors.provider ? "border-red-300" : "border-gray-200"
                }`}
            >
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.provider && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.provider[0]}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Model</label>
            <input
              type="text"
              value={form.model}
              onChange={handleChange("model")}
              placeholder="e.g. gpt-4o-mini"
              required
              className={`w-full text-sm rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-200 ${fieldErrors.model ? "border-red-300" : "border-gray-200"
                }`}
            />
            {fieldErrors.model && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.model[0]}</p>
            )}
          </div>

          {/* Key */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">API Key</label>
            <input
              type="password"
              value={form.key}
              onChange={handleChange("key")}
              placeholder="sk-..."
              required
              autoComplete="off"
              className={`w-full text-sm font-mono rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-200 ${fieldErrors.key ? "border-red-300" : "border-gray-200"
                }`}
            />
            {fieldErrors.key && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.key[0]}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-400 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              {isLoading ? "Creating..." : "Create Key"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Confirm Dialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  keyName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({ keyName, isDeleting, onCancel, onConfirm }: ConfirmDialogProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">Delete API key?</h2>
          <p className="text-sm text-gray-500 mt-1">
            This will permanently revoke <span className="font-semibold text-gray-700">{keyName}</span>. Any
            integration using this key will stop working immediately. This action can&apos;t be undone.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {isDeleting ? "Deleting..." : "Delete key"}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

export default function ApiKeys() {
  const { data: keys, isLoading, isError, refetch } = useApiKeyListQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyPendingDelete, setKeyPendingDelete] = useState<ApiKeyItem | null>(null);
  const [deleteApiKey, { isLoading: isDeleting }] = useDeleteApiKeyMutation();

  const handleDelete = (key: ApiKeyItem) => {
    setKeyPendingDelete(key);
  };

  const confirmDelete = async () => {
    if (!keyPendingDelete) return;

    try {
      await deleteApiKey(keyPendingDelete.id).unwrap();
      toast.success(`"${keyPendingDelete.name}" was deleted.`);
      setKeyPendingDelete(null);
      refetch();
    } catch (err) {
      const errorData = (err as { data?: { detail?: string } })?.data;
      toast.error(errorData?.detail ?? "Failed to delete API key. Please try again.");
    }
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
          onClick={() => setIsModalOpen(true)}
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
              <th className="text-left px-6 py-4 font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Secret Key</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Provider / Model</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Created</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Last Used</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <>
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
              </>
            )}

            {isError && !isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <p className="text-sm text-gray-500 mb-3">Failed to load API keys.</p>
                  <button
                    onClick={() => refetch()}
                    className="text-sm font-semibold text-amber-500 hover:text-amber-600"
                  >
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!isLoading && !isError && keys?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  No API keys yet. Create one to get started.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              keys?.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-5 text-gray-700 font-medium whitespace-nowrap">{key.name}</td>

                  {/* Secret Key */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm text-gray-700">
                        {key.masked_key}
                      </span>
                      <KeyTypeBadge keyType={key.key_type} />
                    </div>
                  </td>

                  {/* Provider / Model */}
                  <td className="px-6 py-5 text-gray-500 whitespace-nowrap">
                    <span className="capitalize">{key.provider}</span>
                    <span className="text-gray-300 mx-1">/</span>
                    <span>{key.model}</span>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{formatDate(key.created_at)}</td>

                  {/* Last Used */}
                  <td className="px-6 py-5 text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(key.last_used_at)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={key.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <button
                      onClick={() => handleDelete(key)}
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

      {isModalOpen && (
        <NewKeyModal
          onClose={() => setIsModalOpen(false)}
          onCreated={() => refetch()}
        />
      )}

      {keyPendingDelete && (
        <ConfirmDialog
          keyName={keyPendingDelete.name}
          isDeleting={isDeleting}
          onCancel={() => setKeyPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}