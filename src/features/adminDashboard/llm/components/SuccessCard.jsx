import React from "react";
import { CheckCircle2, Eye, Download, RefreshCw } from "lucide-react";

const SuccessCard = ({
  examTitle,
  difficulty,
  questionCount,
  generationTime,
  usage,
  onPreview,
  onDownload,
  onRegenerate,
  isLoading,
}) => (
  <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {questionCount} questions ready
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {examTitle} · {generationTime !== null ? `${generationTime}s` : "—"}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2.5">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Difficulty
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
          {difficulty}
        </p>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2.5">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Prompt tokens
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {usage ? usage.prompt_tokens.toLocaleString() : "—"}
        </p>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2.5">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Output tokens
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {usage ? usage.output_tokens.toLocaleString() : "—"}
        </p>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2.5">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Total tokens
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {usage ? usage.total_tokens.toLocaleString() : "—"}
        </p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onPreview}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Eye className="h-3.5 w-3.5" /> Preview Questions
      </button>
      <button
        onClick={onDownload}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Download className="h-3.5 w-3.5" /> Download CSV
      </button>
      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Generate Again
      </button>
    </div>
  </div>
);

export default SuccessCard;
