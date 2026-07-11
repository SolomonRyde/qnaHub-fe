import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getExamResult } from "../../../services/apiExams"; // ✅ Imported API
import useCountUp from "../hooks/useCountUp"; // ✅ Imported Hook

const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const diff = Math.round((new Date(endTime) - new Date(startTime)) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

// ✅ UPDATED: Performance tiers adjusted for a 90% passing threshold
const getPerformance = (pct) => {
  if (pct >= 90)
    return {
      label: "Outstanding",
      desc: "Exceptional result. You demonstrate expert-level knowledge.",
      color: "text-green-700",
    };
  if (pct >= 70)
    return {
      label: "Almost There",
      desc: "Good effort, but you need 90% to pass. Review the topics and try again.",
      color: "text-amber-700",
    };
  return {
    label: "Did not pass",
    desc: "Review the objectives below and schedule a retake.",
    color: "text-red-700",
  };
};

const ScoreCircle = ({ percentage, passed, run }) => {
  const animated = useCountUp(percentage, 1400, run);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          cx="96"
          cy="96"
          r="90"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="96"
          cy="96"
          r="90"
          stroke={passed ? "#16a34a" : "#dc2626"}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 1.4s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-5xl font-bold ${passed ? "text-green-700" : "text-red-700"}`}
        >
          {animated}%
        </span>
        <span
          className={`text-sm font-semibold mt-1 uppercase tracking-wide ${passed ? "text-green-700" : "text-red-700"}`}
        >
          {passed ? "Passed" : "Failed"}
        </span>
      </div>
    </div>
  );
};

const OPTION_KEYS = ["option_a", "option_b", "option_c", "option_d"];
const OPTION_LABELS = ["A", "B", "C", "D"];

const AnswerReviewItem = ({ item, index, isOpen, onToggle }) => {
  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    selected_answer,
    correct_answer,
    is_correct,
    explanation,
  } = item;
  const options = [option_a, option_b, option_c, option_d];

  const statusConfig = !selected_answer
    ? {
        label: "Not answered",
        bg: "bg-yellow-50",
        text: "text-amber-700",
        border: "border-amber-300",
      }
    : is_correct
      ? {
          label: "Correct",
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-500",
        }
      : {
          label: "Incorrect",
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-500",
        };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${isOpen ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
      >
        <span
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          {index + 1}
        </span>
        <span className="flex-1 text-sm text-gray-800 truncate">
          {question}
        </span>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          {statusConfig.label}
        </span>
        <span
          className={`text-gray-500 text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-6 bg-white">
          <p className="mb-5 text-base text-gray-800 leading-relaxed">
            {question}
          </p>
          <div className="space-y-2 mb-4">
            {options.map((text, i) => {
              if (!text) return null;
              const label = OPTION_LABELS[i];
              const isCorrect = label === correct_answer;
              const isSelected = label === selected_answer;
              const isWrong = isSelected && !is_correct;

              let optionClass = "border-gray-200 bg-gray-50 text-gray-600";
              if (isCorrect)
                optionClass = "border-green-500 bg-green-50 text-gray-800";
              if (isWrong)
                optionClass = "border-red-500 bg-red-50 text-gray-800";

              return (
                <div
                  key={label}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 ${optionClass}`}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : isWrong ? (
                      <span className="text-red-600 font-bold">✗</span>
                    ) : (
                      <span className="text-gray-400">○</span>
                    )}
                  </span>
                  <span className="flex-shrink-0 text-sm font-bold text-gray-600 min-w-[20px]">
                    {label}.
                  </span>
                  <span className="text-sm flex-1">{text}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    {isCorrect && (
                      <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded">
                        CORRECT
                      </span>
                    )}
                    {isWrong && (
                      <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded">
                        YOUR ANSWER
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Explanation
              </span>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}

          {!selected_answer && (
            <div className="bg-yellow-50 border border-amber-300 rounded-lg p-3 mt-4 text-sm text-gray-800">
              ⚠️ You did not answer this question. The correct answer is{" "}
              <strong>{correct_answer}</strong>.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ExamResultPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [run, setRun] = useState(false);
  const [openItems, setOpenItems] = useState(new Set());
  const [reviewFilter, setReviewFilter] = useState("all");

  useEffect(() => {
    const state = location.state;
    if (state && state.score !== undefined) {
      if (state.attemptId) {
        setIsLoading(true);
        getExamResult(state.attemptId)
          .then((data) => setResult({ ...state, ...data.data }))
          .catch(() => setResult(state))
          .finally(() => setIsLoading(false));
      } else {
        setResult(state);
      }
    } else if (state?.attemptId) {
      setIsLoading(true);
      getExamResult(state.attemptId)
        .then((data) => setResult(data.data))
        .catch((err) => setError(err.message || "Failed to load result."))
        .finally(() => setIsLoading(false));
    } else {
      navigate(`/exam/${slug}`, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (result) setTimeout(() => setRun(true), 300);
  }, [result]);

  const toggleItem = (idx) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const filteredReview =
    result?.answerReview.filter((item) => {
      if (reviewFilter === "correct") return item.is_correct;
      if (reviewFilter === "incorrect")
        return !item.is_correct && item.selected_answer;
      if (reviewFilter === "skipped") return !item.selected_answer;
      return true;
    }) || [];

  const expandAll = () =>
    setOpenItems(new Set(filteredReview.map((_, i) => i)));
  const collapseAll = () => setOpenItems(new Set());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading your results…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-300 rounded-lg p-10">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-base font-semibold text-gray-900 mb-2">
            Unable to load result
          </p>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/exam/${slug}`)}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800"
          >
            Back to exam
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const {
    score = 0,
    percentage = 0,
    correct = 0,
    wrong = 0,
    unanswered = 0,
    passed = false,
    totalMarks,
    totalQuestions,
    startTime,
    endTime,
    examTitle: nameFromState,
    answerReview = [],
  } = result;

  const pct = parseFloat(percentage) || 0;
  const examName = nameFromState || slug;
  const exam_title = slug.toLocaleUpperCase();
  const duration = formatDuration(startTime, endTime);
  const perf = getPerformance(pct);
  const total = totalQuestions || correct + wrong + unanswered || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {exam_title}
              </h1>
              <p className="text-sm text-gray-600">Exam result report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-300 rounded-lg mb-6">
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ScoreCircle percentage={pct} passed={passed} run={run} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div
                className={`inline-block px-6 py-2 rounded-lg border-2 text-lg font-bold mb-4 ${passed ? "bg-green-50 border-green-600 text-green-700" : "bg-red-50 border-red-600 text-red-700"}`}
              >
                {passed ? "✓ PASS" : "✗ DID NOT PASS"}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${perf.color}`}>
                {perf.label}
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {perf.desc}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Your Score
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {score}
                    {totalMarks && (
                      <span className="text-xl text-gray-600">
                        {" "}
                        / {totalMarks}
                      </span>
                    )}
                  </p>
                </div>
                {total > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Questions
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{total}</p>
                  </div>
                )}
                {duration && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Time Taken
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {duration}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                Your score:{" "}
                <strong className={passed ? "text-green-700" : "text-red-700"}>
                  {pct}%
                </strong>
              </span>
              {/* ✅ UPDATED: Passing threshold text */}
              <span className="text-gray-600">
                Passing: <strong>90%</strong>
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${passed ? "bg-green-600" : "bg-red-600"}`}
                style={{ width: `${pct}%` }}
              />
              {/* ✅ UPDATED: Marker position moved to 90% */}
              <div className="absolute left-[90%] top-0 bottom-0 w-1 bg-gray-800" />
            </div>
            {/* ✅ UPDATED: Passing score text */}
            <p className="text-xs text-gray-600 mt-2">
              Passing score: <strong>90%</strong>
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Answer Breakdown
            </h3>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-600 text-green-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                ✓
              </div>
              <p className="text-4xl font-bold text-green-700 mb-1">
                {correct}
              </p>
              <p className="text-sm text-gray-600">Correct</p>
              {total > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((correct / total) * 100)}% of total
                </p>
              )}
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-600 text-red-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                ✗
              </div>
              <p className="text-4xl font-bold text-red-700 mb-1">{wrong}</p>
              <p className="text-sm text-gray-600">Incorrect</p>
              {total > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((wrong / total) * 100)}% of total
                </p>
              )}
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-600 text-amber-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                —
              </div>
              <p className="text-4xl font-bold text-amber-700 mb-1">
                {unanswered}
              </p>
              <p className="text-sm text-gray-600">Not Answered</p>
              {total > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((unanswered / total) * 100)}% of total
                </p>
              )}
            </div>
          </div>
          {total > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="h-4 rounded-full overflow-hidden flex gap-1">
                {correct > 0 && (
                  <div className="bg-green-600" style={{ flex: correct }} />
                )}
                {wrong > 0 && (
                  <div className="bg-red-600" style={{ flex: wrong }} />
                )}
                {unanswered > 0 && (
                  <div className="bg-amber-600" style={{ flex: unanswered }} />
                )}
              </div>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded bg-green-600" />
                  Correct
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded bg-red-600" />
                  Incorrect
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded bg-amber-600" />
                  Not Answered
                </div>
              </div>
            </div>
          )}
        </div>

        {answerReview.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-gray-900">
                Answer Review{" "}
                <span className="text-gray-600 font-normal">
                  ({filteredReview.length} question
                  {filteredReview.length !== 1 ? "s" : ""})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {[
                  { key: "all", label: `All (${answerReview.length})` },
                  { key: "correct", label: `Correct (${correct})` },
                  { key: "incorrect", label: `Incorrect (${wrong})` },
                  { key: "skipped", label: `Skipped (${unanswered})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setReviewFilter(key);
                      setOpenItems(new Set());
                    }}
                    className={`px-3 py-1.5 text-sm font-semibold rounded border transition-colors ${reviewFilter === key ? "bg-blue-900 text-white border-blue-900" : "bg-white text-gray-700 border-gray-300 hover:border-blue-900 hover:text-blue-900"}`}
                  >
                    {label}
                  </button>
                ))}
                <span className="text-gray-300 mx-1">|</span>
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-sm font-semibold text-blue-900 hover:underline"
                >
                  Expand all
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-sm font-semibold text-blue-900 hover:underline"
                >
                  Collapse all
                </button>
              </div>
            </div>
            <div className="p-6">
              {filteredReview.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No questions in this category.
                </p>
              ) : (
                filteredReview.map((item, idx) => (
                  <AnswerReviewItem
                    key={item.question_id || idx}
                    item={item}
                    index={answerReview.indexOf(item)}
                    isOpen={openItems.has(idx)}
                    onToggle={() => toggleItem(idx)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Exam Details
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { label: "Exam", val: examName },
              total > 0 && { label: "Total questions", val: total },
              totalMarks && { label: "Total marks", val: totalMarks },
              {
                label: "Your score",
                val: `${score}${totalMarks ? ` / ${totalMarks}` : ""}`,
              },
              { label: "Percentage", val: `${pct}%` },
              // ✅ UPDATED: Passing score value
              { label: "Passing score", val: "90%" },
              {
                label: "Result",
                val: passed ? "Pass" : "Did not pass",
                valClass: passed
                  ? "font-bold text-green-700"
                  : "font-bold text-red-700",
              },
              duration && { label: "Time taken", val: duration },
              endTime && {
                label: "Submitted",
                val: new Date(endTime).toLocaleString(),
              },
            ]
              .filter(Boolean)
              .map(({ label, val, valClass = "" }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`text-sm text-gray-900 ${valClass}`}>
                    {val}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Next Steps
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800 text-left"
            >
              🏠 Go to Dashboard
            </button>

            {passed ? (
              <>
                <button className="px-5 py-3 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800 text-left">
                  📄 Download certificate
                </button>
                <button
                  onClick={() => navigate("/exams")}
                  className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 text-left"
                >
                  🔍 Browse more exams
                </button>
                <button
                  onClick={() => {
                    const t = `I scored ${pct}% on ${examName} — PASSED ✓`;
                    navigator.share
                      ? navigator
                          .share({
                            title: examName,
                            text: t,
                            url: window.location.href,
                          })
                          .catch(() => {})
                      : navigator.clipboard.writeText(t);
                  }}
                  className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 text-left"
                >
                  🔗 Share result
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/exam/${slug}`)}
                  className="px-5 py-3 text-sm font-semibold text-white bg-blue-900 rounded hover:bg-blue-800 text-left"
                >
                  🔄 Retake exam
                </button>
                <button
                  onClick={() => navigate("/exams")}
                  className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 text-left"
                >
                  🔍 Browse more exams
                </button>
              </>
            )}
          </div>
        </div>

        {!passed && (
          <div className="bg-white border-2 border-amber-400 rounded-lg mb-6">
            <div className="p-5 flex items-center gap-4">
              <span className="text-4xl">🔒</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Certificate locked
                </p>
                {/* ✅ UPDATED: Certificate lock warning text */}
                <p className="text-sm text-gray-600">
                  Pass the exam with a score of 90% or above to earn your
                  certificate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResultPage;
