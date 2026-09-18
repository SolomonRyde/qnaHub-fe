const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_KEY = "qnahub_cookie_consent";

let gaLoaded = false;

/** Reads and parses the consent object written by CookieConsentBanner. */
function readConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Returns true only if the user explicitly accepted analytics cookies. */
export function hasAnalyticsConsent() {
  const consent = readConsent();
  return !!consent?.analytics;
}

/** Injects the GA script tag and initializes gtag. Call only after consent. */
export function loadGoogleAnalytics() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
  gtag("config", GA_ID, {
    send_page_view: false, // page views are sent manually on route change
    anonymize_ip: true,
  });
}

/** Revokes GA's ability to send further hits (used when the user rejects/withdraws consent). */
export function disableGoogleAnalytics() {
  gaLoaded = false;
  if (GA_ID) window[`ga-disable-${GA_ID}`] = true;
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

/** Send a pageview — call this on every route change, only if consent given. */
export function trackPageview(path) {
  if (!window.gtag || !hasAnalyticsConsent()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Applies whatever consent is already stored, on app boot (e.g. returning visitor).
 * Call once, high up in the component tree.
 */
export function applyStoredConsent() {
  if (hasAnalyticsConsent()) {
    loadGoogleAnalytics();
  }
}
