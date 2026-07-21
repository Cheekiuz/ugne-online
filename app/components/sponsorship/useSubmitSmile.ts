'use client';

import {useCallback, useEffect, useState} from 'react';
import {addSmile, type AddSmileResult} from '../../lib/supabase/smiles';
import {readLocalSmiles} from '../../lib/supabase/local-smiles';
import {getOrCreateVisitorId, hasSmiledLocally, markSmiledLocally, clearSmiledLocally} from '../../lib/supabase/visitor-id';
import {notifySmileSubmitted, notifySmilesRefresh, SPONSOR_SMILE_SUBMITTED_EVENT, type SmileSubmittedDetail} from './sponsor-smile-events';

export function useSubmitSmile() {
  const [submitting, setSubmitting] = useState(false);
  const [hasSmiled, setHasSmiled] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setHasSmiled(hasSmiledLocally());

    const sync = (event: Event) => {
      const detail = (event as CustomEvent<SmileSubmittedDetail>).detail;
      setHasSmiled(hasSmiledLocally());
      if (detail?.smile) {
        setJustSaved(true);
        setSaveWarning(false);
      }
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

    if (result.status === 'success') {
      markSmiledLocally();
      setHasSmiled(true);
      setJustSaved(true);
      notifySmileSubmitted(result.smile);
      notifySmilesRefresh();
    } else if (result.status === 'duplicate') {
      markSmiledLocally();
      setHasSmiled(true);
      setJustSaved(true);
      const existing = readLocalSmiles().find((smile) => smile.visitor_id === visitorId);
      if (existing) {
        notifySmileSubmitted(existing);
      }
      notifySmilesRefresh();
    } else {
      setSaveWarning(true);
    }

    setSubmitting(false);
    return result;
  }, [submitting]);

  const resetThankYou = useCallback(() => {
    clearSmiledLocally();
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
