import React, { useMemo } from "react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "../../../../../lib/utils";

// Sub-components
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyState } from "./EmptyState";

export function AdminExamTable({
  exams = [],
  isLoading = false,
  sortBy = { field: "created_at", direction: "desc" },
  onSort,
  onToggle,
  selectAll,
  clearAll,
  onStatusChange,
  onFeaturedToggle,
  onDelete,
  onPreview,
  onEdit,
}) {
  // Sort exams client-side for demo (backend should handle this in production)
  const sortedExams = useMemo(() => {
    if (!exams.length) return exams;

    const sorted = [...exams];
    const { field, direction } = sortBy;

    sorted.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle nested fields
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        aValue = a[parent]?.[child];
        bValue = b[parent]?.[child];
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [exams, sortBy]);

  if (isLoading && exams.length === 0) {
    return <TableSkeleton rows={5} />;
  }

  if (!exams.length) {
    return <EmptyState />;
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader sortBy={sortBy} onSort={onSort} />
          <tbody className="divide-y divide-border">
            {sortedExams.map((exam) => (
              <TableRow
                key={exam.id}
                exam={exam}
                onToggle={() => onToggle(exam.id)}
                onStatusChange={onStatusChange}
                onFeaturedToggle={onFeaturedToggle}
                onDelete={onDelete}
                onPreview={onPreview}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
