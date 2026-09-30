import { API_PATHS } from "../config/api.js";
import { apiClient, buildQueryString } from "../lib/apiClient.js";
export function getQuestions(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all",
    ),
  );

  const query = buildQueryString(filteredParams);

  return apiClient.get(`${API_PATHS.QUESTIONS}${query}`);
}

function getLoggedInUserForAudit() {
  const possibleKeys = ["user", "auth", "authUser", "currentUser", "admin"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      return (
        parsed.name ||
        parsed.full_name ||
        parsed.fullName ||
        parsed.username ||
        parsed.email ||
        parsed.user?.name ||
        parsed.user?.full_name ||
        parsed.user?.fullName ||
        parsed.user?.username ||
        parsed.user?.email ||
        parsed.data?.name ||
        parsed.data?.email ||
        null
      );
    } catch {
      // ignore invalid JSON
    }
  }

  return "admin";
}

export function uploadCsvToStaging(file, uploadedBy) {
  const userName = uploadedBy || getLoggedInUserForAudit();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploaded_by", userName);
  formData.append("uploadedBy", userName);
  formData.append("created_by", userName);

  return apiClient.post(
    `${API_PATHS.BASE}/question-imports/staging`,
    formData,
    {
      headers: {
        "x-user-id": String(userName),
        "x-uploaded-by": String(userName),
        "x-created-by": String(userName),
        "x-username": String(userName), // ✅ ADD THIS LINE
      },
    },
  );
}

export function getStagingQuestions(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all",
    ),
  );

  const query = buildQueryString(filteredParams);

  return apiClient.get(`${API_PATHS.BASE}/staging-questions${query}`);
}

export function validateStagingQuestionsApi() {
  return apiClient.post(`${API_PATHS.BASE}/staging-questions/validate-all`, {
    scope: "all",
  });
}

export function getPushPreview(importId) {
  const query = importId ? `?import_id=${encodeURIComponent(importId)}` : "";

  return apiClient.get(
    `${API_PATHS.BASE}/staging-questions/push-preview${query}`,
  );
}

export function pushStagingToMain(importId) {
  return apiClient.post(
    `${API_PATHS.BASE}/staging-questions/push-distinct`,
    importId ? { import_id: importId } : {},
  );
}

export function updateQuestion(id, payload) {
  return apiClient.patch(`${API_PATHS.QUESTIONS}/${id}`, payload);
}

export function deleteQuestion(id) {
  return apiClient.delete(`${API_PATHS.QUESTIONS}/${id}`);
}

export async function deleteBulkQuestions(ids) {
  return apiClient.delete(`${API_PATHS.QUESTIONS}/bulk`, { ids });
}

export function getImportHistory(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all",
    ),
  );

  const query = buildQueryString(filteredParams);

  return apiClient.get(`${API_PATHS.BASE}/question-imports${query}`);
}

export function getSingleImportHistory(importId) {
  if (!importId) {
    throw new Error("Import ID is required");
  }

  return apiClient.get(
    `${API_PATHS.BASE}/question-imports/${encodeURIComponent(importId)}`,
  );
}

export function getFinalPushPreview() {
  return apiClient.get(
    `${API_PATHS.BASE}/staging-questions/final-push-preview`,
  );
}

export function pushFinalDistinctQuestions(payload = { scope: "all" }) {
  return apiClient.post(
    `${API_PATHS.BASE}/staging-questions/push-final-distinct`,
    payload,
  );
}

export function getQuestionFilterMeta() {
  return apiClient.get(`${API_PATHS.QUESTIONS}/filter-meta`);
}

export function getExams(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all",
    ),
  );

  const query = buildQueryString(filteredParams);

  return apiClient.get(`${API_PATHS.EXAM}/admin${query}`);
}

export function getIndustries() {
  return apiClient.get(`${API_PATHS.EXAM}/industries`);
  // return apiClient.get(`${API_PATHS.QUESTIONS}/exam/industries`);
}

export function getHierarchy(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const query = buildQueryString(filteredParams);

  return apiClient.get(
    `${API_PATHS.GETHIERARCHY}${query}`,
    // `${API_PATHS.QUESTIONS}/all-industries-categories-subcategories${query}`,
  );
}

export async function deleteSingleStagingQuestion(stageId) {
  return apiClient.delete(
    `${API_PATHS.BASE}/staging-questions/${encodeURIComponent(stageId)}`,
  );
}

export async function deleteDuplicateQuestions() {
  return apiClient.delete(`${API_PATHS.BASE}/staging-questions/duplicates`);
}

export async function deleteAllStagingQuestions() {
  return apiClient.delete(`${API_PATHS.BASE}/staging-questions/all`);
}

export async function deleteStagingQuestionsByStatus(status) {
  return apiClient.delete(
    `${API_PATHS.BASE}/staging-questions/by-status/${encodeURIComponent(status)}`,
  );
}

// ✅ NEW: Delete import history item
export async function deleteImportHistoryItem(importId) {
  return apiClient.delete(
    `${API_PATHS.BASE}/question-imports/${encodeURIComponent(importId)}`,
  );
}
