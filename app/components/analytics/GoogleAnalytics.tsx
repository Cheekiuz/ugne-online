'use client';

import {useEffect} from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') {
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    window.gtag('js', new Date());

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.onload = () => {
      window.gtag?.('config', GA_MEASUREMENT_ID);
    };
    script.onerror = () => {
      // Ad blockers and privacy tools often block GA — not a site error.
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
