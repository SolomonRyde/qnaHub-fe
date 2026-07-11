// hooks/useManageQuestions.js
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getQuestions,
  getStagingQuestions,
  getImportHistory,
  getExams,
  getIndustries,
  validateStagingQuestionsApi,
  deleteImportHistoryItem,
} from "../../../../services/apiQuestions";
import {
  normalizeAnswer,
  normalizeText,
  getStagingStatus,
  displayDifficulty,
} from "../../../../lib/utils";
import { useQuestionFilters } from "./useQuestionFilters";
import { useStagingFilters } from "./useStagingFilters";
import { usePagination } from "./usePagination";
import { useBulkDelete } from "./useBulkDelete";
import { useImportHistoryDelete } from "./useImportHistoryDelete";
import { useMainDbMutations } from "./useMainDbMutations";
import { useStagingMutations } from "./useStagingMutations";
import { useCsvImport } from "./useCsvImport";
import toast from "react-hot-toast";

export function useManageQuestions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // UI States
  const [activeTab, setActiveTab] = useState("main");

  // Inside useManageQuestions function, with other useState declarations
  const [statusToDelete, setStatusToDelete] = useState("error");

  // Query Keys
  const queryKeys = {
    filterMasterData: () => ["filter-master-data"],
    mainQuestions: (page, limit, search, examId, difficulty) => [
      "main-questions",
      page,
      limit,
      search,
      examId,
      difficulty,
    ],
    stagingQuestions: (page, limit, importId) => [
      "staging-questions",
      page,
      limit,
      importId || "all",
    ],
    stagingStatusCounts: () => ["staging-status-counts"],
    importHistory: (page, limit) => ["import-history", page, limit],
  };

  // 1. Pagination Hook
  const pagination = usePagination();

  // 2. ✅ Fetch Filter Master Data FIRST
  const {
    data: filterMasterData = {
      exams: [],
      industries: [],
      categories: [],
      subcategories: [],
    },
  } = useQuery({
    queryKey: queryKeys.filterMasterData(),
    queryFn: async () => {
      const [examRes, industryRes] = await Promise.all([
        getExams(),
        getIndustries(),
      ]);
      const rawExamRows = Array.isArray(examRes?.data) ? examRes.data : [];
      const exams = [],
        industryMap = new Map(),
        categoryMap = new Map(),
        subcategoryMap = new Map();

      rawExamRows.forEach((item) => {
        exams.push({
          id: String(item.id),
          title: item.exam_title,
          industry_id: String(item.industry_id || ""),
          category_id: String(item.category_id || ""),
          sub_category_id: String(item.sub_category_id || ""),
        });
        if (industryRes?.data) {
          industryRes.data.forEach((ind) =>
            industryMap.set(String(ind.id), {
              id: String(ind.id),
              name: ind.industry_name,
            }),
          );
        }
        if (item.category_id && item.category_name) {
          categoryMap.set(String(item.category_id), {
            id: String(item.category_id),
            name: item.category_name,
            industry_id: String(item.industry_id),
          });
        }
        if (item.sub_category_id && item.sub_category_name) {
          subcategoryMap.set(String(item.sub_category_id), {
            id: String(item.sub_category_id),
            name: item.sub_category_name,
            category_id: String(item.category_id),
            industry_id: String(item.industry_id),
          });
        }
      });

      return {
        exams,
        industries: [...industryMap.values()],
        categories: [...categoryMap.values()],
        subcategories: [...subcategoryMap.values()],
      };
    },
  });

  // 3. ✅ Now we can safely pass filterMasterData to useQuestionFilters
  const {
    search,
    setSearch,
    difficultyFilter,
    setDifficultyFilter,
    examFilter,
    setExamFilter,
    industryFilter,
    setIndustryFilter,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    industryOptions,
    categoryOptions,
    subCategoryOptions,
    examOptions,
    clearFilters,
  } = useQuestionFilters(filterMasterData);

  const { stagingSearch, setStagingSearch, stagingStatus, setStagingStatus } =
    useStagingFilters();

  const {
    isBulkDeleteMode,
    setIsBulkDeleteMode,
    selectedQuestionIds,
    toggleQuestionSelection,
    toggleSelectAll,
    handleBulkDelete,
    isDeletingBulk,
  } = useBulkDelete();

  const {
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    isDeletingImportHistory,
    deleteImportHistoryItemHandler,
  } = useImportHistoryDelete();

  const { updateMainQuestion, deleteMainQuestion } = useMainDbMutations();

  const {
    deleteStagingQuestion,
    handleDeleteDuplicates,
    handleDeleteAllStaging,
    handleDeleteByStatus,
    isDeletingDuplicates,
    isDeletingAll,
    isDeletingByStatus,
  } = useStagingMutations();

  // 4. ✅ Define refresh functions BEFORE passing them to useCsvImport
  function loadStaging() {
    queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
    queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
  }

  function loadImportHistory() {
    queryClient.invalidateQueries({ queryKey: ["import-history"] });
  }

  function loadQuestions() {
    queryClient.invalidateQueries({ queryKey: ["main-questions"] });
  }

  // 5. Now pass them to useCsvImport
  const csvImport = useCsvImport(loadStaging, loadImportHistory, loadQuestions);

  // ================= REMAINING QUERIES =================

  const { data: mainQuestionsData, isLoading: isLoadingMain } = useQuery({
    queryKey: queryKeys.mainQuestions(
      pagination.currentPage,
      pagination.pageSize,
      search,
      examFilter === "all" ? null : examFilter,
      difficultyFilter === "all" ? null : difficultyFilter,
    ),
    queryFn: async () => {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
      };
      if (search) params.search = search;
      if (examFilter !== "all") params.exam_id = examFilter;
      if (difficultyFilter !== "all") params.difficulty = difficultyFilter;

      const res = await getQuestions(params);
      const questions = (Array.isArray(res.data) ? res.data : []).map((q) => ({
        ...q,
        id: q.id,
        exam_id: q.exam_id || "-",
        question: q.question || "-",
        difficulty: q.difficulty || "-",
        correct_answer: normalizeAnswer(q.correct_answer),
      }));
      const paginationData = res.pagination || {};
      return {
        questions,
        pagination: {
          page: paginationData.page || pagination.currentPage,
          total: paginationData.total || questions.length,
          totalPages:
            paginationData.totalPages ||
            Math.max(
              1,
              Math.ceil(
                (paginationData.total || questions.length) /
                  pagination.pageSize,
              ),
            ),
        },
      };
    },
    keepPreviousData: true,
  });

  const mainQuestions = mainQuestionsData?.questions || [];
  const questionsPagination = mainQuestionsData?.pagination || null;

  const { data: stagingQuestionsData, isLoading: isStagingLoadingQuery } =
    useQuery({
      queryKey: queryKeys.stagingQuestions(
        pagination.stagingCurrentPage,
        pagination.stagingPageSize,
        csvImport.stagingImportId,
      ),
      queryFn: async () => {
        const params = {
          page: pagination.stagingCurrentPage,
          limit: pagination.stagingPageSize,
        };
        if (csvImport.stagingImportId)
          params.import_id = csvImport.stagingImportId;

        const res = await getStagingQuestions(params);
        const rows = Array.isArray(res.data) ? res.data : [];
        return {
          rows: rows.map((row) => ({
            ...row,
            id: row.stage_id || row.id,
            stage_id: row.stage_id || row.id,
            question: row.question || "-",
            correct_answer: normalizeAnswer(row.correct_answer),
            difficulty: displayDifficulty(row.difficulty),
            stage_status: row.stage_status || row.status || "pending",
          })),
          pagination: {
            page: res.pagination?.page || pagination.stagingCurrentPage,
            total:
              res.pagination?.totalRows || res.pagination?.total || rows.length,
            totalPages:
              res.pagination?.totalPages ||
              Math.max(
                1,
                Math.ceil(
                  (res.pagination?.totalRows || rows.length) /
                    pagination.stagingPageSize,
                ),
              ),
          },
        };
      },
      enabled: activeTab === "staging",
      keepPreviousData: true,
    });

  const stagingQuestions = stagingQuestionsData?.rows || [];
  const stagingPagination = stagingQuestionsData?.pagination || null;

  const { data: stagingStatusCountsData, isLoading: isCountsLoading } =
    useQuery({
      queryKey: queryKeys.stagingStatusCounts(),
      queryFn: async () => {
        const countRes = await validateStagingQuestionsApi();
        const data = countRes?.data || {};
        return {
          total: data.total_staging || 0,
          readyToPush: data.ready_to_push || 0,
          duplicatesInsideStaging: data.duplicates_inside_staging || 0,
          alreadyInMainDb: data.already_in_main_db || 0,
          duplicates:
            (data.duplicates_inside_staging || 0) +
            (data.already_in_main_db || 0),
          errors: data.errors || 0,
          pushed: 0,
          pending: 0,
        };
      },
      enabled: activeTab === "staging",
    });

  const stagingStatusCounts = stagingStatusCountsData || {
    total: 0,
    readyToPush: 0,
    duplicates: 0,
    errors: 0,
    pushed: 0,
    pending: 0,
  };

  const { data: importHistoryData, isLoading: isHistoryLoading } = useQuery({
    queryKey: queryKeys.importHistory(
      pagination.historyCurrentPage,
      pagination.historyPageSize,
    ),
    queryFn: async () => {
      const res = await getImportHistory({
        page: pagination.historyCurrentPage,
        limit: pagination.historyPageSize,
      });
      const rows = Array.isArray(res.data) ? res.data : [];
      return {
        rows: rows.map((item) => ({
          import_id: item.id,
          file_name: item.file_name || "-",
          uploaded_by: item.uploaded_by || item.user_name || "-",
          total_rows: item.total_rows || 0,
          valid_rows: item.csv_valid_rows || 0,
          error_rows: item.csv_error_rows || 0,
          missing_rows: item.csv_missing_rows || 0,
          duplicate_rows: item.csv_duplicate_rows || 0,
          current_stage: item.current_stage || "-",
          stage_history: item.stage_history || "[]",
          imported_at: item.created_at,
        })),
        pagination: res.pagination || null,
      };
    },
    enabled: activeTab === "history",
    keepPreviousData: true,
  });

  const importHistory = importHistoryData?.rows || [];
  const historyPagination = importHistoryData?.pagination || null;

  // ================= MEMOS =================
  const totalQuestionsCount = questionsPagination?.total ?? 0;
  const totalPages = questionsPagination?.totalPages ?? 1;
  const rangeStart =
    totalQuestionsCount === 0
      ? 0
      : (pagination.currentPage - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(
    pagination.currentPage * pagination.pageSize,
    totalQuestionsCount,
  );

  const stats = useMemo(
    () => ({
      totalQuestions: questionsPagination?.total || mainQuestions.length,
      stagingQuestions: stagingPagination?.total || stagingQuestions.length,
      pendingValidation: stagingStatusCounts.errors,
      importBatches: historyPagination?.total || importHistory.length || 0,
    }),
    [
      questionsPagination,
      mainQuestions,
      stagingPagination,
      stagingQuestions,
      historyPagination,
      importHistory,
      stagingStatusCounts,
    ],
  );

  const filteredStagingQuestions = useMemo(() => {
    const searchValue = normalizeText(stagingSearch); // ✅ Use normalizeText
    return stagingQuestions.filter((row) => {
      const matchesSearch =
        normalizeText(row.question).includes(searchValue) ||
        normalizeText(row.import_id).includes(searchValue) ||
        normalizeText(row.file_name).includes(searchValue);
      return (
        matchesSearch &&
        (stagingStatus === "all" || getStagingStatus(row) === stagingStatus)
      );
    });
  }, [stagingQuestions, stagingSearch, stagingStatus]);

  useEffect(() => {
    if (pagination.currentPage !== 1) pagination.setCurrentPage(1);
  }, [
    search,
    examFilter,
    industryFilter,
    categoryFilter,
    subCategoryFilter,
    difficultyFilter,
  ]);

  return {
    activeTab,
    setActiveTab,
    // Question Filters
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
    // Staging Filters
    stagingSearch,
    setStagingSearch,
    stagingStatus,
    setStagingStatus,
    // Pagination
    ...pagination,
    // Stats
    stats,
    isLoading: isLoadingMain,
    mainQuestions,
    totalPages,
    totalQuestionsCount,
    rangeStart,
    rangeEnd,
    // Mutations
    updateMainQuestion,
    deleteMainQuestion,
    stagingStatusCounts,
    stagingQuestions,
    isStagingLoading: isStagingLoadingQuery || isCountsLoading,
    loadStaging,
    openPushPreview: csvImport.openPushPreview,
    stagingPagination,
    deleteStagingQuestion,
    isPushPreviewModalOpen: csvImport.isPushPreviewModalOpen,
    setIsPushPreviewModalOpen: csvImport.setIsPushPreviewModalOpen,
    pushPreviewSummary: csvImport.pushPreviewSummary,
    isPushing: csvImport.isPushing,
    confirmPushToMainDb: () => csvImport.confirmPushToMainDb(setActiveTab),
    isHistoryLoading,
    importHistory,
    loadImportHistory,
    historyPagination,
    openImportDetails: csvImport.openImportDetails,
    isImportDetailsLoading: csvImport.isImportDetailsLoading,
    isImportDetailsOpen: csvImport.isImportDetailsOpen,
    setIsImportDetailsOpen: csvImport.setIsImportDetailsOpen,
    selectedImportDetails: csvImport.selectedImportDetails,
    setSelectedImportDetails: csvImport.setSelectedImportDetails,
    setStagingImportId: csvImport.setStagingImportId,
    // Bulk Delete
    isBulkDeleteMode,
    toggleBulkDeleteMode: setIsBulkDeleteMode,
    selectedQuestionIds,
    toggleQuestionSelection,
    toggleSelectAll: () => toggleSelectAll(mainQuestions),
    handleBulkDelete,
    isDeletingBulk,
    // Import History Delete
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    deleteImportHistoryItemHandler, // ✅ From useImportHistoryDelete
    isDeletingImportHistory,
    // CSV Import
    isImportModalOpen: csvImport.isImportModalOpen,
    setIsImportModalOpen: csvImport.setIsImportModalOpen,
    importStep: csvImport.importStep,
    setImportStep: csvImport.setImportStep,
    selectedCsvFile: csvImport.selectedCsvFile,
    setSelectedCsvFile: csvImport.setSelectedCsvFile,
    csvPreviewRows: csvImport.csvPreviewRows,
    csvPreviewSummary: csvImport.csvPreviewSummary,
    csvPreviewSearch: csvImport.csvPreviewSearch,
    setCsvPreviewSearch: csvImport.setCsvPreviewSearch,
    csvPreviewStatus: csvImport.csvPreviewStatus,
    setCsvPreviewStatus: csvImport.setCsvPreviewStatus,
    isCsvUploading: csvImport.isCsvUploading,
    handleCsvFile: csvImport.handleCsvFile,
    filteredCsvPreviewRows: csvImport.filteredCsvPreviewRows,
    confirmCsvImportToStaging: () =>
      csvImport.confirmCsvImportToStaging(setActiveTab),
    // Staging Mutations
    isDeletingDuplicates,
    isDeletingAll,
    isDeletingByStatus,
    handleDeleteDuplicates,
    handleDeleteAllStaging,
    handleDeleteByStatus,
    statusToDelete,
    setStatusToDelete,
    filteredStagingQuestions,
    loadQuestions,
  };
}
