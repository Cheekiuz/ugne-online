'use client';

import {useEffect, useLayoutEffect, useState} from 'react';

const WELCOME_SEEN_KEY = 'ugne-has-seen-welcome';
const WELCOME_SHOW_KEY = 'ugne-show-welcome';
const VISIBLE_MS = 4000;
const FADE_MS = 500;

type ToastPhase = 'hidden' | 'visible' | 'exiting';

function shouldShowWelcome(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return sessionStorage.getItem(WELCOME_SHOW_KEY) === '1';
  } catch {
    return false;
  }
}

function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, '1');
    sessionStorage.removeItem(WELCOME_SHOW_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

export function prepareWelcomeAfterDoorEntry() {
  try {
    if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
      sessionStorage.setItem(WELCOME_SHOW_KEY, '1');
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function FirstVisitWelcome() {
  const [phase, setPhase] = useState<ToastPhase>('hidden');

  useLayoutEffect(() => {
    if (!shouldShowWelcome()) return;

    markWelcomeSeen();
    setPhase('visible');
  }, []);

  useEffect(() => {
    if (phase !== 'visible') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visibleMs = reducedMotion ? 2000 : VISIBLE_MS;
    const fadeMs = reducedMotion ? 0 : FADE_MS;

    const exitTimer = window.setTimeout(() => {
      if (fadeMs === 0) {
        setPhase('hidden');
        return;
      }

      setPhase('exiting');
    }, visibleMs);

    return () => clearTimeout(exitTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;

    const unmountTimer = window.setTimeout(() => setPhase('hidden'), FADE_MS);
    return () => clearTimeout(unmountTimer);
  }, [phase]);

  if (phase === 'hidden') return null;

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed left-1/2 top-20 z-[150] max-w-[calc(100vw-2rem)] -translate-x-1/2',
        'rounded-xl border border-outline-variant/20 bg-surface-container-high px-5 py-3',
        'text-center text-sm font-medium text-on-surface shadow-lg sm:text-base',
        reducedMotion ? '' : 'transition-all duration-500 ease-out',
        phase === 'exiting' ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100',
      ].join(' ')}
    >
      This website was expecting you.
    </div>
  );
}
