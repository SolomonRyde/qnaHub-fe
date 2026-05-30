import { Award, ChevronRight, Clock, Hash } from "lucide-react";
import React, { memo } from "react";
import { DifficultyPill } from "./DifficlutyPill";
import { GlassChip } from "./Glasschip";
import { cn } from "../../../../lib/utils";

export const ExamHero = memo(
  ({
    exam,
    imgSrc,
    onImgError,
    onImgLoad,
    imgLoaded,
    onBookmark,
    onShare,
    isBookmarked,
  }) => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
        <div className="relative w-full h-[420px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden">
          {/* ── Image layer ── */}
          <div className="absolute inset-0">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={exam.exam_title}
              loading="lazy"
              onError={onImgError}
              onLoad={onImgLoad}
              className={cn(
                "w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out",
                "hover:scale-[1.025]",
                imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
              )}
            />
          </div>

          {/* ── Gradient stack ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/96 via-black/78 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

          {/* ── Content wrapper ── */}
          <div className="relative h-full z-10 flex flex-col px-6 sm:px-8 pt-4 pb-10 sm:pb-12">
            {/* Action buttons — top right */}

            {/* Spacer — content at ~35% from top */}
            <div className="flex-[1] min-h-[20px]" />

            {/* ── Main content block ── */}
            <div className="flex-shrink-0 max-w-2xl lg:max-w-3xl">
              {/* Breadcrumb */}
              <nav
                className="flex items-center gap-2 flex-wrap mb-5"
                aria-label="Breadcrumb"
              >
                {[
                  exam.industry_name,
                  exam.category_name,
                  exam.sub_category_name,
                ]
                  .filter(Boolean)
                  .map((crumb, i, arr) => (
                    <React.Fragment key={i}>
                      <span
                        className={cn(
                          "text-xs font-semibold leading-none transition-colors",
                          i === arr.length - 1
                            ? "px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 backdrop-blur-md text-white"
                            : "text-white/55 hover:text-white/80 cursor-default",
                        )}
                      >
                        {crumb}
                      </span>
                      {i < arr.length - 1 && (
                        <ChevronRight className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
              </nav>

              {/* Title */}
              <h1
                className="font-black text-white tracking-tight leading-[1.06] mb-4"
                style={{
                  fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)",
                  textShadow:
                    "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                {exam.exam_title}
              </h1>

              {/* Description */}
              <p
                className="text-sm sm:text-[15px] text-white/80 leading-relaxed mb-7 max-w-xl"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}
              >
                {exam.description
                  ? exam.description.slice(0, 130) +
                    (exam.description.length > 130 ? "…" : "")
                  : `A ${exam.difficulty} level exam in ${exam.category_name} · ${exam.no_of_questions} questions · ${exam.duration_minutes} minutes`}
              </p>

              {/* Stat chips */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <DifficultyPill level={exam.difficulty} />
                <GlassChip
                  icon={Clock}
                  label="Duration"
                  value={`${exam.duration_minutes} min`}
                  accent="text-sky-300"
                />
                <GlassChip
                  icon={Hash}
                  label="Questions"
                  value={exam.no_of_questions}
                  accent="text-violet-300"
                />
                <GlassChip
                  icon={Award}
                  label="Marks"
                  value={exam.total_marks}
                  accent="text-amber-300"
                />
              </div>
            </div>

            {/* Bottom spacer */}
            <div className="flex-[2] min-h-[28px]" />
          </div>
        </div>
      </div>
    );
  },
);
ExamHero.displayName = "ExamHero";
