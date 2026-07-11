import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Award,
  BookOpen,
  Play,
  Trophy,
  ChevronRight,
  TrendingUp,
  Flame,
  Sparkles,
  CalendarClock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Settings,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
// ✅ 1. Import Pagination Component
import { PaginationControls } from "../../../components/ui/PaginationControls";

import { useAuth } from "../../../context/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { getMyExamAttempts } from "../../../services/apiExams";

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeAttempt = (a) => {
  const totalMarks = Number(a.total_marks) || 0;
  const scoreObtained = Number(a.score) || 0;
  const percentage =
    a.percentage != null
      ? Math.round(Number(a.percentage))
      : totalMarks > 0
        ? Math.round((scoreObtained / totalMarks) * 100)
        : 0;
  const passed = a.passed === 1 || a.passed === true;

  return {
    id: a.id,
    examId: a.exam_id,
    examTitle: a.exam_title || "Untitled Exam",
    slug: a.slug || null,
    percentage,
    scoreObtained,
    totalMarks,
    passed,
    attemptedAt: a.end_time || a.start_time || null,
  };
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const initialsOf = (name) =>
  (name || "U")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─── Progress ring ──────────────────────────────────────────────────────────

function ProgressRing({ percentage = 0, size = 108, strokeWidth = 9 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-muted-foreground/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground leading-none">
          {clamped}%
        </span>
        <span className="text-[10px] text-muted-foreground mt-1">
          pass rate
        </span>
      </div>
    </div>
  );
}

// ─── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, gradient, iconClass }) {
  return (
    <Card
      className={`relative overflow-hidden border-white/10 bg-gradient-to-br ${gradient} transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <CardContent className="p-5 relative">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-3xl font-extrabold text-foreground leading-none tabular-nums">
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-2">{label}</div>
      </CardContent>
    </Card>
  );
}

// ─── Recent attempt row ─────────────────────────────────────────────────────

function AttemptRow({ attempt, onClick }) {
  const {
    examTitle,
    percentage,
    passed,
    attemptedAt,
    scoreObtained,
    totalMarks,
  } = attempt;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left group"
    >
      <div
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
          passed
            ? "bg-emerald-500/15 text-emerald-600"
            : "bg-red-500/15 text-red-600"
        }`}
      >
        {passed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {examTitle}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <CalendarClock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDate(attemptedAt)}
          </span>
          {totalMarks > 0 && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {scoreObtained}/{totalMarks} marks
              </span>
            </>
          )}
        </div>
        {/* mini score bar */}
        <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              passed ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.max(4, Math.min(100, percentage))}%` }}
          />
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-lg font-bold tabular-nums text-foreground">
          {percentage}%
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

// ─── Skeleton for the attempts list while loading ──────────────────────────

function AttemptRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-muted rounded" />
        <div className="h-2.5 w-1/2 bg-muted rounded" />
        <div className="h-1.5 w-full bg-muted rounded-full" />
      </div>
      <div className="h-5 w-10 bg-muted rounded" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ 2. Add Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [attemptsError, setAttemptsError] = useState(null);

  // Store total count separately for accurate stats across pages
  const [totalAttemptsCount, setTotalAttemptsCount] = useState(0);

  // ✅ 3. Update fetch to accept page number
  const fetchAttempts = useCallback(async (page = 1) => {
    setAttemptsLoading(true);
    setAttemptsError(null);
    try {
      const res = await getMyExamAttempts({ limit: ITEMS_PER_PAGE, page });

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      setAttempts(list.map(normalizeAttempt));

      // Update pagination metadata
      if (res?.meta) {
        setTotalAttemptsCount(res.meta.total || 0);
        setTotalPages(res.meta.totalPages || 1);
      } else {
        // Fallback if meta is missing
        setTotalAttemptsCount(list.length);
        setTotalPages(1);
      }

      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load exam attempts:", err);
      setAttemptsError(
        err.message || "Couldn't load your exam history. Please try again.",
      );
    } finally {
      setAttemptsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttempts(1);
  }, [fetchAttempts]);

  // ✅ 4. Update Stats Calculation
  // We use totalAttemptsCount from server for "Total Attempts"
  // We calculate Pass Rate based on ALL attempts if possible, or just current page if API doesn't provide aggregate stats.
  // Note: Ideally, your backend should return aggregate stats (totalPassed, avgScore) in the meta object.
  // For now, we'll estimate or use the total count.
  const stats = useMemo(() => {
    // Use server-side total count for the main stat
    const total = totalAttemptsCount;

    // Calculate stats based on currently loaded attempts (or all if you store them all)
    // Note: If you want accurate Avg/Best across ALL pages, the backend should send these in 'meta'.
    // Here we calculate based on the visible page for demonstration, but Total is accurate.
    const passedInPage = attempts.filter((a) => a.passed).length;

    // Simple estimation for display purposes if backend doesn't send aggregates
    const avgScore =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.percentage, 0) /
              attempts.length,
          )
        : 0;

    const bestScore =
      attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;

    // Note: This passRate is only accurate for the current page unless backend sends totalPassed
    const passRate =
      attempts.length > 0
        ? Math.round((passedInPage / attempts.length) * 100)
        : 0;

    return {
      total,
      passed: passedInPage, // Displaying passed from current view for consistency with list
      passRate,
      avgScore,
      bestScore,
    };
  }, [attempts, totalAttemptsCount]);

  const initials = initialsOf(user?.name);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleStartExam = () => navigate("/exams");
  const handleViewResults = () => navigate("/results");
  const handleViewCertificates = () => navigate("/certificates");
  const handleOpenSettings = () => navigate("/settings");
  const handleAdminDashboard = () => navigate("/dashboard-admin");

  const handleViewAttempt = (attempt) => {
    if (!attempt.slug) {
      navigate("/results", { state: { attemptId: attempt.id } });
      return;
    }
    navigate(`/exam/${attempt.slug}/result`, {
      state: { attemptId: attempt.id },
    });
  };

  const quickActions = [
    {
      label: "Start Exam",
      icon: Play,
      onClick: handleStartExam,
      iconClass: "bg-primary/15 text-primary",
    },
    {
      label: "Results",
      icon: Trophy,
      onClick: handleViewResults,
      iconClass: "bg-amber-500/15 text-amber-600",
    },
    {
      label: "Certificates",
      icon: Award,
      onClick: handleViewCertificates,
      iconClass: "bg-violet-500/15 text-violet-600",
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: handleOpenSettings,
      iconClass: "bg-slate-500/15 text-slate-600",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Decorative background mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl opacity-40" />
      </div>

      <DashboardNavbar />

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero / profile card */}
        <Card className="mb-6 overflow-hidden border-white/10 bg-gradient-to-br from-primary/10 via-background to-violet-500/10 backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-violet-500 blur-md opacity-60" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-primary-foreground text-xl sm:text-2xl font-bold ring-4 ring-background">
                    {initials}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold">
                      Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
                    </h1>
                    {user?.role && (
                      <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Ready to continue your learning journey 🚀
                  </p>
                </div>
              </div>

              {user?.role === "admin" && (
                <Button
                  variant="default"
                  onClick={handleAdminDashboard}
                  className="gap-2 shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7 pt-6 border-t border-border/60">
              {[
                { label: "Name", value: user?.name || "—" },
                { label: "Email", value: user?.email || "—" },
                { label: "Phone", value: user?.phone_number || "—" },
                { label: "Role", value: user?.role || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                    {label}
                  </div>
                  <div className="text-sm font-medium text-foreground truncate mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={BookOpen}
            label="Total Attempts"
            value={stats.total}
            gradient="from-blue-500/10 to-transparent"
            iconClass="bg-blue-500/15 text-blue-600"
          />
          <StatCard
            icon={Trophy}
            label="Exams Passed"
            value={stats.passed}
            gradient="from-emerald-500/10 to-transparent"
            iconClass="bg-emerald-500/15 text-emerald-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Score"
            value={`${stats.avgScore}%`}
            gradient="from-violet-500/10 to-transparent"
            iconClass="bg-violet-500/15 text-violet-600"
          />
          <StatCard
            icon={Flame}
            label="Best Score"
            value={`${stats.bestScore}%`}
            gradient="from-amber-500/10 to-transparent"
            iconClass="bg-amber-500/15 text-amber-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Pass-rate ring */}
          <Card className="lg:col-span-1 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-primary" />
                Performance
              </CardTitle>
              <CardDescription>Based on your recent attempts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-8">
              <ProgressRing percentage={stats.passRate} />
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div>
                  <div className="text-lg font-bold tabular-nums">
                    {stats.passed}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Passed
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold tabular-nums">
                    {Math.max(stats.total - stats.passed, 0)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Not passed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent attempts */}
          <Card className="lg:col-span-2 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Recent Attempts</CardTitle>
                <CardDescription>Your latest exam activity</CardDescription>
              </div>
              {/* View All button removed as we now have pagination inline */}
            </CardHeader>
            <CardContent className="pt-0">
              {attemptsLoading && (
                <div className="divide-y divide-border/60">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <AttemptRowSkeleton key={i} />
                  ))}
                </div>
              )}

              {!attemptsLoading && attemptsError && (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground mb-3">
                    {attemptsError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAttempts(currentPage)}
                    className="gap-2"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Try again
                  </Button>
                </div>
              )}

              {!attemptsLoading && !attemptsError && attempts.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No exams attempted yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Take your first exam to see your results here.
                  </p>
                  <Button onClick={handleStartExam} size="sm" className="gap-2">
                    <Play className="w-3.5 h-3.5" />
                    Start an exam
                  </Button>
                </div>
              )}

              {!attemptsLoading && !attemptsError && attempts.length > 0 && (
                <>
                  <div className="divide-y divide-border/60">
                    {attempts.map((attempt) => (
                      <AttemptRow
                        key={attempt.id}
                        attempt={attempt}
                        onClick={() => handleViewAttempt(attempt)}
                      />
                    ))}
                  </div>

                  {/* ✅ 5. Add Pagination Controls */}
                  <div className="mt-6 flex justify-center border-t border-border/60 pt-4">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(newPage) => fetchAttempts(newPage)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="mb-6 border-white/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate easily</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ label, icon: Icon, onClick, iconClass }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-colors text-left"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} • Keep learning 🚀
        </p>
      </main>
    </div>
  );
}
