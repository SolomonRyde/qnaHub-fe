import React, { useState, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, ChevronDown } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { toast } from "react-hot-toast";
import { cn } from "../../../../../lib/utils";
import {
  useIndustries,
  useCategories,
  useSubcategories,
} from "../../../../exams/hooks/useExams";

export function CreateExamModal({ open, onOpenChange, onSuccess, mutation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Cascading dropdown state
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ NEW: Topics covered state
  const [topicsCovered, setTopicsCovered] = useState("");

  // Fetch industries (always available)
  const { data: industriesData, isLoading: industriesLoading } =
    useIndustries();
  const industries = industriesData?.data || [];

  // Fetch categories based on selected industry
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(
    selectedIndustry || null,
  );
  const categories = categoriesData?.data || [];

  // Fetch subcategories based on selected category
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useSubcategories(selectedCategory || null);
  const subcategories = subcategoriesData?.data || [];

  // Reset cascading selections when parent changes
  useEffect(() => {
    if (!selectedIndustry) {
      setSelectedCategory("");
    }
  }, [selectedIndustry]);

  useEffect(() => {
    if (!selectedCategory) {
      // Reset subcategory when category changes
    }
  }, [selectedCategory]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormErrors({});
      setIsSubmitting(false);
      setSelectedIndustry("");
      setSelectedCategory("");
      setTopicsCovered(""); // ✅ Reset topics field
    }
  }, [open]);

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
      const form = e.target;
      const formData = new FormData(form);

      // ✅ DEBUG: Log all form values properly
      const debugData = {};
      for (let [key, value] of formData.entries()) {
        debugData[key] = value;
      }
      console.log("📤 Sending exam data:", debugData);

      // ✅ Append cascading dropdown values (in case they're not in FormData)
      if (selectedIndustry) {
        formData.set("industry_id", selectedIndustry);
      }
      if (selectedCategory) {
        formData.set("category_id", selectedCategory);
      }

      // ✅ Handle subcategory - only send if has a valid value
      const subcategoryValue = formData.get("sub_category_id");
      if (
        subcategoryValue &&
        subcategoryValue !== "" &&
        subcategoryValue !== "null"
      ) {
        formData.set("sub_category_id", subcategoryValue);
      } else {
        if (form.querySelector('select[name="sub_category_id"]')?.required) {
          setFormErrors({ sub_category_id: "Please select a subcategory" });
          toast.error("Please select a subcategory");
          setIsSubmitting(false);
          return;
        }
      }

      // ✅ Handle is_featured checkbox
      const isFeatured = form.querySelector('input[name="is_featured"]')
        ?.checked
        ? 1
        : 0;
      formData.set("is_featured", isFeatured);

      // ✅ NEW: Handle topics_covered - REQUIRED field
      const formattedTopics = formatTopicsForBackend(topicsCovered);
      const topicsArray = JSON.parse(formattedTopics);

      // Validate: at least one topic required
      if (topicsArray.length === 0) {
        setFormErrors({ topics_covered: "Please enter at least one topic" });
        toast.error("Please enter at least one topic");
        setIsSubmitting(false);
        return;
      }

      formData.set("topics_covered", formattedTopics);

      // ✅ Generate exam_code if blank - use safer format
      if (!formData.get("exam_code")?.trim()) {
        const title = formData.get("exam_title") || "exam";
        const cleanTitle = title
          .replace(/[^a-zA-Z0-9]/g, "_")
          .toUpperCase()
          .slice(0, 10);
        const code = `${cleanTitle}_${Date.now()}`;
        formData.set("exam_code", code);
        console.log("🔑 Auto-generated exam_code:", code);
      }

      await mutation.mutateAsync(formData);

      onOpenChange(false);
      onSuccess?.();
      form.reset();
      setSelectedIndustry("");
      setSelectedCategory("");
      setTopicsCovered("");
    } catch (error) {
      console.error("❌ Create exam error:", error);

      // ✅ Show detailed validation errors from backend
      if (error.errors && Array.isArray(error.errors)) {
        console.error("🔍 Validation errors:", error.errors);

        const errorMap = {};
        error.errors.forEach((err) => {
          const match = err.match(/^([a-zA-Z_]+)/);
          if (match) {
            errorMap[match[1]] = err;
          }
        });
        setFormErrors(errorMap);
        toast.error(`Validation failed: ${Object.values(errorMap)[0]}`);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create exam");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIndustryChange = (e) => {
    const value = e.target.value;
    setSelectedIndustry(value);
    setSelectedCategory("");
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] bg-card border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              Create New Exam
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form
            id="create-exam-form"
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
                  className={cn(
                    "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                    formErrors.exam_title &&
                      "border-destructive focus:ring-destructive",
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
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., JAVA_101 or leave blank to auto-generate"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to auto-generate
                </p>
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
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe what this exam covers..."
              />
            </div>

            {/* ✅ NEW Row: Topics Covered (REQUIRED) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Topics Covered *
              </label>
              <textarea
                name="topics_covered"
                required
                rows={3}
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm",
                  formErrors.topics_covered &&
                    "border-destructive focus:ring-destructive",
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

              {/* ✅ Live preview of parsed topics as tags */}
              {topicsCovered.trim() && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topicsCovered
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t)
                    .map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                      >
                        {topic}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Row 3: Industry, Category, Subcategory (Cascading) */}
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
                    onChange={handleIndustryChange}
                    required
                    disabled={industriesLoading}
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none",
                      formErrors.industry_id &&
                        "border-destructive focus:ring-destructive",
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
                {industriesLoading && (
                  <p className="text-xs text-muted-foreground">
                    Loading industries...
                  </p>
                )}
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
                    onChange={handleCategoryChange}
                    required
                    disabled={!selectedIndustry || categoriesLoading}
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                      formErrors.category_id &&
                        "border-destructive focus:ring-destructive",
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
                {!selectedIndustry && (
                  <p className="text-xs text-muted-foreground">
                    Select industry first
                  </p>
                )}
                {categoriesLoading && (
                  <p className="text-xs text-muted-foreground">
                    Loading categories...
                  </p>
                )}
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
                    required
                    disabled={!selectedCategory || subcategoriesLoading}
                    className={cn(
                      "w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50",
                      formErrors.sub_category_id &&
                        "border-destructive focus:ring-destructive",
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

                {!selectedCategory && (
                  <p className="text-xs text-muted-foreground">
                    Select category first
                  </p>
                )}

                {subcategoriesLoading && (
                  <p className="text-xs text-muted-foreground">
                    Loading subcategories...
                  </p>
                )}

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
                  defaultValue="100"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="100"
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
                  defaultValue="1"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1"
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
                  defaultValue="30"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="30"
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
                  defaultValue="10"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10"
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
                  defaultValue="draft"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Row 7: Featured Toggle & Cover Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Featured Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Featured
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    id="is_featured"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Mark as featured exam
                  </label>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 800x400px
                </p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              form="create-exam-form"
              type="submit"
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Exam"
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
