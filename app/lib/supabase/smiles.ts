import {getSupabaseClient} from './client';

export type SponsorSmile = {
  id: number;
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
};

const SMILE_LIMIT = 100;

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

  if (error) {
    console.error('Failed to fetch smiles:', error.message);
    return [];
  }

  return data ?? [];
}

export type AddSmileResult = 'success' | 'duplicate' | 'error' | 'unconfigured';

export async function addSmile(visitorId: string): Promise<AddSmileResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 'unconfigured';
  }

  const {pos_x, pos_y} = randomPosition();

  const {error} = await supabase.from('sponsor_smiles').insert({
    visitor_id: visitorId,
    pos_x,
    pos_y,
  });

  if (!error) {
    return 'success';
  }

  if (error.code === '23505') {
    return 'duplicate';
  }

  console.error('Failed to add smile:', error.message);
  return 'error';
}
