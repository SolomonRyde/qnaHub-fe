/**
 * The gradient icon+text banner used at the top of every legal page's
 * content area. Replaces the old hand-copied <div> that every page
 * duplicated (and which had a broken, unimported <Rocket /> reference
 * baked in as a hardcoded default).
 *
 * Usage:
 *   <LegalHero icon={ShieldCheck}>
 *     This Privacy Policy explains ...
 *   </LegalHero>
 *
 * For the rare page that also needs a heading inside the hero
 * (Terms & Conditions' "Welcome to QnaHub"), pass `heading`.
 */
export default function LegalHero({ icon: Icon, heading, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 mb-8">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex items-start gap-4">
        {Icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="min-w-0">
          {heading && (
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {heading}
            </h2>
          )}
          <div className="text-muted-foreground [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a:hover]:underline">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
