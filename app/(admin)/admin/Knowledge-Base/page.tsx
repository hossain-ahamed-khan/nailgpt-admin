"use client";

import { useGetCoachListQuery } from "@/redux/features/admin/coaches/coachesApi";
import {
  useGetDocumentListQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from "@/redux/features/admin/knowledgeBase/knowledgeBaseApi";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";

// ── Types ────────────────────────────────────────────────────────────────────

type FileStatus = "indexed" | "processing" | "pending";

export interface AssignedCoach {
  id: string;
  name: string;
}

export interface KBDocument {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_size_display: string;
  assigned_coaches: AssignedCoach[];
  is_all_coaches: boolean;
  status: FileStatus;
  created_at: string;
}

export interface DocumentListResponse {
  next: string | null;
  previous: string | null;
  results: KBDocument[];
}

export interface Coach {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  icon: string;
  accent_color: string;
  system_prompt: string;
  rules: string[];
  temperature: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export type CoachListResponse = Coach[];

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

// ── Sub-components ───────────────────────────────────────────────────────────

const FileIcon = () => (
  <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
    </svg>
  </div>
);

const CoachBadge = ({ label }: { label: string }) => (
  <span className="text-xs text-amber-500 border border-amber-300 px-2 py-0.5 rounded-md whitespace-nowrap">
    {label}
  </span>
);

const StatusBadge = ({ status }: { status: FileStatus }) => {
  if (status === "indexed") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Indexed
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Processing
      </span>
    );
  }
  return <span className="text-xs text-amber-500 font-medium">Pending</span>;
};

const DeleteButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-red-300 hover:text-red-500 transition-colors p-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded-md"
    aria-label="Delete file"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  </button>
);

// ── Coach Dropdown (portal-based, always visible & unclipped) ───────────────

const DROPDOWN_WIDTH = 192; // w-48
const DROPDOWN_MAX_HEIGHT = 260; // approx max-h-64 + header row

