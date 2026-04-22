import { useMemo } from "react";
import {
  getStatusClasses,
  getUserDisplayStatus,
} from "../../../lib/userStatus";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

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

export const RoleBadge = ({ role }) => {
  const variants = {
    ADMIN: "bg-primary/10 text-primary border-primary/20",
    EDITOR: "bg-blue-500/10 text-blue-700 border-blue-200",
    STAFF: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    VIEWER: "bg-secondary text-secondary-foreground border-border",
    USER: "bg-purple-500/10 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[role] || variants.VIEWER,
      )}
    >
      {role}
    </span>
  );
};

export const StatusBadge = ({ user }) => {
  const status = getUserDisplayStatus(user);
  const classes = getStatusClasses(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5  px-2.5 py-0.5 rounded-full text-xs font-medium border",
        classes,
      )}
    >
      {/* <span className="text-xs">{getStatusIcon(status)}</span> */}
      {status}
    </span>
  );
};

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-border bg-card disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-border bg-card"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {pages[0] > 2 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            currentPage === page
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-card hover:bg-accent",
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-border bg-card"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-border bg-card disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
