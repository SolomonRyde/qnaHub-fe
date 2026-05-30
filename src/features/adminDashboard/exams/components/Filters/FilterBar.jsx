import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { cn } from "../../../../../lib/utils";

export function FilterBar({ filters, onFilterChange, onClear, activeCount }) {
  const filterOptions = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ],
    },
    {
      key: "difficulty",
      label: "Difficulty",
      options: [
        { value: "easy", label: "Easy" },
        { value: "intermediate", label: "Intermediate" },
        { value: "hard", label: "Hard" },
      ],
    },
  ];

  console.log(filters.difficulty);

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8">
            <X className="w-4 h-4 mr-1" /> Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <div key={filter.key} className="relative">
            <select
              value={filters[filter.key] || ""}
              onChange={(e) =>
                onFilterChange(filter.key, e.target.value || null)
              }
              className={cn(
                "appearance-none pl-3 pr-8 py-2 text-sm bg-background border border-border rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-primary/50 transition-colors",
              )}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
