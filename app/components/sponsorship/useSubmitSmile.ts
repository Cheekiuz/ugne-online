'use client';

import {useCallback, useEffect, useState} from 'react';
import {addSmile, type AddSmileResult} from '../../lib/supabase/smiles';
import {getOrCreateVisitorId, hasSmiledLocally, markSmiledLocally} from '../../lib/supabase/visitor-id';
import {notifySmileSubmitted, notifySmilesRefresh, SPONSOR_SMILE_SUBMITTED_EVENT} from './sponsor-smile-events';

export function useSubmitSmile() {
  const [submitting, setSubmitting] = useState(false);
  const [hasSmiled, setHasSmiled] = useState(() => hasSmiledLocally());
  const [saveWarning, setSaveWarning] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setHasSmiled(hasSmiledLocally());
      setJustSaved(true);
    };
    window.addEventListener(SPONSOR_SMILE_SUBMITTED_EVENT, sync);
    return () => window.removeEventListener(SPONSOR_SMILE_SUBMITTED_EVENT, sync);
  }, []);

  const submitSmile = useCallback(async (): Promise<AddSmileResult | 'already'> => {
    if (submitting) {
      return 'already';
    }

    if (hasSmiledLocally()) {
      setHasSmiled(true);
      return 'already';
    }

    setSubmitting(true);
    setSaveWarning(false);
    setJustSaved(false);

    const visitorId = getOrCreateVisitorId();
    const result = await addSmile(visitorId);

    if (result === 'success' || result === 'duplicate') {
      markSmiledLocally();
      setHasSmiled(true);
      setJustSaved(true);
      notifySmilesRefresh();
      notifySmileSubmitted();
    } else {
      setSaveWarning(true);
    }

    setSubmitting(false);
    return result;
  }, [submitting]);

  const resetThankYou = useCallback(() => {
    setHasSmiled(false);
    setSaveWarning(false);
    setJustSaved(false);
  }, []);

  return {
    submitSmile,
    submitting,
    hasSmiled,
    saveWarning,
    justSaved,
    resetThankYou,
  };
}
