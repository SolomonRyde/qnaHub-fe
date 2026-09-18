const VARIANT_STYLES = {
  default: "bg-card border-border",
  highlight: "bg-primary/5 border-primary/20",
  warning:
    "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
};

const VARIANT_ICON_BADGE = {
  default: "bg-primary/10 text-primary",
  highlight: "bg-primary text-primary-foreground",
  warning:
    "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
};

const VARIANT_TITLE_TEXT = {
  default: "text-foreground",
  highlight: "text-foreground",
  warning: "text-amber-900 dark:text-amber-100",
};

/**
 * The icon-badge + heading + card wrapper every legal page was
 * re-implementing as a local `SectionHeader` function plus manual
 * `bg-card p-6 rounded-2xl border` markup. One component now covers
 * all three visual variants used across the pages.
 *
 * Headings render with explicit Tailwind text classes (never a bare
 * `<h3>` relying on cascading CSS) — this is what makes it safe to
 * nest ANY component inside a SectionCard, including things like an
 * Accordion that render their own internal heading tags. There is no
 * page-wide `h3 { font-size: ... }` rule anywhere to collide with.
 *
 * Usage:
 *   <SectionCard icon={UserCheck} title="1. Eligibility">
 *     <p className="text-muted-foreground">...</p>
 *   </SectionCard>
 *
 *   <SectionCard icon={ShieldAlert} title="Key Exam Rules" variant="highlight">
 *     ...
 *   </SectionCard>
 */
export default function SectionCard({
  icon: Icon,
  title,
  variant = "default",
  id,
  className = "",
  children,
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border p-6 md:p-8 ${VARIANT_STYLES[variant]} ${
        variant === "default" ? "shadow-sm" : ""
      } ${className}`}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${VARIANT_ICON_BADGE[variant]}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3
            className={`text-lg md:text-xl text-green-700 font-bold leading-tight ${VARIANT_TITLE_TEXT[variant]}`}
          >
            {title}
          </h3>
        </div>
      )}
      {children}
    </section>
  );
}
