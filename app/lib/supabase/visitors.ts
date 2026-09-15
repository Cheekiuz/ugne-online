import {getSupabaseClient, isSupabaseConfigured} from './client';
import {getOrCreateVisitorId} from './visitor-id';
import {VISIT_RECORD_PREFIX, visitRecordId} from './visit-prefix';

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

function friendlyError(message: string): string {
  if (/schema cache|does not exist|could not find the table/i.test(message)) {
    return 'Could not save visit — database table missing';
  }

  if (/row-level security|permission denied|42501/i.test(message)) {
    return 'Blocked by database rules';
  }

  return message;
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

  const {count, error} = await supabase
    .from('sponsor_smiles')
    .select('*', {count: 'exact', head: true})
    .like('visitor_id', `${VISIT_RECORD_PREFIX}%`);

  if (error) {
    console.error('Failed to fetch visitor count:', error.message);
    return {configured: true, count: null, error: friendlyError(error.message)};
  }

  return {configured: true, count: count ?? 0, error: null};
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

  const {error} = await supabase.from('sponsor_smiles').insert({
    visitor_id: visitRecordId(visitorId),
  });

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
    return friendlyError(error.message);
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
      const recordError = await recordVisit();
      const result = await fetchVisitorCount();
      if (result.error || !recordError) {
        return result;
      }

      return {...result, error: recordError};
    })();
  }

  return inflight;
}
