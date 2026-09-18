/**
 * Typography for actual long-form legal prose — numbered clauses with
 * plain <p>/<ul>/<ol>/<strong> tags (e.g. inside the "full policy text"
 * sections of Terms & Conditions or the Refund Policy).
 *
 * IMPORTANT: this is opt-in per block, not a page-wide wrapper. Only
 * put real static text content in here — never an interactive
 * component (Accordion, Tabs, Dialog, etc.) that renders its own
 * heading tags, since those would inherit these heading styles too.
 * For section titles, use <SectionCard title="..."> instead, which
 * uses explicit Tailwind classes and can't collide with anything.
 *
 * Usage:
 *   <LegalRichText>
 *     <p>...</p>
 *     <ul><li>...</li></ul>
 *   </LegalRichText>
 */
export default function LegalRichText({ className = "", children }) {
  return <div className={`legal-richtext ${className}`}>{children}</div>;
}
