import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Database,
  FolderOpen,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Input } from "../../../../../components/ui/Input";
import { Button } from "../../../../../components/ui/Button";
import { Badge } from "../../../../../components/ui/Badge";
import { StatCard } from "../../../../../components/ui/StatCard";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { DeleteConfirmationModal } from "../../../../../components/ui/DeleteConfirmationModal";
import { PaginationControls } from "../../../../../components/ui/PaginationControls";
import { normalizeAnswer, getStagingStatus } from "../../../../../lib/utils";
import { useAuth } from "../../../../../context/AuthContext";

export function StagingTab(props) {
  const {
    stats,
    stagingStatusCounts,
    stagingQuestions,
    isStagingLoading,
    loadStaging,
    validateStagingQuestions,
    openPushPreview,
    stagingSearch,
    setStagingSearch,
    stagingStatus,
    setStagingStatus,
    filteredStagingQuestions,
    deleteStagingQuestion,
    handleDeleteDuplicates,
    handleDeleteAllStaging,
    isDeletingDuplicates,
    isDeletingAll,
    isDeletingByStatus,
    statusToDelete,
    setStatusToDelete,
    handleDeleteByStatus,
    stagingPagination,
    stagingCurrentPage,
    setStagingCurrentPage,
  } = props;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    status: "",
  });
  const isDeleting =
    isDeletingDuplicates || isDeletingAll || isDeletingByStatus;

  const openDeleteModal = (type, id = null, status = "") =>
    setDeleteModal({ isOpen: true, type, id, status });
  const closeDeleteModal = () => {
    if (!isDeleting)
      setDeleteModal({ isOpen: false, type: null, id: null, status: "" });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === "duplicates") handleDeleteDuplicates();
    else if (deleteModal.type === "all") handleDeleteAllStaging();
    else if (deleteModal.type === "byStatus")
      handleDeleteByStatus(deleteModal.status);
    else if (deleteModal.type === "single")
      deleteStagingQuestion(deleteModal.id);
    closeDeleteModal();
  };

  const getModalContent = () => {
    switch (deleteModal.type) {
      case "duplicates":
        return {
          title: "Delete Duplicate Questions",
          message: `This action will permanently delete ${stagingStatusCounts.duplicatesInsideStaging} duplicate questions from staging (questions duplicated within this import).`,
          confirmText: "Delete Duplicates",
          variant: "orange",
        };
      case "all":
        return {
          title: "Delete All Staging Questions",
          message: `⚠️ WARNING: This will permanently delete ALL questions from staging.`,
          confirmText: "Delete All",
          variant: "red",
        };
      case "byStatus":
        return {
          title: `Delete Questions by Status`,
          message: `This will permanently delete all questions with status "${deleteModal.status.replace(/_/g, " ").toUpperCase()}" from staging.`,
          confirmText: "Delete",
          variant: "red",
        };
      case "single":
        return {
          title: "Delete Staging Question",
          message: `This action will permanently delete this question from staging.`,
          confirmText: "Delete",
          variant: "red",
        };
      default:
        return {
          title: "Delete",
          message: "Are you sure?",
          confirmText: "Delete",
          variant: "red",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ UPDATED: StatCards now use accurate backend totals */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Imports"
          value={stats.importBatches}
          icon={FolderOpen}
          variant="neutral"
          trend="All staging imports"
        />
        <StatCard
          title="Total Staging Questions"
          value={stagingStatusCounts.total || stagingQuestions.length}
          icon={Database}
          variant="info"
          trend="All imported questions"
        />
        <StatCard
          title="Distinct"
          value={stagingStatusCounts.readyToPush}
          icon={CheckCircle2}
          variant="success"
          trend="Ready to push"
        />
        <StatCard
          title="Duplicates"
          value={stagingStatusCounts.duplicates}
          icon={FileCheck2}
          variant="warning"
          trend="Will be skipped"
        />
        <StatCard
          title="Errors"
          value={stagingStatusCounts.errors}
          icon={AlertTriangle}
          variant="danger"
          trend="Need attention"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => loadStaging()}
          disabled={isStagingLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        <Button variant="outline" onClick={validateStagingQuestions}>
          <ShieldCheck className="mr-2 h-4 w-4" /> Validate All
        </Button>
        <Button
          onClick={openPushPreview}
          disabled={
            (stagingStatusCounts.total || stagingQuestions.length) === 0
          }
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <Database className="mr-2 h-4 w-4" /> Push to Main DB
        </Button>
      </div>

      {/* Bulk Delete */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
        <span className="text-sm font-semibold text-red-700">Bulk Delete:</span>

        {/* Delete duplicates inside staging only */}
        <Button
          variant="outline"
          onClick={() => openDeleteModal("duplicates")}
          disabled={
            isDeleting || stagingStatusCounts.duplicatesInsideStaging === 0
          }
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />{" "}
          {isDeletingDuplicates
            ? "Deleting..."
            : `Delete Duplicates (${stagingStatusCounts.duplicatesInsideStaging})`}
        </Button>

        {stagingStatusCounts.duplicatesInsideStaging === 0 &&
          stagingStatusCounts.alreadyInMainDb === 0 &&
          (stagingStatusCounts.total || stagingQuestions.length) > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200">
              <CheckCircle2 className="h-4 w-4" /> No duplicate questions found
            </div>
          )}
        <div className="flex items-center gap-2">
          <select
            value={statusToDelete}
            onChange={(e) => setStatusToDelete(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm font-medium"
            disabled={isDeleting}
          >
            <option value="error">Error</option>
            <option value="missing">Missing</option>
            <option value="duplicate">Duplicate</option>
            <option value="duplicate_in_staging">Duplicate in Staging</option>
            <option value="already_in_main_db">Already in Main DB</option>
            <option value="ready_to_push">Ready to Push</option>
          </select>
          <Button
            variant="outline"
            onClick={() => openDeleteModal("byStatus", null, statusToDelete)}
            disabled={isDeleting}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />{" "}
            {isDeletingByStatus ? "Deleting..." : "Delete by Status"}
          </Button>
        </div>

        {/* ✅ FIXED: Delete ALL button now checks actual questions list if counts are broken */}
        <Button
          variant="outline"
          onClick={() => openDeleteModal("all")}
          disabled={
            isDeleting ||
            (stagingStatusCounts.total || stagingQuestions.length) === 0
          }
          className="ml-auto border-red-500 text-red-700 hover:bg-red-100 font-bold"
        >
          <Trash2 className="mr-2 h-4 w-4" />{" "}
          {isDeletingAll
            ? "Deleting..."
            : `Delete ALL (${stagingPagination?.total})`}
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="mt-5 grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={stagingSearch}
              onChange={(event) => setStagingSearch(event.target.value)}
              placeholder="Search by import ID, exam ID or question..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <select
            value={stagingStatus}
            onChange={(event) => setStagingStatus(event.target.value)}
            className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
          >
            <option value="all">Status: All</option>
            <option value="ready_to_push">Ready to Push</option>
            <option value="already_in_main_db">Already In Main DB</option>
            <option value="duplicate_in_staging">Duplicate In Staging</option>
            <option value="duplicate">Duplicate</option>
            <option value="error">Error</option>
            <option value="missing">Missing</option>
            <option value="pushed">Pushed</option>
          </select>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => {
              setStagingSearch("");
              setStagingStatus("all"); // Reset to default
            }}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => {
              setStagingSearch("");
              setStagingStatus("all");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[1250px] text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Import ID</th>
              <th className="px-4 py-3 text-left">Exam</th>
              <th className="px-4 py-3 text-left">Question</th>
              <th className="px-4 py-3 text-left">Answer</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {isStagingLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Loading staging questions...
                </td>
              </tr>
            ) : filteredStagingQuestions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
                    <h4 className="text-lg font-semibold text-muted-foreground">
                      No questions match your current filters
                    </h4>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStagingQuestions.map((row, i) => (
                <tr
                  key={row.stage_id || row.id}
                  className="border-t border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {(stagingCurrentPage - 1) * 10 + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {row.import_id || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{row.exam_id || "-"}</Badge>
                  </td>
                  <td className="max-w-[420px] px-4 py-3">
                    <p className="font-semibold line-clamp-2">
                      {row.question || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {normalizeAnswer(row.correct_answer) || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={getStagingStatus(row)} />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        openDeleteModal("single", row.stage_id || row.id)
                      }
                      title="Delete from staging"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ NEW: Pagination Controls */}
      {stagingPagination && stagingPagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Page {stagingPagination.page} of {stagingPagination.totalPages} |
            Total: {stagingPagination.total}
          </span>
          <PaginationControls
            currentPage={stagingCurrentPage}
            totalPages={stagingPagination.totalPages}
            onPageChange={setStagingCurrentPage}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        {...getModalContent()}
      />
    </div>
  );
}
