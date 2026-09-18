import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  loadGoogleAnalytics,
  disableGoogleAnalytics,
  applyStoredConsent,
} from "../../../lib/analytics";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("qnahub_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      // Returning visitor who already chose — apply it (loads GA if they accepted)
      applyStoredConsent();
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("qnahub_cookie_consent", JSON.stringify(consent));
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("qnahub_cookie_consent", JSON.stringify(consent));
    disableGoogleAnalytics();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-primary shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  QnaHub uses essential cookies for site functionality. We'd
                  also like to use analytics cookies to improve your experience
                  and understand how you use our platform. You can choose which
                  cookies to accept.{" "}
                  <Link
                    to="/cookie-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    Learn more about our cookies
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleRejectNonEssential}
              className="px-6 py-3 text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
