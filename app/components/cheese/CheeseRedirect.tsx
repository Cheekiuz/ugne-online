'use client';

import {useEffect} from 'react';

export function CheeseRedirect() {
  useEffect(() => {
    window.location.replace('/say-cheese/');
  }, []);

  return (
    <p className="p-8 text-center text-on-surface-variant">
      Redirecting to{' '}
      <a href="/say-cheese/" className="text-primary underline underline-offset-2">
        Say Cheese
      </a>
      …
    </p>
  );
}
