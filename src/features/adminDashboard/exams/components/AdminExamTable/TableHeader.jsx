import React from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { cn } from "../../../../../lib/utils";

const columns = [
  { key: "exam", label: "Exam", sortable: true, className: "w-1/3" },
  { key: "heirarchy", label: "Heirarchy", sortable: true, className: "w-1/6" },
  { key: "difficulty", label: "Difficulty", sortable: true, className: "w-24" },
  { key: "status", label: "Status", sortable: true, className: "w-28" },
  { key: "is_featured", label: "Featured", sortable: true, className: "w-20" },
  { key: "actions", label: "", sortable: false, className: "w-20" },
];

export function TableHeader({ sortBy, onSort }) {
  const handleSort = (key) => {
    if (!onSort) return;
    onSort(key);
  };

  return (
    <thead className="bg-muted/50 sticky top-0 z-10">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={cn(
              "px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", // ✅ px-4→px-5, py-3→py-3.5
              col.className,
              col.sortable &&
                "cursor-pointer hover:text-foreground transition-colors",
            )}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            <div className="flex items-center gap-1">
              {col.label}
              {col.sortable && (
                <span className="inline-flex flex-col">
                  <ChevronUp
                    className={cn(
                      "w-3 h-3 -mb-1",
                      sortBy.field === col.key && sortBy.direction === "asc"
                        ? "text-primary"
                        : "text-muted-foreground/50",
                    )}
                  />
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 -mt-1",
                      sortBy.field === col.key && sortBy.direction === "desc"
                        ? "text-primary"
                        : "text-muted-foreground/50",
                    )}
                  />
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
