import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Database,
  FolderOpen,
  AlertTriangle,
  History,
} from "lucide-react";
import { Input } from "../../../../../components/ui/Input";
import { Button } from "../../../../../components/ui/Button";
import { Badge } from "../../../../../components/ui/Badge";
import { StatCard } from "../../../../../components/ui/StatCard";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { DeleteConfirmationModal } from "../../../../../components/ui/DeleteConfirmationModal";
import { EditQuestionModal } from "../modals/EditQuestionsModal";
import { PaginationControls } from "../../../../../components/ui/PaginationControls";
import { formatDate, formatTime } from "../../../../../lib/utils";

export function MainDbTab(props) {
  const {
    stats,
    search,
    setSearch,
    examFilter,
    setExamFilter,
    industryFilter,
    setIndustryFilter,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    examOptions,
    industryOptions,
    categoryOptions,
    subCategoryOptions,
    clearFilters,
    isLoading,
    mainQuestions,
    currentPage,
    pageSize,
    setPageSize,
    setCurrentPage,
    totalPages,
    totalQuestionsCount,
    rangeStart,
    rangeEnd,
    updateMainQuestion,
    deleteMainQuestion,
    isBulkDeleteMode,
    toggleBulkDeleteMode,
    selectedQuestionIds,
    toggleQuestionSelection,
    toggleSelectAll,
    handleBulkDelete,
    isDeletingBulk,
  } = props;

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [editModal, setEditModal] = useState({ isOpen: false, question: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false });

  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteClick = (id) => setDeleteModal({ isOpen: true, id });
  const handleConfirmDelete = () => {
    if (deleteModal.id) deleteMainQuestion(deleteModal.id);
    setDeleteModal({ isOpen: false, id: null });
  };

  // ✅ NEW: Handlers for Bulk Delete Modal
  const handleBulkDeleteClick = () => {
    if (selectedQuestionIds.length === 0) return;
    setBulkDeleteModal({ isOpen: true });
  };

  const handleConfirmBulkDelete = () => {
    handleBulkDelete();
    setBulkDeleteModal({ isOpen: false });
  };

  const handleEditClick = (question) =>
    setEditModal({ isOpen: true, question });
  const handleSaveEdit = async (updatedData) => {
    setIsSaving(true);
    try {
      await updateMainQuestion(editModal.question.id, updatedData);
      setEditModal({ isOpen: false, question: null });
    } catch (error) {
      console.error("Save edit error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Exams</option>
          {examOptions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <select
          value={industryFilter}
          onChange={(e) => {
            setIndustryFilter(e.target.value);
            setCategoryFilter("all");
            setSubCategoryFilter("all");
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">Industry: All</option>
          {industryOptions.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubCategoryFilter("all");
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">Category: All</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={subCategoryFilter}
          onChange={(e) => setSubCategoryFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">Sub-category: All</option>
          {subCategoryOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="all">Difficulty: All</option>
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="hard">Hard</option>
        </select>
        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={clearFilters}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={Database}
          variant="success"
          trend="In Main DB"
        />
        <StatCard
          title="Staging Questions"
          value={stats.stagingQuestions}
          icon={FolderOpen}
          variant="info"
          trend="Ready for review"
        />
        <StatCard
          title="Pending Validation"
          value={stats.pendingValidation}
          icon={AlertTriangle}
          variant="warning"
          trend="Need attention"
        />
        <StatCard
          title="Import Batches"
          value={stats.importBatches}
          icon={History}
          variant="neutral"
          trend="All time"
        />
      </div>

      {/* ✅ NEW: Bulk Delete Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
        <div className="flex gap-2">
          <Button
            variant={isBulkDeleteMode ? "destructive" : "outline"}
            className="h-10 rounded-xl"
            onClick={toggleBulkDeleteMode}
          >
            {isBulkDeleteMode ? "Cancel Bulk Delete" : "Bulk Delete"}
          </Button>

          {isBulkDeleteMode && selectedQuestionIds.length > 0 && (
            <Button
              variant="destructive"
              className="h-10 rounded-xl"
              onClick={handleBulkDeleteClick}
              disabled={isDeletingBulk}
            >
              {isDeletingBulk ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedQuestionIds.length})
                </>
              )}
            </Button>
          )}
        </div>

        {isBulkDeleteMode && (
          <span className="text-sm font-medium text-muted-foreground">
            {selectedQuestionIds.length > 0
              ? `${selectedQuestionIds.length} question(s) selected`
              : "Select questions to delete"}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[950px] text-sm">
          <thead className="bg-muted/40">
            <tr>
              {/* ✅ NEW: Checkbox Column Header */}
              {isBulkDeleteMode && (
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    checked={
                      mainQuestions.length > 0 &&
                      selectedQuestionIds.length === mainQuestions.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Exam</th>
              <th className="px-4 py-3 text-left">Question</th>
              <th className="px-4 py-3 text-left">Difficulty</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  // ✅ Dynamic colSpan based on bulk mode
                  colSpan={isBulkDeleteMode ? 7 : 6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            ) : mainQuestions.length === 0 ? (
              // ✅ NEW: Empty State Message
              <tr>
                <td
                  colSpan={isBulkDeleteMode ? 7 : 6}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Database className="h-12 w-12 text-muted-foreground/40" />
                    <h4 className="text-lg font-semibold text-muted-foreground">
                      No questions found in the Main Database
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or import new questions.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              mainQuestions.map((q, i) => (
                <tr key={q.id} className="border-t border-border">
                  {/* ✅ NEW: Checkbox Column Row */}
                  {isBulkDeleteMode && (
                    <td className="px-4 py-4 w-10">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        checked={selectedQuestionIds.includes(q.id)}
                        onChange={() => toggleQuestionSelection(q.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-4 text-muted-foreground">
                    {(currentPage - 1) * pageSize + i + 1}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary">{q.exam_id}</Badge>
                  </td>
                  <td className="max-w-[460px] px-4 py-4">
                    <p className="font-semibold">{q.question}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      value={
                        q.difficulty === "medium"
                          ? "intermediate"
                          : q.difficulty.toLowerCase()
                      }
                    />
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <p>{formatDate(q.created_at)}</p>
                    <p className="text-xs">{formatTime(q.created_at)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => handleEditClick(q)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => handleDeleteClick(q.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="text-sm text-muted-foreground">
          Showing {rangeStart}–{rangeEnd} of {totalQuestionsCount}
        </span>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Single Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Question from Main DB"
        message="This action will permanently delete this question from the main database. This cannot be undone."
        confirmText="Delete"
        variant="red"
      />

      {/* ✅ NEW: Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ isOpen: false })}
        onConfirm={handleConfirmBulkDelete}
        isDeleting={isDeletingBulk}
        title="Bulk Delete Questions"
        message={`⚠️ WARNING: This action will permanently delete ${selectedQuestionIds.length} selected question(s) from the main database. This cannot be undone.`}
        confirmText="Delete Selected"
        variant="red"
      />

      <EditQuestionModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, question: null })}
        onSave={handleSaveEdit}
        question={editModal.question}
        examOptions={examOptions}
        isSaving={isSaving}
      />
    </div>
  );
}
