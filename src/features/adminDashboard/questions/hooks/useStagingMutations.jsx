// hooks/useStagingMutations.js
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSingleStagingQuestion,
  deleteAllStagingQuestions,
  deleteDuplicateQuestions,
  deleteStagingQuestionsByStatus,
} from "../../../../services/apiQuestions";
import { getStagingStatus } from "../../../../lib/utils";

export function useStagingMutations() {
  const queryClient = useQueryClient();

  const deleteStagingQuestionMutation = useMutation({
    mutationFn: (id) => deleteSingleStagingQuestion(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["staging-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["staging-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["staging-questions"] }, (old) => {
        if (!old?.rows) return old;
        return {
          ...old,
          rows: old.rows.filter((q) => q.id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 0) - 1),
          },
        };
      });

      return { previous };
    },
    onSuccess: () => {
      toast.success("Question deleted from staging");
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to delete question from staging");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  const deleteDuplicatesMutation = useMutation({
    mutationFn: () => deleteDuplicateQuestions(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["staging-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["staging-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["staging-questions"] }, (old) => {
        if (!old?.rows) return old;
        const nonDuplicates = old.rows.filter((q) => {
          const status = getStagingStatus(q);
          return ![
            "duplicate",
            "duplicate_in_staging",
            "already_in_main_db",
            "duplicate_in_main",
          ].includes(status);
        });
        return {
          ...old,
          rows: nonDuplicates,
          pagination: {
            ...old.pagination,
            total: nonDuplicates.length,
          },
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message || "Duplicate questions deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to delete duplicate questions");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  const deleteAllStagingMutation = useMutation({
    mutationFn: () => deleteAllStagingQuestions(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["staging-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["staging-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["staging-questions"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          rows: [],
          pagination: {
            ...old.pagination,
            total: 0,
          },
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(
        res.message || "All staging questions deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to delete all staging questions");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  const deleteByStatusMutation = useMutation({
    mutationFn: (status) => {
      let dbStatus = status;
      if (status === "already_in_main_db") {
        dbStatus = "duplicate_in_main";
      }
      return deleteStagingQuestionsByStatus(dbStatus);
    },
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: ["staging-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["staging-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["staging-questions"] }, (old) => {
        if (!old?.rows) return old;
        const filtered = old.rows.filter((q) => getStagingStatus(q) !== status);
        return {
          ...old,
          rows: filtered,
          pagination: {
            ...old.pagination,
            total: Math.max(
              0,
              (old.pagination?.total || 0) -
                (old.rows.length - filtered.length),
            ),
          },
        };
      });

      return { previous };
    },
    onSuccess: (res, status) => {
      const deletedCount = res?.data?.deletedCount || 0;
      if (deletedCount === 0) {
        toast.error(
          `No questions were deleted with status "${status.replace(/_/g, " ").toUpperCase()}".`,
        );
      } else {
        toast.success(
          res.message || `Successfully deleted ${deletedCount} questions`,
        );
      }
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (err, status, context) => {
      toast.error(
        err.message || `Failed to delete questions with status "${status}"`,
      );
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  async function deleteStagingQuestion(id) {
    try {
      await deleteStagingQuestionMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete staging failed:", error);
    }
  }

  async function handleDeleteDuplicates() {
    try {
      await deleteDuplicatesMutation.mutateAsync();
    } catch (error) {
      console.error("Delete duplicates failed:", error);
    }
  }

  async function handleDeleteAllStaging() {
    try {
      await deleteAllStagingMutation.mutateAsync();
    } catch (error) {
      console.error("Delete all failed:", error);
    }
  }

  async function handleDeleteByStatus(status) {
    if (!status || status === "all") {
      toast.error("Please select a valid status to delete");
      return;
    }
    try {
      await deleteByStatusMutation.mutateAsync(status);
    } catch (error) {
      console.error("Delete by status failed:", error);
    }
  }

  return {
    deleteStagingQuestion,
    handleDeleteDuplicates,
    handleDeleteAllStaging,
    handleDeleteByStatus,
    isDeletingDuplicates: deleteDuplicatesMutation.isPending,
    isDeletingAll: deleteAllStagingMutation.isPending,
    isDeletingByStatus: deleteByStatusMutation.isPending,
  };
}
