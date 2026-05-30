import { memo } from "react";
import { DIFFICULTY_CONFIG } from "../../constants/Difficluty.constants";
import { cn } from "../../../../lib/utils";

export const DifficultyPill = memo(({ level }) => {
  const cfg = DIFFICULTY_CONFIG[level] || DIFFICULTY_CONFIG.intermediate;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
        cfg.pill,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
});
DifficultyPill.displayName = "DifficultyPill";
