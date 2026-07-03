import React, { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Database,
  FileCheck2,
  AlertTriangle,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  ArrowRight,
  FolderOpen,
  History,
  ShieldCheck,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { cn } from "../../../lib/utils";

import {
  getQuestions,
  uploadCsvToStaging,
  getStagingQuestions,
  validateStagingQuestionsApi,
  updateQuestion,
  deleteQuestion,
  getImportHistory,
  getSingleImportHistory,
  getFinalPushPreview,
  pushFinalDistinctQuestions,
  getIndustries,
  getHierarchy,
  getExams,
} from "../services/apiQuestions";


function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^OPTION\s*/, "")
    .replace(/^OPTION_/, "")
    .replace(/^OPTION-/, "");
}

function normalizeStageStatus(value) {
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  if (["valid", "ready", "ready_to_push"].includes(status)) {
    return "ready_to_push";
  }

  if (
    [
      "duplicate_in_staging",
      "duplicates_in_staging",
      "duplicate_inside_staging",
      "duplicates_inside_staging",
      "staging_duplicate",
    ].includes(status)
  ) {
    return "duplicate_in_staging";
  }

  if (
    [
      "already_in_main_db",
      "already_exists_in_main_db",
      "exists_in_main_db",
      "main_db_duplicate",
      "already_in_main",
    ].includes(status)
  ) {
    return "already_in_main_db";
  }

  if (["duplicate", "duplicates"].includes(status)) {
    return "duplicate";
  }

  if (["error", "invalid"].includes(status)) {
    return "error";
  }

  if (["missing", "missing_value", "missing_values"].includes(status)) {
    return "missing";
  }

  if (["pushed", "completed"].includes(status)) {
    return "pushed";
  }

  return status || "pending";
}

function getStagingStatus(row) {
  const rawStatus = normalizeStageStatus(row.stage_status || row.status);
  const reason = normalizeStageStatus(row.duplicate_reason || row.message);

  if (reason === "already_in_main_db") return "already_in_main_db";
  if (reason === "duplicate_in_staging") return "duplicate_in_staging";

  if (
    String(row.duplicate_reason || row.message || "")
      .toLowerCase()
      .includes("already")
  ) {
    return "already_in_main_db";
  }

  if (
    String(row.duplicate_reason || row.message || "")
      .toLowerCase()
      .includes("duplicate")
  ) {
    return "duplicate_in_staging";
  }

  return rawStatus;
}
const DIFFICULTY_LABELS = {
  easy: "Easy",
  intermediate: "Intermediate",
  medium: "Intermediate",
  hard: "Hard",
};

function displayDifficulty(value) {
  const key = String(value || "").trim().toLowerCase();
  return DIFFICULTY_LABELS[key] || "-";
}

function getUniqueOptions(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))];
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const value = String(status || "pending").toLowerCase();

  const classes = {
    valid: "bg-green-50 text-green-700 border-green-200",
    ready_to_push: "bg-green-50 text-green-700 border-green-200",
    pushed: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    missing: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
    duplicate: "bg-purple-50 text-purple-700 border-purple-200",
    validated: "bg-green-50 text-green-700 border-green-200",
    duplicates_checked: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        classes[value] || "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  const value = String(difficulty || "-").toLowerCase();

  const classes = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        classes[value] || "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {value}
    </span>
  );
}

function SoftPill({ children, color = "blue" }) {
  const classes = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        classes[color]
      )}
    >
      {children || "-"}
    </span>
  );
}

function StatsCard({ title, value, subtitle, icon: Icon, className }) {
  return (
    <Card className="rounded-2xl border border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn("rounded-xl p-3", className)}>
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {title}
            </p>
            <h2 className="mt-1 text-3xl font-bold leading-none">{value}</h2>
            <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryPill({ label, value, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-semibold",
        className
      )}
    >
      {label}: {value}
    </div>
  );
}

const REQUIRED_CSV_COLUMNS = [
  "exam_id",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
];

function normalizeHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function parseCsvText(text) {
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

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  return rows;
}

function validateCsvRows(rows) {
  const questionCount = new Map();

  rows.forEach((row) => {
    const key = normalizeText(row.question);
    if (!key) return;
    questionCount.set(key, (questionCount.get(key) || 0) + 1);
  });

  return rows.map((row, index) => {
    const errors = [];
    const duplicateErrors = [];

    REQUIRED_CSV_COLUMNS.forEach((column) => {
      if (!String(row[column] || "").trim()) {
        errors.push(`Missing ${column}`);
      }
    });

    const answer = normalizeAnswer(row.correct_answer);

    if (row.correct_answer && !["A", "B", "C", "D"].includes(answer)) {
      errors.push("correct_answer must be A, B, C or D");
    }

    const questionKey = normalizeText(row.question);

    if (questionKey && questionCount.get(questionKey) > 1) {
      duplicateErrors.push("Duplicate question inside CSV");
    }

    let status = "valid";

    if (errors.some((error) => error.toLowerCase().includes("missing"))) {
      status = "error";
    } else if (errors.length > 0) {
      status = "error";
    } else if (duplicateErrors.length > 0) {
      status = "duplicate";
    }

    return {
  ...row,
  row_no: index + 1,
  correct_answer: answer,
  status,
  message: [...errors, ...duplicateErrors].join(", ") || "Ready",
};
  });
}

function getCsvSummary(rows) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1;

      if (row.status === "valid") summary.valid += 1;
      else if (row.status === "duplicate") summary.duplicate += 1;
      else summary.invalid += 1;

      return summary;
    },
    {
      total: 0,
      valid: 0,
      invalid: 0,
      duplicate: 0,
    }
  );
}

function getQuestionKeys(row) {
  const examId = String(row.exam_id || "").trim();
  const questionTextKey = normalizeText(row.question);
  const hashKey = String(row.question_hash || "").trim();

  return [
    hashKey ? `${examId}|HASH|${hashKey}` : null,
    questionTextKey ? `${examId}|TEXT|${questionTextKey}` : null,
  ].filter(Boolean);
}

function hasAnyKey(sourceSet, keys) {
  return keys.some((key) => sourceSet.has(key));
}

function addAllKeys(sourceSet, keys) {
  keys.forEach((key) => sourceSet.add(key));
}

