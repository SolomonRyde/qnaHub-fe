// features/exams/components/ExamCard.jsx
import React, { useState } from "react";
import {
  Clock,
  BookOpen,
  ChevronRight,
  Building2,
  Layers,
  Tag,
  Award,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../../lib/utils";
import FeaturedBadge from "../badges/FeaturedBadge";
import { StatusBadge } from "../../../../components/ui/StatusBadge";

const DIFFICULTY_GLOW = {
  easy: "hover:shadow-emerald-500/10",
  intermediate: "hover:shadow-amber-500/10",
  hard: "hover:shadow-rose-500/10",
};

const ExamCard = ({ exam }) => {
  const {
    exam_title,
    slug,
    description,
    exam_code,
    difficulty,
    duration_minutes,
    no_of_questions,
    total_marks,
    cover_image_path,
    is_featured,
    industry_name,
    category_name,
    sub_category_name,
  } = exam;

  const defaultImage = "/exams/fallback-exam.jpg";

  const imageUrl = cover_image_path
    ? `${import.meta.env.VITE_BACKEND_URL}${cover_image_path}`
    : defaultImage;

  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      className={cn(
        "group relative flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden",
        "shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        DIFFICULTY_GLOW[difficulty] || "hover:shadow-primary/10",
      )}
    >
      {/* ── Cover image ── */}
      <div className="relative h-36 overflow-hidden bg-muted flex-shrink-0">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={imgSrc}
          alt={exam_title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (imgSrc !== defaultImage) setImgSrc(defaultImage);
          }}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06]",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Featured badge */}
        {is_featured && (
          <div className="absolute top-2.5 left-2.5">
            <FeaturedBadge />
          </div>
        )}

        {/* Difficulty on image */}
        <div className="absolute bottom-2.5 left-2.5">
          <StatusBadge value={difficulty} />
        </div>

        {/* Duration chip on image */}
        <div
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg
                        bg-black/40 border border-white/15 backdrop-blur-sm"
        >
          <Clock className="h-2.5 w-2.5 text-white/70" />
          <span className="text-[10px] font-bold text-white">
            {duration_minutes}m
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3
          className="text-sm font-bold text-foreground line-clamp-2 leading-snug
                       group-hover:text-primary transition-colors duration-150"
        >
          {exam_title}{" "}
          <span className="ml-1 text-[10px] font-medium text-muted-foreground">
            ({exam_code})
          </span>
        </h3>

        {/* Taxonomy */}
        <div className="flex flex-col gap-1">
          {industry_name && (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3 flex-shrink-0 text-blue-500" />
              <span className="text-[11px] text-muted-foreground truncate">
                {industry_name}
              </span>
            </div>
          )}
          {category_name && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3 w-3 flex-shrink-0 text-emerald-500" />
              <span className="text-[11px] text-muted-foreground truncate">
                {category_name}
              </span>
            </div>
          )}
          {sub_category_name && (
            <div className="flex items-center gap-1.5">
              <Layers className="h-3 w-3 flex-shrink-0 text-violet-500" />
              <span className="text-[11px] text-muted-foreground truncate">
                {sub_category_name}
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted border border-border">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-foreground">
              {no_of_questions} Q
            </span>
          </div>
          {total_marks && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted border border-border">
              <Award className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-foreground">
                {total_marks} pts
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>
        )}

        {/* CTA */}
        <Link
          to={`/exam/${slug}`}
          className={cn(
            "group/btn relative mt-auto flex items-center justify-center gap-2",
            "w-full py-2.5 rounded-xl text-xs font-bold overflow-hidden",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-px",
            "active:translate-y-0 active:scale-[0.985]",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          {/* shimmer */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                           -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700
                           ease-in-out pointer-events-none"
          />
          <span className="relative flex items-center gap-1.5">
            <Zap className="h-3 w-3 fill-current" />
            Start Exam
            <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </article>
  );
};

export default ExamCard;
