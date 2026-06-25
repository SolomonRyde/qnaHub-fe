import Papa from "papaparse";

export const downloadQuestionsCsv = (
  questions,
  exam_id = null,
  filename = null,
  examMetadata = null, // ✅ New parameter for exam metadata
) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn("No questions to export");
    return;
  }

  // Use exam_id from props if provided, otherwise fallback to first question's exam_id if available
  const targetExamId = exam_id || questions[0]?.exam_id;

  // ✅ Extract metadata fields
  const industry = examMetadata?.industry || "";
  const category = examMetadata?.category || "";
  const subcategory = examMetadata?.subcategory || "";

  const csvData = questions.map((q) => ({
    exam_id: targetExamId || "",
    industry: industry,
    category: category,
    subcategory: subcategory,
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

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `questions-${timestamp}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default downloadQuestionsCsv;
