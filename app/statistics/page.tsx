import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {Mail} from 'lucide-react';
import {SeriousVisitorsCard} from '../components/serious-visitors/SeriousVisitorsCard';

const PERSONA_IMAGE = '/cc34d4a1-65a9-47d8-82e2-ce055bec3b13.jpeg';

export const metadata: Metadata = {
  title: 'Statistics — Ugnė',
  description: 'Court performance metrics and season highlights.',
};

const KEY_METRICS = [
  {label: 'Matches Played', value: '47', border: 'border-primary'},
  {label: 'Win Rate', value: '68%', border: 'border-secondary-container'},
  {label: 'First Serve', value: '72%', border: 'border-tertiary-container'},
  {label: 'Aces', value: '124', border: 'border-primary'},
  {label: 'Fastest Serve', value: '168 km/h', border: 'border-secondary-container'},
  {label: 'Longest Rally', value: '34 shots', border: 'border-tertiary-container'},
];

const SEASON_RECORDS = [
  {period: 'August 2023', record: '12–4', note: 'Comeback season — tie-break specialists beware.'},
  {period: 'May 2024', record: '9–6', note: 'Clay court endurance block. Three-hour marathons logged.'},
  {period: 'Active Season', record: '26–8', note: 'Current form trending upward. Serve QA in progress.'},
];

const SHOT_BREAKDOWN = [
  {label: 'Forehand', percent: 42, color: 'bg-primary'},
  {label: 'Backhand', percent: 31, color: 'bg-secondary'},
  {label: 'Volley', percent: 14, color: 'bg-tertiary'},
  {label: 'Serve', percent: 13, color: 'bg-primary-container'},
];

const RECENT_FORM = [
  {
    date: 'June 2026',
    result: 'W 6–4, 7–5',
    opponent: 'vs. baseline grinder',
    tags: ['Precision', 'Patience'],
    border: 'border-primary',
  },
  {
    date: 'May 2026',
    result: 'W 7–6, 6–3',
    opponent: 'vs. net rusher',
    tags: ['Strategy', 'Adaptability'],
    border: 'border-secondary-container',
  },
  {
    date: 'April 2026',
    result: 'L 4–6, 6–7',
    opponent: 'vs. lefty slicer',
    tags: ['Learning', 'Grit'],
    border: 'border-tertiary-container',
  },
];

export default function StatisticsPage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto font-headline tracking-tight">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={PERSONA_IMAGE}
                alt="Ugnė"
                fill
                className="object-cover object-top"
                sizes="40px"
                priority
              />
            </div>
            <div className="text-3xl font-black text-primary">Ugnė.</div>
          </Link>
          <div className="hidden md:flex gap-10 items-center">
            <Link
              href="/statistics/"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              Statistics
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:crycocacola@gmail.com"
              className="text-primary inline-flex hover:scale-110 transition-transform"
              aria-label="Email crycocacola@gmail.com"
            >
              <Mail className="h-6 w-6" aria-hidden />
            </a>
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform"
            >
              Back to Court
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-8 mb-20">
          <div className="tennis-gradient p-12 md:p-16 rounded-xl text-center text-on-primary shadow-xl">
            <span className="font-label text-xs uppercase tracking-widest opacity-80 mb-4 block">
              Performance Dashboard
            </span>
            <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">Court Statistics</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light">
              Season metrics tracked with the same rigor as a production QA suite — every serve,
              rally, and result logged for continuous improvement.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="flex flex-col md:flex-row gap-4 mb-12 items-baseline">
            <h2 className="font-headline text-4xl font-bold">Key Metrics</h2>
            <div className="h-[2px] flex-grow bg-outline-variant opacity-20" />
            <span className="font-label text-tertiary-container bg-tertiary px-4 py-1 rounded-full text-xs uppercase tracking-widest">
              Season Totals
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_METRICS.map((metric) => (
              <div
                key={metric.label}
                className={`bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 ${metric.border}`}
              >
                <span className="font-headline text-4xl md:text-5xl font-black text-primary tabular-nums">
                  {metric.value}
                </span>
                <p className="mt-3 font-label uppercase tracking-widest text-xs text-on-surface-variant">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-sm">
            <SeriousVisitorsCard />
          </div>
        </section>

        <section className="bg-surface-container-low pt-24 pb-24 mb-24">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline text-4xl font-bold mb-12">Season Record</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-lowest">
                    <th className="px-8 py-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">
                      Period
                    </th>
                    <th className="px-8 py-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">
                      W–L
                    </th>
                    <th className="px-8 py-4 font-label text-xs uppercase tracking-widest text-on-surface-variant hidden md:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SEASON_RECORDS.map((row) => (
                    <tr key={row.period} className="border-b border-outline-variant/10 last:border-0">
                      <td className="px-8 py-6 font-bold text-primary">{row.period}</td>
                      <td className="px-8 py-6 font-headline text-2xl font-black tabular-nums">
                        {row.record}
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant hidden md:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 mb-24">
          <h2 className="font-headline text-4xl font-bold mb-12">Shot Breakdown</h2>
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm space-y-8">
            {SHOT_BREAKDOWN.map((shot) => (
              <div key={shot.label}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-lg">{shot.label}</span>
                  <span className="font-headline text-2xl font-black text-primary tabular-nums">
                    {shot.percent}%
                  </span>
                </div>
                <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full ${shot.color} rounded-full transition-all`}
                    style={{width: `${shot.percent}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 mb-24">
          <h2 className="font-headline text-4xl font-bold mb-12">Recent Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RECENT_FORM.map((match) => (
              <div
                key={match.date}
                className={`bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 ${match.border}`}
              >
                <div className="flex justify-between mb-6">
                  <span className="text-xs font-label uppercase tracking-tighter text-outline">
                    {match.date}
                  </span>
                  <span
                    className={`text-xs font-label uppercase tracking-widest font-bold ${
                      match.result.startsWith('W') ? 'text-primary' : 'text-error'
                    }`}
                  >
                    {match.result.startsWith('W') ? 'Win' : 'Loss'}
                  </span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-2 tabular-nums">{match.result}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 italic">
                  {match.opponent}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {match.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full rounded-t-none bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center p-12 mt-20 max-w-7xl mx-auto font-body text-sm uppercase tracking-widest">
          <div className="font-headline font-bold text-on-surface mb-6 md:mb-0">Ugnė.</div>
          <div className="text-on-surface opacity-60 text-center md:text-left mb-6 md:mb-0">
            ©2026 Ugnė. Engineered with Precision. Played with Passion. Not for serious persons.
          </div>
          <div className="flex gap-8">
            <a
              className="text-on-surface opacity-60 hover:text-primary underline underline-offset-4 transition-opacity"
              href="https://www.instagram.com/ugne_le_?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
