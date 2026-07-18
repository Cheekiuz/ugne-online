const STORAGE_KEY = 'ugne-sponsor-visitor-id';
const SMILED_KEY = 'ugne-sponsor-has-smiled';

function generateVisitorId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const id = generateVisitorId();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return generateVisitorId();
  }
}

export function hasSmiledLocally(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(SMILED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markSmiledLocally(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(SMILED_KEY, 'true');
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearSmiledLocally(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(SMILED_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}
