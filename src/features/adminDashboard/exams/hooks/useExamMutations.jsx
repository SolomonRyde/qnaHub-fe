import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExam,
  updateExam as updateExamApi,
  deleteExam,
  updateExamStatus,
  toggleFeatured as toggleFeaturedApi,
} from "../../../../services/apiExams";
import { toast } from "react-hot-toast";

import {
  updateExamInCache,
  removeExamFromCache,
  getExamsSnapshot,
  restoreExamsSnapshot,
  invalidateAdminExams,
} from "../../../../lib/examCache";

const getAdminExamsQueryKey = () => ["admin-exams"];

export function useExamMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createExam,
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["admin-exams"] });
      const snapshots = getExamsSnapshot(queryClient);
      const tempId = `temp-${Date.now()}`;
      queryClient.setQueriesData({ queryKey: ["admin-exams"] }, (old) => ({
        ...old,
        data: [
          {
            id: tempId,
            exam_title: formData.get?.("exam_title") || "New Exam",
            slug: "new-exam",
            status: "draft",
            is_featured: false,
            difficulty: "intermediate",
            duration_minutes: 30,
            no_of_questions: 10,
            created_at: new Date().toISOString(),
            cover_image_path: null,
            industry_name: null,
            category_name: null,
            // ✅ Add topics_covered for optimistic update
            topics_covered: [],
          },
          ...(old?.data || []),
        ],
        pagination: old?.pagination
          ? { ...old.pagination, total: (old.pagination.total || 0) + 1 }
          : undefined,
      }));
      return { snapshots };
    },
    onSuccess: () => {
      toast.success("Exam created successfully");
      invalidateAdminExams(queryClient);
    },
    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to create exam");
      if (context?.snapshots)
        restoreExamsSnapshot(queryClient, context.snapshots);
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => updateExamStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-exams"] });
      const snapshots = getExamsSnapshot(queryClient);
      updateExamInCache(queryClient, id, {
        status,
        updated_at: new Date().toISOString(),
      });
      return { snapshots };
    },
    onSuccess: (_, { id, status }) => {
      toast.success(
        `Exam ${status === "published" ? "published" : status === "archived" ? "archived" : "saved as draft"}`,
      );
      invalidateAdminExams(queryClient);
    },
    onError: (err, vars, context) => {
      toast.error("Failed to update status");
      if (context?.snapshots)
        restoreExamsSnapshot(queryClient, context.snapshots);
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, isFeatured }) => toggleFeaturedApi(id, isFeatured),
    onMutate: async ({ id, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-exams"] });
      const snapshots = getExamsSnapshot(queryClient);
      updateExamInCache(queryClient, id, { is_featured: isFeatured ? 1 : 0 });
      return { snapshots };
    },
    onSuccess: (_, { id, isFeatured }) => {
      toast.success(isFeatured ? "Added to featured" : "Removed from featured");
      invalidateAdminExams(queryClient);
    },
    onError: (err, vars, context) => {
      toast.error("Failed to update featured status");
      if (context?.snapshots)
        restoreExamsSnapshot(queryClient, context.snapshots);
    },
  });

  const remove = useMutation({
    mutationFn: deleteExam,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-exams"] });
      const snapshots = getExamsSnapshot(queryClient);
      removeExamFromCache(queryClient, id);
      return { snapshots };
    },
    onSuccess: () => {
      toast.success("Exam deleted permanently");
      invalidateAdminExams(queryClient);
    },
    onError: (err, vars, context) => {
      toast.error("Failed to delete exam");
      if (context?.snapshots)
        restoreExamsSnapshot(queryClient, context.snapshots);
    },
  });

  const updateExam = useMutation({
    mutationFn: ({ id, formData }) => updateExamApi(id, formData),

    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-exams"] });

      const snapshots = getExamsSnapshot(queryClient);

      queryClient.setQueriesData({ queryKey: ["admin-exams"] }, (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((exam) =>
            exam.id === id
              ? {
                  ...exam,
                  exam_title: formData.get("exam_title") || exam.exam_title,
                  exam_code: formData.get("exam_code") || exam.exam_code,
                  description: formData.get("description") || exam.description,
                  total_marks: formData.get("total_marks") || exam.total_marks,
                  duration_minutes:
                    formData.get("duration_minutes") || exam.duration_minutes,
                  no_of_questions:
                    formData.get("no_of_questions") || exam.no_of_questions,
                  points_per_question:
                    formData.get("points_per_question") ||
                    exam.points_per_question,
                  difficulty: formData.get("difficulty") || exam.difficulty,
                  status: formData.get("status") || exam.status,
                  is_featured: formData.get("is_featured") === "1" ? 1 : 0,
                  industry_id: formData.get("industry_id") || exam.industry_id,
                  category_id: formData.get("category_id") || exam.category_id,
                  sub_category_id:
                    formData.get("sub_category_id") || exam.sub_category_id,
                  // ✅ NEW: Handle topics_covered in optimistic update
                  topics_covered: formData.get("topics_covered")
                    ? JSON.parse(formData.get("topics_covered"))
                    : exam.topics_covered,
                  updated_at: new Date().toISOString(),
                }
              : exam,
          ),
        };
      });

      return { snapshots };
    },

    onSuccess: () => {
      toast.success("Exam updated successfully");
      invalidateAdminExams(queryClient);
    },

    onError: (err, vars, context) => {
      toast.error(err.message || "Failed to update exam");

      if (context?.snapshots) {
        restoreExamsSnapshot(queryClient, context.snapshots);
      }
    },
  });

  return {
    create,
    updateStatus,
    toggleFeatured,
    remove,
    updateExam,
  };
}
