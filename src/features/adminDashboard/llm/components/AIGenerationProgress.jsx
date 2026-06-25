import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { STAGES } from "./constants";

export const useStageIndex = (isLoading) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!isLoading) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, [isLoading]);
  return index;
};

const AIGenerationProgress = ({ stageIndex }) => (
  <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
        <Loader2 className="h-4 w-4 text-green-600 dark:text-green-400 animate-spin" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Generating your questions
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This usually takes a few seconds.
        </p>
      </div>
    </div>
    <ol className="relative ml-1.5 space-y-5">
      {STAGES.map((stage, i) => {
        const done = i < stageIndex;
        const active = i === stageIndex;
        return (
          <li key={stage.id} className="relative flex items-center gap-3 pl-0">
            {i < STAGES.length - 1 && (
              <span
                className={`absolute left-[9px] top-5 h-5 w-px ${done ? "bg-green-300 dark:bg-green-700" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            )}
            {done ? (
              <CheckCircle2 className="h-[18px] w-[18px] text-green-500 flex-shrink-0" />
            ) : active ? (
              <span className="relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
              </span>
            ) : (
              <Circle className="h-[18px] w-[18px] text-gray-300 dark:text-gray-600 flex-shrink-0" />
            )}
            <span
              className={`text-sm ${done ? "text-green-700 dark:text-green-300 font-medium" : active ? "text-green-700 dark:text-green-300 font-medium" : "text-gray-400 dark:text-gray-500"}`}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  </div>
);

export default AIGenerationProgress;
