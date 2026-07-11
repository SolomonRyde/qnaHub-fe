import React, { useState } from "react";
import { RefreshCw, Eye, Trash2 } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { PaginationControls } from "../../../../../components/ui/PaginationControls";
import { DeleteConfirmationModal } from "../../../../../components/ui/DeleteConfirmationModal";
import { formatDate, formatTime } from "../../../../../lib/utils";

export function HistoryTab(props) {
  const {
    isHistoryLoading,
    importHistory,
    loadImportHistory,
    historyPagination,
    openImportDetails,
    isImportDetailsLoading,
    historyCurrentPage,
    setHistoryCurrentPage,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    isDeletingImportHistory,
  } = props;

  const handleDeleteClick = (id) => openDeleteModal(id);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={loadImportHistory}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh History
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[1150px] text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">Import ID</th>
              <th className="px-4 py-3 text-left">File</th>
              <th className="px-4 py-3 text-left">Uploaded By</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Valid</th>
              <th className="px-4 py-3 text-left">Error</th>
              <th className="px-4 py-3 text-left">Stage</th>
              <th className="px-4 py-3 text-left">Imported At</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {isHistoryLoading ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              importHistory.map((item) => (
                <tr key={item.import_id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{item.import_id}</td>
                  <td className="px-4 py-3">{item.file_name}</td>
                  <td className="px-4 py-3">{item.uploaded_by}</td>
                  <td className="px-4 py-3">{item.total_rows}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    {item.valid_rows}
                  </td>
                  <td className="px-4 py-3 font-semibold text-red-700">
                    {item.error_rows}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      value={String(item.current_stage).toLowerCase()}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p>{formatDate(item.imported_at)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(item.imported_at)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {/* ✅ UPDATED: Action buttons container */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => openImportDetails(item.import_id)}
                        disabled={isImportDetailsLoading}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>

                      {/* ✅ NEW: Delete Button */}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteClick(item.import_id)}
                        title="Delete import history"
                      >
                        <Trash2 className="h-4 w-4" />
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
      {historyPagination && historyPagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Page {historyPagination.page} of {historyPagination.totalPages} |
            Total: {historyPagination.total}
          </span>
          <PaginationControls
            currentPage={historyCurrentPage}
            totalPages={historyPagination.totalPages}
            onPageChange={setHistoryCurrentPage}
          />
        </div>
      )}

      {/* ✅ Use hook's modal state */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingImportHistory}
        title="Delete Import History"
        message="⚠️ WARNING: This will permanently delete this import record and ALL associated staging questions. This cannot be undone."
        confirmText="Delete"
        variant="red"
      />
    </div>
  );
}
