'use client';

import {useEffect, useState} from 'react';

const FLIP_DELAY_MS = 5000;
const FLIP_DURATION_MS = 3000;

export function useHomeUpsideDownFlip() {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let revertTimeout: ReturnType<typeof setTimeout> | undefined;

    const flipTimeout = setTimeout(() => {
      setIsFlipped(true);
      revertTimeout = setTimeout(() => {
        setIsFlipped(false);
      }, FLIP_DURATION_MS);
    }, FLIP_DELAY_MS);

    return () => {
      clearTimeout(flipTimeout);
      if (revertTimeout) clearTimeout(revertTimeout);
    };
  }, []);

  return isFlipped;
}
