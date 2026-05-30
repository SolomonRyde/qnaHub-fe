import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export function FeaturedToggle({
  isFeatured,
  onToggle,
  disabled = false,
  examId,
}) {
  const [optimistic, setOptimistic] = useState(isFeatured);

  const handleClick = async () => {
    if (disabled) return;

    // Optimistic update
    setOptimistic(!optimistic);

    try {
      await onToggle(examId, !optimistic);
    } catch (error) {
      // Revert on error
      setOptimistic(optimistic);
      console.error("Failed to toggle featured:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        optimistic
          ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          : "text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-800",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      aria-label={optimistic ? "Remove from featured" : "Add to featured"}
      aria-pressed={optimistic}
    >
      <Star
        className={cn(
          "w-5 h-5 transition-transform duration-200",
          optimistic ? "fill-current scale-110" : "scale-100",
        )}
      />
    </button>
  );
}
