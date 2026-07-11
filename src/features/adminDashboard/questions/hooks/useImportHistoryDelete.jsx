// hooks/useImportHistoryDelete.js
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImportHistoryItem } from "../../../../services/apiQuestions";

export function useImportHistoryDelete() {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const deleteImportHistoryMutation = useMutation({
    mutationFn: (importId) => deleteImportHistoryItem(importId),
    onMutate: async (importId) => {
      await queryClient.cancelQueries({ queryKey: ["import-history"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["import-history"],
      });

      queryClient.setQueriesData({ queryKey: ["import-history"] }, (old) => {
        if (!old?.rows) return old;
        return {
          ...old,
          rows: old.rows.filter(
            (item) => String(item.import_id) !== String(importId),
          ),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 0) - 1),
          },
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message || "Import history deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to delete import history");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  function openDeleteModal(id) {
    setDeleteModal({ isOpen: true, id });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, id: null });
  }

  async function handleConfirmDelete() {
    if (deleteModal.id) {
      await deleteImportHistoryMutation.mutateAsync(deleteModal.id);
    }
    closeDeleteModal();
  }

  async function deleteImportHistoryItemHandler(importId) {
    try {
      await deleteImportHistoryMutation.mutateAsync(importId);
    } catch (error) {
      console.error("Delete import history failed:", error);
    }
  }

  return {
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    deleteImportHistoryItemHandler,
    isDeletingImportHistory: deleteImportHistoryMutation.isPending,
  };
}
