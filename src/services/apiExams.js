const API_BASE = "https://api.rydevalues.cloud/api/v1/exam";

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const handleResponse = async (res) => {
  const resClone = res.clone();

  let data;
  try {
    data = await res.json();
  } catch (e) {
    const text = await resClone.text();
    throw new Error(`Server returned ${res.status}: ${text}`);
  }

  if (!res.ok) {
    console.error("API Error:", {
      status: res.status,
      data: data,
    });

    const error = new Error(data.message || data.error || "Request failed");
    error.status = res.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
};

const buildQueryString = (params) => {
  if (!params) return "";
  const filtered = Object.entries(params)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  return filtered ? `?${filtered}` : "";
};

/* ========================================
   PUBLIC APIS
   ======================================== */

export async function getAllExams(params = {}) {
  const queryString = buildQueryString({
    ...params,
    status: params.status || "published",
  });
  const res = await fetch(`${API_BASE}${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function getExamBySlug(slug) {
  const res = await fetch(`${API_BASE}/slug/${slug}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function getIndustries() {
  const res = await fetch(`${API_BASE}/industries`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function getCategories(industryId) {
  const queryString = buildQueryString({ industryId });
  const res = await fetch(`${API_BASE}/categories${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function getSubcategories(categoryId) {
  const queryString = buildQueryString({ categoryId });
  const res = await fetch(`${API_BASE}/subcategories${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/* ========================================
   ADMIN APIS
   ======================================== */

export async function getAdminExams(params = {}) {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE}/admin${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function createExam(formData) {
  const res = await fetch(API_BASE, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(true),
    body: formData,
  });
  return handleResponse(res);
}

export async function updateExam(id, formData) {
  const isMultipart = formData instanceof FormData;

  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    credentials: "include",
    // IMPORTANT: Do NOT set Content-Type header for FormData.
    headers: isMultipart ? {} : { "Content-Type": "application/json" },
    body: isMultipart ? formData : JSON.stringify(formData),
  });

  return handleResponse(res);
}

export async function deleteExam(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function updateExamStatus(id, status) {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function toggleFeatured(id, isFeatured) {
  const res = await fetch(`${API_BASE}/${id}/featured`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify({ is_featured: isFeatured }),
  });
  return handleResponse(res);
}

/* ========================================
   ANALYTICS
   ======================================== */

export async function getExamAnalytics(industryId = null) {
  const queryString = buildQueryString({ industryId });
  const res = await fetch(`${API_BASE}/analytics${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  return handleResponse(res);
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
