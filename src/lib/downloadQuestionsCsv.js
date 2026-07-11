import Papa from "papaparse";

export const downloadQuestionsCsv = (
  questions,
  exam_id = null,
  filename = null,
  examMetadata = null,
) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn("No questions to export");
    return;
  }

  // Use exam_id from props if provided, otherwise fallback to first question's exam_id if available
  const targetExamId = exam_id || questions[0]?.exam_id;

  // ✅ Extract metadata fields for CSV content
  const industry = examMetadata?.industry || "";
  const category = examMetadata?.category || "";
  const subcategory = examMetadata?.subcategory || "";
  const difficulty = examMetadata?.difficulty || "UNKNOWN";

  const csvData = questions.map((q) => ({
    exam_id: targetExamId || "",
    industry: industry,
    category: category,
    subcategory: subcategory,
    difficulty: difficulty,
    question: q.question || "",
    option_a: q.option_a || "",
    option_b: q.option_b || "",
    option_c: q.option_c || "",
    option_d: q.option_d || "",
    correct_answer: q.correct_answer || "",
    explanation: q.explanation || "",
  }));

  const csv = Papa.unparse(csvData, {
    quotes: true,
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // ✅ GENERATE DYNAMIC FILENAME: EXAM_TITLE_DIFFICULTY_NO_OF_QUESTIONS.csv
  const examTitle = examMetadata?.exam_title || "EXAM";
  const noOfQuestions = examMetadata?.no_of_questions || questions.length;

  // Clean and format the title:
  // 1. Convert to UPPERCASE
  // 2. Replace any non-alphanumeric characters (spaces, hyphens, etc.) with a single underscore
  // 3. Remove any leading or trailing underscores
  const formattedTitle = examTitle
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  const formattedDifficulty = difficulty.toUpperCase();

  // Construct the final filename (e.g., JUDICIARY_BASICS_HARD_10.csv)
  const dynamicFilename = `${formattedTitle}_${formattedDifficulty}_${noOfQuestions}.csv`;

  link.setAttribute("href", url);
  // Use the explicitly provided filename, or fallback to our new dynamic format
  link.setAttribute("download", filename || dynamicFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default downloadQuestionsCsv;
