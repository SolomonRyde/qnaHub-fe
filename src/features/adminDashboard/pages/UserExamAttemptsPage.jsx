import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PaginationControls } from "../../../components/ui/PaginationControls";
import { useDebounce } from "../exams/hooks/useDebounce";
import { useAdminExamAttempts } from "../userExamAttempts/hooks/useAdminExamAttempts";
import { AttemptDetailModal } from "../userExamAttempts/components/AttemptDetailModal";
import { ExamAttemptsStats } from "../userExamAttempts/components/ExamAttemptsStats";
import { ExamAttemptsFilters } from "../userExamAttempts/components/ExamAttemptsFilters";
import { ExamAttemptsTable } from "../userExamAttempts/components/ExamAttemptsTable";
import { exportAdminExamAttempts } from "../../../services/apiExams";
import { toast } from "react-hot-toast";

export default function UserExamAttemptsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [passed, setPassed] = useState("");
  const [sort, setSort] = useState("created_at:desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);

  // New Date State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Export Loading State
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, passed, sort, startDate, endDate]);

  const { data, isLoading, isFetching, error } = useAdminExamAttempts({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: status || undefined,
    passed: passed || undefined,
    sort,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAdminExamAttempts({
        search: debouncedSearch || undefined,
        status: status || undefined,
        passed: passed || undefined,
        sort,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      toast.success("Exam attempts exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export exam attempts");
    } finally {
      setIsExporting(false);
    }
  };

  const attempts = data?.data || [];
  const stats = data?.stats || {};
  const pagination = data?.pagination;

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading attempts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to load exam attempts
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 backdrop-blur">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">Exam Attempts</h1>
          <p className="text-muted-foreground mt-1">
            Every user's exam attempt, score, and result in one place
          </p>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Stat cards */}
        <ExamAttemptsStats stats={stats} />

        {/* Combined Filters & Export */}
        <ExamAttemptsFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          passed={passed}
          setPassed={setPassed}
          sort={sort}
          setSort={setSort}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleExport={handleExport}
          isExporting={isExporting}
          attempts={attempts}
        />

        {/* Table */}
        <ExamAttemptsTable
          attempts={attempts}
          isFetching={isFetching}
          isLoading={isLoading}
          pageSize={pageSize}
          onViewAttempt={setSelectedAttemptId}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} attempts
            </p>
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      <AttemptDetailModal
        attemptId={selectedAttemptId}
        open={!!selectedAttemptId}
        onOpenChange={(open) => !open && setSelectedAttemptId(null)}
      />
    </div>
  );
}
