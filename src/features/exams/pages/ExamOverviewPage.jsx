// features/exams/pages/ExamOverviewPage.jsx
// Peak production UI/UX — Stripe + Linear + Coursera aesthetic
// Fully theme-aware (light/dark), zero hardcoded colors

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Shield,
  AlertCircle,
  BookOpen,
  FileText,
  Award,
  Wifi,
  Lock,
  Zap,
  RefreshCcw,
  ArrowLeft,
  BadgeCheck,
  Hash,
  TrendingUp,
  Eye,
  BarChart2,
  Timer,
  AlertTriangle,
  Layers,
  Play,
  ChevronDown,
  ChevronRight,
  Star,
  Target,
  Bookmark,
  Share2,
  CheckCircle2,
  Maximize2,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { ExamNavbar } from "../components/navigation/ExamNavbar";
import { useExamBySlug } from "../hooks/useExams";
import toast from "react-hot-toast";
// ⚠️ Adjust this path if your AuthContext lives elsewhere in the project.
import { useAuth } from "../../../context/AuthContext";

import { DIFFICULTY_CONFIG } from "../constants/Difficluty.constants";
import { TOPIC_COLORS } from "../constants/TopicColors.constatns";
import { TRUST_ITEMS } from "../constants/TrustItems.constants";
import { BENEFITS } from "../constants/Benefits.constats";

import { DifficultyPill } from "../components/overview/DifficlutyPill";
import { GlassChip } from "../components/overview/Glasschip";
import { SectionCard } from "../components/overview/SectionCard";
import { ExamHero } from "../components/overview/ExamHero";
import { AboutSection } from "../components/overview/AboutSection";
import { InstructionsSection } from "../components/overview/InstructionsSection";
import { ExamSidebar } from "../components/overview/ExamSidebar";

import { ExamSkeleton } from "../components/states/Skeleton";
import { ExamError } from "../components/states/ExamError";
import { TopicsSection } from "../components/overview/TopicsSection";

// ─── Design tokens / constants ────────────────────────────────────────────────

const DEFAULT_IMAGE = "/exams/fallback-exam.jpg";

const ExamOverviewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [showFullscreenNotice, setShowFullscreenNotice] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { data: examData, isLoading, error, refetch } = useExamBySlug(slug);
  const exam = examData?.data;

  useEffect(() => {
    if (exam?.cover_image_path) {
      setImgLoaded(false);
      setImgSrc(`${import.meta.env.VITE_BACKEND_URL}${exam.cover_image_path}`);
    } else {
      setImgSrc(DEFAULT_IMAGE);
    }
  }, [exam]);

  const handleImgError = useCallback(() => {
    if (imgSrc !== DEFAULT_IMAGE) setImgSrc(DEFAULT_IMAGE);
  }, [imgSrc]);
  const handleImgLoad = useCallback(() => setImgLoaded(true), []);
  const handleBookmark = useCallback(() => {
    setIsBookmarked((v) => !v);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    );
  }, [isBookmarked]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: exam?.exam_title,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback for browsers that don't support Web Share API
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  }, [exam]);

  // ✅ FIXED: Properly handle topics_covered - works with array OR string

  // Step 1 — triggered by the "Start Exam" buttons. Just gates on auth and,
  // if the user is signed in, opens the fullscreen-notice modal. No network
  // call happens here yet.
  const handleStartExam = useCallback(() => {
    if (!exam?.id) return;

    // ── Auth gate ────────────────────────────────────────────────────────
    // Don't let an unauthenticated user get anywhere near the "start exam"
    // flow — send them to login first, and bring them right back here once
    // they're signed in.
    if (authLoading) {
      toast.error("Checking your session, please try again in a moment.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please log in to start this exam.");
      navigate("/login", {
        state: { from: `/exam/${slug}` },
      });
      return;
    }

    setShowFullscreenNotice(true);
  }, [exam, navigate, slug, authLoading, isAuthenticated]);

  // Step 2 — triggered by the "Continue & Start" button inside the
  // fullscreen-notice modal. This is still a direct, trusted click, so the
  // fullscreen request below is allowed to succeed.
  const confirmAndStartExam = useCallback(async () => {
    if (!exam?.id) return;

    setIsStarting(true);
    try {
      const res = await fetch(
        `https://api.rydevalues.cloud/api/v1/exam/${exam.id}/start`,
        {
          method: "POST",
          credentials: "include", // ← this sends the auth cookie
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      // Cookie could have expired between page load and this click — bounce
      // to login instead of showing a generic error.
      if (res.status === 401) {
        setShowFullscreenNotice(false);
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { state: { from: `/exam/${slug}` } });
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to start exam. Please try again.",
        );
      }

      // ── Mandatory fullscreen gate ────────────────────────────────────────
      // The exam attempt already exists on the backend at this point, so we
      // don't re-create it if fullscreen is denied — we simply refuse to
      // navigate into the quiz page until the user grants it.
      try {
        const el = document.documentElement;
        const requestFs =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.msRequestFullscreen;

        if (!requestFs) {
          throw new Error("Fullscreen is not supported in this browser.");
        }

        await requestFs.call(el);
      } catch (fsErr) {
        console.error("Fullscreen request failed:", fsErr);
        toast.error(
          "Fullscreen mode is mandatory to start this exam. Please allow fullscreen and try again.",
        );
        setIsStarting(false);
        return;
      }

      setShowFullscreenNotice(false);
      navigate(`/exam/${exam.slug}/start`, {
        state: {
          attemptId: data.attemptId,
          examId: exam.id,
          durationMinutes: exam.duration_minutes,
        },
      });
    } catch (err) {
      console.error("Failed to start exam:", err);
      toast.error(err.message || "Failed to start exam. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }, [exam, navigate, slug]);

  const topicsCovered = useMemo(() => {
    if (!exam) return [];

    const raw = exam.topics_covered;

    // Case 1: Already an array (backend parsed it) → return directly
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((t) => String(t).trim()).filter((t) => t);
    }

    // Case 2: String that might be JSON → try to parse
    if (typeof raw === "string" && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => String(t).trim()).filter((t) => t);
        }
        // If parsed but not array, treat as single topic
        return [String(parsed).trim()].filter((t) => t);
      } catch {
        // Not valid JSON, treat as comma-separated string
        return raw
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      }
    }

    // Case 3: Empty/null → fallback to category/subcategory
    return [exam?.sub_category_name || exam?.category_name].filter(Boolean);
  }, [exam]);

  const instructions = useMemo(() => {
    if (!exam) return [];
    return [
      {
        icon: Clock,
        title: "Time Management",
        description: `You have ${exam.duration_minutes} minutes for all ${exam.no_of_questions} questions — roughly ${Math.round((exam.duration_minutes / exam.no_of_questions) * 60)} seconds each.`,
        type: "info",
      },
      {
        icon: Shield,
        title: "No Back Navigation",
        description:
          "Once you move past a question you cannot return. Think carefully before submitting.",
        type: "warning",
      },
      {
        icon: AlertTriangle,
        title: "Auto-Submit on Timeout",
        description:
          "When the timer hits zero the exam submits automatically, including unanswered questions.",
        type: "warning",
      },
      {
        icon: Wifi,
        title: "Stable Connection Required",
        description:
          "Maintain a reliable internet connection throughout. Disconnecting may terminate your attempt.",
        type: "warning",
      },
      {
        icon: Lock,
        title: "Anti-Cheating Policy",
        description:
          "Tab switching and external resources are monitored. Violations may disqualify your attempt.",
        type: "info",
      },
      {
        icon: FileText,
        title: "Fullscreen Recommended",
        description:
          "Use fullscreen mode to avoid accidental tab exits and get the best experience.",
        type: "info",
      },
    ];
  }, [exam]);

  if (isLoading) return <ExamSkeleton />;
  if (error || !exam) return <ExamError error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExamNavbar examTitle={exam?.exam_title} />

      <ExamHero
        exam={exam}
        imgSrc={imgSrc}
        onImgError={handleImgError}
        onImgLoad={handleImgLoad}
        imgLoaded={imgLoaded}
        onBookmark={handleBookmark}
        onShare={handleShare}
        isBookmarked={isBookmarked}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-9">
          {/* Left — content */}
          <div className="lg:col-span-2 space-y-5">
            <AboutSection exam={exam} />
            {topicsCovered.length > 0 && (
              <TopicsSection topics={topicsCovered} />
            )}
            <InstructionsSection instructions={instructions} />
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-1">
            <ExamSidebar
              exam={exam}
              isStarting={isStarting}
              onStart={handleStartExam}
            />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                      bg-gradient-to-t from-background via-background/97 to-transparent
                      px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <button
          onClick={handleStartExam}
          disabled={isStarting}
          aria-label="Start exam"
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base",
            "bg-primary text-primary-foreground",
            "shadow-2xl shadow-primary/25",
            "active:scale-[0.985] transition-transform duration-100",
            "disabled:opacity-55 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {isStarting ? (
              <>
                <span className="h-5 w-5 rounded-full border-2 border-primary-foreground/25 border-t-primary-foreground animate-spin" />
                Preparing…
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-current" />
                Start Exam Now
              </>
            )}
          </span>
        </button>
        <p className="text-center text-[10px] text-muted-foreground/70 mt-2 tabular-nums">
          {exam.no_of_questions} questions · {exam.duration_minutes} min ·{" "}
          {exam.total_marks} marks
        </p>
      </div>

      {/* ── Fullscreen notice modal ── shown right after "Start Exam" is
          clicked, before the fullscreen request is actually made. */}
      {showFullscreenNotice && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullscreen-notice-title"
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Maximize2 className="h-6 w-6 text-primary" />
            </div>

            <h3
              id="fullscreen-notice-title"
              className="text-lg font-semibold text-foreground mb-2"
            >
              This exam runs in fullscreen mode
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              When you continue, your browser will switch to fullscreen and stay
              that way for the duration of the exam. Exiting fullscreen,
              switching tabs, or minimizing the window will be flagged as an
              integrity violation and may auto-submit your exam.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <button
                onClick={() => setShowFullscreenNotice(false)}
                disabled={isStarting}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold",
                  "bg-secondary text-secondary-foreground",
                  "hover:bg-secondary/80 transition-colors",
                  "disabled:opacity-55 disabled:cursor-not-allowed",
                )}
              >
                Cancel
              </button>
              <button
                onClick={confirmAndStartExam}
                disabled={isStarting}
                autoFocus
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                  "disabled:opacity-55 disabled:cursor-not-allowed",
                  "inline-flex items-center justify-center gap-2",
                )}
              >
                {isStarting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/25 border-t-primary-foreground animate-spin" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    Continue & Start
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamOverviewPage;
