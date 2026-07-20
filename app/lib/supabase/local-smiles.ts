import type {SponsorSmile} from './smiles';

const LOCAL_SMILES_KEY = 'ugne-sponsor-local-smiles';

function readRaw(): SponsorSmile[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_SMILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SponsorSmile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(smiles: SponsorSmile[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_SMILES_KEY, JSON.stringify(smiles));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readLocalSmiles(): SponsorSmile[] {
  return readRaw();
}

export function addLocalSmile(visitorId: string): SponsorSmile {
  const smiles = readRaw();
  const existing = smiles.find((smile) => smile.visitor_id === visitorId);
  if (existing) {
    return existing;
  }

  const smile: SponsorSmile = {
    id: Date.now(),
    visitor_id: visitorId,
    pos_x: 5 + Math.random() * 90,
    pos_y: 5 + Math.random() * 90,
    created_at: new Date().toISOString(),
  };

  writeRaw([smile, ...smiles]);
  return smile;
}

export function mergeUniqueSmiles(...groups: SponsorSmile[][]): SponsorSmile[] {
  const byId = new Map<number, SponsorSmile>();

  for (const group of groups) {
    for (const smile of group) {
      byId.set(smile.id, smile);
    }
  }

  return [...byId.values()].sort((a, b) => a.id - b.id);
}
