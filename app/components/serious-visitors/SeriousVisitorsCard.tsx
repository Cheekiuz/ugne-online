'use client';

import {useEffect, useState} from 'react';
import {ensureVisitCounted, formatVisitorCount} from '../../lib/supabase/visitors';
import {WalkingDuck} from './WalkingDuck';

export function SeriousVisitorsCard() {
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
    <div className="min-h-[200px] bg-primary rounded-xl flex flex-col items-center justify-center gap-3 px-4 py-6 card-lift">
      <WalkingDuck className="text-on-primary h-10 w-10" />
      <span className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums text-on-primary">
        {formatVisitorCount(count, ready)}
      </span>
      <div className="h-px w-16 bg-on-primary/35" role="presentation" />
      <span className="text-center text-sm font-bold text-on-primary/90">Serious Visitors</span>
      <span className="text-center text-xs font-normal text-on-primary/75">
        * Counted on this site. Ad blockers allowed.
      </span>
    </div>
  );
}
