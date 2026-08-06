import type { NegotiationPack as Pack } from '@/lib/negotiation';

// The Negotiation Bundle section of the report.
//
// Ordered the way the conversation actually happens: the three numbers first,
// because that is what the buyer is standing in a forecourt trying to remember,
// then the evidence behind them, then what the seller will say back, then the
// words, then the checks.

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

function Lever({
  title,
  detail,
  source,
  tone,
}: {
  title: string;
  detail: string;
  source: string;
  tone: 'yours' | 'theirs';
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        tone === 'yours' ? 'border-good/30 bg-good/5' : 'border-warn/30 bg-warn/5'
      }`}
    >
      <h4 className="font-bold text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{detail}</p>
      <p className="mt-3 text-xs text-ink-2/80">Source: {source}</p>
    </div>
  );
}

export default function NegotiationPack({ pack }: { pack: Pack }) {
  return (
    <section className="rounded-2xl border-2 border-brand/40 bg-white p-6 md:p-8" id="negotiation">
      <div className="text-xs uppercase tracking-wider text-brand">Negotiation Bundle</div>
      <h2 className="mt-1 text-2xl font-extrabold">What to pay, and how to get there</h2>

      {/* The three numbers */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-2xl font-bold text-ink">{usd(pack.opening)}</div>
          <div className="mt-1 text-xs font-semibold text-ink-2">Open here</div>
        </div>
        <div className="rounded-xl border-2 border-good bg-good/5 p-5 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-good">{usd(pack.target)}</div>
          <div className="mt-1 text-xs font-semibold text-ink-2">Aim to pay</div>
        </div>
        <div className="rounded-xl border border-bad/40 bg-bad/5 p-5 text-center">
          <div className="text-2xl font-bold text-bad">{usd(pack.walkAway)}</div>
          <div className="mt-1 text-xs font-semibold text-ink-2">Walk away above</div>
        </div>
      </div>

      {pack.savingAtTarget !== null && pack.savingAtTarget > 0 && (
        <div className="mt-4 rounded-xl border border-good/30 bg-good/5 p-4 text-center">
          <span className="text-sm text-ink-2">Hit the target and you save </span>
          <span className="text-lg font-extrabold text-good">{usd(pack.savingAtTarget)}</span>
          <span className="text-sm text-ink-2"> against the {usd(pack.askingPrice!)} asking price.</span>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-ink-2">{pack.basis}</p>

      {/* Your levers */}
      {pack.levers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Your case for paying less</h3>
          {/* The old line claimed every item was "a fact about this car". Two of
              them routinely are not: running costs are mostly US national
              averages, and recalls are matched by year, make and model rather
              than by VIN. Each lever states its own scope, so the heading only
              needs to promise the source, which is the part that holds up. */}
          <p className="mt-1 text-sm text-ink-2">
            Each of these carries its source, so you can say where it came from if you are challenged on it.
          </p>
          <div className="mt-4 space-y-4">
            {pack.levers.map((l) => (
              <Lever key={l.title} {...l} tone="yours" />
            ))}
          </div>
        </div>
      )}

      {/* Their levers */}
      {pack.sellerLevers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">What the seller will say back</h3>
          <p className="mt-1 text-sm text-ink-2">
            None of these are bluffs. Knowing they are coming is what stops them working.
          </p>
          <div className="mt-4 space-y-4">
            {pack.sellerLevers.map((l) => (
              <Lever key={l.title} {...l} tone="theirs" />
            ))}
          </div>
        </div>
      )}

      {/* Script */}
      <div className="mt-8">
        <h3 className="text-lg font-bold">How the conversation goes</h3>
        <ol className="mt-4 space-y-4">
          {pack.script.map((s, i) => (
            <li key={s.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {i + 1}
              </div>
              <div>
                <div className="font-bold">{s.step}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.say}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Checks */}
      <div className="mt-8">
        <h3 className="text-lg font-bold">Before any money changes hands</h3>
        <ul className="mt-4 space-y-2">
          {pack.checks.map((c) => (
            <li key={c} className="flex gap-3 text-sm leading-relaxed text-ink-2">
              <span className="shrink-0 font-bold text-brand">✓</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