const CoachDropdown = ({
  fileId,
  coaches,
  coachesLoading,
  coachesError,
  assignedCoaches,
  isAllCoaches,
  isSaving,
  onChange,
}: {
  fileId: string;
  coaches: Coach[];
  coachesLoading: boolean;
  coachesError: boolean;
  assignedCoaches: AssignedCoach[];
  isAllCoaches: boolean;
  isSaving: boolean;
  onChange: (fileId: string, coachIds: string[], isAllCoaches: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; openUpward: boolean } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const computeCoords = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < DROPDOWN_MAX_HEIGHT && rect.top > DROPDOWN_MAX_HEIGHT;

    let left = rect.left;
    // Keep the panel within the horizontal viewport bounds
    if (left + DROPDOWN_WIDTH > window.innerWidth - 8) {
      left = window.innerWidth - DROPDOWN_WIDTH - 8;
    }

    setCoords({
      top: openUpward ? rect.top - 4 : rect.bottom + 4,
      left,
      openUpward,
    });
  };

  const toggleOpen = () => {
    if (!isOpen) computeCoords();
    setIsOpen((prev) => !prev);
  };

  // Recompute position on open, and keep in sync on scroll/resize
  useLayoutEffect(() => {
    if (!isOpen) return;
    computeCoords();

    const handleReposition = () => computeCoords();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCoach = (coachId: string) => {
    const isAssigned = assignedCoaches.some((c) => c.id === coachId);
    const nextIds = isAssigned
      ? assignedCoaches.filter((c) => c.id !== coachId).map((c) => c.id)
      : [...assignedCoaches.map((c) => c.id), coachId];
    onChange(fileId, nextIds, false);
  };

  const toggleAll = () => {
    onChange(fileId, [], !isAllCoaches);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        disabled={isSaving}
        className="flex flex-wrap items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <span className="text-xs text-gray-400">Saving...</span>
        ) : (
          <>
            {isAllCoaches ? (
              <CoachBadge label="All" />
            ) : (
              assignedCoaches.map((c) => <CoachBadge key={c.id} label={c.name} />)
            )}
            {!isAllCoaches && (
              <span className="text-xs text-gray-400 border border-dashed border-gray-300 px-2 py-0.5 rounded-md hover:border-amber-300 hover:text-amber-400 transition-colors">
                + Assign
              </span>
            )}
          </>
        )}
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: DROPDOWN_WIDTH,
              transform: coords.openUpward ? "translateY(-100%)" : undefined,
            }}
            className="z-[999] bg-white border border-gray-100 rounded-lg shadow-lg py-1 max-h-64 overflow-y-auto"
          >
            <label className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer font-medium border-b border-gray-100">
              <input
                type="checkbox"
                checked={isAllCoaches}
                onChange={toggleAll}
                className="accent-amber-400"
              />
              All Coaches
            </label>

            {coachesLoading && (
              <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>
            )}
            {coachesError && (
              <div className="px-3 py-2 text-xs text-red-400">
                Failed to load coaches.
              </div>
            )}
            {!coachesLoading &&
              !coachesError &&
              coaches.map((coach) => (
                <label
                  key={coach.id}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    disabled={isAllCoaches}
                    checked={assignedCoaches.some((c) => c.id === coach.id)}
                    onChange={() => toggleCoach(coach.id)}
                    className="accent-amber-400"
                  />
                  {coach.name}
                </label>
              ))}
          </div>,
          document.body
        )}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function KnowledgeBase() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: documentList,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetDocumentListQuery();

  const {
    data: coachList,
    isLoading: isCoachListLoading,
    isError: isCoachListError,
  } = useGetCoachListQuery();

  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingCoachId, setSavingCoachId] = useState<string | null>(null);

  const files: KBDocument[] = documentList?.results ?? [];
  const coaches: Coach[] = coachList ?? [];

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await uploadDocument(formData).unwrap();
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        console.error("Upload failed:", err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string, fileName: string) => {
    const result = await Swal.fire({
      title: "Delete file?",
      text: `"${fileName}" will be permanently deleted. This can't be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteDocument(id).unwrap();
      toast.success(`${fileName} deleted`);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Failed to delete ${fileName}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCoachChange = async (
    fileId: string,
    coachIds: string[],
    isAllCoaches: boolean
  ) => {
    setSavingCoachId(fileId);
    try {
      await updateDocument({ documentId: fileId, coachIds, isAllCoaches }).unwrap();
    } catch (err) {
      console.error("Failed to update assigned coaches:", err);
      toast.error("Failed to update assigned coaches");
    } finally {
      setSavingCoachId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-400">Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload your materials to train the AI coaches.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${isDragging
          ? "border-amber-400 bg-amber-50"
          : "border-gray-200 hover:border-amber-300"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <p className="text-amber-400 font-medium text-sm mb-1">
          {isUploading ? "Uploading..." : "Drop files here to upload"}
        </p>
        <p className="text-gray-400 text-xs text-center max-w-xs">
          Supported formats: PDF, DOCX, PPTX, TXT, MP3, MP4. The AI will
          automatically transcribe audio/video and index the content.
        </p>
      </div>

      {/* File Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-xs font-medium text-gray-500">
              <th className="text-left px-5 py-3 font-medium">File Name</th>
              <th className="text-left px-5 py-3 font-medium">Assigned Coaches</th>
              <th className="text-left px-5 py-3 font-medium">Size</th>
              <th className="text-left px-5 py-3 font-medium">Date Added</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isListLoading && (
              <tr>
                <td className="px-5 py-6 text-gray-400 text-sm" colSpan={6}>
                  Loading files...
                </td>
              </tr>
            )}

            {isListError && (
              <tr>
                <td className="px-5 py-6 text-red-400 text-sm" colSpan={6}>
                  Failed to load files.
                </td>
              </tr>
            )}

            {!isListLoading && !isListError && files.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-gray-400 text-sm" colSpan={6}>
                  No files uploaded yet.
                </td>
              </tr>
            )}

            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <FileIcon />
                    <span className="text-sm text-gray-800 font-medium">
                      {file.file_name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <CoachDropdown
                    fileId={file.id}
                    coaches={coaches}
                    coachesLoading={isCoachListLoading}
                    coachesError={isCoachListError}
                    assignedCoaches={file.assigned_coaches}
                    isAllCoaches={file.is_all_coaches}
                    isSaving={savingCoachId === file.id}
                    onChange={handleCoachChange}
                  />
                </td>
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">
                  {file.file_size_display}
                </td>
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">
                  {formatDate(file.created_at)}
                </td>
                <td className="px-5 py-5">
                  <StatusBadge status={file.status} />
                </td>
                <td className="px-5 py-5 text-right">
                  <DeleteButton
                    onClick={() => handleDelete(file.id, file.file_name)}
                    disabled={isDeleting && deletingId === file.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}