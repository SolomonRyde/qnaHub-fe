import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

export const ExamError = ({ error, onRetry }) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="text-center max-w-sm space-y-5">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Exam Not Found
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error?.message ||
            "We couldn't load this exam. It may have been removed or the link is invalid."}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border
                     text-sm font-medium text-foreground hover:bg-accent transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCcw className="h-4 w-4" /> Retry
        </button>
        <Link
          to="/exams"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground
                     text-sm font-semibold hover:bg-primary/90 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Exams
        </Link>
      </div>
    </div>
  </div>
);
