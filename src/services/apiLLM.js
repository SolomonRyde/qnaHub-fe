// src/services/llmService.js
import { apiClient, buildQueryString } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

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
  return apiClient.post(`${API_PATHS.LLM}/questions`, {
    exam_id,
    difficulty,
    count,
    prompt: prompt?.trim() || "",
    model,
  });
};

// ✅ NEW: Fetch persistent AI Stats from backend
export const getAiStats = async () => {
  return apiClient.get(`${API_PATHS.LLM}/questions/stats`);
};

// ✅ APIs for Generated Files
export const getGeneratedFiles = async () => {
  return apiClient.get(`${API_PATHS.LLM}/questions/generated-files`);
};

export const deleteGeneratedFile = async (id) => {
  return apiClient.delete(`${API_PATHS.LLM}/questions/generated-files/${id}`);
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
