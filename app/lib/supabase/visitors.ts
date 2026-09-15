import {getSupabaseClient, isSupabaseConfigured} from './client';
import {getOrCreateVisitorId} from './visitor-id';
import {isVisitRecordId, visitRecordId} from './visit-prefix';

const SESSION_KEY = 'ugne-visit-recorded';

export type VisitorCountResult = {
  configured: boolean;
  count: number | null;
  error: string | null;
};

function isLikelyBot(): boolean {
  if (typeof navigator === 'undefined') {
    return true;
  }

  if (navigator.webdriver) {
    return true;
  }

  return /bot|crawler|spider|slurp|facebookexternalhit|linkedinbot/i.test(navigator.userAgent);
}

function randomPosition(): {pos_x: number; pos_y: number} {
  return {
    pos_x: 5 + Math.random() * 90,
    pos_y: 5 + Math.random() * 90,
  };
}

function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not reach the visitor database';
}

export function formatVisitorCount(count: number | null, ready: boolean): string {
  if (!ready) {
    return '…';
  }

  if (count == null) {
    return '—';
  }

  return count.toLocaleString('en-US');
}

export async function fetchVisitorCount(): Promise<VisitorCountResult> {
  if (!isSupabaseConfigured()) {
    return {configured: false, count: null, error: 'Open ugne.online — local dev has no database keys'};
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {configured: false, count: null, error: 'Open ugne.online — local dev has no database keys'};
  }

  const {data, error} = await supabase.from('sponsor_smiles').select('visitor_id');

  if (error) {
    console.error('Failed to fetch visitor count:', error.message);
    return {configured: true, count: null, error: errorMessage(error)};
  }

  const count = (data ?? []).filter((row) => isVisitRecordId(row.visitor_id)).length;
  return {configured: true, count, error: null};
}

export async function recordVisit(): Promise<string | null> {
  if (typeof window === 'undefined' || isLikelyBot()) {
    return null;
  }

  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      return null;
    }
  } catch {
    /* private mode — still try to record */
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return 'Open ugne.online — local dev has no database keys';
  }

  const visitorId = getOrCreateVisitorId();
  if (!visitorId) {
    return null;
  }

  const {pos_x, pos_y} = randomPosition();
  let {error} = await supabase.from('sponsor_smiles').insert({
    visitor_id: visitRecordId(visitorId),
    pos_x,
    pos_y,
  });

  if (error) {
    ({error} = await supabase.from('sponsor_smiles').insert({
      visitor_id: visitRecordId(visitorId),
    }));
  }

  if (error) {
    if (error.code === '23505') {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      return null;
    }

    console.error('Failed to record visit:', error.message);
    return errorMessage(error);
  }

  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }

  return null;
}

let inflight: Promise<VisitorCountResult> | null = null;

export function ensureVisitCounted(): Promise<VisitorCountResult> {
  if (!inflight) {
    inflight = (async () => {
      try {
        const recordError = await recordVisit();
        const result = await fetchVisitorCount();
        if (result.error || !recordError) {
          return result;
        }

        return {...result, error: recordError};
      } catch (error) {
        return {configured: true, count: null, error: errorMessage(error)};
      }
    })();
  }

  return inflight;
}
