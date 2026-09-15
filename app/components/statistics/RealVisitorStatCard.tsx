'use client';

import {useEffect, useState} from 'react';
import {Eye} from 'lucide-react';
import {ensureVisitCounted, formatVisitorCount} from '../../lib/supabase/visitors';

const STAT_VALUE_WRAP = 'block min-w-0 w-full max-w-full break-words [overflow-wrap:anywhere]';

export function RealVisitorStatCard() {
  const [count, setCount] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void ensureVisitCounted().then((value) => {
      if (!cancelled) {
        setCount(value);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-surface-container-lowest overflow-hidden p-6 sm:p-8 rounded-xl shadow-sm border-b-4 border-primary flex min-w-0 flex-col gap-3 card-lift">
      <Eye className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />
      <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">Website visitors</p>
      <span className={`${STAT_VALUE_WRAP} font-headline text-4xl md:text-5xl font-black text-primary tabular-nums`}>
        {formatVisitorCount(count, ready)}
      </span>
      <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
        Unique browsers counted here.{'\n'}Google Analytics is optional.
      </p>
    </div>
  );
}
