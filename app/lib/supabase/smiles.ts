import {getSupabaseClient} from './client';

export type SponsorSmile = {
  id: number;
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
};

const SMILE_LIMIT = 100;
export const SMILE_DONATION_FLOOR = 35;

function positionFromId(id: number): {pos_x: number; pos_y: number} {
  return {
    pos_x: 10 + ((id * 47) % 80),
    pos_y: 10 + ((id * 83) % 80),
  };
}

export function ensureSmilesForDisplay(smiles: SponsorSmile[], count: number): SponsorSmile[] {
  if (count <= 0) {
    return smiles;
  }

  const sorted = [...smiles].sort((a, b) => b.id - a.id);
  const capped = sorted.slice(0, count);

  if (capped.length >= count) {
    return capped.sort((a, b) => a.id - b.id);
  }

  const byId = new Map(capped.map((smile) => [smile.id, smile]));
  const filled: SponsorSmile[] = [...capped];

  for (let id = 1; filled.length < count; id++) {
    if (byId.has(id)) {
      continue;
    }

    const derived = positionFromId(id);
    const placeholder: SponsorSmile = {
      id,
      pos_x: derived.pos_x,
      pos_y: derived.pos_y,
      created_at: '',
    };
    filled.push(placeholder);
    byId.set(id, placeholder);
  }

  let nextId = Math.max(0, ...capped.map((smile) => smile.id)) + 1;
  while (filled.length < count) {
    if (byId.has(nextId)) {
      nextId++;
      continue;
    }

    const derived = positionFromId(nextId);
    const placeholder: SponsorSmile = {
      id: nextId,
      pos_x: derived.pos_x,
      pos_y: derived.pos_y,
      created_at: '',
    };
    filled.push(placeholder);
    byId.set(nextId, placeholder);
    nextId++;
  }

  return filled.sort((a, b) => a.id - b.id);
}

function normalizeSmile(smile: SponsorSmile): SponsorSmile {
  if (smile.pos_x != null && smile.pos_y != null) {
    return smile;
  }

  const derived = positionFromId(smile.id);
  return {
    ...smile,
    pos_x: smile.pos_x ?? derived.pos_x,
    pos_y: smile.pos_y ?? derived.pos_y,
  };
}

function randomPosition(): {pos_x: number; pos_y: number} {
  return {
    pos_x: 5 + Math.random() * 90,
    pos_y: 5 + Math.random() * 90,
  };
}

export async function fetchSmileCount(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const {count, error} = await supabase
    .from('sponsor_smiles')
    .select('*', {count: 'exact', head: true});

  if (error) {
    console.error('Failed to fetch smile count:', error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchSmiles(): Promise<SponsorSmile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const {data, error} = await supabase
    .from('sponsor_smiles')
    .select('id, pos_x, pos_y, created_at')
    .order('created_at', {ascending: false})
    .limit(SMILE_LIMIT);

  if (!error && data) {
    return data.map(normalizeSmile);
  }

  const {data: fallbackData, error: fallbackError} = await supabase
    .from('sponsor_smiles')
    .select('id, created_at')
    .order('created_at', {ascending: false})
    .limit(SMILE_LIMIT);

  if (fallbackError) {
    console.error('Failed to fetch smiles:', error?.message ?? fallbackError.message);
    return [];
  }

  return (fallbackData ?? []).map((row) =>
    normalizeSmile({
      id: row.id,
      created_at: row.created_at,
      pos_x: null,
      pos_y: null,
    }),
  );
}

export type AddSmileResult = 'success' | 'duplicate' | 'error' | 'unconfigured';

export async function addSmile(visitorId: string): Promise<AddSmileResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 'unconfigured';
  }

  const {pos_x, pos_y} = randomPosition();

  let {error} = await supabase.from('sponsor_smiles').insert({
    visitor_id: visitorId,
    pos_x,
    pos_y,
  });

  if (error) {
    ({error} = await supabase.from('sponsor_smiles').insert({
      visitor_id: visitorId,
    }));
  }

  if (!error) {
    return 'success';
  }

  if (error.code === '23505') {
    return 'duplicate';
  }

  console.error('Failed to add smile:', error.message);
  return 'error';
}
