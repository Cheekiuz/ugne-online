'use client';

import type {CSSProperties} from 'react';
import {Smile} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  layoutScatteredSmiles,
  type LayoutSmile,
} from '../../lib/supabase/smile-layout';
import {
  ensureSmilesForDisplay,
  fetchSmileCount,
  fetchSmiles,
  SMILE_DONATION_FLOOR,
  type SponsorSmile,
} from '../../lib/supabase/smiles';
import {mergeUniqueSmiles} from '../../lib/supabase/local-smiles';
import {hasSmiledLocally} from '../../lib/supabase/visitor-id';
import {useSubmitSmile} from './useSubmitSmile';
import './sponsor-smile-wall.css';

import {
  SPONSOR_SMILES_REFRESH_EVENT,
  SPONSOR_SMILE_SUBMITTED_EVENT,
  type SmileSubmittedDetail,
} from './sponsor-smile-events';

function smileStyle(smile: LayoutSmile, zIndex: number, color: string): CSSProperties {
  return {
    left: `${smile.display_x}%`,
    top: `${smile.display_y}%`,
    transform: `translate(-50%, -50%) rotate(${smile.rotation}deg)`,
    color,
    zIndex,
  };
}

function upsertSmile(smiles: SponsorSmile[], next: SponsorSmile): SponsorSmile[] {
  if (smiles.some((smile) => smile.id === next.id)) {
    return smiles;
  }

  return [...smiles, next];
}

export function SponsorSmileWall() {
  const [smiles, setSmiles] = useState<SponsorSmile[]>([]);
  const [count, setCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pendingSmileId, setPendingSmileId] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);
  const {submitSmile, submitting, hasSmiled, saveWarning, justSaved} = useSubmitSmile();
  const alreadySmiled = hasSmiled || hasSmiledLocally();

  const smilesForLayout = useMemo(() => {
    const displayCount = Math.max(SMILE_DONATION_FLOOR, count, smiles.length);
    return ensureSmilesForDisplay(smiles, displayCount);
  }, [smiles, count]);

  const wallSmiles = useMemo(() => layoutScatteredSmiles(smilesForLayout), [smilesForLayout]);
  const wallMinHeight = wallSmiles.length > 8 ? 'min-h-[700px]' : 'min-h-[480px]';

  const loadSmiles = useCallback(async () => {
    const showInitialLoader = !hasLoadedRef.current;
    if (showInitialLoader) {
      setInitialLoading(true);
    }

    try {
      const [data, total] = await Promise.all([fetchSmiles(), fetchSmileCount()]);
      setSmiles((current) => mergeUniqueSmiles(data, current));
      setCount((current) => Math.max(total, data.length, current, SMILE_DONATION_FLOOR));
    } finally {
      if (showInitialLoader) {
        setInitialLoading(false);
      }
      hasLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    void loadSmiles();

    const onRefresh = () => {
      void loadSmiles();
    };

    const onSubmitted = (event: Event) => {
      const detail = (event as CustomEvent<SmileSubmittedDetail>).detail;
      if (!detail?.smile) return;

      setPendingSmileId(detail.smile.id);
      setSmiles((current) => {
        const next = upsertSmile(current, detail.smile);
        setCount((total) => Math.max(total + 1, next.length, SMILE_DONATION_FLOOR));
        return next;
      });
    };

    window.addEventListener(SPONSOR_SMILES_REFRESH_EVENT, onRefresh);
    window.addEventListener(SPONSOR_SMILE_SUBMITTED_EVENT, onSubmitted);
    return () => {
      window.removeEventListener(SPONSOR_SMILES_REFRESH_EVENT, onRefresh);
      window.removeEventListener(SPONSOR_SMILE_SUBMITTED_EVENT, onSubmitted);
    };
  }, [loadSmiles]);

  useEffect(() => {
    if (pendingSmileId && smiles.some((smile) => smile.id === pendingSmileId)) {
      setPendingSmileId(null);
    }
  }, [pendingSmileId, smiles]);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 mb-8 sm:mb-10">
        {justSaved ? (
          <p className="text-sm text-primary font-bold">Your smile is on the board. Thank you!</p>
        ) : alreadySmiled ? (
          <p className="text-sm text-on-surface-variant italic">
            You already left a smile here.{' '}
            <span className="text-error-container not-italic font-semibold">Karma noticed.</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void submitSmile()}
            disabled={submitting}
            className="bmc-blink-button inline-block px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg uppercase hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? 'Sending…' : 'Leave a smile'}
          </button>
        )}
        {saveWarning ? (
          <p className="text-xs text-on-surface-variant italic">
            Couldn&apos;t save right now. Try again in a moment.
          </p>
        ) : null}
      </div>

      <div
        className={`bg-surface-container-lowest rounded-xl shadow-sm p-4 ${wallMinHeight} relative overflow-hidden border-b-2 border-primary card-lift`}
      >
        {initialLoading ? (
          <p className="text-on-surface-variant text-sm text-center py-16">Loading smiles…</p>
        ) : wallSmiles.length > 0 ? (
          wallSmiles.map((smile, index) => (
            <Smile
              key={`wall-${smile.id}`}
              className={`absolute h-10 w-10${smile.id === pendingSmileId ? ' sponsor-smile-wall__new' : ''}`}
              strokeWidth={2.25}
              style={smileStyle(smile, index + 1, smile.colorWall)}
              aria-hidden
            />
          ))
        ) : (
          <p className="text-on-surface-variant text-sm text-center italic py-16 px-4">
            No smiles yet. Be the first to leave one.
          </p>
        )}
      </div>

      <div className="bg-primary rounded-xl flex flex-col items-center justify-center gap-3 px-4 py-6 min-h-[120px] card-lift">
        <Smile className="text-on-primary h-8 w-8 shrink-0" strokeWidth={1.5} aria-hidden />
        <div className="h-px w-16 bg-on-primary/35" role="presentation" />
        <span className="text-center text-sm font-normal text-on-primary/90">Anonymous Internet Heroes</span>
      </div>
    </div>
  );
}
