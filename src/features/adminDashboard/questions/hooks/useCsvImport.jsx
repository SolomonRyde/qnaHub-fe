// hooks/useCsvImport.js
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadCsvToStaging,
  getStagingQuestions,
  validateStagingQuestionsApi,
  getFinalPushPreview,
  pushFinalDistinctQuestions,
  getSingleImportHistory,
} from "../../../../services/apiQuestions";
import {
  parseCsvText,
  validateCsvRows,
  getCsvSummary,
  parseStageHistory,
  REQUIRED_CSV_COLUMNS,
  normalizeHeader,
  normalizeText,
} from "../../../../lib/utils";

export function useCsvImport(loadStaging, loadImportHistory, loadQuestions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState([]);
  const [csvPreviewSummary, setCsvPreviewSummary] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicate: 0,
  });
  const [csvPreviewSearch, setCsvPreviewSearch] = useState("");
  const [csvPreviewStatus, setCsvPreviewStatus] = useState("all");
  const [pushPreview, setPushPreview] = useState(null);
  const [isPushPreviewModalOpen, setIsPushPreviewModalOpen] = useState(false);
  const [isImportDetailsOpen, setIsImportDetailsOpen] = useState(false);
  const [isImportDetailsLoading, setIsImportDetailsLoading] = useState(false);
  const [selectedImportDetails, setSelectedImportDetails] = useState(null);
  const [stagingImportId, setStagingImportId] = useState("");

  // ✅ ADD THIS MEMO CALCULATION RIGHT BEFORE THE RETURN STATEMENT
  const filteredCsvPreviewRows = useMemo(() => {
    const searchValue = normalizeText(csvPreviewSearch);
    return csvPreviewRows.filter((row) => {
      const matchesSearch =
        normalizeText(row.question).includes(searchValue) ||
        normalizeText(row.exam_id).includes(searchValue);
      return (
        matchesSearch &&
        (csvPreviewStatus === "all" || row.status === csvPreviewStatus)
      );
    });
  }, [csvPreviewRows, csvPreviewSearch, csvPreviewStatus]);

  const uploadCsvMutation = useMutation({
    mutationFn: ({ file, uploadedBy }) => uploadCsvToStaging(file, uploadedBy),
    onSuccess: (res) => {
      toast.success(res.message || "Imported successfully");
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
      queryClient.invalidateQueries({ queryKey: ["main-questions"] });
    },
    onError: (err) => toast.error(err.message || "Import failed"),
  });

  const validateStagingMutation = useMutation({
    mutationFn: validateStagingQuestionsApi,
    onSuccess: () => {
      toast.success("Validated successfully");
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
    },
    onError: (err) => toast.error(err.message || "Validation failed"),
  });

  const pushToMainDbMutation = useMutation({
    mutationFn: () => pushFinalDistinctQuestions({ scope: "all" }),
    onSuccess: (res) => {
      const pushedCount = Number(
        res.data?.pushed || res.data?.inserted_count || 0,
      );
      if (pushedCount > 0) toast.success(`${pushedCount} questions inserted`);
      else toast.error(res.message || "No questions inserted");
      queryClient.invalidateQueries({ queryKey: ["main-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-questions"] });
      queryClient.invalidateQueries({ queryKey: ["staging-status-counts"] });
    },
    onError: (err) => toast.error(err.message || "Push failed"),
  });

  async function handleCsvFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    try {
      setSelectedCsvFile(file);
      setImportStep(2);
      const text = await file.text();
      const csvRows = parseCsvText(text);
      if (csvRows.length < 2) {
        toast.error("CSV must contain header and data");
        return;
      }
      const headers = csvRows[0].map(normalizeHeader);
      const missingColumns = REQUIRED_CSV_COLUMNS.filter(
        (col) => !headers.includes(col),
      );
      if (missingColumns.length > 0) {
        toast.error(`Missing columns: ${missingColumns.join(", ")}`);
        return;
      }
      const rows = csvRows.slice(1).map((cells) => {
        const row = {};
        headers.forEach((h, i) => (row[h] = cells[i] || ""));
        return row;
      });
      const validatedRows = validateCsvRows(rows);
      setCsvPreviewRows(validatedRows);
      setCsvPreviewSummary(getCsvSummary(validatedRows));
      setImportStep(3);
    } catch (error) {
      toast.error(error.message || "Failed to preview CSV");
    } finally {
      event.target.value = "";
    }
  }

  async function confirmCsvImportToStaging(setActiveTab) {
    if (!selectedCsvFile || csvPreviewSummary.valid === 0) {
      toast.error("No valid rows to import");
      return;
    }
    try {
      const uploadedBy = user?.name || user?.email || user?.username || "admin";
      const res = await uploadCsvMutation.mutateAsync({
        file: selectedCsvFile,
        uploadedBy,
      });
      setImportStep(4);
      const newImportId = res.import_id || res.data?.import_id || "";
      if (newImportId) setStagingImportId(String(newImportId));

      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStep(1);
        setSelectedCsvFile(null);
        setCsvPreviewRows([]);
        setActiveTab("staging");
        loadStaging();
        loadImportHistory();
        loadQuestions();
      }, 800);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  async function validateStagingQuestions() {
    try {
      await validateStagingMutation.mutateAsync();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }

  async function openPushPreview() {
    try {
      const res = await getFinalPushPreview();
      setPushPreview({
        success: true,
        data: res.data || res.preview || {},
        summary: res.data || res.summary || {},
      });
      setIsPushPreviewModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to generate preview");
    }
  }

  async function confirmPushToMainDb(setActiveTab) {
    try {
      await pushToMainDbMutation.mutateAsync();
      setPushPreview(null);
      setIsPushPreviewModalOpen(false);
      setActiveTab("main");
    } catch (error) {
      console.error("Push failed:", error);
    }
  }

  async function openImportDetails(importId) {
    try {
      setIsImportDetailsLoading(true);
      const res = await getSingleImportHistory(importId);
      const item = res.importData || res.data || res.import || null;
      if (!item) throw new Error("Import details not found");
      setSelectedImportDetails({
        id: item.id,
        file_name: item.file_name || "-",
        uploaded_by: item.uploaded_by || "-",
        total_rows: item.total_rows || 0,
        valid_rows: item.csv_valid_rows || 0,
        error_rows: item.csv_error_rows || 0,
        missing_rows: item.csv_missing_rows || 0,
        duplicate_rows: item.csv_duplicate_rows || 0,
        current_stage: item.current_stage || "-",
        stage_history: parseStageHistory(item.stage_history),
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
      setIsImportDetailsOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load details");
    } finally {
      setIsImportDetailsLoading(false);
    }
  }

  const pushPreviewSummary = {
    overallCount:
      pushPreview?.summary?.total_staging ||
      pushPreview?.summary?.totalStaging ||
      pushPreview?.summary?.overallCount ||
      0,
    readyToPush:
      pushPreview?.summary?.ready_to_push ||
      pushPreview?.summary?.readyToPush ||
      0,
    alreadyInMainDb:
      pushPreview?.summary?.already_in_main_db ||
      pushPreview?.summary?.alreadyInMainDb ||
      0,
    duplicatesInsideStaging:
      pushPreview?.summary?.duplicates_inside_staging ||
      pushPreview?.summary?.duplicatesInsideStaging ||
      0,
    distinctCount:
      pushPreview?.summary?.final_distinct ||
      pushPreview?.summary?.finalDistinct ||
      pushPreview?.summary?.distinctCount ||
      0,
    errorCount:
      pushPreview?.summary?.error_count ||
      pushPreview?.summary?.errorCount ||
      pushPreview?.summary?.errors ||
      0,
  };

  return {
    isImportModalOpen,
    setIsImportModalOpen,
    importStep,
    setImportStep,
    selectedCsvFile,
    setSelectedCsvFile,
    csvPreviewRows,
    csvPreviewSummary,
    csvPreviewSearch,
    setCsvPreviewSearch,
    csvPreviewStatus,
    setCsvPreviewStatus,
    pushPreview,
    isPushPreviewModalOpen,
    setIsPushPreviewModalOpen,
    isImportDetailsOpen,
    setIsImportDetailsOpen,
    isImportDetailsLoading,
    selectedImportDetails,
    setSelectedImportDetails,
    setStagingImportId,
    isCsvUploading: uploadCsvMutation.isPending,
    isPushing: pushToMainDbMutation.isPending,
    handleCsvFile,
    confirmCsvImportToStaging,
    validateStagingQuestions,
    openPushPreview,
    confirmPushToMainDb,
    openImportDetails,
    pushPreviewSummary,
    stagingImportId,
    filteredCsvPreviewRows,
  };
}
