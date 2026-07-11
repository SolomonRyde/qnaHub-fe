const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://api.rydevalues.cloud/api/v1"
).replace(/\/$/, "");

function findTokenInsideObject(obj) {
  if (!obj || typeof obj !== "object") return null;

  return (
    obj.accessToken ||
    obj.access_token ||
    obj.token ||
    obj.authToken ||
    obj.jwt ||
    obj?.data?.accessToken ||
    obj?.data?.access_token ||
    obj?.data?.token ||
    obj?.user?.accessToken ||
    obj?.user?.access_token ||
    obj?.user?.token ||
    null
  );
}

function getToken() {
  const possibleKeys = [
    "accessToken",
    "access_token",
    "token",
    "authToken",
    "jwt",
    "user",
    "auth",
    "authUser",
    "currentUser",
    "admin",
  ];

  for (const key of possibleKeys) {
    const localValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    const value = localValue || sessionValue;

    if (!value) continue;

    if (value.startsWith("eyJ") || value.length > 40) {
      return value;
    }

    try {
      const parsed = JSON.parse(value);
      const token = findTokenInsideObject(parsed);

      if (token) return token;
    } catch {
      // ignore invalid JSON
    }
  }

  return import.meta.env.VITE_DEV_ACCESS_TOKEN || null;
}

async function request(url, options = {}) {
  const isFormData = options.body instanceof FormData;
  const token = getToken();

  const fullUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  console.log("API URL:", fullUrl);
  console.log("TOKEN FOUND:", token ? "YES" : "NO");

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  });

  const rawText = await response.text();

  let data = null;

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = {
      success: false,
      message: rawText || response.statusText || "Invalid server response",
      raw: rawText,
    };
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        data.message ||
          "Too many requests. Please wait for 2-5 minutes and try again.",
      );
    }

    if (response.status === 401) {
      throw new Error(data.message || "Access token required or expired");
    }

    if (response.status === 403) {
      throw new Error(data.message || "You do not have permission");
    }

    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`,
    );
  }

  if (data && data.success === false) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}
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

  const query = new URLSearchParams(filteredParams).toString();

  return request(`/questions${query ? `?${query}` : ""}`);
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
  console.log("LoggedInUserAudit", userName);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploaded_by", userName);
  formData.append("uploadedBy", userName);
  formData.append("created_by", userName);

  return request("/question-imports/staging", {
    method: "POST",
    headers: {
      "x-user-id": String(userName),
      "x-uploaded-by": String(userName),
      "x-created-by": String(userName),
      "x-username": String(userName), // ✅ ADD THIS LINE
    },
    body: formData,
  });
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

  const query = new URLSearchParams(filteredParams).toString();

  return request(`/staging-questions${query ? `?${query}` : ""}`);
}

export function validateStagingQuestionsApi() {
  return request("/staging-questions/validate-all", {
    method: "POST",
    body: JSON.stringify({
      scope: "all",
    }),
  });
}

export function getPushPreview(importId) {
  const query = importId ? `?import_id=${encodeURIComponent(importId)}` : "";

  return request(`/staging-questions/push-preview${query}`);
}

export function pushStagingToMain(importId) {
  return request("/staging-questions/push-distinct", {
    method: "POST",
    body: JSON.stringify(importId ? { import_id: importId } : {}),
  });
}

export function updateQuestion(id, payload) {
  return request(`/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteQuestion(id) {
  return request(`/questions/${id}`, {
    method: "DELETE",
  });
}

export async function deleteBulkQuestions(ids) {
  return request("/questions/bulk", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
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

  const query = new URLSearchParams(filteredParams).toString();

  return request(`/question-imports${query ? `?${query}` : ""}`);
}

export function getSingleImportHistory(importId) {
  if (!importId) {
    throw new Error("Import ID is required");
  }

  return request(`/question-imports/${encodeURIComponent(importId)}`);
}

export function getFinalPushPreview() {
  return request("/staging-questions/final-push-preview");
}

export function pushFinalDistinctQuestions(payload = { scope: "all" }) {
  return request("/staging-questions/push-final-distinct", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getQuestionFilterMeta() {
  return request("/questions/filter-meta");
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

  const query = new URLSearchParams(filteredParams).toString();

  return request(`/exam${query ? `?${query}` : ""}`);
}

export function getIndustries() {
  return request("/exam/industries");
}

export function getHierarchy(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const query = new URLSearchParams(filteredParams).toString();

  return request(
    `/all-industries-categories-subcategories${query ? `?${query}` : ""}`,
  );
}

export async function deleteSingleStagingQuestion(stageId) {
  return request(`/staging-questions/${encodeURIComponent(stageId)}`, {
    method: "DELETE",
  });
}

export async function deleteDuplicateQuestions() {
  return request("/staging-questions/duplicates", {
    method: "DELETE",
  });
}

export async function deleteAllStagingQuestions() {
  return request("/staging-questions/all", {
    method: "DELETE",
  });
}

export async function deleteStagingQuestionsByStatus(status) {
  return request(`/staging-questions/by-status/${encodeURIComponent(status)}`, {
    method: "DELETE",
  });
}

// ✅ NEW: Delete import history item
export async function deleteImportHistoryItem(importId) {
  return request(`/question-imports/${encodeURIComponent(importId)}`, {
    method: "DELETE",
  });
}
