import React from "react";
import { cn } from "@/lib/utils";

const badgeConfigs = {
  // Existing configs
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  },
  published: {
    label: "Published",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500 animate-pulse",
  },
  archived: {
    label: "Archived",
    className: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  easy: {
    label: "Easy",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  hard: {
    label: "Hard",
    className: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },

  // Question Management Specific Configs
  valid: {
    label: "Valid",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ready_to_push: {
    label: "Ready",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500 animate-pulse",
  },
  pushed: {
    label: "Pushed",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  missing: {
    label: "Missing",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  error: {
    label: "Error",
    className: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  duplicate: {
    label: "Duplicate",
    className: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  duplicate_in_staging: {
    label: "Dup. in Staging",
    className: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  already_in_main_db: {
    label: "In Main DB",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-500",
  },
};

export function StatusBadge({ value, className, showDot = true }) {
  const config = badgeConfigs[value];
  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200",
          className,
        )}
      >
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
        {value || "Unknown"}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      )}
      {config.label}
    </span>
  );
}
