export const SPONSOR_SMILES_REFRESH_EVENT = 'ugne-sponsor-smiles-refresh';
export const SPONSOR_SMILE_SUBMITTED_EVENT = 'ugne-sponsor-smile-submitted';

export function notifySmilesRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SPONSOR_SMILES_REFRESH_EVENT));
  }
}

export function notifySmileSubmitted() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SPONSOR_SMILE_SUBMITTED_EVENT));
  }
}
