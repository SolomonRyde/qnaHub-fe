import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution
 * @param {...string} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 */
// export function formatDate(date, options = {}) {
//   if (!date) return "";

//   const d = new Date(date);
//   if (isNaN(d.getTime())) return "";

//   const defaultOptions = {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   };

//   return d.toLocaleDateString("en-US", { ...defaultOptions, ...options });
// }

/**
 * Format number with commas
 * @param {number} num - Number to format
 */
export function formatNumber(num) {
  if (num == null) return "";
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate random ID for keys
 */
export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^OPTION\s*/, "")
    .replace(/^OPTION_/, "")
    .replace(/^OPTION-/, "");
}

export function normalizeStageStatus(value) {
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
  if (["valid", "ready", "ready_to_push"].includes(status))
    return "ready_to_push";
  if (
    [
      "duplicate_in_staging",
      "duplicates_in_staging",
      "duplicate_inside_staging",
      "staging_duplicate",
    ].includes(status)
  )
    return "duplicate_in_staging";
  if (
    [
      "already_in_main_db",
      "already_exists_in_main_db",
      "exists_in_main_db",
      "main_db_duplicate",
      "duplicate_in_main", // ✅ ADD THIS: Matches the actual DB ENUM value
      "duplicate_in_prod", // ✅ ADD THIS: Just in case legacy code still sends this
    ].includes(status)
  )
    return "already_in_main_db";
  if (["duplicate", "duplicates"].includes(status)) return "duplicate";
  if (["error", "invalid"].includes(status)) return "error";
  if (["missing", "missing_value", "missing_values"].includes(status))
    return "missing";
  if (["pushed", "completed"].includes(status)) return "pushed";
  return status || "pending";
}

export function getStagingStatus(row) {
  const rawStatus = normalizeStageStatus(row.stage_status || row.status);
  const reason = normalizeStageStatus(row.duplicate_reason || row.message);
  if (reason === "already_in_main_db") return "already_in_main_db";
  if (reason === "duplicate_in_staging") return "duplicate_in_staging";
  if (
    String(row.duplicate_reason || row.message || "")
      .toLowerCase()
      .includes("already")
  )
    return "already_in_main_db";
  if (
    String(row.duplicate_reason || row.message || "")
      .toLowerCase()
      .includes("duplicate")
  )
    return "duplicate_in_staging";
  return rawStatus;
}

export function displayDifficulty(value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const map = {
    easy: "Easy",
    intermediate: "Intermediate",
    medium: "Intermediate",
    hard: "Hard",
  };
  return map[key] || "-";
}

export function getUniqueOptions(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))];
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const REQUIRED_CSV_COLUMNS = [
  "exam_id",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
];

export function normalizeHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export function parseCsvText(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      i++;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(cell.trim());
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  row.push(cell.trim());
  if (row.some((v) => v !== "")) rows.push(row);
  return rows;
}

export function validateCsvRows(rows) {
  const questionCount = new Map();
  rows.forEach((row) => {
    const key = normalizeText(row.question);
    if (key) questionCount.set(key, (questionCount.get(key) || 0) + 1);
  });

  return rows.map((row, index) => {
    const errors = [];
    const duplicateErrors = [];
    REQUIRED_CSV_COLUMNS.forEach((column) => {
      if (!String(row[column] || "").trim()) errors.push(`Missing ${column}`);
    });
    const answer = normalizeAnswer(row.correct_answer);
    if (row.correct_answer && !["A", "B", "C", "D"].includes(answer))
      errors.push("correct_answer must be A, B, C or D");
    const questionKey = normalizeText(row.question);
    if (questionKey && questionCount.get(questionKey) > 1)
      duplicateErrors.push("Duplicate question inside CSV");

    let status = "valid";
    if (errors.length > 0) status = "error";
    else if (duplicateErrors.length > 0) status = "duplicate";

    return {
      ...row,
      row_no: index + 1,
      correct_answer: answer,
      status,
      message: [...errors, ...duplicateErrors].join(", ") || "Ready",
    };
  });
}

export function getCsvSummary(rows) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1;
      if (row.status === "valid") summary.valid += 1;
      else if (row.status === "duplicate") summary.duplicate += 1;
      else summary.invalid += 1;
      return summary;
    },
    { total: 0, valid: 0, invalid: 0, duplicate: 0 },
  );
}

export function parseStageHistory(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
