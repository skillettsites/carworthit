'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { US_STATES } from '@/lib/plate';
import { PLATE_ENABLED } from '@/lib/constants';

export default function SearchBox({ dark = false }: { dark?: boolean }) {
  const [tab, setTab] = useState<'plate' | 'vin'>(PLATE_ENABLED ? 'plate' : 'vin');
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submitPlate(e: React.FormEvent) {
    e.preventDefault();
    const p = plate.trim().toUpperCase();
    if (!/^[A-Z0-9]{2,8}$/.test(p)) return setError('Enter your license plate.');
    if (!state) return setError('Select the plate’s state.');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: p, state }),
      });
      const data = await res.json();
      if (data.vin) router.push(`/report/${data.vin}`);
      else { setError(data.error || 'We couldn’t find that plate. Try the VIN.'); setLoading(false); }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  function submitVin(e: React.FormEvent) {
    e.preventDefault();
    const clean = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) return setError('A VIN is exactly 17 characters (no I, O or Q).');
    setError('');
    setLoading(true);
    router.push(`/report/${clean}`);
  }

  const tabBtn = (active: boolean) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
      active ? 'bg-white text-brand shadow-sm' : dark ? 'text-slate-300 hover:text-white' : 'text-ink-2 hover:text-ink'
    }`;

  return (
    <div className="w-full">
      {/* Tabs (plate lookup hidden until the paid data API is live) */}
      {PLATE_ENABLED && (
        <div className={`inline-flex gap-1 rounded-xl p-1 mb-3 ${dark ? 'bg-white/10' : 'bg-surface border border-border'}`}>
          <button type="button" className={tabBtn(tab === 'plate')} onClick={() => { setTab('plate'); setError(''); }}>
            License Plate
          </button>
          <button type="button" className={tabBtn(tab === 'vin')} onClick={() => { setTab('vin'); setError(''); }}>
            VIN
          </button>
        </div>
      )}

      {tab === 'plate' ? (
        <form onSubmit={submitPlate}>
          <div className="search-glow flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2">
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="License plate"
              aria-label="License plate"
              maxLength={8}
              className="flex-1 rounded-xl bg-transparent px-4 py-4 font-mono tracking-wider text-lg text-ink outline-none placeholder:text-slate-400"
            />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              aria-label="State"
              className="rounded-xl bg-transparent px-3 py-4 text-ink outline-none border-l border-border sm:w-28"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Check this car'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitVin}>
          <div className="search-glow flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2">
            <input
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              aria-label="VIN"
              maxLength={17}
              className="flex-1 rounded-xl bg-transparent px-4 py-4 font-mono tracking-wider text-lg text-ink outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Check this car'}
            </button>
          </div>
        </form>
      )}

      {error ? (
        <p className={`mt-2 text-sm ${dark ? 'text-red-300' : 'text-bad'}`}>{error}</p>
      ) : (
        <p className={`mt-2 text-sm ${dark ? 'text-slate-300' : 'text-ink-2'}`}>
          {tab === 'plate' ? 'Free preview instantly. We’ll find the VIN from the plate.' : 'The VIN is on the dashboard, door jamb, or title.'}
        </p>
      )}
    </div>
  );
}
