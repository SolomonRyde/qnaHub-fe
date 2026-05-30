import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";
import { useAdminExams, useExamAnalytics } from "../../exams/hooks/useExams";
import { AdminExamTable } from "../exams/components/AdminExamTable/AdminTable";
import { EmptyState } from "../exams/components/AdminExamTable/EmptyState";
import { FilterBar } from "../exams/components/Filters/FilterBar";
import { ConfirmModal } from "../exams/components/UI/ConfirmModel";
import { CreateExamModal } from "../exams/components/UI/CreateExamModel";
import { EditExamModal } from "../exams/components/UI/EditExamModel";
import { useDebounce } from "../exams/hooks/useDebounce";
import { useExamFilters } from "../exams/hooks/useExamFilters";
import { useExamMutations } from "../exams/hooks/useExamMutations";

import { Link } from "react-router-dom";
import { Pagination } from "../exams/components/UI/Pagination";
import { StatCard } from "../../../components/ui/StatCard";

const AdminExamsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({
    field: "created_at",
    direction: "desc",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ✅ Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounce(search, 300);
  const { filters, updateFilter, clearFilters, activeFilterCount } =
    useExamFilters();

  console.log("OVR_VIW :", filters.difficulty);

  const { data, isLoading, error } = useAdminExams({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: filters.status || undefined,
    difficulty: filters.difficulty || undefined,
    industry: filters.industry || undefined,
    category: filters.category || undefined,
    sort: `${sortBy.field}:${sortBy.direction}`,
  });

  const {
    updateStatus,
    remove,

    create,
    updateExam: updateExamMut,
    toggleFeatured,
  } = useExamMutations();

  const exams = data?.data || [];

  const handleSort = useCallback((field) => {
    setSortBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, sortBy]);

  // Handler for page changes
  const handlePageChange = useCallback(
    (page, newPageSize) => {
      setCurrentPage(page);
      if (newPageSize && newPageSize !== pageSize) {
        setPageSize(newPageSize);
      }
      // Scroll to top of table
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pageSize],
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await remove.mutateAsync(id);
        setConfirmDelete(null);
      } catch {
        toast.error("Failed to delete exam");
      }
    },
    [remove],
  );

  // ✅ Modal handlers
  const handleCreateClick = useCallback(() => setShowCreateModal(true), []);

  const handleEditClick = useCallback((exam) => {
    setEditingExam(exam);
    setShowEditModal(true);
  }, []);

  const handleModalSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-exams"], exact: false });
  }, [queryClient]);

  const { data: analytics } = useExamAnalytics();

  const stats = useMemo(() => {
    return {
      total: analytics?.data?.total_exams || 0,
      published: analytics?.data?.published_count || 0,
      featured: analytics?.data?.featured_count || 0,
      draft: analytics?.data?.draft_count || 0,
    };
  }, [analytics]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to load exams
          </h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["admin-exams"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className=" bg-background/95 backdrop-blur ">
        {/* <header className="sticky top-0 z-40 bg-background/95 backdrop-blur "> */}
        <div className="px-6 py-6">
          {" "}
          {/* <div className="max-w-7xl mx-auto px-6 py-6"> */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Exam Management
              </h1>

              <p className="text-muted-foreground mt-1">
                Manage, publish, and feature your exam content
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard-admin/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button> */}

              <Button size="sm" onClick={handleCreateClick}>
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* <main className="max-w-7xl mx-auto px-4 py-6 space-y-6"> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Exams"
            value={stats.total}
            icon={FileText}
            variant="info"
            trend="+12% from last month"
          />

          <StatCard
            title="Published"
            value={stats.published}
            icon={CheckCircle2}
            variant="success"
            trend="Live to users"
          />

          <StatCard
            title="Featured"
            value={stats.featured}
            icon={Star}
            variant="warning"
            trend="Highlighted on homepage"
          />

          <StatCard
            title="Drafts"
            value={stats.draft}
            icon={Clock}
            variant="neutral"
            trend="Awaiting review"
          />
        </div>

        <div className="space-y-4">
          <FilterBar
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort:
              </span>
              <select
                value={`${sortBy.field}:${sortBy.direction}`}
                onChange={(e) => {
                  const [f, d] = e.target.value.split(":");
                  setSortBy({ field: f, direction: d });
                }}
                className="px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="created_at:desc">Newest First</option>
                <option value="created_at:asc">Oldest First</option>
                <option value="exam_title:asc">Title A-Z</option>
                <option value="exam_title:desc">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <AdminExamTable
          exams={exams}
          isLoading={isLoading}
          sortBy={sortBy}
          onSort={handleSort}
          onStatusChange={(id, status) =>
            updateStatus.mutateAsync({ id, status })
          }
          onDelete={(id) => setConfirmDelete(id)}
          onPreview={(slug) => window.open(`/exam/${slug}`, "_blank")}
          onEdit={handleEditClick} // ✅ Opens edit modal
        />

        {!isLoading && exams.length === 0 && (
          <EmptyState search={search} onClearFilters={clearFilters} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={data?.pagination?.totalPages || 1}
          totalItems={data?.pagination?.total || 0}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          showPageSizeSelector={true}
        />
      </main>

      {/* ✅ Create Modal */}
      <CreateExamModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleModalSuccess}
        mutation={create}
      />

      {/* ✅ Edit Modal */}
      <EditExamModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        exam={editingExam}
        onSuccess={handleModalSuccess}
        updateMutation={updateExamMut}
        featuredMutation={toggleFeatured}
      />

      {/* Confirmation Modals */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Exam"
        description="This action will permanently delete the exam. This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => handleDelete(confirmDelete)}
        onOpenChange={() => setConfirmDelete(null)}
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default AdminExamsPage;
