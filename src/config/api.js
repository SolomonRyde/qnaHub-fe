/**
 * Centralized API Configuration
 *
 * Manages backend base URL with environment-aware defaults:
 * - Development: http://localhost:3000 (local backend)
 * - Production: https://api.qnahub.in (deployed backend)
 *
 * Override via VITE_API_BASE_URL in .env file
 */

const getApiBaseUrl = () => {
  // Priority 1: Explicit environment variable (allows manual override)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 2: Smart default based on build mode
  if (import.meta.env.DEV) {
    // Development mode - point to local backend
    return "http://localhost:3000";
  }

  // Priority 3: Production default
  return "https://api.qnahub.in";
};

// Export the resolved base URL
export const API_BASE_URL = getApiBaseUrl();

// Export common API path prefixes for convenience
export const API_PATHS = {
  BASE: "/api/v1",
  AUTH: "/api/v1/auth",
  ADMIN: "/api/v1/admin",
  EXAM: "/api/v1/exam",
  QUESTIONS: "/api/v1/questions",
  LLM: "/api/v1/llm",
  GETHIERARCHY: "/api/v1/all-industries-categories-subcategories",
  INDUSTRIES: "/api/v1/industries",
  CATEGORIES: "/api/v1/categories",
  SUBCATEGORIES: "/api/v1/subcategories",
  STAGING_QUESTIONS: "/api/v1/staging-questions",
  QUESTION_IMPORTS: "/api/v1/question-imports",
  CONTACT: "/api/v1/contact",
};

// Helper to build full API URLs
export const buildApiUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
