import { memo } from "react";
import { SectionCard } from "./SectionCard";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "../../../../lib/utils";

export const InstructionsSection = memo(({ instructions }) => {
  const warnCount = instructions.filter((i) => i.type === "warning").length;
  return (
    <SectionCard
      icon={
        <AlertCircle className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />
      }
      title="Exam Instructions"
      subtitle="Read before you start"
    >
      {/* Warning banner */}
      {warnCount > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4
                        bg-amber-50 border border-amber-200
                        dark:bg-amber-500/8 dark:border-amber-500/20"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            {warnCount} important warning{warnCount !== 1 ? "s" : ""} below —
            read carefully before starting.
          </p>
        </div>
      )}

      <ol className="space-y-2" role="list">
        {instructions.map((item, i) => {
          const Icon = item.icon;
          const warn = item.type === "warning";
          return (
            <li
              key={i}
              style={{
                boxShadow: warn
                  ? "inset 3px 0 0 0 rgb(245 158 11 / 0.65)"
                  : "inset 3px 0 0 0 hsl(var(--primary) / 0.35)",
              }}
              className={cn(
                "flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-colors",
                warn
                  ? "bg-amber-50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/18 hover:bg-amber-50/80"
                  : "bg-muted/40 border-border hover:bg-muted/70",
              )}
            >
              {/* Icon badge */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5",
                  warn ? "bg-amber-100 dark:bg-amber-500/15" : "bg-primary/10",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    warn
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-primary",
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold leading-snug mb-0.5",
                    warn
                      ? "text-amber-800 dark:text-amber-200"
                      : "text-foreground",
                  )}
                >
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <span className="flex-shrink-0 text-[10px] text-muted-foreground/35 font-mono tabular-nums select-none mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
});
InstructionsSection.displayName = "InstructionsSection";
