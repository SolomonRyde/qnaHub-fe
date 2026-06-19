import { useMemo } from "react";
import {
  getStatusClasses,
  getUserDisplayStatus,
} from "../../../../lib/userStatus";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

export function StatsCard({ title, value, icon: Icon, iconColor }) {
  const iconBg = {
    primary: "bg-primary/10 text-primary",
    success:
      "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    danger: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    warning:
      "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  };

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl p-4">
      <div className="flex gap-4 items-center mb-4">
        <div
          className={cn(
            "p-3 rounded-full",
            iconBg[iconColor] || iconBg.primary,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <h3 className="text-3xl font-bold text-foreground">{value}</h3>
    </Card>
  );
}
