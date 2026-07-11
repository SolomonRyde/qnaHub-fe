// features/exams/hooks/useExamProctoring.js
//
// Encapsulates exam integrity / anti-cheat monitoring:
//   - A SINGLE shared violation counter, incremented by:
//       * exiting fullscreen
//       * switching tabs (visibilitychange -> document.hidden)
//       * window losing focus / being minimized (blur)
//   - A ~1s cooldown so one physical action (e.g. pressing Esc, which can
//     fire fullscreenchange + visibilitychange + blur almost simultaneously)
//     is only ever counted once.
//   - 1st violation -> warning modal (exam continues).
//   - 2nd violation -> onAutoSubmit() fires exactly once (guarded), intended
//     to be wired to the page's existing handleSubmit(true).
//   - Each violation is packaged into a log entry (attemptId, type,
//     timestamp, running total) via onViolation(), ready to be POSTed to a
//     backend endpoint later — no network call is made here.
//
// This hook is intentionally UI-agnostic: it only exposes state + actions.
// The page component renders the actual warning modal / toast.

import { useCallback, useEffect, useRef, useState } from "react";

// Violations are 1-indexed. The exam is auto-submitted the moment the
// running count reaches this value.
const AUTO_SUBMIT_AT_VIOLATION = 2;

// Minimum time between two violations for them to be counted separately.
const VIOLATION_COOLDOWN_MS = 1000;

export const VIOLATION_TYPES = {
  FULLSCREEN_EXIT: "fullscreen-exit",
  TAB_SWITCH: "tab-switch",
  WINDOW_BLUR: "window-blur",
};

function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}

function requestFullscreenOn(el) {
  if (!el) return Promise.reject(new Error("No element to fullscreen"));
  const req =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.msRequestFullscreen;
  if (!req) return Promise.reject(new Error("Fullscreen API not supported"));
  return req.call(el);
}

function exitFullscreenSafely() {
  const exit =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (isFullscreenActive() && exit) {
    return exit.call(document);
  }
  return Promise.resolve();
}

/**
 * @param {Object} opts
 * @param {boolean} opts.enabled - master switch; monitoring only runs while
 *   true (e.g. false while questions are loading or the review screen/a
 *   modal that should legitimately blur the page is open).
 * @param {string|number} [opts.attemptId] - included on every violation log.
 * @param {(logEntry: {attemptId, type, timestamp, totalViolations}) => void}
 *   [opts.onViolation] - fired for every counted violation (1st and 2nd+).
 *   Hook this up to a backend call later; no-op by default.
 * @param {(logEntry) => void} [opts.onAutoSubmit] - fired exactly once, the
 *   moment the violation count reaches AUTO_SUBMIT_AT_VIOLATION. Hook this
 *   up to the page's existing handleSubmit(true).
 */
export function useExamProctoring({
  enabled,
  attemptId,
  onViolation,
  onAutoSubmit,
}) {
  const [violationCount, setViolationCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Refs (don't need to trigger re-renders, and must be readable inside
  // event handlers without going stale).
  const lastViolationAtRef = useRef(0);
  const hasTerminatedRef = useRef(false); // guards duplicate auto-submits
  const hasEnteredFullscreenRef = useRef(isFullscreenActive());

  const requestFullscreen = useCallback(async () => {
    try {
      await requestFullscreenOn(document.documentElement);
    } catch (err) {
      // Swallow: the fullscreenchange handler will simply never fire
      // "entered", so we keep treating the exam as not-yet-fullscreen.
      console.error("Fullscreen request failed:", err);
    }
  }, []);

  // ── Central, deduplicated violation entry point ─────────────────────────
  const registerViolation = useCallback(
    (type) => {
      if (!enabled || hasTerminatedRef.current) return;

      const now = Date.now();
      if (now - lastViolationAtRef.current < VIOLATION_COOLDOWN_MS) {
        // Same physical action already counted (e.g. Esc triggering
        // fullscreenchange + visibilitychange + blur back-to-back).
        return;
      }
      lastViolationAtRef.current = now;

      setViolationCount((prev) => {
        const next = prev + 1;

        const logEntry = {
          attemptId,
          type,
          timestamp: new Date().toISOString(),
          totalViolations: next,
        };
        onViolation?.(logEntry);

        if (next >= AUTO_SUBMIT_AT_VIOLATION) {
          if (!hasTerminatedRef.current) {
            hasTerminatedRef.current = true;
            setShowWarningModal(false);
            onAutoSubmit?.(logEntry);
          }
        } else {
          setShowWarningModal(true);
        }

        return next;
      });
    },
    [enabled, attemptId, onViolation, onAutoSubmit],
  );

  // ── Fullscreen change detection ──────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const active = isFullscreenActive();

      if (active) {
        hasEnteredFullscreenRef.current = true;
        return;
      }

      // Ignore the "exit" event that can fire before the user has ever
      // entered fullscreen at all.
      if (!hasEnteredFullscreenRef.current) return;

      registerViolation(VIOLATION_TYPES.FULLSCREEN_EXIT);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, [enabled, registerViolation]);

  // ── Tab visibility detection ─────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation(VIOLATION_TYPES.TAB_SWITCH);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, registerViolation]);

  // ── Window focus detection (covers minimizing + alt-tabbing away) ───────
  useEffect(() => {
    if (!enabled) return;

    const handleBlur = () => {
      registerViolation(VIOLATION_TYPES.WINDOW_BLUR);
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [enabled, registerViolation]);

  // ── Copy / right-click / devtools-shortcut blocking (unchanged extra) ───
  useEffect(() => {
    if (!enabled) return;

    const preventDefault = (e) => e.preventDefault();
    const blockShortcutKeys = (e) => {
      const key = e.key?.toLowerCase();
      const blockedCombo =
        (e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "u", "p", "s"].includes(key);
      if (blockedCombo || e.key === "F12" || e.key === "PrintScreen") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("keydown", blockShortcutKeys);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("keydown", blockShortcutKeys);
    };
  }, [enabled]);

  // Called from the warning modal's "Return to Exam" button. Must be
  // invoked directly inside a click handler (trusted user gesture) so the
  // browser allows the fullscreen re-request.
  const dismissWarningAndResume = useCallback(() => {
    setShowWarningModal(false);
    requestFullscreen();
  }, [requestFullscreen]);

  return {
    violationCount,
    showWarningModal,
    dismissWarningAndResume,
    requestFullscreen,
    exitFullscreen: exitFullscreenSafely,
    isFullscreen: isFullscreenActive(),
  };
}
