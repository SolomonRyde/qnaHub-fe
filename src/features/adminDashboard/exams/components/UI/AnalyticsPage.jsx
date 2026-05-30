import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Users,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { cn } from "../../../../../lib/utils";
import { useExamFilters } from "../../hooks/useExamFilters";
import { FilterBar } from "../Filters/FilterBar";
import {
  getExamAnalytics,
  getAdminExams,
} from "../../../../../services/apiExams";

// Reusable stat card component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "primary",
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    info: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              )}
              <span
                className={
                  trend === "up" ? "text-emerald-600" : "text-rose-600"
                }
              >
                {trendValue}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Simple bar chart component (CSS-based, no external library)
function SimpleBarChart({ data, labels, title }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels[idx]}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Status distribution chart
function StatusDistributionChart({ exams }) {
  const distribution = useMemo(() => {
    const counts = { draft: 0, published: 0, archived: 0 };
    exams.forEach((exam) => {
      if (counts[exam.status] !== undefined) {
        counts[exam.status]++;
      }
    });
    return counts;
  }, [exams]);

  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Status Distribution
      </h3>
      <div className="flex items-end justify-center gap-8 h-48">
        {Object.entries(distribution).map(([status, count]) => {
          const height = (count / total) * 100;
          const colors = {
            draft: "bg-gray-400",
            published: "bg-emerald-500",
            archived: "bg-rose-500",
          };
          return (
            <div key={status} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-16 rounded-t-lg transition-all duration-500",
                  colors[status],
                )}
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${count} exams`}
              />
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {status}
              </span>
              <span className="text-sm font-bold text-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Difficulty distribution
function DifficultyChart({ exams }) {
  const distribution = useMemo(() => {
    const counts = { easy: 0, intermediate: 0, hard: 0 };
    exams.forEach((exam) => {
      if (counts[exam.difficulty] !== undefined) {
        counts[exam.difficulty]++;
      }
    });
    return counts;
  }, [exams]);

  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Difficulty Levels
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(distribution).map(([level, count]) => {
          const percent = Math.round((count / total) * 100);
          const colors = {
            easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
            intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
            hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30",
          };
          return (
            <div
              key={level}
              className={cn("p-4 rounded-lg text-center", colors[level])}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm font-medium capitalize">{level}</p>
              <p className="text-xs opacity-75">{percent}% of total</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsPage({ onBack }) {
  const { filters, updateFilter, clearFilters, activeFilterCount } =
    useExamFilters();

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["exam-analytics", filters.industry],
    queryFn: () => getExamAnalytics(filters.industry || null),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch exams for distribution charts
  const { data: examsData, isLoading: examsLoading } = useQuery({
    queryKey: ["admin-exams-analytics", filters],
    queryFn: () =>
      getAdminExams({
        page: 1,
        limit: 100, // Fetch enough for charts
        status: filters.status || undefined,
        difficulty: filters.difficulty || undefined,
        industry: filters.industry || undefined,
        category: filters.category || undefined,
      }),
    staleTime: 2 * 60 * 1000,
  });

  const exams = examsData?.data || [];
  const analytics = analyticsData || {};

  // Prepare bar chart data for industries (if available)
  const industryData = useMemo(() => {
    // This would ideally come from a dedicated endpoint
    // For now, we'll mock based on exam data
    const industryCounts = {};
    exams.forEach((exam) => {
      const name = exam.industry_name || "Unknown";
      industryCounts[name] = (industryCounts[name] || 0) + 1;
    });
    return Object.entries(industryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [exams]);

  if (analyticsLoading || examsLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                title="Back to exams"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Exam Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Insights and metrics for your exam content
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          activeCount={activeFilterCount}
        />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Exams"
            value={analytics.total_exams || 0}
            icon={BarChart3}
            trend="up"
            trendValue="+12%"
            color="primary"
          />
          <StatCard
            title="Published"
            value={analytics.published_count || 0}
            icon={TrendingUp}
            trend="up"
            trendValue="+8%"
            color="success"
          />
          <StatCard
            title="Featured"
            value={analytics.featured_count || 0}
            icon={Award}
            color="warning"
          />
          <StatCard
            title="Avg. Duration"
            value={`${Math.round(analytics.avg_duration || 0)} min`}
            icon={Clock}
            color="info"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDistributionChart exams={exams} />
          <DifficultyChart exams={exams} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Industry Distribution */}
          <SimpleBarChart
            data={industryData.map((d) => ({ value: d.value }))}
            labels={industryData.map((d) => d.name)}
            title="Top Industries by Exam Count"
          />

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">
                  Avg. Questions per Exam
                </span>
                <span className="font-semibold text-foreground">
                  {Math.round(analytics.avg_questions || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Publish Rate</span>
                <span className="font-semibold text-emerald-600">
                  {analytics.total_exams
                    ? Math.round(
                        (analytics.published_count / analytics.total_exams) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Featured Rate</span>
                <span className="font-semibold text-amber-600">
                  {analytics.total_exams
                    ? Math.round(
                        (analytics.featured_count / analytics.total_exams) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-semibold text-foreground">
                  {(analytics.avg_questions || 0) *
                    (analytics.total_exams || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Exams
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exams.slice(0, 5).map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {exam.exam_title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exam.industry_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          exam.status === "published" &&
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
                          exam.status === "draft" &&
                            "bg-gray-100 text-gray-700 dark:bg-gray-800",
                          exam.status === "archived" &&
                            "bg-rose-100 text-rose-700 dark:bg-rose-900/30",
                        )}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize text-muted-foreground">
                        {exam.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {exam.created_at
                        ? new Date(exam.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
