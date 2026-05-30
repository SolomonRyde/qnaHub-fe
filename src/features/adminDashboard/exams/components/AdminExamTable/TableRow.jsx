import React, { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../../lib/utils";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { ActionDropdown } from "../../../../../components/ui/ActionDropdown";

const ExamImage = React.memo(({ exam }) => {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const defaultImage = "/exams/fallback-exam.jpg";

  const imageUrl = useMemo(() => {
    if (error || !exam?.cover_image_path) {
      return defaultImage;
    }

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    return `${baseUrl}${exam.cover_image_path}`;
  }, [exam?.cover_image_path, error]);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  return (
    <div className="relative flex-shrink-0">
      {!loaded && (
        <div className="absolute inset-0 w-12 h-12 bg-muted animate-pulse rounded-lg" />
      )}
      <img
        src={imageUrl}
        alt={exam?.exam_title || "Exam"}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-12 h-12 object-cover rounded-lg border border-border transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
});
ExamImage.displayName = "ExamImage";

export function TableRow({
  exam,
  isSelected,
  onToggle,
  onStatusChange,
  onDelete,
  onPreview,
  onEdit,
}) {
  const {
    id,
    exam_title,
    slug,
    duration_minutes,
    no_of_questions,
    difficulty,
    status,
    is_featured,
    industry_name,
    category_name,
    sub_category_name,
  } = exam || {};

  const safeTitle = exam_title || "Untitled Exam";
  const safeSlug = slug || "";
  const safeIndustry = industry_name || "-";
  const safeCategory = category_name || "-";
  const safeSubcategory = sub_category_name || "";
  const safeDifficulty = difficulty || "intermediate";
  const safeStatus = status || "draft";

  return (
    // ✅ Added: py-1 for vertical spacing between rows, hover effect
    <tr
      className={cn(
        "group hover:bg-muted/50 transition-colors border-b border-border/50",
        isSelected && "bg-primary/5",
        "py-1", // ✅ Small vertical space before/after row
      )}
    >
      {/* Exam Column - Added extra left padding */}
      <td className="px-5 py-4">
        {" "}
        {/* ✅ px-4 → px-5 for small left space */}
        <div className="flex items-center gap-3 min-w-0">
          <ExamImage exam={exam} />
          <div className="min-w-0">
            <Link
              to={`/exam/${safeSlug}`}
              target="_blank"
              className="font-medium text-foreground hover:text-primary transition-colors truncate block"
            >
              {safeTitle}
            </Link>
            <p className="text-sm text-muted-foreground mt-0.5">
              {" "}
              {/* ✅ Small top margin */}
              {duration_minutes || 0} mins • {no_of_questions || 0} questions
            </p>
          </div>
        </div>
      </td>

      {/* Category Column */}
      <td className="px-5 py-4">
        {" "}
        {/* ✅ px-4 → px-5 */}
        <div className="text-base">
          <p className="text-foreground font-medium">{safeIndustry}</p>
          <p className="text-muted-foreground text-sm mt-0.5">{safeCategory}</p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {safeSubcategory}
          </p>
          {/* ✅ Small top margin */}
        </div>
      </td>

      {/* Difficulty Column */}
      <td className="px-4 py-4">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize", // ✅ Slightly larger padding
            safeDifficulty === "easy" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            safeDifficulty === "intermediate" &&
              "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            safeDifficulty === "hard" &&
              "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
          )}
        >
          {safeDifficulty}
        </span>
      </td>

      {/* Status Column */}
      <td className="px-4 py-4">
        <StatusBadge value={safeStatus} />
      </td>

      {/* Featured Column */}
      <td className="px-4 py-4">
        <span
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-lg",
            is_featured
              ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
              : "text-gray-300",
          )}
          title={is_featured ? "Featured exam" : "Not featured"}
        >
          ★
        </span>
      </td>

      {/* Actions Column - Added right padding */}
      <td className="px-5 py-4">
        {" "}
        {/* ✅ px-4 → px-5 for right space */}
        <div className="flex justify-end">
          <ActionDropdown
            exam={exam}
            onPreview={onPreview}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}
