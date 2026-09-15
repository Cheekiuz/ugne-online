'use client';

import {useEffect} from 'react';
import {ensureVisitCounted} from '../../lib/supabase/visitors';

export function VisitorTracker() {
  useEffect(() => {
    void ensureVisitCounted();
  }, []);

  return null;
}