function buildLocalPushPreview(stagingRows = [], mainRows = []) {
  const mainKeys = new Set();

  mainRows.forEach((row) => {
    addAllKeys(mainKeys, getQuestionKeys(row));
  });

  const seenStagingKeys = new Set();

  const distinctRows = [];
  const duplicateRows = [];
  const errorRows = [];

  stagingRows.forEach((row) => {
    const status = getStagingStatus(row);
    const keys = getQuestionKeys(row);

    if (!row.question || keys.length === 0) {
      errorRows.push({
        ...row,
        duplicate_reason: "Missing question or question hash",
      });
      return;
    }

    if (status === "error" || status === "missing") {
      errorRows.push(row);
      return;
    }

    if (
      status === "duplicate" ||
      status === "duplicate_in_staging" ||
      status === "already_in_main_db"
    ) {
      duplicateRows.push(row);
      return;
    }

    if (status !== "ready_to_push") {
      return;
    }

    const alreadyInMainDb = hasAnyKey(mainKeys, keys);
    const alreadyInStaging = hasAnyKey(seenStagingKeys, keys);

    if (alreadyInMainDb || alreadyInStaging) {
      duplicateRows.push({
        ...row,
        duplicate_reason: alreadyInMainDb
          ? "Already exists in Main DB"
          : "Duplicate inside staging",
      });
      return;
    }

    addAllKeys(seenStagingKeys, keys);
    distinctRows.push(row);
  });

  return {
    overallCount: stagingRows.length,
    mainDbCount: mainRows.length,
    distinctCount: distinctRows.length,
    duplicateCount: duplicateRows.length,
    errorCount: errorRows.length,
    distinctRows,
    duplicateRows,
    errorRows,
  };
}
function parseStageHistory(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ManageQuestionsPage() {
  const [mainQuestions, setMainQuestions] = useState([]);
  const [stagingQuestions, setStagingQuestions] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [hierarchyRows, setHierarchyRows] = useState([]);

  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
const [historyPagination, setHistoryPagination] = useState(null);

const [selectedImportDetails, setSelectedImportDetails] = useState(null);
const [isImportDetailsOpen, setIsImportDetailsOpen] = useState(false);
const [isImportDetailsLoading, setIsImportDetailsLoading] = useState(false);

  const [stagingImportId, setStagingImportId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");

  const [preview, setPreview] = useState(null);
  const [pushPreview, setPushPreview] = useState(null);

  const [isPushPreviewModalOpen, setIsPushPreviewModalOpen] = useState(false);
const [stagingSearch, setStagingSearch] = useState("");
const [stagingStatus, setStagingStatus] = useState("all");
const [isStagingLoading, setIsStagingLoading] = useState(false);
const [isPushing, setIsPushing] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
const [importStep, setImportStep] = useState(1);
const [selectedCsvFile, setSelectedCsvFile] = useState(null);
const [csvPreviewRows, setCsvPreviewRows] = useState([]);
const [csvPreviewSummary, setCsvPreviewSummary] = useState({
  total: 0,
  valid: 0,
  invalid: 0,
  duplicate: 0,
});
const [csvPreviewSearch, setCsvPreviewSearch] = useState("");
const [csvPreviewStatus, setCsvPreviewStatus] = useState("all");
const [isCsvUploading, setIsCsvUploading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPagination, setQuestionsPagination] = useState(null);

  const [filterMasterData, setFilterMasterData] = useState({
  exams: [],
  industries: [],
  categories: [],
  subcategories: [],
});

// async function loadFilterMasterData() {
//   try {
//     const [examRes, hierarchyRes] = await Promise.all([
//       getExams(),
//       getHierarchy(),
//     ]);
    
//     console.log("Exam Response:", examRes);
//     console.log("Hierarchy Response:", hierarchyRes);

//     const rawExamRows = Array.isArray(examRes?.data)
//       ? examRes.data
//       : Array.isArray(examRes?.data?.rows)
//       ? examRes.data.rows
//       : Array.isArray(examRes?.rows)
//       ? examRes.rows
//       : [];

//     const exams = rawExamRows
//       .map((x) => ({
//         id: String(x.id ?? x.exam_id ?? x.examId),
//         title: x.exam_title || x.title || x.name || "-",
//       }))
//       .filter((x) => x.id && x.title !== "-");

//     const rawRows = Array.isArray(hierarchyRes?.data)
//       ? hierarchyRes.data
//       : Array.isArray(hierarchyRes?.data?.rows)
//       ? hierarchyRes.data.rows
//       : Array.isArray(hierarchyRes?.rows)
//       ? hierarchyRes.rows
//       : Array.isArray(hierarchyRes?.industries)
//       ? hierarchyRes.industries
//       : [];

//     const industryMap = new Map();
//     const categoryMap = new Map();
//     const subcategoryMap = new Map();

//     rawRows.forEach((item) => {
//       const industryId =
//         item.industry_id ?? item.industryId ?? item.id ?? null;
//       const industryName =
//         item.industry_name ?? item.industryName ?? item.name ?? "-";

//       if (industryId && industryName && industryName !== "-") {
//         industryMap.set(String(industryId), {
//           id: String(industryId),
//           name: industryName,
//         });
//       }

//       const categories =
//         item.categories || item.category_list || item.categoryList || [];

//       if (Array.isArray(categories)) {
//         categories.forEach((categoryItem) => {
//           const categoryId =
//             categoryItem.id ??
//             categoryItem.category_id ??
//             categoryItem.categoryId ??
//             null;

//           const categoryName =
//             categoryItem.category_name ||
//             categoryItem.category ||
//             categoryItem.name ||
//             "-";

//           if (categoryId && categoryName && categoryName !== "-") {
//             categoryMap.set(String(categoryId), {
//               id: String(categoryId),
//               name: categoryName,
//               industry_id: industryId ? String(industryId) : null,
//             });
//           }

//           const subCategories =
//             categoryItem.sub_categories ||
//             categoryItem.subCategories ||
//             categoryItem.subcategories ||
//             categoryItem.children ||
//             [];

//           if (Array.isArray(subCategories)) {
//             subCategories.forEach((subItem) => {
//               const subId =
//                 subItem.id ??
//                 subItem.sub_category_id ??
//                 subItem.subcategory_id ??
//                 subItem.subCategoryId ??
//                 null;

//               const subName =
//                 subItem.sub_category_name ||
//                 subItem.subcategory_name ||
//                 subItem.subCategoryName ||
//                 subItem.name ||
//                 "-";

//               if (subId && subName && subName !== "-") {
//                 subcategoryMap.set(String(subId), {
//                   id: String(subId),
//                   name: subName,
//                   category_id: categoryId ? String(categoryId) : null,
//                   industry_id: industryId ? String(industryId) : null,
//                 });
//               }
//             });
//           }
//         });
//       }
//     });

//     console.log("Industries:", Array.from(industryMap.values()));
// console.log("Categories:", Array.from(categoryMap.values()));
// console.log("Subcategories:", Array.from(subcategoryMap.values()));

// console.log("FILTER MASTER DATA:", {
//   exams,
//   industries: Array.from(industryMap.values()),
//   categories: Array.from(categoryMap.values()),
//   subcategories: Array.from(subcategoryMap.values()),
// });

//     setFilterMasterData({
//       exams,
//       industries: Array.from(industryMap.values()),
//       categories: Array.from(categoryMap.values()),
//       subcategories: Array.from(subcategoryMap.values()),
//     });
//   } catch (error) {
//     console.error("Filter master data load error:", error);
//     toast.error(error.message || "Failed to load filter master data");
//   }
// }

async function loadFilterMasterData() {
  try {
    const [examRes, industryRes] = await Promise.all([
    getExams(),
    getIndustries(),
]);


    console.log("Exam Response:", examRes);

    const rawExamRows = Array.isArray(examRes?.data)
      ? examRes.data
      : [];

    console.log(filterMasterData.exams[0]);

    const exams = [];
    const industryMap = new Map();
    const categoryMap = new Map();
    const subcategoryMap = new Map();

    rawExamRows.forEach((item) => {
      exams.push({
  id: String(item.id),
  title: item.exam_title,
  industry_id: item.industry_id ? String(item.industry_id) : "",
  category_id: item.category_id ? String(item.category_id) : "",
  sub_category_id: item.sub_category_id ? String(item.sub_category_id) : "",
});

      industryRes.data.forEach((industry) => {
    industryMap.set(String(industry.id), {
        id: String(industry.id),
        name: industry.industry_name,
    });
});

      if (item.category_id && item.category_name) {
        categoryMap.set(String(item.category_id), {
          id: String(item.category_id),
          name: item.category_name,
          industry_id: String(item.industry_id),
        });
      }

      if (item.sub_category_id && item.sub_category_name) {
        subcategoryMap.set(String(item.sub_category_id), {
          id: String(item.sub_category_id),
          name: item.sub_category_name,
          category_id: String(item.category_id),
          industry_id: String(item.industry_id),
        });
      }
    });

    setFilterMasterData({
      exams,
      industries: [...industryMap.values()],
      categories: [...categoryMap.values()],
      subcategories: [...subcategoryMap.values()],
    });

    console.log("Filter Master Data", {
      exams,
      industries: [...industryMap.values()],
      categories: [...categoryMap.values()],
      subcategories: [...subcategoryMap.values()],
    });

  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}



async function loadQuestions(page = currentPage, limit = pageSize) {
try {
    setIsLoading(true);

      const selectedIndustry = industryOptions.find(
  (item) => String(item.id) === String(industryFilter)
)?.name;

const selectedCategory = categoryOptions.find(
  (item) => String(item.id) === String(categoryFilter)
)?.name;

const selectedSubCategory = subCategoryOptions.find(
  (item) => String(item.id) === String(subCategoryFilter)
)?.name;

console.log("Industry Filter:", industryFilter);
console.log("Selected Industry:", selectedIndustry);

console.log("Category Filter:", categoryFilter);
console.log("Selected Category:", selectedCategory);

console.log("SubCategory Filter:", subCategoryFilter);
console.log("Selected SubCategory:", selectedSubCategory);

console.log("Industry Options:", industryOptions);
console.log("Category Options:", categoryOptions);
console.log("SubCategory Options:", subCategoryOptions);

const res = await getQuestions({
  page,
  limit,
  search,
  exam_id: examFilter,
  industry: industryFilter === "all" ? "" : selectedIndustry || "",
  category: categoryFilter === "all" ? "" : selectedCategory || "",
  sub_category: subCategoryFilter === "all" ? "" : selectedSubCategory || "",
  difficulty: difficultyFilter,
});
    const rows = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.rows)
      ? res.data.rows
      : Array.isArray(res.rows)
      ? res.rows
      : [];

    const questions = (res.data || []).map((q) => ({
      ...q,
      id: q.id,
      exam_id: q.exam_id || q.examId || "-",
      exam_title: q.exam_title || q.exam || "",
      industry: q.industry || q.industry_name || "-",
      category: q.category || q.category_name || "-",
      sub_category: q.sub_category || q.sub_category_name || "-",
      question: q.question || "-",
      option_a: q.option_a || q.optionA || "",
      option_b: q.option_b || q.optionB || "",
      option_c: q.option_c || q.optionC || "",
      option_d: q.option_d || q.optionD || "",
      correct_answer: normalizeAnswer(q.correct_answer || q.answer),
      difficulty: q.difficulty || "-",
      explanation: q.explanation || "",
      created_at: q.created_at || q.createdAt || "",
    }));

    const pagination = res.pagination || res.data?.pagination || {};

    setMainQuestions(questions);

    setQuestionsPagination({
      page: pagination.page || page,
      limit: pagination.limit || limit,
      total: pagination.total || questions.length,
      totalPages:
        pagination.totalPages ||
        Math.max(1, Math.ceil((pagination.total || questions.length) / limit)),
      hasNext: Boolean(pagination.hasNext),
      hasPrev: Boolean(pagination.hasPrev),
    });

    return questions;
  } catch (error) {
    console.error("Load questions error:", error);
    toast.error(error.message || "Failed to load questions");
    return [];
  } finally {
    setIsLoading(false);
  }
}

  async function loadStaging(params = {}) {
  try {
    setIsStagingLoading(true);

    let page = 1;
    const limit = 100;
    let allRows = [];
    let hasNext = true;

    while (hasNext) {
      const res = await getStagingQuestions({
        page,
        limit,
        ...params,
      });

      const rows = Array.isArray(res.data) ? res.data : [];
      allRows = [...allRows, ...rows];

      hasNext = Boolean(res.pagination?.hasNext);
      page += 1;
    }

    const mappedRows = allRows.map((row) => ({
      ...row,

      id: row.stage_id || row.id,
      stage_id: row.stage_id || row.id,

      import_id: row.import_id || "-",
      file_name: row.file_name || "-",

      exam_id: row.exam_id || "-",
      industry: row.industry || "-",
      category: row.category || "-",
      sub_category: row.sub_category || "-",

      question: row.question || "-",
      question_hash: row.question_hash || "",

      option_a: row.option_a || "",
      option_b: row.option_b || "",
      option_c: row.option_c || "",
      option_d: row.option_d || "",

      correct_answer: normalizeAnswer(row.correct_answer),
      difficulty: displayDifficulty(row.difficulty),

      explanation: row.explanation || "",
      imported_by: row.imported_by || "system",

      status: row.stage_status || row.status || "pending",
      stage_status: row.stage_status || row.status || "pending",

      message: row.duplicate_reason || "Ready to push",

      created_at: row.created_at || row.import_created_at || "",
      imported_at: row.import_created_at || row.created_at || "",
    }));

    setStagingQuestions(mappedRows);
    return mappedRows;
  } catch (error) {
    console.error("Load staging error:", error);
    setStagingQuestions([]);
    toast.error(error.message || "Failed to load staging questions");
    return [];
  } finally {
    setIsStagingLoading(false);
  }
}

async function loadImportHistory() {
  try {
    setIsHistoryLoading(true);

    const res = await getImportHistory({
      page: 1,
      limit: 100,
    });

    const rows = Array.isArray(res.data) ? res.data : [];

    const mappedHistory = rows.map((item) => ({
      import_id: item.id,
      file_name: item.file_name || "-",
      uploaded_by:
  item.uploaded_by ||
  item.uploadedBy ||
  item.imported_by ||
  item.created_by ||
  item.createdBy ||
  item.user_name ||
  item.username ||
  item.email ||
  "-",
      total_rows: item.total_rows || 0,
      valid_rows: item.csv_valid_rows || 0,
      error_rows: item.csv_error_rows || 0,
      missing_rows: item.csv_missing_rows || 0,
      duplicate_rows: item.csv_duplicate_rows || 0,
      current_stage: item.current_stage || "-",
      stage_history: item.stage_history || "[]",
      imported_at: item.created_at,
      updated_at: item.updated_at,
    }));

    setImportHistory(mappedHistory);
    setHistoryPagination(res.pagination || null);

    return mappedHistory;
  } catch (error) {
    console.error("Import history error:", error);
    toast.error(error.message || "Failed to load import history");
    return [];
  } finally {
    setIsHistoryLoading(false);
  }
}

React.useEffect(() => {
  loadFilterMasterData();
}, []);



React.useEffect(() => {
  loadQuestions(currentPage, pageSize);
}, [currentPage, pageSize]);

React.useEffect(() => {
  loadStaging({});
  loadImportHistory();
}, []);

React.useEffect(() => {
  if (currentPage !== 1) {
    setCurrentPage(1);
  } else {
    loadQuestions(1, pageSize);
  }
}, [
  search,
  examFilter,
  industryFilter,
  categoryFilter,
  subCategoryFilter,
  difficultyFilter,
]);
React.useEffect(() => {
  if (activeTab === "staging") {
    loadStaging(
      stagingImportId
        ? {
            import_id: stagingImportId,
          }
        : {}
    );
  }

  if (activeTab === "history") {
    loadImportHistory();
  }
}, [activeTab, stagingImportId]);

const examOptions = useMemo(() => {
  let exams = Array.isArray(filterMasterData?.exams)
    ? filterMasterData.exams
    : [];

  if (industryFilter !== "all") {
    exams = exams.filter(
      (exam) => String(exam.industry_id) === String(industryFilter)
    );
  }

  if (categoryFilter !== "all") {
    exams = exams.filter(
      (exam) => String(exam.category_id) === String(categoryFilter)
    );
  }

  if (subCategoryFilter !== "all") {
    exams = exams.filter(
      (exam) => String(exam.sub_category_id) === String(subCategoryFilter)
    );
  }

  return exams;
}, [filterMasterData, industryFilter, categoryFilter, subCategoryFilter]);



const industryOptions = useMemo(() => {
  return Array.isArray(filterMasterData?.industries)
    ? filterMasterData.industries
    : [];
}, [filterMasterData]);

console.log("Industry Options", industryOptions);

const categoryOptions = useMemo(() => {
  const allCategories = Array.isArray(filterMasterData?.categories)
    ? filterMasterData.categories
    : [];

  if (industryFilter === "all") return allCategories;

  return allCategories.filter(
    (item) => String(item.industry_id) === String(industryFilter)
  );
}, [filterMasterData, industryFilter]);

const subCategoryOptions = useMemo(() => {
  let rows = Array.isArray(filterMasterData?.subcategories)
    ? filterMasterData.subcategories
    : [];

  if (industryFilter !== "all") {
    rows = rows.filter(
      (item) => String(item.industry_id) === String(industryFilter)
    );
  }

  if (categoryFilter !== "all") {
    rows = rows.filter(
      (item) => String(item.category_id) === String(categoryFilter)
    );
  }

  return rows;
}, [filterMasterData, industryFilter, categoryFilter]);

const filteredMainQuestions = useMemo(() => {
  const searchValue = normalizeText(search);

  return mainQuestions.filter((question) => {
    const matchesSearch =
      normalizeText(question.question).includes(searchValue) ||
      normalizeText(question.exam_id).includes(searchValue) ||
      normalizeText(question.exam_title).includes(searchValue) ||
      normalizeText(question.industry).includes(searchValue) ||
      normalizeText(question.category).includes(searchValue) ||
      normalizeText(question.sub_category).includes(searchValue);

    const matchesExam =
      examFilter === "all" || String(question.exam_id) === String(examFilter);

    const selectedIndustry = industryOptions.find(
  (item) => String(item.id) === String(industryFilter)
)?.name;

const selectedCategory = categoryOptions.find(
  (item) => String(item.id) === String(categoryFilter)
)?.name;

const selectedSubCategory = subCategoryOptions.find(
  (item) => String(item.id) === String(subCategoryFilter)
)?.name;

const matchesIndustry =
  industryFilter === "all" || question.industry === selectedIndustry;

const matchesCategory =
  categoryFilter === "all" || question.category === selectedCategory;

const matchesSubCategory =
  subCategoryFilter === "all" ||
  question.sub_category === selectedSubCategory;

    const matchesDifficulty =
      difficultyFilter === "all" || question.difficulty === difficultyFilter;

    return (
      matchesSearch &&
      matchesExam &&
      matchesIndustry &&
      matchesCategory &&
      matchesSubCategory &&
      matchesDifficulty
    );
  });
}, [
  mainQuestions,
  search,
  examFilter,
  industryFilter,
  categoryFilter,
  subCategoryFilter,
  difficultyFilter,
]);

const totalQuestionsCount = questionsPagination?.total ?? 0;
const totalPages = questionsPagination?.totalPages ?? 1;


const rangeStart =
  totalQuestionsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;

const rangeEnd = Math.min(currentPage * pageSize, totalQuestionsCount);
const localPushPreview = useMemo(() => {
  return buildLocalPushPreview(stagingQuestions, mainQuestions);
}, [stagingQuestions, mainQuestions]);

const stagingStatusCounts = useMemo(() => {
  return stagingQuestions.reduce(
    (summary, row) => {
      const status = getStagingStatus(row);

      summary.total += 1;

      if (status === "ready_to_push") {
        summary.readyToPush += 1;
      } else if (
        status === "duplicate" ||
        status === "duplicate_in_staging" ||
        status === "already_in_main_db"
      ) {
        summary.duplicates += 1;
      } else if (status === "error" || status === "missing") {
        summary.errors += 1;
      } else if (status === "pushed") {
        summary.pushed += 1;
      } else {
        summary.pending += 1;
      }

      return summary;
    },
    {
      total: 0,
      readyToPush: 0,
      duplicates: 0,
      errors: 0,
      pushed: 0,
      pending: 0,
    }
  );
}, [stagingQuestions]);

const stats = useMemo(() => {
  const pendingValidation =
    stagingQuestions.filter((row) => {
      const status = String(
        row.stage_status || row.status || ""
      ).toLowerCase();

      return ["missing", "error", "pending"].includes(status);
    }).length +
    (preview
      ? (preview.summary?.missing || 0) +
        (preview.summary?.error || 0)
      : 0);

  return {
    totalQuestions: questionsPagination?.total || filteredMainQuestions.length,
    stagingQuestions: stagingQuestions.length,
    pendingValidation,
    importBatches:
      importHistory.length ||
      getUniqueOptions(stagingQuestions, "import_id").length ||
      0,
  };
}, [
  questionsPagination,
  mainQuestions,
  stagingQuestions,
  importHistory,
  preview,
]);

const filteredCsvPreviewRows = useMemo(() => {
  const searchValue = normalizeText(csvPreviewSearch);

  return csvPreviewRows.filter((row) => {
    const matchesSearch =
      normalizeText(row.question).includes(searchValue) ||
      normalizeText(row.exam_id).includes(searchValue);

    const matchesStatus =
      csvPreviewStatus === "all" || row.status === csvPreviewStatus;

    return matchesSearch && matchesStatus;
  });
}, [csvPreviewRows, csvPreviewSearch, csvPreviewStatus]);

const filteredStagingQuestions = useMemo(() => {
  const searchValue = normalizeText(stagingSearch);

  return stagingQuestions.filter((row) => {
    const matchesSearch =
      normalizeText(row.question).includes(searchValue) ||
      normalizeText(row.exam_id).includes(searchValue) ||
      normalizeText(row.import_id).includes(searchValue) ||
      normalizeText(row.file_name).includes(searchValue);

    const rowStatus = getStagingStatus(row);

    const matchesStatus =
      stagingStatus === "all" || rowStatus === stagingStatus;

    return matchesSearch && matchesStatus;
  });
}, [stagingQuestions, stagingSearch, stagingStatus]);

const pushPreviewSummary = useMemo(() => {
  const summary = pushPreview?.summary || pushPreview?.data || {};

  const alreadyInMainDb =
    summary.already_in_main_db ||
    summary.alreadyInMainDb ||
    0;

  const duplicatesInsideStaging =
    summary.duplicates_inside_staging ||
    summary.duplicatesInsideStaging ||
    0;

  return {
    overallCount:
      summary.total_staging ||
      summary.totalStaging ||
      summary.overallCount ||
      0,

    readyToPush:
      summary.ready_to_push ||
      summary.readyToPush ||
      0,

    mainDbCount:
      summary.main_db_count ||
      summary.mainDbCount ||
      mainQuestions.length,

    alreadyInMainDb,

    duplicatesInsideStaging,

    distinctCount:
      summary.final_distinct ||
      summary.finalDistinct ||
      summary.distinctCount ||
      0,

    duplicateCount:
      alreadyInMainDb + duplicatesInsideStaging,

    errorCount:
      summary.error_count ||
      summary.errorCount ||
      summary.errors ||
      0,

    pushed:
      summary.pushed ||
      0,
  };
}, [pushPreview, mainQuestions.length]);

async function openImportDetails(importId) {
  try {
    setIsImportDetailsLoading(true);

    const res = await getSingleImportHistory(importId);

    const item =
      res.importData ||
      res.data ||
      res.import ||
      res.import_data ||
      null;

    if (!item) {
      throw new Error("Import details not found in API response");
    }

    setSelectedImportDetails({
      id: item.id,
      file_name: item.file_name || "-",
      uploaded_by:
  item.uploaded_by ||
  item.uploadedBy ||
  item.imported_by ||
  item.created_by ||
  item.createdBy ||
  item.user_name ||
  item.username ||
  item.email ||
  "-",
      total_rows: item.total_rows || 0,
      valid_rows: item.csv_valid_rows || 0,
      error_rows: item.csv_error_rows || 0,
      missing_rows: item.csv_missing_rows || 0,
      duplicate_rows: item.csv_duplicate_rows || 0,
      current_stage: item.current_stage || "-",
      stage_history: parseStageHistory(item.stage_history),
      created_at: item.created_at,
      updated_at: item.updated_at,
    });

    setIsImportDetailsOpen(true);
  } catch (error) {
    console.error("Single import history error:", error);
    toast.error(error.message || "Failed to load import details");
  } finally {
    setIsImportDetailsLoading(false);
  }
}

  function clearFilters() {
    setSearch("");
    setExamFilter("all");
    setIndustryFilter("all");
    setCategoryFilter("all");
    setSubCategoryFilter("all");
    setDifficultyFilter("all");
  }

  async function handleCsvFile(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".csv")) {
    toast.error("Please upload only a CSV file");
    event.target.value = "";
    return;
  }

  try {
    setSelectedCsvFile(file);
    setImportStep(2);

    const text = await file.text();
    const csvRows = parseCsvText(text);

    if (csvRows.length < 2) {
      toast.error("CSV must contain header and at least one row");
      event.target.value = "";
      return;
    }

    const headers = csvRows[0].map(normalizeHeader);

    const missingColumns = REQUIRED_CSV_COLUMNS.filter(
      (column) => !headers.includes(column)
    );

    if (missingColumns.length > 0) {
      toast.error(`Missing columns: ${missingColumns.join(", ")}`);
      event.target.value = "";
      return;
    }

    const rows = csvRows.slice(1).map((cells) => {
      const row = {};

      headers.forEach((header, index) => {
        row[header] = cells[index] || "";
      });

      return row;
    });

    const validatedRows = validateCsvRows(rows);
    const summary = getCsvSummary(validatedRows);

    setCsvPreviewRows(validatedRows);
    setCsvPreviewSummary(summary);
    setImportStep(3);

    toast.success("CSV preview generated");
  } catch (error) {
    console.error("CSV preview error:", error);
    toast.error(error.message || "Failed to preview CSV");
  } finally {
    event.target.value = "";
  }
}
function getCurrentUploadUser() {
  const directValue =
    localStorage.getItem("userName") ||
    localStorage.getItem("username") ||
    localStorage.getItem("name") ||
    localStorage.getItem("email") ||
    sessionStorage.getItem("userName") ||
    sessionStorage.getItem("username") ||
    sessionStorage.getItem("name") ||
    sessionStorage.getItem("email");

  if (directValue) return directValue;

  const possibleKeys = [
    "user",
    "auth",
    "authUser",
    "currentUser",
    "admin",
    "userData",
    "loginUser",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      const user =
        parsed.user ||
        parsed.data?.user ||
        parsed.data ||
        parsed.admin ||
        parsed;

      return (
        user.name ||
        user.full_name ||
        user.fullName ||
        user.username ||
        user.email ||
        parsed.name ||
        parsed.email ||
        "admin"
      );
    } catch {
      // ignore invalid JSON
    }
  }

  return "admin";
}
async function confirmCsvImportToStaging() {
  if (!selectedCsvFile) {
    toast.error("Please select a CSV file first");
    return;
  }

  if (csvPreviewSummary.valid === 0) {
    toast.error("No valid rows available to import");
    return;
  }

  try {
    setIsCsvUploading(true);

    const uploadedBy = getCurrentUploadUser();

console.log("UPLOADED BY SENT:", uploadedBy);

const res = await uploadCsvToStaging(selectedCsvFile, uploadedBy);

    toast.success(res.message || "CSV imported to staging successfully");

    setImportStep(4);

  const newImportId =
  res.import_id ||
  res.importId ||
  res.data?.import_id ||
  res.data?.importId ||
  res.data?.id ||
  "";

if (newImportId) {
  setStagingImportId(String(newImportId));
}

    await loadStaging();
    await loadQuestions();
    await loadImportHistory();

    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportStep(1);
      setSelectedCsvFile(null);
      setCsvPreviewRows([]);
      setCsvPreviewSearch("");
      setCsvPreviewStatus("all");
      setActiveTab("staging");
    }, 800);
  } catch (error) {
    console.error("CSV import error:", error);
    toast.error(error.message || "CSV import failed");
  } finally {
    setIsCsvUploading(false);
  }
}


  async function validateStagingQuestions() {
  try {
    setIsStagingLoading(true);

    const res = await validateStagingQuestionsApi();

    toast.success(res.message || "All staging questions validated successfully");

    setStagingImportId("");

    await loadStaging({});
    await loadImportHistory();
  } catch (error) {
    console.error("Validate all staging error:", error);
    toast.error(error.message || "Failed to validate all staging questions");
  } finally {
    setIsStagingLoading(false);
  }
}

  async function openPushPreview() {
  try {
    setIsStagingLoading(true);

    const res = await getFinalPushPreview();

    const data =
      res.data ||
      res.preview ||
      res.finalPreview ||
      res.summary ||
      {};

    const normalizedPreview = {
      success: res.success ?? true,
      message: res.message || "Final push preview generated",
      data,
      summary: {
        total_staging:
          data.total_staging ||
          data.totalStaging ||
          data.overallCount ||
          data.total ||
          0,

        ready_to_push:
          data.ready_to_push ||
          data.readyToPush ||
          0,

        already_in_main_db:
          data.already_in_main_db ||
          data.alreadyInMainDb ||
          data.main_db_duplicates ||
          data.mainDbDuplicates ||
          0,

        duplicates_inside_staging:
          data.duplicates_inside_staging ||
          data.duplicatesInsideStaging ||
          data.staging_duplicates ||
          data.stagingDuplicates ||
          0,

        final_distinct:
          data.final_distinct ||
          data.finalDistinct ||
          data.distinct ||
          0,

        pushed:
          data.pushed ||
          data.inserted_count ||
          data.insertedCount ||
          0,

        error_count:
          data.error_count ||
          data.errorCount ||
          data.errors ||
          0,
      },
      rows: data.rows || [],
      validRows:
        data.final_distinct_rows ||
        data.finalDistinctRows ||
        data.validRows ||
        [],
    };

    setPushPreview(normalizedPreview);
    setIsPushPreviewModalOpen(true);
    setActiveTab("staging");

    toast.success(res.message || "Final push preview generated");
  } catch (error) {
    console.error("Final push preview error:", error);
    toast.error(error.message || "Failed to generate final push preview");
  } finally {
    setIsStagingLoading(false);
  }
}
  async function confirmPushToMainDb() {
  try {
    setIsPushing(true);

    const res = await pushFinalDistinctQuestions({
      scope: "all",
    });

    console.log("FINAL PUSH RESPONSE:", res);

    const data = res.data || res.result || {};

    const pushedCount =
      Number(data.pushed || 0) ||
      Number(data.inserted_count || 0) ||
      Number(data.insertedCount || 0) ||
      Number(data.rows_inserted || 0) ||
      Number(data.rowsInserted || 0);

    if (pushedCount > 0) {
      toast.success(`${pushedCount} questions inserted into Main DB`);
    } else {
      toast.error(
        res.message ||
          "No questions inserted. Please check backend push response."
      );
    }

    setPushPreview(null);
    setIsPushPreviewModalOpen(false);
    setActiveTab("main");

    // Only refresh Main DB now.
    // Do not refresh staging + history immediately because it causes 429.
    await loadQuestions();
  } catch (error) {
    console.error("Final distinct push error:", error);
    toast.error(error.message || "Failed to push final distinct questions");
  } finally {
    setIsPushing(false);
  }
}

  async function editMainQuestion(question) {
    const updatedQuestion = window.prompt("Edit question", question.question);

    if (!updatedQuestion?.trim()) return;

    try {
      await updateQuestion(question.id, {
        question: updatedQuestion.trim(),
      });

      toast.success("Question updated");
      await loadQuestions();
    } catch (error) {
      toast.error(error.message || "Update API is not ready");
    }
  }
  

  async function deleteMainQuestion(id) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteQuestion(id);
      toast.success("Question deleted");
      await loadQuestions();
    } catch (error) {
      toast.error(error.message || "Delete API is not ready");
    }
  }

  function deleteStagingQuestion(id) {
  setStagingQuestions((previous) =>
    previous.filter((row) => row.stage_id !== id && row.id !== id)
  );

  toast.success("Removed from staging view");
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload, validate, stage, review, and manage all your questions.
          </p>
        </div>

        <Button
  variant="outline"
  className="h-11 rounded-xl"
  onClick={() => {
    setIsImportModalOpen(true);
    setImportStep(1);
  }}
>
  <Upload className="mr-2 h-4 w-4" />
  Import CSV
</Button>
{isImportModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-background shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6">
        <h2 className="text-2xl font-bold">Bulk Import Questions (CSV)</h2>

        <button
          onClick={() => {
            setIsImportModalOpen(false);
            setImportStep(1);
            setSelectedCsvFile(null);
            setCsvPreviewRows([]);
          }}
          className="rounded-full p-2 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-8 grid grid-cols-4 items-center gap-3">
          {[
            [1, "Upload"],
            [2, "Processing"],
            [3, "Preview"],
            [4, "Done"],
          ].map(([step, label], index) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full font-bold",
                  importStep > step
                    ? "bg-green-600 text-white"
                    : importStep === step
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {importStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
              </div>

              <span
                className={cn(
                  "font-semibold",
                  importStep === step
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>

              {index < 3 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        {importStep === 1 && (
          <div>
            <h3 className="text-2xl font-bold">Upload CSV File</h3>
            <p className="mt-1 text-muted-foreground">
              Upload a CSV file to import multiple questions at once.
            </p>

            <label className="mt-8 flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50/30 p-8 text-center hover:bg-green-50">
              <div className="rounded-full bg-green-100 p-6 text-green-700">
                <Upload className="h-10 w-10" />
              </div>

              <h4 className="mt-5 text-xl font-bold">
                Drag & drop your CSV file here
              </h4>
              <p className="mt-1 text-muted-foreground">or click to browse</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Only .csv files are allowed
              </p>

              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvFile}
              />
            </label>

            <div className="mt-6 rounded-2xl border border-border p-5">
              <h4 className="font-bold">CSV Format Requirements</h4>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>All required columns must be present</li>
                <li>
                  <code>correct_answer</code> must be one of: A, B, C, D
                </li>
                <li>No empty fields allowed</li>
                <li>Duplicate question text will be marked as duplicate</li>
              </ul>
            </div>
          </div>
        )}

        {importStep === 2 && (
          <div className="py-20 text-center">
            <RefreshCw className="mx-auto h-12 w-12 animate-spin text-green-600" />
            <h3 className="mt-4 text-xl font-bold">Processing CSV...</h3>
            <p className="text-muted-foreground">
              Reading and validating your questions.
            </p>
          </div>
        )}

        {importStep === 3 && (
          <div>
            <h3 className="text-2xl font-bold">Preview Import Data</h3>
            <p className="mt-1 text-muted-foreground">
              Review the data below before importing.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <SummaryPill
                label="Total Rows"
                value={csvPreviewSummary.total}
                className="border-border bg-white text-foreground"
              />
              <SummaryPill
                label="Valid Rows"
                value={csvPreviewSummary.valid}
                className="border-green-200 bg-green-50 text-green-700"
              />
              <SummaryPill
                label="Invalid Rows"
                value={csvPreviewSummary.invalid}
                className="border-red-200 bg-red-50 text-red-700"
              />
              <SummaryPill
                label="Duplicates"
                value={csvPreviewSummary.duplicate}
                className="border-yellow-200 bg-yellow-50 text-yellow-700"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2">
                {[
                  ["all", "All"],
                  ["valid", "Valid"],
                  ["error", "Errors"],
                  ["duplicate", "Duplicates"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCsvPreviewStatus(key)}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-semibold",
                      csvPreviewStatus === key
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={csvPreviewSearch}
                  onChange={(event) => setCsvPreviewSearch(event.target.value)}
                  placeholder="Search question..."
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="mt-6 max-h-[420px] overflow-auto rounded-xl border border-border">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Exam ID</th>
                    <th className="px-4 py-3 text-left">Question</th>
                    <th className="px-4 py-3 text-left">Opt A</th>
                    <th className="px-4 py-3 text-left">Opt B</th>
                    <th className="px-4 py-3 text-left">Opt C</th>
                    <th className="px-4 py-3 text-left">Opt D</th>
                    <th className="px-4 py-3 text-left">Answer</th>
                    <th className="px-4 py-3 text-left">Explanation</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCsvPreviewRows.map((row) => (
                    <tr
                      key={row.row_no}
                      className={cn(
                        "border-t border-border",
                        row.status === "valid" && "bg-green-50/40",
                        row.status === "duplicate" && "bg-yellow-50/40",
                        row.status === "error" && "bg-red-50/40"
                      )}
                    >
                      <td className="px-4 py-3">{row.row_no}</td>
                      <td className="px-4 py-3">{row.exam_id || "-"}</td>
                      <td className="max-w-[260px] px-4 py-3 font-medium">
                        {row.question || "-"}
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        {row.option_a || "-"}
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        {row.option_b || "-"}
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        {row.option_c || "-"}
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        {row.option_d || "-"}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {row.correct_answer || "-"}
                      </td>
                      <td className="max-w-[220px] px-4 py-3 text-muted-foreground">
                        {row.explanation || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                        {row.message !== "Ready" && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {row.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setImportStep(1);
                  setSelectedCsvFile(null);
                  setCsvPreviewRows([]);
                }}
              >
                Choose Another File
              </Button>

              <Button
                onClick={confirmCsvImportToStaging}
                disabled={isCsvUploading || csvPreviewSummary.valid === 0}
              >
                {isCsvUploading ? "Importing..." : "Import Valid Rows"}
              </Button>
            </div>
          </div>
        )}

        {importStep === 4 && (
          <div className="py-20 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            <h3 className="mt-4 text-2xl font-bold">Import Completed</h3>
            <p className="text-muted-foreground">
              CSV questions uploaded to staging successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      </div>

      <Card className="rounded-2xl border border-border shadow-sm">
        <CardContent className="space-y-4 p-4">
        {activeTab === "main" && (
          <div className="grid gap-3 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by question or keyword..."
                className="h-11 rounded-xl pl-9"
              />
            </div>

            <select
  value={examFilter}
  onChange={(e) => setExamFilter(e.target.value)}
  className="h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none"
>
  <option value="all">All Exams</option>
  {examOptions.map((exam) => (
    <option key={exam.id} value={exam.id}>
      {exam.title}
    </option>
  ))}
</select>

            <select
              value={industryFilter}
              onChange={(event) => {
                setIndustryFilter(event.target.value);
                setCategoryFilter("all");
                setSubCategoryFilter("all");
              }}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="all">Industry: All</option>
              {industryOptions.map((industry) => (
  <option key={industry.id} value={industry.id}>
    {industry.name}
  </option>
))}
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setSubCategoryFilter("all");
              }}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="all">Category: All</option>
              {categoryOptions.map((category) => (
  <option key={category.id} value={category.id}>
    {category.name}
  </option>
))}
            </select>

            <select
              value={subCategoryFilter}
              onChange={(event) => setSubCategoryFilter(event.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="all">Sub-category: All</option>
              {subCategoryOptions.map((subCategory) => (
  <option key={subCategory.id} value={subCategory.id}>
    {subCategory.name}
  </option>
))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="all">Difficulty: All</option>
              <option value="easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Hard">Hard</option>
            </select>

            <Button
              variant="outline"
              className="h-11 rounded-xl border-green-200 text-green-700 hover:bg-green-50"
              onClick={clearFilters}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
          )}

          <div className="flex flex-col gap-3 border-b border-border pt-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-6">
              {[
                ["main", "Main DB"],
                ["staging", "Staging"],
                ["history", "Import History"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "border-b-2 px-1 pb-3 text-sm font-semibold transition-colors",
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            
          </div>

          {activeTab === "main" && (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Questions"
        value={stats.totalQuestions}
        subtitle="In Main DB"
        icon={Database}
        className="bg-green-50 text-green-700"
      />

      <StatsCard
        title="Staging Questions"
        value={stats.stagingQuestions}
        subtitle="Ready for review"
        icon={FolderOpen}
        className="bg-blue-50 text-blue-700"
      />

      <StatsCard
        title="Pending Validation"
        value={stats.pendingValidation}
        subtitle="Need attention"
        icon={AlertTriangle}
        className="bg-yellow-50 text-yellow-700"
      />

      <StatsCard
        title="Import Batches"
        value={stats.importBatches}
        subtitle="All time"
        icon={History}
        className="bg-purple-50 text-purple-700"
      />
    </div>

    <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[950px] text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Exam ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Question
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Difficulty
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-10 text-center text-muted-foreground"
                      >
                        Loading questions...
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    mainQuestions.map((question, index) => (
                      <tr key={question.id} className="border-t border-border">
                        <td className="px-4 py-4 text-muted-foreground">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <SoftPill color="gray">{question.exam_id}</SoftPill>
                        </td>

                        <td className="max-w-[460px] px-4 py-4">
                          <p className="font-semibold leading-6">
                            {question.question}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            Ans: {question.correct_answer || "-"}{" "}
                            {question.explanation
                              ? `• ${question.explanation}`
                              : ""}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <DifficultyBadge difficulty={question.difficulty} />
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          <p>{formatDate(question.created_at)}</p>
                          <p className="text-xs">{formatTime(question.created_at)}</p>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 rounded-xl"
                              onClick={() => editMainQuestion(question)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 rounded-xl"
                              onClick={() => deleteMainQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && mainQuestions.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-muted-foreground"
                      >
                        No questions found. Try clearing filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex flex-col gap-3 border-t border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Showing {rangeStart}–{rangeEnd} of{" "}
{totalQuestionsCount} questions
                  </span>

                  <label className="flex items-center gap-2">
                    Rows per page:
                    <select
                      value={pageSize}
                      onChange={(event) => {
  setPageSize(Number(event.target.value));
  setCurrentPage(1);
}}
                      className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Previous
                  </Button>

                  <Badge className="rounded-lg px-3 py-2">
                    {currentPage}
                  </Badge>

                  <span className="text-sm text-muted-foreground">
                    of {totalPages}
                  </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "staging" && (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatsCard
        title="Total Imports"
        value={getUniqueOptions(stagingQuestions, "import_id").length}
        subtitle="All staging imports"
        icon={FolderOpen}
        className="bg-purple-50 text-purple-700"
      />

      <StatsCard
        title="Total Staging"
        value={stagingQuestions.length}
        subtitle="All imported questions"
        icon={Database}
        className="bg-blue-50 text-blue-700"
      />

      <StatsCard
        title="Distinct"
        value={stagingStatusCounts.readyToPush}
        subtitle="Ready to push"
        icon={CheckCircle2}
        className="bg-green-50 text-green-700"
      />

      <StatsCard
        title="Duplicates"
        value={stagingStatusCounts.duplicates}
        subtitle="Will be skipped"
        icon={FileCheck2}
        className="bg-orange-50 text-orange-700"
      />

      <StatsCard
        title="Errors"
        value={stagingStatusCounts.errors}
        subtitle="Need attention"
        icon={AlertTriangle}
        className="bg-red-50 text-red-700"
      />
    </div>

    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-lg font-bold">Staging Questions</h3>
          <p className="text-sm text-muted-foreground">
            Showing all questions from all CSV imports. Only distinct questions will be pushed to Main DB.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => loadStaging()}
            disabled={isStagingLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isStagingLoading ? "Refreshing..." : "Refresh"}
          </Button>

          <Button variant="outline" onClick={validateStagingQuestions}>
  <ShieldCheck className="mr-2 h-4 w-4" />
  Validate All
</Button>

          <Button
            onClick={openPushPreview}
            disabled={stagingQuestions.length === 0}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Database className="mr-2 h-4 w-4" />
            Push to Main DB
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={stagingSearch}
            onChange={(event) => setStagingSearch(event.target.value)}
            placeholder="Search by import ID, exam ID or question..."
            className="h-11 rounded-xl pl-9"
          />
        </div>

        <select
  value={stagingStatus}
  onChange={(event) => setStagingStatus(event.target.value)}
  className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium"
>
  <option value="all">Status: All</option>
  <option value="ready_to_push">Ready to Push</option>
  <option value="already_in_main_db">Already In Main DB</option>
  <option value="duplicate_in_staging">Duplicate In Staging</option>
  <option value="duplicate">Duplicate</option>
  <option value="error">Error</option>
  <option value="missing">Missing</option>
  <option value="pushed">Pushed</option>
</select>

        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => {
            setStagingSearch("");
            setStagingStatus("all");
          }}
        >
          Clear
        </Button>
      </div>
    </div>

    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[1250px] text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Import ID</th>
            <th className="px-4 py-3 text-left">Imported On</th>
            <th className="px-4 py-3 text-left">Exam ID</th>
            <th className="px-4 py-3 text-left">Question</th>
            <th className="px-4 py-3 text-left">Answer</th>
            <th className="px-4 py-3 text-left">Difficulty</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Message</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {isStagingLoading && (
            <tr>
              <td
                colSpan="10"
                className="px-4 py-10 text-center text-muted-foreground"
              >
                Loading staging questions...
              </td>
            </tr>
          )}

          {!isStagingLoading &&
            filteredStagingQuestions.map((row, index) => (
              <tr
                key={row.stage_id || row.id || `${row.import_id}-${index}`}
  className="border-t border-border"
              >
                <td className="px-4 py-3 text-muted-foreground">
                  {index + 1}
                </td>

                <td className="px-4 py-3 font-medium">
                  {row.import_id || "-"}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  <p>{formatDate(row.imported_at || row.created_at)}</p>
                  <p className="text-xs">
                    {formatTime(row.imported_at || row.created_at)}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <SoftPill color="gray">{row.exam_id || "-"}</SoftPill>
                </td>

                <td className="max-w-[420px] px-4 py-3">
                  <p className="font-semibold leading-6">
                    {row.question || "-"}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {row.explanation || ""}
                  </p>
                </td>

                <td className="px-4 py-3 font-bold">
                  {normalizeAnswer(row.correct_answer) || "-"}
                </td>

                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={row.difficulty} />
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={row.stage_status || row.status || "pending"} />
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {row.message || "Ready to push"}
                </td>

                <td className="px-4 py-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-xl"
                    onClick={() => deleteStagingQuestion(row.stage_id || row.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}

          {!isStagingLoading && filteredStagingQuestions.length === 0 && (
            <tr>
              <td
                colSpan="10"
                className="px-4 py-10 text-center text-muted-foreground"
              >
                No staging questions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
)}

    {isPushPreviewModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-xl font-bold">Push to Main DB - Preview</h3>
              <p className="text-sm text-muted-foreground">
                Only distinct questions will be pushed. Duplicates and errors will be skipped.
              </p>
            </div>

            <button
              onClick={() => setIsPushPreviewModalOpen(false)}
              className="rounded-full p-2 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Distinct questions are calculated by comparing staging questions with existing Main DB questions and removing duplicates.
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
  <SummaryPill
    label="Total Staging"
    value={pushPreviewSummary.overallCount}
    className="border-border bg-white text-foreground"
  />

  <SummaryPill
    label="Ready To Push"
    value={pushPreviewSummary.readyToPush}
    className="border-blue-200 bg-blue-50 text-blue-700"
  />

  <SummaryPill
    label="Already In Main DB"
    value={pushPreviewSummary.alreadyInMainDb}
    className="border-yellow-200 bg-yellow-50 text-yellow-700"
  />

  <SummaryPill
    label="Duplicates In Staging"
    value={pushPreviewSummary.duplicatesInsideStaging}
    className="border-orange-200 bg-orange-50 text-orange-700"
  />

  <SummaryPill
    label="Final Distinct"
    value={pushPreviewSummary.distinctCount}
    className="border-green-200 bg-green-50 text-green-700"
  />

  <SummaryPill
    label="Errors"
    value={pushPreviewSummary.errorCount}
    className="border-red-200 bg-red-50 text-red-700"
  />
</div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              You are about to push{" "}
              <strong>{pushPreviewSummary.distinctCount}</strong> distinct
              questions to Main DB.
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsPushPreviewModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={confirmPushToMainDb}
                disabled={isPushing || pushPreviewSummary.distinctCount === 0}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isPushing ? "Pushing..." : "Confirm & Push"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}

          {activeTab === "history" && (
  <div className="space-y-4">
    <div className="flex justify-end">
      <Button variant="outline" onClick={loadImportHistory}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh History
      </Button>
    </div>

    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[1150px] text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left">Import ID</th>
            <th className="px-4 py-3 text-left">File</th>
            <th className="px-4 py-3 text-left">Uploaded By</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Valid</th>
            <th className="px-4 py-3 text-left">Missing</th>
            <th className="px-4 py-3 text-left">Error</th>
            <th className="px-4 py-3 text-left">Duplicate</th>
            <th className="px-4 py-3 text-left">Stage</th>
            <th className="px-4 py-3 text-left">Imported At</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {isHistoryLoading && (
            <tr>
              <td
                colSpan="11"
                className="px-4 py-10 text-center text-muted-foreground"
              >
                Loading import history...
              </td>
            </tr>
          )}

          {!isHistoryLoading &&
            importHistory.map((item) => (
              <tr key={item.import_id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">
                  {item.import_id}
                </td>

                <td className="px-4 py-3">{item.file_name}</td>

                <td className="px-4 py-3">{item.uploaded_by}</td>

                <td className="px-4 py-3">{item.total_rows}</td>

                <td className="px-4 py-3 font-semibold text-green-700">
                  {item.valid_rows}
                </td>

                <td className="px-4 py-3 font-semibold text-yellow-700">
                  {item.missing_rows}
                </td>

                <td className="px-4 py-3 font-semibold text-red-700">
                  {item.error_rows}
                </td>

                <td className="px-4 py-3 font-semibold text-orange-700">
                  {item.duplicate_rows}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={String(item.current_stage).toLowerCase()} />
                </td>

                <td className="px-4 py-3">
                  <p>{formatDate(item.imported_at)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(item.imported_at)}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => openImportDetails(item.import_id)}
                    disabled={isImportDetailsLoading}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}

          {!isHistoryLoading && importHistory.length === 0 && (
            <tr>
              <td
                colSpan="11"
                className="px-4 py-10 text-center text-muted-foreground"
              >
                No import history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {historyPagination && (
        <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          Showing page {historyPagination.page} of{" "}
          {historyPagination.totalPages} | Total imports:{" "}
          {historyPagination.total}
        </div>
      )}
    </div>

    {isImportDetailsOpen && selectedImportDetails && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-xl font-bold">
                Import Details #{selectedImportDetails.id}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedImportDetails.file_name}
              </p>
            </div>

            <button
              onClick={() => {
                setIsImportDetailsOpen(false);
                setSelectedImportDetails(null);
              }}
              className="rounded-full p-2 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-5">
              <SummaryPill
                label="Total"
                value={selectedImportDetails.total_rows}
                className="border-gray-200 bg-white text-gray-700"
              />

              <SummaryPill
                label="Valid"
                value={selectedImportDetails.valid_rows}
                className="border-green-200 bg-green-50 text-green-700"
              />

              <SummaryPill
                label="Missing"
                value={selectedImportDetails.missing_rows}
                className="border-yellow-200 bg-yellow-50 text-yellow-700"
              />

              <SummaryPill
                label="Error"
                value={selectedImportDetails.error_rows}
                className="border-red-200 bg-red-50 text-red-700"
              />

              <SummaryPill
                label="Duplicate"
                value={selectedImportDetails.duplicate_rows}
                className="border-orange-200 bg-orange-50 text-orange-700"
              />
            </div>

            <div className="rounded-xl border border-border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded By</p>
                  <p className="font-semibold">
                    {selectedImportDetails.uploaded_by}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Current Stage</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={String(
                        selectedImportDetails.current_stage
                      ).toLowerCase()}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-semibold">
                    {formatDate(selectedImportDetails.created_at)}{" "}
                    {formatTime(selectedImportDetails.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>
                  <p className="font-semibold">
                    {formatDate(selectedImportDetails.updated_at)}{" "}
                    {formatTime(selectedImportDetails.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <h4 className="mb-4 font-bold">Stage History</h4>

              {selectedImportDetails.stage_history.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No stage history available.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedImportDetails.stage_history.map((stageItem, index) => (
                    <div
                      key={`${stageItem.stage}-${index}`}
                      className="flex items-start gap-3 rounded-xl bg-muted/40 p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold">{stageItem.stage}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(stageItem.timestamp)}{" "}
                          {formatTime(stageItem.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImportDetailsOpen(false);
                  setSelectedImportDetails(null);
                }}
              >
                Close
              </Button>

              <Button
                onClick={() => {
  const importId = selectedImportDetails.id;

  setIsImportDetailsOpen(false);
  setSelectedImportDetails(null);
  setStagingImportId(String(importId));
  setActiveTab("staging");

  loadStaging({
    import_id: importId,
  });
}}
              >
                View Staging Questions
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}
        </CardContent>
      </Card>
    </div>
  );
}