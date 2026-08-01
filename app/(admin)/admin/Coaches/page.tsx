"use client";

import {
    useGetCoachListQuery,
    useGetIndividualCoachQuery,
    useCreateCoachMutation,
    useUpdateCoachMutation,
    useDeleteCoachMutation,
    type Coach,
} from "@/redux/features/admin/coaches/coachesApi";
import React, { useMemo, useState } from "react";
import {
    Crown,
    DollarSign,
    Users,
    Star,
    Megaphone,
    Sparkles,
    Plus,
    Pencil,
    Trash2,
    X,
    type LucideIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatCreated = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

const iconMap: Record<string, LucideIcon> = {
    crown: Crown,
    dollar: DollarSign,
    users: Users,
    star: Star,
    megaphone: Megaphone,
};

const iconOptions = Object.keys(iconMap);

const resolveIcon = (icon: string): LucideIcon => iconMap[icon] ?? Sparkles;

// ── Sub-components ───────────────────────────────────────────────────────────

const CoachIcon = ({ icon, color }: { icon: string; color: string }) => {
    const Icon = resolveIcon(icon);
    return (
        <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}1A` }}
        >
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
        </div>
    );
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
        return (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Active
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
        aria-label="View coach"
    >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    </button>
);

const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors shrink-0"
        aria-label="Edit coach"
    >
        <Pencil className="w-4 h-4 text-amber-500" strokeWidth={2} />
    </button>
);

const DeleteButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Delete coach"
    >
        <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
    </button>
);

// ── Coach Detail Modal ───────────────────────────────────────────────────────

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
);

const CoachDetailModal = ({ coachId, onClose }: { coachId: string; onClose: () => void }) => {
    const { data: coach, isLoading, isError } = useGetIndividualCoachQuery(coachId);

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-amber-400">Coach Details</h2>
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

                {isLoading && <p className="text-sm text-gray-400 py-6 text-center">Loading coach...</p>}
                {isError && <p className="text-sm text-red-500 py-6 text-center">Failed to load coach.</p>}

                {coach && (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${coach.accent_color}1A` }}
                            >
                                {React.createElement(resolveIcon(coach.icon), {
                                    className: "w-6 h-6",
                                    style: { color: coach.accent_color },
                                    strokeWidth: 2,
                                })}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{coach.name}</p>
                                <p className="text-sm text-gray-500">{coach.tagline}</p>
                            </div>
                        </div>

                        <DetailRow label="Slug" value={coach.slug} />
                        <DetailRow label="Status" value={<StatusBadge isActive={coach.is_active} />} />
                        <DetailRow label="Temperature" value={coach.temperature} />
                        <DetailRow label="Sort Order" value={coach.sort_order} />
                        <DetailRow label="Created" value={formatCreated(coach.created_at)} />

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-1.5">System Prompt</p>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                                {coach.system_prompt}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-1.5">Rules</p>
                            <ul className="space-y-1.5">
                                {coach.rules.map((rule, i) => (
                                    <li key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Coach Form (shared by Create & Edit) ────────────────────────────────────

interface CoachFormState {
    name: string;
    tagline: string;
    icon: string;
    accent_color: string;
    system_prompt: string;
    rules: string[];
    temperature: number;
    is_active: boolean;
    sort_order: number;
}

const initialFormState: CoachFormState = {
    name: "",
    tagline: "",
    icon: "star",
    accent_color: "#E2B53E",
    system_prompt: "",
    rules: [""],
    temperature: 0.7,
    is_active: true,
    sort_order: 0,
};

const coachToFormState = (coach: Coach): CoachFormState => ({
    name: coach.name,
    tagline: coach.tagline,
    icon: coach.icon,
    accent_color: coach.accent_color,
    system_prompt: coach.system_prompt,
    rules: coach.rules.length > 0 ? coach.rules : [""],
    temperature: coach.temperature,
    is_active: coach.is_active,
    sort_order: coach.sort_order,
});

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="text-sm text-gray-500 mb-1.5 block">{label}</label>
        {children}
    </div>
);

const inputClasses =
    "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-700 placeholder-gray-400";

const CoachFormFields = ({
    form,
    updateField,
    updateRule,
    addRule,
    removeRule,
}: {
    form: CoachFormState;
    updateField: <K extends keyof CoachFormState>(key: K, value: CoachFormState[K]) => void;
    updateRule: (index: number, value: string) => void;
    addRule: () => void;
    removeRule: (index: number) => void;
}) => (
    <>
        <FormField label="Name">
            <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Marketing"
                className={inputClasses}
                required
            />
        </FormField>

        <FormField label="Tagline">
            <input
                type="text"
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="e.g. Attract more clients with great marketing."
                className={inputClasses}
                required
            />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon">
                <select
                    value={form.icon}
                    onChange={(e) => updateField("icon", e.target.value)}
                    className={inputClasses}
                >
                    {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                            {icon}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Accent Color">
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={form.accent_color}
                        onChange={(e) => updateField("accent_color", e.target.value)}
                        className="w-9 h-9 rounded-lg border border-gray-200 shrink-0 cursor-pointer bg-gray-50"
                    />
                    <input
                        type="text"
                        value={form.accent_color}
                        onChange={(e) => updateField("accent_color", e.target.value)}
                        className={inputClasses}
                    />
                </div>
            </FormField>
        </div>

        <FormField label="System Prompt">
            <textarea
                value={form.system_prompt}
                onChange={(e) => updateField("system_prompt", e.target.value)}
                placeholder="You are the ... Coach inside NailGPT..."
                rows={4}
                className={`${inputClasses} resize-none`}
                required
            />
        </FormField>

        <FormField label="Rules">
            <div className="space-y-2">
                {form.rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={rule}
                            onChange={(e) => updateRule(i, e.target.value)}
                            placeholder={`Rule ${i + 1}`}
                            className={inputClasses}
                        />
                        <button
                            type="button"
                            onClick={() => removeRule(i)}
                            disabled={form.rules.length === 1}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Remove rule"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addRule}
                    className="flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-500 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                    Add rule
                </button>
            </div>
        </FormField>

        <div className="grid grid-cols-3 gap-4">
            <FormField label="Temperature">
                <input
                    type="number"
                    value={form.temperature}
                    onChange={(e) => updateField("temperature", parseFloat(e.target.value))}
                    step={0.1}
                    min={0}
                    max={1}
                    className={inputClasses}
                />
            </FormField>

            <FormField label="Sort Order">
                <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => updateField("sort_order", parseInt(e.target.value, 10) || 0)}
                    min={0}
                    className={inputClasses}
                />
            </FormField>

            <FormField label="Active">
                <label className="flex items-center gap-2 h-[38px]">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => updateField("is_active", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-400 focus:ring-amber-300"
                    />
                    <span className="text-sm text-gray-600">Is active</span>
                </label>
            </FormField>
        </div>
    </>
);

const useCoachForm = (initial: CoachFormState) => {
    const [form, setForm] = useState<CoachFormState>(initial);

    const updateField = <K extends keyof CoachFormState>(key: K, value: CoachFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateRule = (index: number, value: string) => {
        setForm((prev) => ({
            ...prev,
            rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
        }));
    };

    const addRule = () => {
        setForm((prev) => ({ ...prev, rules: [...prev.rules, ""] }));
    };

    const removeRule = (index: number) => {
        setForm((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
    };

    return { form, updateField, updateRule, addRule, removeRule };
};

// ── Create Coach Modal ───────────────────────────────────────────────────────

const CreateCoachModal = ({ onClose }: { onClose: () => void }) => {
    const [createCoach, { isLoading }] = useCreateCoachMutation();
    const { form, updateField, updateRule, addRule, removeRule } = useCoachForm(initialFormState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.tagline.trim() || !form.system_prompt.trim()) {
            toast.error("Name, tagline, and system prompt are required.");
            return;
        }

        try {
            await createCoach({
                name: form.name.trim(),
                tagline: form.tagline.trim(),
                icon: form.icon,
                accent_color: form.accent_color,
                system_prompt: form.system_prompt.trim(),
                rules: form.rules.map((rule) => rule.trim()).filter(Boolean),
                temperature: form.temperature,
                is_active: form.is_active,
                sort_order: form.sort_order,
            }).unwrap();

            toast.success("Coach created successfully.");
            onClose();
        } catch {
            toast.error("Failed to create coach.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-amber-400">Create Coach</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <CoachFormFields
                        form={form}
                        updateField={updateField}
                        updateRule={updateRule}
                        addRule={addRule}
                        removeRule={removeRule}
                    />

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating..." : "Create Coach"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Edit Coach Modal ─────────────────────────────────────────────────────────

const EditCoachModal = ({ coach, onClose }: { coach: Coach; onClose: () => void }) => {
    const [updateCoach, { isLoading }] = useUpdateCoachMutation();
    const { form, updateField, updateRule, addRule, removeRule } = useCoachForm(coachToFormState(coach));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.tagline.trim() || !form.system_prompt.trim()) {
            toast.error("Name, tagline, and system prompt are required.");
            return;
        }

        try {
            await updateCoach({
                coachId: coach.id,
                coachData: {
                    name: form.name.trim(),
                    tagline: form.tagline.trim(),
                    icon: form.icon,
                    accent_color: form.accent_color,
                    system_prompt: form.system_prompt.trim(),
                    rules: form.rules.map((rule) => rule.trim()).filter(Boolean),
                    temperature: form.temperature,
                    is_active: form.is_active,
                    sort_order: form.sort_order,
                },
            }).unwrap();

            toast.success("Coach updated successfully.");
            onClose();
        } catch {
            toast.error("Failed to update coach.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-amber-400">Edit Coach</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-gray-500" strokeWidth={2} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <CoachFormFields
                        form={form}
                        updateField={updateField}
                        updateRule={updateRule}
                        addRule={addRule}
                        removeRule={removeRule}
                    />

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function Coaches() {
    const { data, isLoading, isError, error } = useGetCoachListQuery();
    const [deleteCoach, { isLoading: isDeleting }] = useDeleteCoachMutation();

    const [search, setSearch] = useState("");
    const [viewingCoachId, setViewingCoachId] = useState<string | null>(null);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const coaches: Coach[] = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => a.sort_order - b.sort_order);
    }, [data]);

    const filtered = coaches.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = async (coach: Coach) => {
        const result = await Swal.fire({
            title: `Delete ${coach.name}?`,
            text: "This coach persona will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "Yes, delete",
        });

        if (!result.isConfirmed) return;

        setPendingDeleteId(coach.id);
        try {
            await deleteCoach(coach.id).unwrap();
            toast.success("Coach deleted successfully.");
        } catch {
            toast.error("Failed to delete coach.");
        } finally {
            setPendingDeleteId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-400">Coaches</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your AI coach personas.</p>
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
                        placeholder="Search coaches..."
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
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-amber-400 hover:bg-amber-500 rounded-full shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Add Coach
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-400 text-xs font-medium text-white">
                            <th className="text-left px-5 py-3 font-medium">Coach</th>
                            <th className="text-left px-5 py-3 font-medium">Tagline</th>
                            <th className="text-left px-5 py-3 font-medium">Status</th>
                            <th className="text-left px-5 py-3 font-medium">Temperature</th>
                            <th className="text-left px-5 py-3 font-medium">Sort Order</th>
                            <th className="text-left px-5 py-3 font-medium">Created</th>
                            <th className="text-left px-5 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                                    Loading coaches...
                                </td>
                            </tr>
                        )}

                        {isError && !isLoading && (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-red-500">
                                    Failed to load coaches. {error && typeof error === "object" && "status" in error
                                        ? `(Error ${(error as { status: unknown }).status})`
                                        : ""}
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                                    No coaches found.
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            !isError &&
                            filtered.map((coach) => (
                                <tr key={coach.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Coach */}
                                    <td className="px-5 py-5">
                                        <button
                                            onClick={() => setViewingCoachId(coach.id)}
                                            className="flex items-center gap-3 text-left"
                                        >
                                            <CoachIcon icon={coach.icon} color={coach.accent_color} />
                                            <span className="font-medium text-amber-400 hover:underline">{coach.name}</span>
                                        </button>
                                    </td>

                                    {/* Tagline */}
                                    <td className="px-5 py-5 text-gray-500 max-w-xs truncate">{coach.tagline}</td>

                                    {/* Status */}
                                    <td className="px-5 py-5">
                                        <StatusBadge isActive={coach.is_active} />
                                    </td>

                                    {/* Temperature */}
                                    <td className="px-5 py-5 text-gray-700">{coach.temperature}</td>

                                    {/* Sort Order */}
                                    <td className="px-5 py-5 text-gray-700">{coach.sort_order}</td>

                                    {/* Created */}
                                    <td className="px-5 py-5 text-gray-500 whitespace-nowrap">{formatCreated(coach.created_at)}</td>

                                    {/* Action */}
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-2">
                                            <ViewButton onClick={() => setViewingCoachId(coach.id)} />
                                            <EditButton onClick={() => setEditingCoach(coach)} />
                                            <DeleteButton
                                                onClick={() => handleDelete(coach)}
                                                isLoading={isDeleting && pendingDeleteId === coach.id}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {viewingCoachId && (
                <CoachDetailModal coachId={viewingCoachId} onClose={() => setViewingCoachId(null)} />
            )}

            {editingCoach && (
                <EditCoachModal coach={editingCoach} onClose={() => setEditingCoach(null)} />
            )}

            {isCreating && <CreateCoachModal onClose={() => setIsCreating(false)} />}
        </div>
    );
}