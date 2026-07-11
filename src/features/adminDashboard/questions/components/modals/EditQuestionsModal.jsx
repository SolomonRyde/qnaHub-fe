import React, { useState, useEffect } from "react";
import { X, Save, Edit2 } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";

export function EditQuestionModal({
  isOpen,
  onClose,
  onSave,
  question,
  examOptions = [],
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    exam_id: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    explanation: "",
    difficulty: "",
  });

  // Populate form when a question is selected
  useEffect(() => {
    if (question) {
      setFormData({
        exam_id: question.exam_id || "",
        question: question.question || "",
        option_a: question.option_a || "",
        option_b: question.option_b || "",
        option_c: question.option_c || "",
        option_d: question.option_d || "",
        correct_answer: question.correct_answer || "",
        explanation: question.explanation || "",
        difficulty:
          question.difficulty === "medium"
            ? "intermediate"
            : question.difficulty || "easy",
      });
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-background shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <Edit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Edit Question</h3>
              <p className="text-xs text-muted-foreground">ID: {question.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            disabled={isSaving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          {/* Exam & Difficulty */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <select
                name="exam_id"
                value={formData.exam_id}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select Exam</option>
                {examOptions.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Text</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter the question..."
              required
            />
          </div>

          {/* Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {["option_a", "option_b", "option_c", "option_d"].map(
              (opt, idx) => (
                <div key={opt} className="space-y-2">
                  <label className="text-sm font-medium">
                    Option {String.fromCharCode(65 + idx)}
                  </label>
                  <Input
                    name={opt}
                    value={formData[opt]}
                    onChange={handleChange}
                    placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                    required
                  />
                </div>
              ),
            )}
          </div>

          {/* Correct Answer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Correct Answer</label>
            <select
              name="correct_answer"
              value={formData.correct_answer}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Explanation</label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Explain the correct answer..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border p-5 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
