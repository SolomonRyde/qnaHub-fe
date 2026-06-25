import React, { useState } from "react";
import { useAdminExams } from "../../../../features/exams/hooks/useExams"; // Adjust path as needed
import {
  Sparkles,
  Loader2,
  Zap,
  Gauge,
  GraduationCap,
  SlidersHorizontal,
  ScrollText,
} from "lucide-react";

export const DIFFICULTIES = [
  {
    value: "easy",
    label: "Easy",
    description: "Foundational, recall-based questions.",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Applied concepts with moderate reasoning.",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Multi-step reasoning and edge cases.",
  },
];

export const MODELS = [
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    tagline: "Free",
    badges: ["Lower cost", "Fast generation"],
    icon: Zap,
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    tagline: "Paid",
    badges: ["Better reasoning", "Best for difficult exams"],
    icon: Gauge,
  },
];

const COUNT_PRESETS = [5, 10, 15, 20, 30, 50, 100];

const FieldLabel = ({ htmlFor, required, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {children}
    {required && <span className="text-green-500">*</span>}
  </label>
);

const HelperText = ({ children }) =>
  children ? (
    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
      {children}
    </p>
  ) : null;

const SectionHeading = ({ step, icon: Icon, title, description }) => (
  <div className="flex items-start gap-3">
    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-semibold text-green-600 dark:bg-green-900/30 dark:text-green-400">
      {step}
    </span>
    <div className="min-w-0">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        {title}
      </h3>
      {description && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  </div>
);

// Base classes without border/focus colors so we can apply them dynamically
const baseInputClasses =
  "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const QuestionGeneratorForm = ({ formData, onChange, onSubmit, isLoading }) => {
  const { data: examsData, isLoading: isLoadingExams } = useAdminExams({
    limit: 100,
    status: "published",
  });

  // ✅ Added state for form validation errors
  const [errors, setErrors] = useState({});

  const exams = examsData?.exams || examsData?.data || [];
  const selectedDifficulty = DIFFICULTIES.find(
    (d) => d.value === formData.difficulty,
  );
  const selectedModel = MODELS.find((m) => m.value === formData.model);
  const promptLength = formData.prompt?.length || 0;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onChange({
      ...formData,
      // Allow empty string for number inputs so user can clear and retype
      [name]:
        type === "number" ? (value === "" ? "" : parseInt(value, 10)) : value,
    });

    // ✅ Clear error for this specific field when user interacts
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCountPreset = (n) => {
    if (isLoading) return;
    onChange({ ...formData, count: n });

    // ✅ Clear count error when preset is clicked
    if (errors.count) {
      setErrors((prev) => ({ ...prev, count: null }));
    }
  };

  // ✅ Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.exam_id) {
      newErrors.exam_id = "Please select an exam.";
    }
    if (!formData.difficulty) {
      newErrors.difficulty = "Please select a difficulty level.";
    }
    if (!formData.count || formData.count < 1 || formData.count > 100) {
      newErrors.count = "Please enter a number between 1 and 100.";
    }
    if (!formData.model) {
      newErrors.model = "Please select an LLM model.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed if valid
    setErrors({});
    onSubmit();
  };

  // ✅ Helper to dynamically apply red border if field has an error
  const getInputClasses = (fieldName) => {
    const hasError = !!errors[fieldName];
    return `${baseInputClasses} ${
      hasError
        ? "border-red-500 dark:border-red-500 focus:ring-red-500"
        : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
    }`;
  };

  // ✅ Reusable Error Message Component
  const ErrorMessage = ({ fieldName }) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
        <svg
          className="w-3 h-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {errors[fieldName]}
      </p>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Section 1: Exam Configuration */}
      <div className="space-y-4">
        <SectionHeading
          step={1}
          icon={GraduationCap}
          title="Exam configuration"
          description="Choose which exam these questions belong to and how hard they should be."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pl-10">
          <div>
            <FieldLabel htmlFor="exam_id" required>
              Exam
            </FieldLabel>
            <select
              id="exam_id"
              name="exam_id"
              value={formData.exam_id || ""}
              onChange={handleChange}
              disabled={isLoading || isLoadingExams}
              className={getInputClasses("exam_id")}
            >
              <option value="" disabled>
                {isLoadingExams ? "Loading exams..." : "Select an exam"}
              </option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.exam_title}
                </option>
              ))}
            </select>
            <ErrorMessage fieldName="exam_id" />
            <HelperText>Only published exams are listed here.</HelperText>
          </div>

          <div>
            <FieldLabel htmlFor="difficulty" required>
              Difficulty
            </FieldLabel>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              disabled={isLoading}
              className={getInputClasses("difficulty")}
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
            <ErrorMessage fieldName="difficulty" />
            <HelperText>{selectedDifficulty?.description}</HelperText>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700/60" />

      {/* Section 2: Generation Settings */}
      <div className="space-y-4">
        <SectionHeading
          step={2}
          icon={SlidersHorizontal}
          title="Generation settings"
          description="Pick a model and decide how many questions to generate."
        />

        <div className="pl-10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="model" required>
                LLM Model
              </FieldLabel>
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={isLoading}
                className={getInputClasses("model")}
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} — {m.tagline}
                  </option>
                ))}
              </select>
              <ErrorMessage fieldName="model" />
              {selectedModel && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedModel.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="count" required>
                Number of questions
              </FieldLabel>
              <input
                type="number"
                id="count"
                name="count"
                min="1"
                max="100"
                value={formData.count}
                onChange={handleChange}
                disabled={isLoading}
                className={getInputClasses("count")}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {COUNT_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCountPreset(n)}
                    disabled={isLoading}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.count === n
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <ErrorMessage fieldName="count" />
              <HelperText>Max 100 questions per request.</HelperText>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700/60" />

      {/* Section 3: Topic Restriction */}
      <div className="space-y-4">
        <SectionHeading
          step={3}
          icon={ScrollText}
          title="Topic restriction"
          description="Narrow the question pool to a specific topic, or leave blank for full syllabus coverage."
        />
        <div className="pl-10">
          <FieldLabel htmlFor="prompt">
            Custom prompt{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </FieldLabel>
          <textarea
            id="prompt"
            name="prompt"
            rows="3"
            value={formData.prompt}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Focus on C++ variable sizes and memory allocation..."
            className={`${baseInputClasses} border-gray-300 dark:border-gray-600 focus:ring-green-500 resize-y`}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <HelperText>Leave blank to cover the full syllabus.</HelperText>
            <span className="text-xs text-gray-400">{promptLength} chars</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700/60" />

      {/* Section 4: Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || isLoadingExams}
          className="inline-flex items-center gap-2 px-6 py-3 text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 shadow-sm shadow-primary/20 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Questions
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default QuestionGeneratorForm;
