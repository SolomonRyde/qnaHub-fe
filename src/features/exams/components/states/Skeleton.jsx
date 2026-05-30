export const ExamSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-16 bg-card border-b border-border" />
    <div className="relative h-[520px] bg-muted overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-accent/30 to-muted" />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {[180, 200, 340].map((h, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 space-y-3"
              style={{ height: h }}
            >
              <div className="h-4 w-1/4 rounded-lg bg-muted animate-pulse" />
              <div className="h-3 w-full rounded bg-muted animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-3 w-4/6 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
        <div
          className="rounded-2xl border border-border bg-card animate-pulse"
          style={{ height: 520 }}
        />
      </div>
    </div>
  </div>
);
