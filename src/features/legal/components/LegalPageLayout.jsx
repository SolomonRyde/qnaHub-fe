import { useEffect } from "react";
import { Navbar } from "../../landingPage/components/Navbar";
import { Footer } from "../../landingPage/components/Footer";

/**
 * Shell for every legal/info page: navbar, background decoration,
 * page title, optional "last updated" pill, and a footer.
 *
 * Deliberately does NOT wrap children in any typography class.
 * Compose pages from <LegalHero>, <SectionCard>, and <LegalRichText>
 * instead — see those components for why.
 */
export default function LegalPageLayout({ title, lastUpdated, children }) {
  useEffect(() => {
    document.title = `${title} | QnaHub - AI-Powered Certification Exams Platform`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background relative overflow-hidden">
        {/* Subtle background decoration so short pages don't feel empty */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />
        </div>

        {/* Page title */}
        <div className="relative pt-8 md:pt-10 px-4 md:px-6 max-w-[1280px] mx-auto text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            {title}
          </h1>
        </div>

        {lastUpdated && (
          <p className="relative z-10 text-sm text-muted-foreground font-medium bg-card/50 w-fit px-4 py-1.5 rounded-full border border-border backdrop-blur-sm mx-auto my-5">
            Last updated: {lastUpdated}
          </p>
        )}

        {/* Page content — pages compose their own layout below */}
        <div className="relative pb-20 px-4 md:px-6 max-w-[1280px] mx-auto z-10">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
