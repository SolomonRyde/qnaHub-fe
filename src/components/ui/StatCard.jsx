import React from "react";
import { cn } from "../../lib/utils";
import { Card } from "./Card";

const iconVariants = {
  primary: "bg-primary/10 text-primary",

  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",

  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",

  danger: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",

  info: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",

  neutral:
    "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "primary",
  trend,
  className,
}) {
  return (
    <Card
      className={cn(
        "border border-border rounded-2xl p-5 shadow-sm",
        "hover:shadow-md transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left content */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h3 className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </h3>

          {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </div>

        {/* Right icon */}
        {Icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
              iconVariants[variant],
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
