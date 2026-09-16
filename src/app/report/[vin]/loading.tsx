// Streamed while the report is built. The route is dynamic and, on the landing
// after payment, waits on Stripe and up to four data feeds; without this the
// buyer stares at Stripe's page until every one of them has answered. With it
// the shell paints immediately and the report streams in behind it.
export default function Loading() {
  return (
    <div className="bg-surface min-h-screen" aria-busy="true" aria-live="polite">
      <div className="bg-slate-900 text-white">
        <div className="container-x py-8 max-w-4xl">
          <div className="text-xs uppercase tracking-wider text-slate-400">CarWorthIt report</div>
          <div className="mt-2 h-9 w-2/3 animate-pulse rounded bg-slate-700" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-800" />
        </div>
      </div>
      <div className="container-x py-8 max-w-4xl space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
          <div className="text-sm font-semibold text-ink">Building the report</div>
          <p className="mt-1 text-sm text-ink-2">Decoding the VIN, checking recalls and safety ratings, and pricing the car against live listings. A few seconds.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="h-20 animate-pulse rounded-xl bg-surface" />
            <div className="h-20 animate-pulse rounded-xl bg-surface" />
            <div className="h-20 animate-pulse rounded-xl bg-surface" />
          </div>
        </div>
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-white" />
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-white" />
      </div>
    </div>
  );
}
