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

/**
 * Generate questions with PDF source material
 */
/**
 * Generate questions with PDF source material
 */
export const generateQuestionsWithPdf = async ({
  exam_id,
  difficulty,
  count,
  prompt = "",
  model = "gemini-2.5-flash",
  pdfFile,
}) => {
  if (!pdfFile) throw new Error("Please upload a PDF file.");

  console.log(
    `🤖 Generating ${count} ${difficulty} questions for Exam ${exam_id} using ${model} with PDF source...`,
  );

  // Multipart body — apiClient skips the JSON Content-Type for FormData,
  // so the browser sets it with the correct boundary.
  const formData = new FormData();
  formData.append("pdf", pdfFile); // must match uploadPdf.single("pdf") on the backend
  formData.append("exam_id", exam_id);
  formData.append("difficulty", difficulty);
  formData.append("count", count);
  formData.append("prompt", prompt?.trim() || "");
  formData.append("model", model);

  return apiClient.post(
    `${API_PATHS.LLM}/questions/generate-with-pdf`,
    formData,
  );
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
// ✅ Validation constants
export const VALID_DIFFICULTIES = ["easy", "intermediate", "hard"];
export const VALID_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro"];
export const MAX_PDF_SIZE_MB = 20; // matches the "max 20MB" text in the UI
export const MAX_PROMPT_LENGTH = 1000; // text-only generation (backend schema: 1000)
export const MAX_PDF_PROMPT_LENGTH = 2000; // PDF generation (backend schema: 2000)

export const validateGenerationParams = ({
  exam_id,
  difficulty,
  count,
  model,
  prompt = "",
  usePdf = false,
  pdfFile = null,
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

  const trimmedPrompt = prompt?.trim() || "";

  // ✅ PDF mode: PDF and prompt are both mandatory
  if (usePdf) {
    if (!pdfFile) {
      return { valid: false, error: "Please upload a PDF file." };
    }

    const isPdf =
      pdfFile.type === "application/pdf" ||
      pdfFile.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return { valid: false, error: "Only PDF files are allowed." };
    }

    if (pdfFile.size === 0) {
      return { valid: false, error: "The selected PDF file is empty." };
    }

    if (pdfFile.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      return {
        valid: false,
        error: `PDF is too large. Maximum size is ${MAX_PDF_SIZE_MB}MB.`,
      };
    }

    if (!trimmedPrompt) {
      return {
        valid: false,
        error:
          "Please enter a prompt describing the topic to generate from this PDF.",
      };
    }

    if (trimmedPrompt.length > MAX_PDF_PROMPT_LENGTH) {
      return {
        valid: false,
        error: `Prompt is too long. Maximum is ${MAX_PDF_PROMPT_LENGTH} characters.`,
      };
    }

    return { valid: true };
  }

  // ✅ Text-only mode: prompt is optional but has a max length
  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt is too long. Maximum is ${MAX_PROMPT_LENGTH} characters.`,
    };
  }

  return { valid: true };
};
export default {
  generateQuestions,
  generateQuestionsWithPdf,
  getAiStats, // ✅ Added
  getGeneratedFiles,
  deleteGeneratedFile,
  validateGenerationParams,
  VALID_DIFFICULTIES,
  VALID_MODELS,
};
