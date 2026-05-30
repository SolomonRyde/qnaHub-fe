// features/exams/components/ExamNavbar.jsx
// Dedicated navbar for the Exam Overview page.
// Always visible — uses a dark glass treatment so it reads
// over any hero cover image regardless of color/brightness.

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../../../context/ThemeContext";
import { useAuth } from "../../../../context/AuthContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  GraduationCap,
  User,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

// ─── Nav links (same as global Navbar) ───────────────────────────────────────

const NAV_LINKS = [
  { name: "Home", href: "/", type: "route" },
  { name: "Pricing", href: "#pricing", type: "anchor" },
  { name: "Exams", href: "/exams", type: "route" },
  { name: "About", href: "#about", type: "anchor" },
];

// ─── ExamNavbar ───────────────────────────────────────────────────────────────
//
// Visual strategy:
//   • Starts as a dark glass bar (bg-black/40 + backdrop-blur)
//     so it's always legible over the hero image.
//   • On scroll past ~60px it transitions to the standard
//     bg-background/90 + border — matching the rest of the app.
//   • A "← Back to Exams" pill on the left gives quick exit.
//   • Logo + nav links centered / right side unchanged from global nav.
//   • Fully theme-aware for the scrolled state.

export function ExamNavbar({ examTitle }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Track scroll to swap glass → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  if (loading) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? // Scrolled: solid theme-aware card — same as global nav
            "bg-background/92 backdrop-blur-xl border-b border-border shadow-sm"
          : // Hero zone: dark glass so it floats cleanly over any image
            "bg-black/45 backdrop-blur-md border-b border-white/10",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Left: back button + logo ── */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-lg font-bold transition-colors duration-300 hidden sm:block",
                  scrolled ? "text-foreground" : "text-white",
                )}
              >
                Examify
              </span>
            </Link>
          </div>

          {/* ── Center: exam title pill (desktop only, appears after scroll) ── */}
          <div
            className={cn(
              "hidden lg:flex absolute left-1/2 -translate-x-1/2",
              "transition-all duration-300",
              scrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none",
            )}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border max-w-[280px]">
              <BookOpen className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground truncate">
                {examTitle || "Exam Overview"}
              </span>
            </div>
          </div>

          {/* ── Center: nav links (desktop, hero zone only) ── */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-7 transition-all duration-300",
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            {NAV_LINKS.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* ── Right: actions ── */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                scrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                  : "text-white/70 hover:text-white hover:bg-white/12",
              )}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                    "transition-all duration-150",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                      : "text-white/80 hover:text-white hover:bg-white/12",
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  {user?.name?.split(" ")[0] || "Dashboard"}
                </button>

                <button
                  onClick={handleLogout}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                      : "text-white/80 hover:text-white hover:bg-white/12",
                  )}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile: theme + hamburger ── */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                scrolled
                  ? "text-foreground hover:bg-accent"
                  : "text-white hover:bg-white/12",
              )}
            >
              {theme === "light" ? (
                <Moon className="w-4.5 h-4.5" />
              ) : (
                <Sun className="w-4.5 h-4.5" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                scrolled
                  ? "text-foreground hover:bg-accent"
                  : "text-white hover:bg-white/12",
              )}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileOpen ? "max-h-[420px] pb-5" : "max-h-0",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-1 pt-3 mt-1 rounded-xl p-3",
              scrolled
                ? "bg-background border border-border"
                : "bg-black/50 backdrop-blur-md border border-white/10",
            )}
          >
            {/* Back to exams */}
            <button
              onClick={() => {
                navigate("/exams");
                setMobileOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-left",
                scrolled
                  ? "text-muted-foreground hover:bg-accent"
                  : "text-white/80 hover:bg-white/10",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Exams
            </button>

            <div
              className={cn(
                "my-1 h-px",
                scrolled ? "bg-border" : "bg-white/10",
              )}
            />

            {NAV_LINKS.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  )}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  )}
                >
                  {link.name}
                </Link>
              ),
            )}

            <div
              className={cn(
                "my-1 h-px",
                scrolled ? "bg-border" : "bg-white/10",
              )}
            />

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                    scrolled
                      ? "text-muted-foreground hover:bg-accent"
                      : "text-white/80 hover:bg-white/10",
                  )}
                >
                  <User className="w-4 h-4" />
                  {user?.name?.split(" ")[0] || "Dashboard"}
                </button>
                <button
                  onClick={handleLogout}
                  className="mx-3 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium",
                    scrolled
                      ? "text-muted-foreground hover:bg-accent"
                      : "text-white/80 hover:bg-white/10",
                  )}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileOpen(false);
                  }}
                  className="mx-3 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
