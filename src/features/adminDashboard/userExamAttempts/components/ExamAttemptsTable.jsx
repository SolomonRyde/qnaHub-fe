import { Eye, Clock } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { StatusBadge } from "../../../../components/ui/StatusBadge"; // Adjust path as needed

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ResultBadge({ status, passed }) {
  if (status !== "submitted") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const config = passed
    ? {
        className:
          "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        icon: "✓",
        label: "Passed",
      }
    : {
        className:
          "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
        icon: "✕",
        label: "Failed",
      };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.icon} {config.label}
    </span>
  );
}

export function ExamAttemptsTable({
  attempts,
  isFetching,
  isLoading,
  pageSize,
  onViewAttempt,
}) {
  if (isFetching && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={8} className="px-4 py-3">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="text-center py-16">
          <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No attempts found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Percentage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{a.user_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.user_email}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{a.exam_title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {a.difficulty}
                  </p>
                </td>
                <td className="px-4 py-3 text-foreground">
                  {a.status === "submitted"
                    ? `${a.score}/${a.total_marks}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {a.status === "submitted"
                    ? `${Number(a.percentage).toFixed(2)}%`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={a.status} />
                </td>
                <td className="px-4 py-3">
                  <ResultBadge status={a.status} passed={a.passed} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(a.end_time || a.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={a.status !== "submitted"}
                    onClick={() => onViewAttempt(a.id)}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
