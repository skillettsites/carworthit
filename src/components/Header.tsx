'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/sample-report', label: 'Sample report' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/guides', label: 'Guides' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-border bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-ink" onClick={() => setOpen(false)}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white">✓</span>
          <span>Car<span className="text-brand">Worth</span>It</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#check"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500"
            onClick={() => setOpen(false)}
          >
            Check a VIN
          </Link>
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="container-x py-2 flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="py-3 border-b border-border last:border-0 text-ink-2 font-medium hover:text-ink" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
