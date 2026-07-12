import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className="border-b border-border bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-ink">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">✓</span>
          <span>Car<span className="text-brand">Worth</span>It</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-2">
          <Link href="/how-it-works" className="hover:text-ink">How it works</Link>
          <Link href="/sample-report" className="hover:text-ink">Sample report</Link>
          <Link href="/pricing" className="hover:text-ink">Pricing</Link>
          <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <Link
          href="/#check"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500"
        >
          Check a VIN
        </Link>
      </div>
    </header>
  );
}
