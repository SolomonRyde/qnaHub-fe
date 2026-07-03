export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.rydevalues.cloud/api/v1";

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      sessionStorage.clear();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      throw new Error("Session expired. Please login again.");
    }

    throw new Error(data?.message || `Request failed: ${res.status}`);
  }

  return data;
}