// hooks/useMainDbMutations.js
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateQuestion,
  deleteQuestion,
} from "../../../../services/apiQuestions";

export function useMainDbMutations() {
  const queryClient = useQueryClient();

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }) => updateQuestion(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["main-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["main-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["main-questions"] }, (old) => {
        if (!old?.questions) return old;
        return {
          ...old,
          questions: old.questions.map((q) =>
            q.id === id ? { ...q, ...data } : q,
          ),
        };
      });

      return { previous };
    },
    onSuccess: () => {
      toast.success("Question updated successfully");
      queryClient.invalidateQueries({ queryKey: ["main-questions"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to update question");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id) => deleteQuestion(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["main-questions"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["main-questions"],
      });

      queryClient.setQueriesData({ queryKey: ["main-questions"] }, (old) => {
        if (!old?.questions) return old;
        return {
          ...old,
          questions: old.questions.filter((q) => q.id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 0) - 1),
          },
        };
      });

      return { previous };
    },
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["main-questions"] });
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Delete failed");
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });

  async function updateMainQuestion(id, data) {
    await updateQuestionMutation.mutateAsync({ id, data });
  }

  async function deleteMainQuestion(id) {
    try {
      await deleteQuestionMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return {
    updateMainQuestion,
    deleteMainQuestion,
  };
}
