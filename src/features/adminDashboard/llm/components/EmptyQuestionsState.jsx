import React from "react";
import { Brain } from "lucide-react";

const EmptyQuestionsState = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
    <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
      <Brain className="h-7 w-7 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
      No questions yet
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-1">
      Fill in the form on the left, then generate a fresh batch of exam-ready
      MCQs.
    </p>
    <p className="text-xs font-medium text-green-600 dark:text-green-400">
      ← Configure and click Generate Questions
    </p>
  </div>
);

export default EmptyQuestionsState;
