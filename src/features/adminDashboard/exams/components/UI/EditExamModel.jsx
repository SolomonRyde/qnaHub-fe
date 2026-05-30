import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Star, ChevronDown } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { toast } from "react-hot-toast";
import { cn } from "../../../../../lib/utils";
import {
  useIndustries,
  useCategories,
  useSubcategories,
} from "../../../../exams/hooks/useExams";

export function EditExamModal({
  open,
  onOpenChange,
  exam,
  onSuccess,
  updateMutation,
  featuredMutation,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFeatured, setIsFeatured] = useState(false);

  // ✅ Cascading dropdown states
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // ✅ Form field states (for controlled inputs)
  const [examCode, setExamCode] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [pointsPerQuestion, setPointsPerQuestion] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");

  // ✅ NEW: topics_covered state
  const [topicsCovered, setTopicsCovered] = useState("");

  // Fetch industries/categories/subcategories
  const { data: industriesData } = useIndustries();
  const industries = industriesData?.data || [];

  const { data: categoriesData } = useCategories(selectedIndustry || null);
  const categories = categoriesData?.data || [];

  const { data: subcategoriesData } = useSubcategories(
    selectedCategory || null,
  );
  const subcategories = subcategoriesData?.data || [];

  // ✅ Initialize ALL form fields when exam loads
  useEffect(() => {
    if (exam && open) {
      console.log("📝 Editing exam:", exam);

      // Set featured state
      setIsFeatured(!!exam.is_featured);

      // Set cascading dropdown values
      setSelectedIndustry(exam.industry_id?.toString() ?? "");
      setSelectedCategory(exam.category_id?.toString() ?? "");
      setSelectedSubcategory(exam.sub_category_id?.toString() ?? "");

      // ✅ Set all form field values
      setExamCode(exam.exam_code ?? "");
      setExamTitle(exam.exam_title ?? "");
      setDescription(exam.description ?? "");
      setTotalMarks(exam.total_marks?.toString() ?? "");
      setPointsPerQuestion(exam.points_per_question?.toString() ?? "");
      setDurationMinutes(exam.duration_minutes?.toString() ?? "");
      setNoOfQuestions(exam.no_of_questions?.toString() ?? "");
      setDifficulty(exam.difficulty ?? "");
      setStatus(exam.status ?? "");

      // ✅ NEW: Initialize topics_covered (convert array to comma-separated string)
      if (Array.isArray(exam.topics_covered)) {
        setTopicsCovered(exam.topics_covered.join(", "));
      } else if (typeof exam.topics_covered === "string") {
        // Handle case where backend returns JSON string
        try {
          const parsed = JSON.parse(exam.topics_covered);
          setTopicsCovered(
            Array.isArray(parsed) ? parsed.join(", ") : exam.topics_covered,
          );
        } catch {
          setTopicsCovered(exam.topics_covered);
        }
      } else {
        setTopicsCovered("");
      }

      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [exam, open]);

  // Reset cascading when parent changes
  useEffect(() => {
    if (!selectedIndustry) {
      setSelectedCategory("");
      setSelectedSubcategory("");
    }
  }, [selectedIndustry]);

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  // ✅ Helper: Convert comma-separated string to JSON array string for backend
  const formatTopicsForBackend = (input) => {
    if (!input || input.trim() === "") return "[]";

    // Split by comma, trim each topic, filter empty
    const topics = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    return JSON.stringify(topics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // ✅ Append cascading values explicitly
      if (selectedIndustry) formData.set("industry_id", selectedIndustry);
      if (selectedCategory) formData.set("category_id", selectedCategory);
      if (selectedSubcategory)
        formData.set("sub_category_id", selectedSubcategory);

      // ✅ Handle is_featured checkbox
      formData.set("is_featured", isFeatured ? "1" : "0");

      // ✅ NEW: Add topics_covered as JSON array string
      formData.set("topics_covered", formatTopicsForBackend(topicsCovered));

      // ✅ Handle file upload: keep existing if no new file selected
      const fileInput = form.querySelector('input[name="cover_image"]');
      if (!fileInput?.files?.[0] && exam?.cover_image_path) {
        formData.delete("cover_image");
      }

      // Call mutation
      await updateMutation?.mutateAsync({ id: exam?.id, formData });

      // If we get here, it was successful
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("❌ Update Failed:", error);
      setIsSubmitting(false);

      // Check if it's a validation error (400)
      if (error.status === 400 && error.errors && error.errors.length > 0) {
        const errorMap = {};
        error.errors.forEach((errMsg) => {
          const lowerMsg = errMsg.toLowerCase();
          // Map error messages to field keys
          if (lowerMsg.includes("exam code")) errorMap.exam_code = errMsg;
          else if (lowerMsg.includes("exam title"))
            errorMap.exam_title = errMsg;
          else if (lowerMsg.includes("industry")) errorMap.industry_id = errMsg;
          else if (lowerMsg.includes("category")) errorMap.category_id = errMsg;
          else if (lowerMsg.includes("subcategory"))
            errorMap.sub_category_id = errMsg;
          else if (lowerMsg.includes("duration"))
            errorMap.duration_minutes = errMsg;
          else if (lowerMsg.includes("total marks"))
            errorMap.total_marks = errMsg;
          else if (lowerMsg.includes("points"))
            errorMap.points_per_question = errMsg;
          else if (lowerMsg.includes("questions"))
            errorMap.no_of_questions = errMsg;
          else if (lowerMsg.includes("difficulty"))
            errorMap.difficulty = errMsg;
          else if (lowerMsg.includes("description"))
            errorMap.description = errMsg;
          else if (lowerMsg.includes("topics"))
            errorMap.topics_covered = errMsg;
          else errorMap.general = errMsg;
        });

        setFormErrors(errorMap);
        toast.error("Please fix the highlighted errors");
      } else {
        // Generic network or server error
        toast.error(
          error.message || "Failed to update exam. Check console for details.",
        );
      }
    }
  };

  if (!exam) return null;

  // ✅ Safe mutation state access
  const updatePending = updateMutation?.isPending ?? false;
  const featuredPending = featuredMutation?.isPending ?? false;
  const anyPending = isSubmitting || updatePending || featuredPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] bg-card border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              Edit Exam
            </Dialog.Title>
            <div className="flex items-center gap-2">
              {/* Featured toggle */}
              <button
                type="button"
                onClick={() => setIsFeatured((prev) => !prev)}
                disabled={featuredPending}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isFeatured
                    ? "text-yellow-500 hover:bg-yellow-50"
                    : "text-gray-400 hover:text-yellow-500",
                )}
                title={isFeatured ? "Remove from featured" : "Add to featured"}
              >
                <Star className={cn("w-5 h-5", isFeatured && "fill-current")} />
              </button>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Row 1: Exam Title & Exam Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Exam Title *
                </label>
                <input
                  type="text"
                  name="exam_title"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                    formErrors.exam_title && "border-destructive",
                  )}
                  placeholder="Enter exam title"
                />
                {formErrors.exam_title && (
                  <p className="text-xs text-destructive">
                    {formErrors.exam_title}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Exam Code *
                </label>
                <input
                  type="text"
                  name="exam_code"
                  required
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., JAVA_101"
                />
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe what this exam covers..."
              />
            </div>

            {/* ✅ NEW Row: Topics Covered */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Topics Covered
              </label>
              <textarea
                name="topics_covered"
                rows={3}
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm",
                  formErrors.topics_covered && "border-destructive",
                )}
                placeholder="Enter topics separated by commas (e.g., Variables, Functions, Async/Await)"
              />
              <p className="text-xs text-muted-foreground">
                💡 Separate multiple topics with commas. Example:
                <code className="bg-muted px-1 py-0.5 rounded ml-1">
                  Variables, Data Types, Functions, Scope
                </code>
              </p>
              {formErrors.topics_covered && (
                <p className="text-xs text-destructive">
                  {formErrors.topics_covered}
                </p>
              )}

              {/* ✅ Preview of parsed topics */}
              {topicsCovered.trim() && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topicsCovered
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t)
                    .map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Row 3: Industry, Category, Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Industry *
                </label>
                <div className="relative">
                  <select
                    name="industry_id"
                    value={selectedIndustry}
                    onChange={(e) => {
                      setSelectedIndustry(e.target.value);
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                    }}
                    required
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none",
                      formErrors.industry_id && "border-destructive",
                    )}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.industry_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {formErrors.industry_id && (
                  <p className="text-xs text-destructive">
                    {formErrors.industry_id}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="category_id"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory("");
                    }}
                    required
                    disabled={!selectedIndustry}
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                      formErrors.category_id && "border-destructive",
                    )}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {formErrors.category_id && (
                  <p className="text-xs text-destructive">
                    {formErrors.category_id}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subcategory *
                </label>
                <div className="relative">
                  <select
                    name="sub_category_id"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    required
                    disabled={!selectedCategory}
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                      formErrors.sub_category_id && "border-destructive",
                    )}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.sub_category_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {formErrors.sub_category_id && (
                  <p className="text-xs text-destructive">
                    {formErrors.sub_category_id}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Marks & Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Total Marks *
                </label>
                <input
                  type="number"
                  name="total_marks"
                  required
                  min="1"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Points Per Question *
                </label>
                <input
                  type="number"
                  name="points_per_question"
                  required
                  min="1"
                  value={pointsPerQuestion}
                  onChange={(e) => setPointsPerQuestion(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Row 5: Duration & Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  required
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  name="no_of_questions"
                  required
                  min="1"
                  value={noOfQuestions}
                  onChange={(e) => setNoOfQuestions(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Row 6: Difficulty & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  required
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Row 7: Featured Checkbox & Cover Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Featured
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    id="is_featured_edit"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="is_featured_edit"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Mark as featured exam
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cover Image
                </label>
                {exam.cover_image_path && (
                  <div className="mb-2">
                    <img
                      src={`${import.meta.env?.VITE_BACKEND_URL || ""}${exam.cover_image_path}`}
                      alt="Current"
                      className="w-24 h-16 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current image
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to keep current image
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
              <Dialog.Close asChild>
                <Button variant="outline" disabled={anyPending}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={anyPending}>
                {anyPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
