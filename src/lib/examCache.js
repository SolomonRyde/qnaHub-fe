export const updateExamInCache = (queryClient, examId, updates) => {
  queryClient.setQueriesData({ queryKey: ["admin-exams"] }, (old) => {
    if (!old?.data) return old;
    return {
      ...old,
      data: old.data.map((exam) =>
        exam.id === examId ? { ...exam, ...updates } : exam,
      ),
    };
  });
};

export const removeExamFromCache = (queryClient, examId) => {
  queryClient.setQueriesData({ queryKey: ["admin-exams"] }, (old) => {
    if (!old?.data) return old;
    return {
      ...old,
      data: old.data.filter((exam) => exam.id !== examId),
      pagination: old.pagination
        ? { ...old.pagination, total: Math.max(0, old.pagination.total - 1) }
        : old.pagination,
    };
  });
};

export const getExamsSnapshot = (queryClient) =>
  queryClient.getQueriesData({ queryKey: ["admin-exams"] });

export const restoreExamsSnapshot = (queryClient, snapshots) => {
  snapshots.forEach(([key, value]) => {
    queryClient.setQueryData(key, value);
  });
};

export const invalidateAdminExams = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["admin-exams"], exact: false });
  queryClient.invalidateQueries({ queryKey: ["exams"] });
};
