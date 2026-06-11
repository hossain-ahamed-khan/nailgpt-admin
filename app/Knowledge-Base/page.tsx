"use client";

import React, { useState, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type FileStatus = "Indexed" | "Processing" | "Pending";

interface KBFile {
  id: number;
  name: string;
  coaches: string[];
  size: string;
  dateAdded: string;
  status: FileStatus;
}

// ── Data ────────────────────────────────────────────────────────────────────

const initialFiles: KBFile[] = [
  {
    id: 1,
    name: "Pricing_Masterclass_2025.pdf",
    coaches: ["Pricing", "Business"],
    size: "2.4 MB",
    dateAdded: "May 12, 2026",
    status: "Indexed",
  },
  {
    id: 2,
    name: "Client_Retention_Webinar_Transcript.docx",
    coaches: ["Clientele"],
    size: "1.1 MB",
    dateAdded: "May 10, 2026",
    status: "Indexed",
  },
  {
    id: 3,
    name: "IG_Caption_Templates_Q2.pdf",
    coaches: ["Content"],
    size: "850 KB",
    dateAdded: "May 05, 2026",
    status: "Indexed",
  },
  {
    id: 4,
    name: "Hiring_Assistant_SOP.pdf",
    coaches: ["Business"],
    size: "3.2 MB",
    dateAdded: "Apr 28, 2026",
    status: "Indexed",
  },
  {
    id: 5,
    name: "VoiceNote_Handling_Late_Clients.mp3",
    coaches: ["Clientele"],
    size: "4.5 MB",
    dateAdded: "Apr 25, 2026",
    status: "Indexed",
  },
  {
    id: 6,
    name: "New_Mentorship_Framework_Draft.pdf",
    coaches: ["All"],
    size: "1.8 MB",
    dateAdded: "Today",
    status: "Pending",
  },
];

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
  if (status === "Indexed") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Indexed
      </span>
    );
  }
  if (status === "Processing") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Processing
      </span>
    );
  }
  return <span className="text-xs text-gray-400">—</span>;
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-red-300 hover:text-red-500 transition-colors p-1"
    aria-label="Delete file"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  </button>
);

// ── Main Component ───────────────────────────────────────────────────────────

export default function KnowledgeBase() {
  const [files, setFiles] = useState<KBFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Extend with real upload logic as needed
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
        className={`bg-white border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${
          isDragging
            ? "border-amber-400 bg-amber-50"
            : "border-gray-200 hover:border-amber-300"
        }`}
      >
        <input ref={inputRef} type="file" multiple className="hidden" />
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
          Drop files here to upload
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
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <FileIcon />
                    <span className="text-sm text-gray-800 font-medium">{file.name}</span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <div className="flex flex-wrap gap-1">
                    {file.coaches.map((c) => (
                      <CoachBadge key={c} label={c} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">{file.size}</td>
                <td className="px-5 py-5 text-gray-500 whitespace-nowrap">{file.dateAdded}</td>
                <td className="px-5 py-5">
                  <StatusBadge status={file.status} />
                </td>
                <td className="px-5 py-5 text-right">
                  <DeleteButton onClick={() => handleDelete(file.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}