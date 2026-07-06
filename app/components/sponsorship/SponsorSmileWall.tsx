'use client';

import type {CSSProperties} from 'react';
import {Smile} from 'lucide-react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {layoutScatteredSmiles, type LayoutSmile} from '../../lib/supabase/smile-layout';
import {fetchSmileCount, fetchSmiles, type SponsorSmile} from '../../lib/supabase/smiles';
import {hasSmiledLocally} from '../../lib/supabase/visitor-id';
import {useSubmitSmile} from './useSubmitSmile';

import {SPONSOR_SMILES_REFRESH_EVENT} from './sponsor-smile-events';

function smileStyle(smile: LayoutSmile, zIndex: number): CSSProperties {
  return {
    left: `${smile.display_x}%`,
    top: `${smile.display_y}%`,
    transform: `translate(-50%, -50%) rotate(${smile.rotation}deg)`,
    zIndex,
  };
}

export function SponsorSmileWall() {
  const [smiles, setSmiles] = useState<SponsorSmile[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const {submitSmile, submitting, hasSmiled, saveWarning, justSaved} = useSubmitSmile();
  const alreadySmiled = hasSmiled || hasSmiledLocally();
  const layoutSmiles = useMemo(() => layoutScatteredSmiles(smiles), [smiles]);

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

  return (
    <div className="space-y-4">
      <div className="min-h-[120px] bg-primary rounded-xl flex flex-col items-center justify-center gap-3 px-4 py-6">
        <Smile className="text-on-primary h-8 w-8 shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="font-headline text-4xl font-bold tabular-nums text-on-primary">
          {loading ? '…' : count}
        </span>
        <div className="h-px w-16 bg-on-primary/35" role="presentation" />
        <span className="text-center text-sm font-normal text-on-primary/90">Real Smiles</span>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 min-h-[240px] relative overflow-hidden border-b-2 border-primary">
        {loading ? (
          <p className="text-on-surface-variant text-sm text-center py-16">Loading smiles…</p>
        ) : count === 0 ? (
          <p className="text-on-surface-variant text-sm text-center italic py-10 px-4">
            No smiles yet. Be the first.
          </p>
        ) : layoutSmiles.length === 0 ? (
          <p className="text-on-surface-variant text-sm text-center italic py-10 px-4">
            {count} {count === 1 ? 'smile' : 'smiles'} on the board.
          </p>
        ) : (
          layoutSmiles.map((smile, index) => (
            <span
              key={smile.id}
              className="absolute text-3xl leading-none select-none"
              style={smileStyle(smile, index + 1)}
              aria-hidden
            >
              😊
            </span>
          ))
        )}
      </div>

      <div className="text-center space-y-2">
        {justSaved ? (
          <p className="text-sm text-primary font-bold">Your smile is on the board. Thank you!</p>
        ) : alreadySmiled ? (
          <p className="text-sm text-on-surface-variant italic">You already left a smile here.</p>
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
