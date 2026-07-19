'use client';

import { Smile } from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';

const INITIAL_COUNT = 645321;
const STORAGE_KEY = 'ugne-serious-visitors-count';

function readStoredCount(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function persistCount(n: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    /* ignore quota / private mode */
  }
}

export function SeriousVisitorsCard() {
  const [count, setCount] = useState(INITIAL_COUNT);

  useLayoutEffect(() => {
    const stored = readStoredCount();
    if (stored != null) {
      setCount(stored);
    } else {
      persistCount(INITIAL_COUNT);
    }
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delayMs = 1000 * (1 + Math.floor(Math.random() * 20));
      timeoutId = setTimeout(() => {
        const delta = 1 + Math.floor(Math.random() * 3);
        setCount((n) => {
          const next = n + delta;
          persistCount(next);
          return next;
        });
        schedule();
      }, delayMs);
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-[200px] bg-primary rounded-xl flex flex-col items-center justify-center gap-3 px-4 py-6">
      <Smile className="text-on-primary h-8 w-8 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums text-on-primary">{count}*</span>
      <div className="h-px w-16 bg-on-primary/35" role="presentation" />
      <span className="text-center text-sm font-bold text-on-primary/90">Serious Visitors</span>
      <span className="text-center text-xs font-normal text-on-primary/75">* Maybe YES, maybe NO.</span>
    </div>
  );
}
