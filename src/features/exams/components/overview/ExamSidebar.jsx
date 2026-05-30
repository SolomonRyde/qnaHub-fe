import { memo } from "react";
import { DIFFICULTY_CONFIG } from "../../constants/Difficluty.constants";
import { cn } from "../../../../lib/utils";
import { DifficultyPill } from "./DifficlutyPill";
import {
  Award,
  CheckCircle2,
  Clock,
  Hash,
  Play,
  Star,
  Target,
} from "lucide-react";
import { TRUST_ITEMS } from "../../constants/TrustItems.constants";

export const ExamSidebar = memo(({ exam, isStarting, onStart }) => {
  const diff =
    DIFFICULTY_CONFIG[exam.difficulty] || DIFFICULTY_CONFIG.intermediate;
  const passingScore = Math.round(exam.total_marks * 0.6);

  return (
    <div className="sticky top-24 space-y-3 pb-24 lg:pb-0">
      {/* ── CTA card ── */}
      <div
        className={cn(
          "rounded-2xl border border-border bg-card overflow-hidden shadow-xl",
          diff.glow,
        )}
      >
        {/* Accent rule */}
        <div className="h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="p-5 space-y-4">
          {/* Difficulty row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                Difficulty
              </span>
              <DifficultyPill level={exam.difficulty} />
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  diff.bar,
                )}
              />
            </div>
          </div>

          {/* 2×2 stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: Clock,
                label: "Duration",
                value: `${exam.duration_minutes} min`,
              },
              { icon: Hash, label: "Questions", value: exam.no_of_questions },
              { icon: Award, label: "Total Marks", value: exam.total_marks },
              {
                icon: Target,
                label: "Per Question",
                value: `${exam.points_per_question} pts`,
              },
            ].map(({ icon: Icon, label, value }, i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted border border-border
                           hover:border-primary/25 hover:bg-muted/70 transition-all duration-150 group"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                    {label}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground leading-none">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Meta list */}
          <div className="divide-y divide-border text-xs">
            {[
              {
                label: "Passing Score",
                value: `${passingScore} / ${exam.total_marks}`,
              },
              { label: "Language", value: "English" },
              { label: "Attempt Type", value: "Online · Proctored" },
              { label: "Certificate", value: "Issued on Pass" },
            ].map(({ label, value }, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground font-semibold">{value}</span>
              </div>
            ))}
          </div>

          {/* ── CTA button ── */}
          <button
            onClick={onStart}
            disabled={isStarting}
            aria-label="Start exam"
            className={cn(
              "group relative w-full py-3.5 rounded-xl font-bold text-sm overflow-hidden",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-px",
              "active:translate-y-0 active:scale-[0.985] transition-all duration-150",
              "disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            )}
          >
            {/* Shimmer */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                             -translate-x-full group-hover:translate-x-full transition-transform duration-600
                             ease-in-out pointer-events-none"
            />
            <span className="relative flex items-center justify-center gap-2">
              {isStarting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Preparing Exam…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Start Exam Now
                </>
              )}
            </span>
          </button>

          {/* Trust grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
            {TRUST_ITEMS.map(({ icon: Icon, label, color }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <Icon className={cn("h-3 w-3 flex-shrink-0", color)} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-center text-muted-foreground/70">
            By starting, you agree to our{" "}
            <a
              href="#"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              Terms &amp; Conditions
            </a>
          </p>
        </div>
      </div>

      {/* ── Checklist card ── */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Pre-exam checklist
        </p>
        {[
          "Stable internet connection ready",
          "Browser notifications disabled",
          "At least 30 min of free time",
          "Comfortable, distraction-free space",
        ].map((item, i) => (
          <label
            key={i}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
            />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {item}
            </span>
          </label>
        ))}
      </div>

      {/* ── Pro tip ── */}
      <div
        className="rounded-2xl border border-amber-200 bg-amber-50
                      dark:border-amber-500/20 dark:bg-amber-500/5 p-4"
      >
        <div className="flex items-start gap-2.5">
          <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5 fill-current" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Pro Tip
            </p>
            <p className="text-xs text-amber-700/90 dark:text-amber-400/75 leading-relaxed">
              Review all topics before starting. The exam cannot be paused once
              begun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
ExamSidebar.displayName = "ExamSidebar";
