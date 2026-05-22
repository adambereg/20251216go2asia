export const PROJECTION_LABELS = {
  readOnlyProjection: 'Read-only projection',
  referenceOnlyProjection: 'Reference-only projection',
  activitySummary: 'Activity summary',
  preview: 'Preview',
  inquiryOnly: 'Inquiry-only',
  seedSource: 'Источник: seed preview',
  runtimeSource: 'Источник: runtime projection',
} as const;

export const PROJECTION_HELPERS = {
  nonProofFooter: 'Read-only projection: не proof, не receipt и не owner_fact.',
  previewNotGrant: 'Preview only: не grant, не receipt и не owner_fact.',
  activityNotReceipt: 'Reference-only activity summary: не receipt и не полный audit trail.',
  sourceNotProofMetadata: 'Source label является UI-контекстом, не proof metadata.',
} as const;

export const FORBIDDEN_PROJECTION_METADATA_FIELDS = [
  'proofClass',
  'asOf',
  'sourceOwner',
  'ownerFactRef',
  'dataFreshness',
  'stalenessStatus',
  'projectionGeneratedAt',
  'isProof',
  'isReceipt',
  'isAuthoritative',
] as const;

export type ProjectionSourceKind = 'runtime' | 'seed';

export function getProjectionSourceLabel(source: ProjectionSourceKind): string {
  return source === 'seed' ? PROJECTION_LABELS.seedSource : PROJECTION_LABELS.runtimeSource;
}
