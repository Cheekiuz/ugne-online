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
  type SponsorSmile,
} from '../../lib/supabase/smiles';
import {hasSmiledLocally} from '../../lib/supabase/visitor-id';
import {useSubmitSmile} from './useSubmitSmile';

import {SPONSOR_SMILES_REFRESH_EVENT} from './sponsor-smile-events';

function smileStyle(smile: LayoutSmile, zIndex: number, color: string): CSSProperties {
  return {
    left: `${smile.display_x}%`,
    top: `${smile.display_y}%`,
    transform: `translate(-50%, -50%) rotate(${smile.rotation}deg)`,
    color,
    zIndex,
  };
}

function createOptimisticSmile(): SponsorSmile {
  return {
    id: Date.now(),
    pos_x: 15 + Math.random() * 70,
    pos_y: 15 + Math.random() * 70,
    created_at: new Date().toISOString(),
  };
}

export function SponsorSmileWall() {
  const [smiles, setSmiles] = useState<SponsorSmile[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optimisticSmile, setOptimisticSmile] = useState<SponsorSmile | null>(null);
  const prevSmileCountRef = useRef(0);
  const {submitSmile, submitting, hasSmiled, saveWarning, justSaved} = useSubmitSmile();
  const alreadySmiled = hasSmiled || hasSmiledLocally();

  const smilesForLayout = useMemo(() => {
    let base = smiles;
    if (optimisticSmile && !smiles.some((smile) => smile.id === optimisticSmile.id)) {
      base = [...smiles, optimisticSmile];
    }
    return ensureSmilesForDisplay(base, Math.max(base.length, count));
  }, [smiles, optimisticSmile, count]);

  const wallSmiles = useMemo(() => layoutScatteredSmiles(smilesForLayout), [smilesForLayout]);
  const wallMinHeight = wallSmiles.length > 8 ? 'min-h-[280px]' : 'min-h-[240px]';

  const loadSmiles = useCallback(async () => {
    setLoading(true);
    const [data, total] = await Promise.all([fetchSmiles(), fetchSmileCount()]);
    setSmiles(data);
    setCount(total);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSmiles();

    const onRefresh = () => {
      void loadSmiles();
    };

    window.addEventListener(SPONSOR_SMILES_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(SPONSOR_SMILES_REFRESH_EVENT, onRefresh);
  }, [loadSmiles]);

  useEffect(() => {
    if (justSaved) {
      setOptimisticSmile(createOptimisticSmile());
    }
  }, [justSaved]);

  useEffect(() => {
    if (!loading && smiles.length > prevSmileCountRef.current) {
      setOptimisticSmile(null);
    }
    prevSmileCountRef.current = smiles.length;
  }, [loading, smiles.length]);

  return (
    <div className="space-y-4">
      <div className="bg-primary rounded-xl flex flex-col items-center justify-center gap-3 px-4 py-6 min-h-[120px]">
        <Smile className="text-on-primary h-8 w-8 shrink-0" strokeWidth={1.5} aria-hidden />
        <div className="h-px w-16 bg-on-primary/35" role="presentation" />
        <span className="text-center text-sm font-normal text-on-primary/90">Real Smiles donated</span>
      </div>

      <div
        className={`bg-surface-container-lowest rounded-xl shadow-sm p-4 ${wallMinHeight} relative overflow-hidden border-b-2 border-primary`}
      >
        {loading ? (
          <p className="text-on-surface-variant text-sm text-center py-16">Loading smiles…</p>
        ) : wallSmiles.length > 0 ? (
          wallSmiles.map((smile, index) => (
            <Smile
              key={`wall-${smile.id}`}
              className="absolute h-10 w-10"
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

      <div className="text-center space-y-2">
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
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-black text-sm uppercase hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
          >
            <Smile className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            {submitting ? 'Sending…' : 'Leave a smile'}
          </button>
        )}
        {saveWarning ? (
          <p className="text-xs text-on-surface-variant italic">
            Couldn&apos;t save right now. Try again in a moment.
          </p>
        ) : null}
      </div>
    </div>
  );
}
