import { apiClient, buildQueryString } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

/* ========================================
   PUBLIC APIS
   ======================================== */

export async function getAllExams(params = {}) {
  const queryString = buildQueryString({
    ...params,
    status: params.status || "published",
  });
  return apiClient.get(`${API_PATHS.EXAM}${queryString}`);
}

export async function getExamBySlug(slug) {
  return apiClient.get(`${API_PATHS.EXAM}/slug/${slug}`);
}

export async function getIndustries() {
  return apiClient.get(`${API_PATHS.EXAM}/industries`);
}

export async function getCategories(industryId) {
  const queryString = buildQueryString({ industryId });
  return apiClient.get(`${API_PATHS.EXAM}/categories${queryString}`);
}

export async function getSubcategories(categoryId) {
  const queryString = buildQueryString({ categoryId });
  return apiClient.get(`${API_PATHS.EXAM}/subcategories${queryString}`);
}

/* ========================================
   EXAM ATTEMPT APIS (Authenticated Users)
   ======================================== */

export async function startExam(examId) {
  return apiClient.post(`${API_PATHS.EXAM}/${examId}/start`);
}

export async function getExamQuestions(examId) {
  return apiClient.get(`${API_PATHS.EXAM}/${examId}/questions`);
}

export async function submitExam(attemptId, answers) {
  return apiClient.post(`${API_PATHS.EXAM}/submit`, { attemptId, answers });
}

export async function getExamResult(attemptId) {
  return apiClient.get(`${API_PATHS.EXAM}/result/${attemptId}`);
}

/* ========================================
   USER / ACCOUNT APIS (Authenticated Users)
   ======================================== */

// Returns the logged-in user's own exam attempt history.
// Backend must scope this to req.user.id from the auth cookie/session —
// never accept a userId param from the client for this endpoint.
//
// Confirmed response shape (GET /exam/my-attempts):
//   { success, data: [{ id, exam_id, exam_title, slug, score, total_marks,
//                        percentage, passed, status, start_time, end_time }],
//     meta: { total, page, limit, totalPages } }
export async function getMyExamAttempts(params = {}) {
  const queryString = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 5,
    ...params,
  });
  return apiClient.get(`${API_PATHS.EXAM}/my-attempts${queryString}`);
}

/* ========================================
   ADMIN APIS
   ======================================== */

export async function getAdminExams(params = {}) {
  const queryString = buildQueryString(params);
  return apiClient.get(`${API_PATHS.EXAM}/admin${queryString}`);
}

export async function createExam(formData) {
  return apiClient.post(API_PATHS.EXAM, formData);
}

export async function updateExam(id, formData) {
  return apiClient.patch(`${API_PATHS.EXAM}/${id}`, formData);
}

export async function deleteExam(id) {
  return apiClient.delete(`${API_PATHS.EXAM}/${id}`);
}

export async function updateExamStatus(id, status) {
  return apiClient.patch(`${API_PATHS.EXAM}/${id}/status`, { status });
}

export async function toggleFeatured(id, isFeatured) {
  return apiClient.patch(`${API_PATHS.EXAM}/${id}/featured`, { is_featured: isFeatured });
}

/* ========================================
   ANALYTICS
   ======================================== */

export async function getExamAnalytics(industryId = null) {
  const queryString = buildQueryString({ industryId });
  return apiClient.get(`${API_PATHS.EXAM}/analytics${queryString}`);
}

/* ========================================
   UTILITIES
   ======================================== */

export function parseExamData(exam) {
  if (!exam) return null;
  return {
    id: exam.id,
    exam_title: exam.exam_title,
    slug: exam.slug,
    description: exam.description,
    difficulty: exam.difficulty,
    duration_minutes: exam.duration_minutes,
    no_of_questions: exam.no_of_questions,
    cover_image_path: exam.cover_image_path,
    is_featured: Boolean(exam.is_featured),
    status: exam.status,
    // ✅ Include topics_covered in parsed data
    topics_covered: exam.topics_covered || [],
    industry: { id: exam.industry_id, name: exam.industry_name },
    category: { id: exam.category_id, name: exam.category_name },
    subcategory: { id: exam.sub_category_id, name: exam.sub_category_name },
    industry_id: exam.industry_id,
    category_id: exam.category_id,
    subcategory_id: exam.sub_category_id,
  };
}

export function parseExamsList(exams = []) {
  return exams.map(parseExamData).filter(Boolean);
}

/* ========================================
   ADMIN: EXAM ATTEMPTS DASHBOARD
   ======================================== */

// GET /exam/admin/attempts
// Returns { success, data: [...attempts], stats: {...}, pagination: {...} }
export async function getAdminExamAttempts(params = {}) {
  const queryString = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search || undefined,
    status: params.status || undefined,
    passed: params.passed ?? undefined, // "true" | "false"
    examId: params.examId || undefined,
    referralSource: params.referralSource || undefined,
    sort: params.sort || "created_at:desc",
    startDate: params.startDate || undefined,
    endDate: params.endDate || undefined,
  });
  return apiClient.get(`${API_PATHS.EXAM}/admin/attempts${queryString}`);
}

// GET /exam/admin/attempts/export
// Downloads Excel file
export async function exportAdminExamAttempts(params = {}) {
  const queryString = buildQueryString({
    search: params.search || undefined,
    status: params.status || undefined,
    passed: params.passed ?? undefined,
    examId: params.examId || undefined,
    referralSource: params.referralSource || undefined,
    sort: params.sort || "created_at:desc",
    startDate: params.startDate || undefined,
    endDate: params.endDate || undefined,
  });

  const res = await fetch(`${API_PATHS.EXAM}/admin/attempts/export${queryString}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to export");
  }

  // Handle blob download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Extract filename from Content-Disposition header if available
  const disposition = res.headers.get("Content-Disposition");
  let filename = "exam_attempts.xlsx";
  if (disposition && disposition.indexOf("attachment") !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// GET /exam/admin/attempts/:attemptId
// Returns { success, data: { ...attempt, answerReview: [...] } }
export async function getAdminAttemptDetail(attemptId) {
  return apiClient.get(`${API_PATHS.EXAM}/admin/attempts/${attemptId}`);
}
