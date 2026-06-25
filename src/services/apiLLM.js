// src/services/llmService.js
const LLM_API_BASE = "https://api.rydevalues.cloud/api/v1";

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
    } else {
      const text = await res.text().catch(() => "");
      console.error("🔴 LLM API Error: ", res.status, text.substring(0, 200));
    }

    if (res.status === 400) throw new Error(message);
    if (res.status === 401)
      throw new Error("Session expired. Please log in again.");
    if (res.status === 403) throw new Error("Admin access required.");
    if (res.status === 429)
      throw new Error("Too many requests. Please try again later.");
    if (res.status === 500)
      throw new Error(
        "AI service is temporarily unavailable. Please try again.",
      );

    throw new Error(message);
  }
  return isJson ? res.json() : { success: true };
}

/**
 * Reusable fetch wrapper
 */
async function llmRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${LLM_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return handleResponse(res);
}

/**
 * Generate questions
 */
export const generateQuestions = async ({
  exam_id,
  difficulty,
  count,
  prompt = "",
  model = "gemini-2.5-flash",
}) => {
  console.log(
    `🤖 Generating ${count} ${difficulty} questions for Exam ${exam_id} using ${model}...`,
  );
  return llmRequest("/llm/questions", {
    method: "POST",
    body: JSON.stringify({
      exam_id,
      difficulty,
      count,
      prompt: prompt?.trim() || "",
      model,
    }),
  });
};

// ✅ NEW: Fetch persistent AI Stats from backend
export const getAiStats = async () => {
  return llmRequest("/llm/questions/stats");
};

// ✅ APIs for Generated Files
export const getGeneratedFiles = async () => {
  return llmRequest("/llm/questions/generated-files");
};

export const deleteGeneratedFile = async (id) => {
  return llmRequest(`/llm/questions/generated-files/${id}`, {
    method: "DELETE",
  });
};

// ✅ Validation constants
export const VALID_DIFFICULTIES = ["easy", "intermediate", "hard"];
export const VALID_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro"];

export const validateGenerationParams = ({
  exam_id,
  difficulty,
  count,
  model,
}) => {
  if (!exam_id) return { valid: false, error: "Please select an exam." };
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return {
      valid: false,
      error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
    };
  }
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return { valid: false, error: "Question count must be between 1 and 100" };
  }
  if (!VALID_MODELS.includes(model)) {
    return { valid: false, error: "Invalid LLM model selected." };
  }
  return { valid: true };
};

export default {
  generateQuestions,
  getAiStats, // ✅ Added
  getGeneratedFiles,
  deleteGeneratedFile,
  validateGenerationParams,
  VALID_DIFFICULTIES,
  VALID_MODELS,
};
