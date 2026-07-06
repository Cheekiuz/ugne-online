'use client';

import type {CSSProperties} from 'react';
import {Smile} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  layoutScatteredSmiles,
  type LayoutSmile,
} from '../../lib/supabase/smile-layout';
import {fetchSmiles, type SponsorSmile} from '../../lib/supabase/smiles';
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
  const [loading, setLoading] = useState(true);
  const [optimisticSmile, setOptimisticSmile] = useState<SponsorSmile | null>(null);
  const prevSmileCountRef = useRef(0);
  const {submitSmile, submitting, hasSmiled, saveWarning, justSaved} = useSubmitSmile();
  const alreadySmiled = hasSmiled || hasSmiledLocally();

  const smilesForLayout = useMemo(() => {
    if (optimisticSmile && !smiles.some((smile) => smile.id === optimisticSmile.id)) {
      return [...smiles, optimisticSmile];
    }
    return smiles;
  }, [smiles, optimisticSmile]);

  const wallSmiles = useMemo(() => layoutScatteredSmiles(smilesForLayout), [smilesForLayout]);
  const hasVisibleSmiles = !loading && wallSmiles.length > 0;
  const wallMinHeight = wallSmiles.length > 8 ? 'min-h-[280px]' : 'min-h-[240px]';

  const loadSmiles = useCallback(async () => {
    setLoading(true);
    const data = await fetchSmiles();
    setSmiles(data);
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
      {loading ? (
        <p className="text-sm text-on-surface-variant text-center py-8">Loading smiles…</p>
      ) : hasVisibleSmiles ? (
        <div
          className={`bg-surface-container-lowest rounded-xl shadow-sm p-4 ${wallMinHeight} relative overflow-hidden border-b-2 border-primary`}
        >
          {wallSmiles.map((smile, index) => (
            <Smile
              key={`wall-${smile.id}`}
              className="absolute h-10 w-10"
              strokeWidth={2.25}
              style={smileStyle(smile, index + 1, smile.colorWall)}
              aria-hidden
            />
          ))}
        </div>
      ) : null}

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
