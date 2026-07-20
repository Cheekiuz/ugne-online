import type {SponsorSmile} from '../../lib/supabase/smiles';

export const SPONSOR_SMILES_REFRESH_EVENT = 'ugne-sponsor-smiles-refresh';
export const SPONSOR_SMILE_SUBMITTED_EVENT = 'ugne-sponsor-smile-submitted';

export type SmileSubmittedDetail = {
  smile: SponsorSmile;
};

export function notifySmilesRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SPONSOR_SMILES_REFRESH_EVENT));
  }
}

export function notifySmileSubmitted(smile: SponsorSmile) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<SmileSubmittedDetail>(SPONSOR_SMILE_SUBMITTED_EVENT, {
        detail: {smile},
      }),
    );
  }
}
