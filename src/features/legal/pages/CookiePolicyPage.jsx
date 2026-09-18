import { Link } from "react-router-dom";
import {
  Cookie,
  Settings2,
  Share2,
  SlidersHorizontal,
  Clock,
  History,
  HelpCircle,
  MonitorCog,
  Globe,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={Cookie}>
          This Cookie Policy explains what cookies are, how QnaHub.in uses them,
          and how you can manage your preferences.
        </LegalHero>

        <div className="space-y-8">
          <SectionCard icon={HelpCircle} title="1. What Are Cookies?">
            <p className="text-muted-foreground">
              Cookies are small text files placed on your device (computer,
              phone, or tablet) when you visit a website. They help the site
              remember information about your visit, such as your preferences,
              login status, and settings, so that you don't have to re-enter
              information each time you return.
            </p>
          </SectionCard>

          <SectionCard icon={Settings2} title="2. How QnaHub Uses Cookies">
            <p className="text-muted-foreground mb-6">
              We use cookies to provide essential functionality, improve your
              experience, and understand how the platform is used. The cookies
              we use fall into the following categories:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    a) Strictly Necessary Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground m-0">
                    These cookies are essential for QnaHub to function. They
                    enable core features like logging in, maintaining your
                    session while you take an exam, and remembering your
                    authentication state. Without these cookies, the platform
                    cannot work properly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    b) Functional Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground m-0">
                    These cookies allow QnaHub to remember choices you make
                    (such as your preferred language, theme, or display
                    settings) and provide enhanced, more personalized features.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    c) Analytics and Performance Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies help us understand how visitors use QnaHub
                    which pages are visited most often, where users encounter
                    errors, and how long they spend on different sections. This
                    information is aggregated and anonymous; it does not
                    identify you personally. We use this data to improve the
                    platform's performance and user experience.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-foreground/90 m-0">
                      <strong>Note:</strong> Analytics cookies are optional. You
                      can choose to reject them via the cookie consent banner
                      when you first visit QnaHub.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Share2} title="3. Third-Party Cookies">
            <p className="text-muted-foreground mb-3">
              QnaHub integrates with third-party services that may set their own
              cookies:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside mb-3">
              <li>
                <strong className="text-foreground">Payment Gateway:</strong>{" "}
                When you make a payment, Razorpay may set cookies to process the
                transaction securely and prevent fraud. These cookies are
                governed by Razorpay's own privacy and cookie policies.
              </li>
              <li>
                <strong className="text-foreground">
                  Analytics Providers:
                </strong>{" "}
                If you have consented to analytics cookies, we may use
                third-party analytics tools (such as Google Analytics or
                similar) to collect aggregated, non-identifying usage data.
              </li>
            </ul>
            <p className="text-muted-foreground">
              We do not control third-party cookies. Please review the privacy
              and cookie policies of these services for more information.
            </p>
          </SectionCard>

          <SectionCard
            icon={SlidersHorizontal}
            title="4. Managing Your Cookie Preferences"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Cookie className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Via QnaHub's Cookie Banner
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  When you first visit QnaHub, you will see a cookie consent
                  banner at the bottom of the page. You can choose:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-3">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">"Accept All"</strong>{" "}
                      allows both essential and analytics cookies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">
                        "Reject Non-Essential"
                      </strong>{" "}
                      allows only strictly necessary cookies (analytics cookies
                      are blocked)
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground m-0">
                  Your choice is stored locally on your device. If you clear
                  your browser data or use a different device, you will be asked
                  to make the choice again.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MonitorCog className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Via Your Browser Settings
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Most web browsers allow you to control cookies through their
                  settings. You can typically:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-3">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>View and delete cookies stored on your device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Block all cookies or only third-party cookies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Clear cookies when you close your browser</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mb-3">
                  For instructions on how to manage cookies in your browser,
                  consult your browser's help documentation or visit{" "}
                  <a
                    href="https://www.allaboutcookies.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.allaboutcookies.org
                  </a>
                  .
                </p>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200 m-0">
                    <strong>Important:</strong> If you block or delete strictly
                    necessary cookies, some parts of QnaHub (such as login and
                    exam attempts) may not work correctly.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Clock} title="5. How Long Do Cookies Last?">
            <p className="text-muted-foreground mb-4">
              Cookies can be either{" "}
              <strong className="text-foreground">session cookies</strong>{" "}
              (deleted when you close your browser) or{" "}
              <strong className="text-foreground">persistent cookies</strong>{" "}
              (remain on your device for a set period or until you delete them):
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                  Session Cookies
                </p>
                <p className="text-sm text-muted-foreground m-0">
                  Used to maintain your login state and exam progress during a
                  single browsing session. Deleted when you close the browser.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                  Persistent Cookies
                </p>
                <p className="text-sm text-muted-foreground m-0">
                  Used to remember your preferences (such as theme or cookie
                  consent choice) across multiple visits. These may last for
                  weeks, months, or until you manually delete them.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={History} title="6. Updates to This Cookie Policy">
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect
              changes in technology, legal requirements, or how we use cookies.
              Any updates will be posted on this page with a revised "Last
              updated" date. We encourage you to review this policy
              periodically.
            </p>
          </SectionCard>

          <SectionCard
            icon={Globe}
            title="7. Questions or Concerns"
            variant="highlight"
          >
            <p className="text-foreground/90">
              If you have any questions about how QnaHub uses cookies, or if you
              would like more information about your data privacy rights, please
              see our{" "}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              or contact us at{" "}
              <strong className="text-foreground">admin@rydecs.com</strong>.
            </p>
          </SectionCard>

          <p className="text-sm text-muted-foreground text-center pt-2">
            Last updated: 01-Sep-2026
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
}
