import React from "react";
import { cn } from "../../lib/utils";

export function SummaryPill({ label, value, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-semibold",
        className,
      )}
    >
      {label}: {value}
    </div>
  );
}
