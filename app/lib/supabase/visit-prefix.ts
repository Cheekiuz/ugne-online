/** Rows in sponsor_smiles that record a unique site visit, not a wall smile. */
export const VISIT_RECORD_PREFIX = 'vv-';

export function visitRecordId(visitorId: string): string {
  return `${VISIT_RECORD_PREFIX}${visitorId}`;
}

export function isVisitRecordId(visitorId: string | undefined): boolean {
  return Boolean(visitorId?.startsWith(VISIT_RECORD_PREFIX));
}
