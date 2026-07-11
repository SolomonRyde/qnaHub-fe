import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getExamQuestions, submitExam } from "../../../services/apiExams"; // ✅ Imported API
import { useExamProctoring } from "../hooks/useExamProctoring";

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_KEYS = ["option_a", "option_b", "option_c", "option_d"];

const pad = (n) => String(n).padStart(2, "0");
const fmt = (s) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const fmtShort = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

// Question status helpers
const getStatus = (qid, answers, flagged, currentId) => {
  if (qid === currentId) return "active";
  if (flagged.has(qid))
    return answers[qid] !== undefined ? "flagged-answered" : "flagged";
  if (answers[qid] !== undefined) return "answered";
  return "unseen";
};

// ─── Review / Summary Screen ────────────────────────────────────────────────
const ReviewScreen = ({
  questions,
  answers,
  flagged,
  onGoTo,
  onSubmit,
  onReturn,
  isSubmitting,
  timeLeft,
}) => {
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  const unanswered = questions.length - answered;
  const flagCount = flagged.size;

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col font-sans select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="bg-white border-b border-gray-300">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Review Your Answers
          </h1>
          <span
            className={`font-mono text-sm px-3 py-1 rounded ${timeLeft <= 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
          >
            {fmtShort(timeLeft)} remaining
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8">
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Exam Summary
          </h2>
          <div className="flex flex-wrap gap-8">
            {[
              {
                label: "Total questions",
                val: questions.length,
                color: "text-gray-900",
              },
              { label: "Answered", val: answered, color: "text-green-700" },
              {
                label: "Unanswered",
                val: unanswered,
                color: unanswered > 0 ? "text-red-700" : "text-green-700",
              },
              {
                label: "Flagged for review",
                val: flagCount,
                color: "text-amber-700",
              },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className={`text-2xl font-bold ${color} leading-none`}>
                  {val}
                </div>
                <div className="text-xs text-gray-600 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {unanswered > 0 && (
          <div className="bg-yellow-50 border border-amber-300 rounded-lg p-3 mb-5 flex gap-2.5 items-start">
            <span className="text-base mt-0.5">⚠️</span>
            <span className="text-sm text-gray-800">
              You have <strong>{unanswered}</strong> unanswered question
              {unanswered !== 1 ? "s" : ""}. Unanswered questions will be marked
              incorrect.
            </span>
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-semibold text-gray-900">
              Question status
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => onGoTo(idx)}
                  className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <span
                    className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center flex-shrink-0 ${isAnswered ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-800 truncate flex-1">
                    {q.question?.substring(0, 60)}
                    {q.question?.length > 60 ? "…" : ""}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isFlagged && (
                      <span className="text-[10px] bg-yellow-50 text-amber-700 border border-amber-300 rounded px-1.5 py-px font-semibold">
                        Flagged
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold ${isAnswered ? "text-green-700" : "text-red-700"}`}
                    >
                      {isAnswered ? "Answered" : "Not answered"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onReturn}
            className="px-5 py-2 text-sm font-semibold bg-white border-2 border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Return to exam
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 text-sm font-semibold rounded ${isSubmitting ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"}`}
          >
            {isSubmitting ? "Submitting…" : "Submit exam"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main ExamQuizPage ──────────────────────────────────────────────────────
const ExamQuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { attemptId, examId, durationMinutes, examTitle } =
    location.state || {};

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const timerRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  const q = questions[current];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const selectedAns = answers[q?.id];
  const isFlagged = flagged.has(q?.id);
  const isDanger = timeLeft <= 300;
  const isCritical = timeLeft <= 60;
  const progressPct = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0;
  const exam_title = slug.toUpperCase();

  useEffect(() => {
    if (!attemptId || !examId) {
      toast.error("Invalid exam session.");
      navigate(`/exam/${slug}`, { replace: true });
    }
  }, []);

  // ✅ Fetch Questions using extracted API function
  useEffect(() => {
    if (!examId) return;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getExamQuestions(examId);
        const qs = data.data;
        setQuestions(qs);
        const secs = Math.round((durationMinutes ?? qs.length * 1.5) * 60);
        setTimeLeft(secs);
      } catch (err) {
        toast.error(err.message || "Failed to load questions.");
        navigate(`/exam/${slug}`, { replace: true });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [examId]);

  // ✅ Submit Exam using extracted API function
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (isSubmitting || hasAutoSubmitted.current) return;
      hasAutoSubmitted.current = true;
      clearInterval(timerRef.current);
      setIsSubmitting(true);
      if (auto) toast("Time expired. Submitting exam…");

      try {
        const data = await submitExam(attemptId, answers);
        navigate(`/exam/${slug}/result`, {
          state: { ...data, attemptId, examTitle },
          replace: true,
        });
      } catch (err) {
        toast.error(err.message || "Submission failed.");
        hasAutoSubmitted.current = false;
        setIsSubmitting(false);
      }
    },
    [answers, attemptId, isSubmitting, navigate, slug, examTitle],
  );

  // ── Exam integrity / anti-cheat monitoring ───────────────────────────────
  const proctoringEnabled = !isLoading && questions.length > 0;

  const handleProctoringViolation = useCallback((logEntry) => {
    console.warn("[exam-proctoring] violation recorded:", logEntry);
  }, []);

  const handleProctoringAutoSubmit = useCallback(() => {
    toast.error(
      "Your exam was automatically submitted due to multiple integrity violations.",
    );
    handleSubmit(true);
  }, [handleSubmit]);

  const { showWarningModal, dismissWarningAndResume } = useExamProctoring({
    enabled: proctoringEnabled,
    attemptId,
    onViolation: handleProctoringViolation,
    onAutoSubmit: handleProctoringAutoSubmit,
  });

  // Timer
  useEffect(() => {
    if (isLoading || timeLeft === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isLoading, timeLeft]);

  const selectAnswer = (label) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: label }));
  };

  const toggleFlag = () => {
    if (!q) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const goTo = (idx) => {
    setCurrent(Math.max(0, Math.min(idx, questions.length - 1)));
    setShowReview(false);
  };

  const goToPrevious = () => {
    if (current > 0) goTo(current - 1);
  };
  const goToNext = () => {
    if (current < totalQ - 1) goTo(current + 1);
  };

  useEffect(() => {
    const handler = (e) => {
      // 🛡️ ANTI-CHEAT: Block DevTools and Copy/Paste shortcuts globally
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        const key = e.key.toLowerCase();
        if (["c", "x", "v", "a", "u", "s", "p"].includes(key)) {
          e.preventDefault();
          return;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        const key = e.key.toLowerCase();
        if (["i", "j", "c"].includes(key)) {
          e.preventDefault();
          return;
        }
      }
      // ---------------------------------------------

      if (showConfirm || showReview) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (!q) return;
      const map = { 1: "A", 2: "B", 3: "C", 4: "D" };
      if (map[e.key]) selectAnswer(map[e.key]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, q, showConfirm, showReview]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading exam questions…</p>
        </div>
      </div>
    );
  }

  // ✅ NEW: FALLBACK FOR EXAMS WITH NO QUESTIONS
  if (!isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-lg w-full bg-white border border-gray-300 rounded-xl shadow-sm p-8 md:p-10 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Questions Available
          </h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            This exam currently does not have any questions assigned to it.{" "}
            <br className="hidden md:block" />
            Please contact the administrator or try another exam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate("/exams")}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800 transition-colors"
            >
              Browse Other Exams
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <ReviewScreen
        questions={questions}
        answers={answers}
        flagged={flagged}
        onGoTo={goTo}
        onReturn={() => setShowReview(false)}
        onSubmit={() => {
          setShowReview(false);
          setShowConfirm(true);
        }}
        isSubmitting={isSubmitting}
        timeLeft={timeLeft}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col font-sans select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="bg-white border-b border-gray-300">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            {`Ryde Foundation ${exam_title}` || "Exam"}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Time remaining</span>
                <span
                  className={`text-lg font-mono font-semibold ${isCritical ? "text-red-700 animate-pulse" : isDanger ? "text-red-600" : "text-gray-900"}`}
                >
                  {fmt(timeLeft)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Test will be auto submitted for grading at 00:00:00
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlagged}
                  onChange={toggleFlag}
                  className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mark for Review</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                Question {current + 1}
              </span>
              {isFlagged && (
                <span className="bg-yellow-50 text-amber-700 border border-amber-300 text-xs font-semibold px-2 py-0.5 rounded">
                  🚩 Flagged for review
                </span>
              )}
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-5">
              <p className="text-base text-gray-800 leading-relaxed">
                {q.question}
              </p>
            </div>

            <div className="space-y-3">
              {OPTION_KEYS.map((key, idx) => {
                const label = OPTION_LABELS[idx];
                const text = q[key];
                const isSelected = selectedAns === label;
                if (!text) return null;

                return (
                  <label
                    key={label}
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${isSelected ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={label}
                      checked={isSelected}
                      onChange={() => selectAnswer(label)}
                      className="w-5 h-5 mt-0.5 border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-base text-gray-800 flex-1">
                      <span className="font-medium">{label}.</span> {text}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="h-20" />
          </div>
        </div>

        <div className="w-72 bg-white border-l border-gray-300 overflow-y-auto flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="text-xs font-semibold text-gray-900 mb-0.5">
              Question Navigator
            </div>
            <div className="text-[10px] text-gray-600">
              {answeredCount} of {totalQ} answered
            </div>
          </div>

          <div className="p-3 grid grid-cols-5 gap-2">
            {questions.map((item, idx) => {
              const status = getStatus(item.id, answers, flagged, q?.id);
              let buttonClass =
                "h-9 text-xs font-bold rounded border-2 transition-all ";
              if (status === "active")
                buttonClass +=
                  "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300";
              else if (status === "answered")
                buttonClass += "bg-green-600 text-white border-green-600";
              else if (status === "flagged")
                buttonClass += "bg-amber-600 text-white border-amber-600";
              else if (status === "flagged-answered")
                buttonClass +=
                  "bg-amber-600 text-white border-amber-600 ring-1 ring-white";
              else
                buttonClass +=
                  "bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600";

              return (
                <button
                  key={item.id}
                  onClick={() => goTo(idx)}
                  className={buttonClass}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs font-semibold text-gray-900 mb-2">
              Legend
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-green-600 border border-green-600"></span>
                <span className="text-xs text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-600 border border-amber-600"></span>
                <span className="text-xs text-gray-600">Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-blue-600 border border-blue-600 ring-2 ring-blue-300"></span>
                <span className="text-xs text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-white border border-gray-300"></span>
                <span className="text-xs text-gray-600">Not visited</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Answered</span>
                <span className="text-sm font-bold text-green-700">
                  {answeredCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Unanswered</span>
                <span
                  className={`text-sm font-bold ${totalQ - answeredCount > 0 ? "text-red-700" : "text-green-700"}`}
                >
                  {totalQ - answeredCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Flagged</span>
                <span className="text-sm font-bold text-amber-700">
                  {flagged.size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-300 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={current === 0}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <div className="text-sm text-gray-600">
            {current + 1} of {totalQ} Questions
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReview(true)}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Review All
            </button>
            {current < totalQ - 1 ? (
              <button
                onClick={goToNext}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-900 rounded hover:bg-blue-800"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setShowReview(true)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-900 rounded hover:bg-blue-800"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-red-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-semibold text-gray-900">
                Exam Warning
              </h2>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              You have left fullscreen mode or switched away from the exam.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              This is your first warning.
            </p>
            <p className="text-sm font-semibold text-red-700 mb-6">
              One more violation will automatically submit your exam.
            </p>
            <div className="flex justify-end">
              <button
                onClick={dismissWarningAndResume}
                autoFocus
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800"
              >
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Submit Exam?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to submit your exam? You cannot change your
              answers after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuizPage;
