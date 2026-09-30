import { API_BASE_URL } from "../config/api.js";

/**
 * Centralized API Client
 *
 * Provides unified HTTP methods for all API calls with:
 * - Automatic base URL handling
 * - Consistent authentication via HTTP-only cookies
 * - Unified error handling
 * - Query string building utilities
 */

/**
 * Build query string from params object
 */
export function buildQueryString(params) {
  if (!params) return "";
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return filtered ? `?${filtered}` : "";
}

/**
 * Unified response handler
 */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    if (isJson) {
      const data = await res.json().catch(() => ({}));
      message = data.message || data.error || message;
    }

    // Status-specific error messages
    if (res.status === 400) throw new Error(message);
    if (res.status === 401) throw new Error(message || "Session expired. Please log in again.");
    if (res.status === 403) throw new Error(message || "You do not have permission to perform this action.");
    if (res.status === 429) throw new Error(message || "Too many requests. Please try again later.");
    if (res.status === 500) throw new Error(message || "Server error. Please try again.");

    throw new Error(message);
  }

  return isJson ? res.json() : { success: true };
}

/**
 * Core request method
 */
async function request(path, options = {}) {
  // Build full URL
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  // Handle headers
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // Make request
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Always include cookies for authentication
  });

  return handleResponse(res);
}

/**
 * HTTP Methods
 */
export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),

  post: (path, body, options = {}) => request(path, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  patch: (path, body, options = {}) => request(path, {
    ...options,
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  put: (path, body, options = {}) => request(path, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
};

export default apiClient;
