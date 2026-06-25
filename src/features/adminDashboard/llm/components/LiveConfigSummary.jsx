import React from "react";
import { Cpu, GraduationCap, BarChart3, Hash, ScrollText } from "lucide-react";
// ⚠️ Adjust this path to point to your QuestionGeneratorForm file
import {
  MODELS,
  DIFFICULTIES,
} from "../../llm/components/QuestionGeneratorForm";

const SummaryRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900 dark:text-white text-right truncate max-w-[60%]">
      {value}
    </span>
  </div>
);

const LiveConfigSummary = ({ formData, exams }) => {
  const exam = exams.find((e) => +e.id === +formData.exam_id);
  const difficulty = DIFFICULTIES.find((d) => d.value === formData.difficulty);
  const model = MODELS.find((m) => m.value === formData.model);

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-1">
        <Cpu className="h-4 w-4 text-green-600 dark:text-green-400" />
        Current configuration
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Updates live as you fill out the form.
      </p>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
        <SummaryRow
          icon={GraduationCap}
          label="Exam"
          value={exam?.exam_title || "Not selected"}
        />
        <SummaryRow
          icon={BarChart3}
          label="Difficulty"
          value={difficulty?.label || "—"}
        />
        <SummaryRow icon={Hash} label="Question count" value={formData.count} />
        <SummaryRow icon={Cpu} label="Model" value={model?.label || "—"} />
        <SummaryRow
          icon={ScrollText}
          label="Topic restriction"
          value={formData.prompt?.trim() ? formData.prompt : "None specified"}
        />
      </div>
    </div>
  );
};

export default LiveConfigSummary;
