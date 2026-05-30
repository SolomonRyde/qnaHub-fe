import { memo } from "react";
import { cn } from "../../../../lib/utils";

// Standard section card — theme-aware
export const SectionCard = memo(
  ({ icon, title, subtitle, children, className }) => (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        "shadow-sm hover:shadow-md transition-shadow duration-300",
        className,
      )}
    >
      <header className="px-6 pt-5 pb-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </header>
      <div className="p-6">{children}</div>
    </section>
  ),
);
SectionCard.displayName = "SectionCard";
