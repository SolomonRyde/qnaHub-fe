import { Award, CheckCircle2, ListChecks, XCircle } from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";

export function ExamAttemptsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Attempts"
        value={stats.totalAttempts ?? 0}
        icon={ListChecks}
        variant="info"
        trend={`${stats.inProgressCount ?? 0} in progress`}
      />
      <StatCard
        title="Passed"
        value={stats.passedCount ?? 0}
        icon={CheckCircle2}
        variant="success"
        trend="Submitted & passed"
      />
      <StatCard
        title="Failed"
        value={stats.failedCount ?? 0}
        icon={XCircle}
        variant="danger"
        trend="Submitted & failed"
      />
      <StatCard
        title="Average Score"
        value={`${stats.avgPercentage ?? 0}%`}
        icon={Award}
        variant="warning"
        trend="Across submitted attempts"
      />
    </div>
  );
}
