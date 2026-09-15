import {getSupabaseClient} from './client';
import {getOrCreateVisitorId} from './visitor-id';

const SESSION_KEY = 'ugne-visit-recorded';

function isLikelyBot(): boolean {
  if (typeof navigator === 'undefined') {
    return true;
  }

  if (navigator.webdriver) {
    return true;
  }

  return /bot|crawler|spider|slurp|preview|facebookexternalhit|linkedinbot/i.test(
    navigator.userAgent,
  );
}

export async function fetchVisitorCount(): Promise<number | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const {count, error} = await supabase.from('site_visitors').select('*', {count: 'exact', head: true});

  if (error) {
    console.error('Failed to fetch visitor count:', error.message);
    return null;
  }

  return count ?? 0;
}

export async function recordVisit(): Promise<void> {
  if (typeof window === 'undefined' || isLikelyBot()) {
    return;
  }

  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      return;
    }
  } catch {
    /* private mode — still try to record */
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const visitorId = getOrCreateVisitorId();
  if (!visitorId) {
    return;
  }

  const {error} = await supabase.from('site_visitors').upsert(
    {visitor_id: visitorId},
    {onConflict: 'visitor_id', ignoreDuplicates: true},
  );

  if (error) {
    console.error('Failed to record visit:', error.message);
    return;
  }

  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }
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

let inflight: Promise<number | null> | null = null;

export function ensureVisitCounted(): Promise<number | null> {
  if (!inflight) {
    inflight = (async () => {
      await recordVisit();
      return fetchVisitorCount();
    })();
  }

  return inflight;
}
