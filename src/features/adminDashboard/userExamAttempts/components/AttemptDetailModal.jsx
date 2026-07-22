import { CheckCircle2, Loader2, Mail, User, X, XCircle } from "lucide-react";
import { useAdminAttemptDetail } from "../hooks/useAdminExamAttempts";
import { Badge } from "../../../../components/ui/Badge";

const OPTION_KEYS = ["A", "B", "C", "D"];

function optionText(question, key) {
  return question[`option_${key.toLowerCase()}`];
}

export function AttemptDetailModal({ attemptId, open, onOpenChange }) {
  const { data, isLoading, error } = useAdminAttemptDetail(
    open ? attemptId : null,
  );
  const attempt = data?.data;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {attempt?.exam_title || "Attempt detail"}
            </h2>
            {attempt && (
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {attempt.user_name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {attempt.user_email}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive text-center py-8">
              Failed to load attempt detail.
            </p>
          )}

          {attempt && !isLoading && (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryStat
                  label="Score"
                  value={`${attempt.score}/${attempt.total_marks}`}
                />
                <SummaryStat
                  label="Percentage"
                  value={`${Number(attempt.percentage).toFixed(2)}%`}
                />
                <SummaryStat
                  label="Correct"
                  value={attempt.correct_count}
                  valueClassName="text-emerald-600"
                />
                <SummaryStat
                  label="Wrong"
                  value={attempt.wrong_count}
                  valueClassName="text-rose-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={attempt.passed ? "default" : "destructive"}>
                  {attempt.passed ? "Passed" : "Failed"}
                </Badge>
                <Badge variant="secondary">{attempt.status}</Badge>
                {attempt.unanswered_count > 0 && (
                  <Badge variant="outline">
                    {attempt.unanswered_count} unanswered
                  </Badge>
                )}
              </div>

              {/* Answer review */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Answer review
                </h3>
                <div className="space-y-3">
                  {attempt.answerReview?.map((qa, idx) => (
                    <div
                      key={qa.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">
                          {idx + 1}. {qa.question}
                        </p>
                        {qa.is_correct ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {OPTION_KEYS.map((key) => {
                          const isSelected = qa.selected_answer === key;
                          const isCorrectOpt = qa.correct_answer === key;
                          return (
                            <div
                              key={key}
                              className={`text-xs rounded-lg border px-3 py-2 ${
                                isCorrectOpt
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                  : isSelected
                                    ? "border-rose-300 bg-rose-50 text-rose-800"
                                    : "border-border text-muted-foreground"
                              }`}
                            >
                              <span className="font-semibold mr-1">{key}.</span>
                              {optionText(qa, key)}
                              {isSelected && (
                                <span className="ml-1 font-medium">
                                  (selected)
                                </span>
                              )}
                              {isCorrectOpt && !isSelected && (
                                <span className="ml-1 font-medium">
                                  (correct)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {qa.explanation && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Explanation:{" "}
                          </span>
                          {qa.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {attempt.answerReview?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No answers were recorded for this attempt.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, valueClassName = "text-foreground" }) {
  return (
    <div className="rounded-xl border border-border p-3 text-center">
      <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
