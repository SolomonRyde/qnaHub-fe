import React, { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

const OPTION_LABELS = ["A", "B", "C", "D"];

const QuestionPreview = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!questions?.length) return null;

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Generated Questions{" "}
        <span className="text-gray-400 font-normal">({questions.length})</span>
      </h3>

      <div className="space-y-2">
        {questions.map((q, index) => {
          const isOpen = openIndex === index;
          const correctIndex = OPTION_LABELS.indexOf(q.correct_answer);

          const options = [
            { label: "A", text: q.option_a },
            { label: "B", text: q.option_b },
            { label: "C", text: q.option_c },
            { label: "D", text: q.option_d },
          ];

          return (
            <article
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
                         border border-gray-200 dark:border-gray-700
                         overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full flex items-start gap-3 p-4 sm:p-5 text-left"
              >
                <span
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center
                               bg-green-100 dark:bg-green-900/30
                               text-green-700 dark:text-green-300
                               rounded-full text-sm font-semibold"
                >
                  {index + 1}
                </span>
                <h4 className="flex-1 font-medium text-gray-900 dark:text-white leading-relaxed">
                  {q.question}
                </h4>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-gray-400 mt-1 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5">
                  {/* Options */}
                  <div className="ml-10 space-y-2 mb-4">
                    {options.map((opt, optIndex) => {
                      const isCorrect = optIndex === correctIndex;
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors
                            ${
                              isCorrect
                                ? "bg-green-50/70 dark:bg-green-900/15 border-green-200 dark:border-green-800"
                                : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                            }`}
                        >
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0
                              ${
                                isCorrect
                                  ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                              }`}
                          >
                            {opt.label}
                          </span>
                          <span
                            className={`text-sm flex-1 ${
                              isCorrect
                                ? "font-medium text-green-800 dark:text-green-200"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {opt.text}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="ml-10 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <span className="font-semibold">Explanation: </span>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPreview;
