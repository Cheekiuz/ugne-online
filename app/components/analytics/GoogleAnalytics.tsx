'use client';

import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isInitialPageview = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') {
      return;
    }

    if (isInitialPageview.current) {
      isInitialPageview.current = false;
      return;
    }

    window.gtag?.('config', GA_MEASUREMENT_ID, {page_path: pathname});
  }, [pathname]);

  return null;
}
