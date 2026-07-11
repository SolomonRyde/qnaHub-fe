// hooks/useBulkDelete.js
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBulkQuestions } from "../../../../services/apiQuestions";

export function useBulkDelete() {
  const queryClient = useQueryClient();
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const deleteBulkQuestionsMutation = useMutation({
    mutationFn: (ids) => deleteBulkQuestions(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ["main-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["main-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["main-questions"] }, (old) => {
        if (!old?.questions) return old;
        const idsSet = new Set(ids.map(String));
        return {
          ...old,
          questions: old.questions.filter((q) => !idsSet.has(String(q.id))),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 0) - ids.length),
          },
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message || "Questions deleted successfully");
      setSelectedQuestionIds([]);
      setIsBulkDeleteMode(false);
      queryClient.invalidateQueries({ queryKey: ["main-questions"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to delete questions");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  function toggleBulkDeleteMode() {
    setIsBulkDeleteMode((prev) => !prev);
    setSelectedQuestionIds([]);
  }

  function toggleQuestionSelection(id) {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id],
    );
  }

  function toggleSelectAll(mainQuestions) {
    if (selectedQuestionIds.length === mainQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(mainQuestions.map((q) => q.id));
    }
  }

  async function handleBulkDelete() {
    if (selectedQuestionIds.length === 0) {
      toast.error("No questions selected");
      return;
    }
    try {
      await deleteBulkQuestionsMutation.mutateAsync(selectedQuestionIds);
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  }

  return {
    isBulkDeleteMode,
    setIsBulkDeleteMode: toggleBulkDeleteMode,
    selectedQuestionIds,
    toggleQuestionSelection,
    toggleSelectAll,
    handleBulkDelete,
    isDeletingBulk: deleteBulkQuestionsMutation.isPending,
  };
}
