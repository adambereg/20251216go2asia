export type ProjectionSource = 'POINTS_SERVICE';

export type ProjectionKind =
  | 'ACTIVITY_PROJECTION'
  | 'POINTS_SUMMARY'
  | 'BADGE_PREVIEW'
  | 'RF_LIFECYCLE_PROJECTION'
  | 'INQUIRY_PROJECTION';

export type ProjectionReferenceScope =
  | 'READ_ONLY'
  | 'REFERENCE_ONLY'
  | 'PREVIEW_ONLY'
  | 'INQUIRY_ONLY';

export type ProjectionOwnerFactReference = {
  ownerService: string;
  ownerEntity: string;
  referenceType: 'OWNER_FACT_REFERENCE';
};

export type ProjectionMetadataEnvelope = {
  projectionSource: ProjectionSource;
  projectionKind: ProjectionKind;
  generatedAt: string;
  referenceScope: ProjectionReferenceScope;
  ownerFactReference?: ProjectionOwnerFactReference;
  supportLookupKey?: string;
};

export function createProjectionMetadata(
  input: Omit<ProjectionMetadataEnvelope, 'projectionSource' | 'generatedAt'> & {
    generatedAt?: string;
  }
): ProjectionMetadataEnvelope {
  return {
    projectionSource: 'POINTS_SERVICE',
    projectionKind: input.projectionKind,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    referenceScope: input.referenceScope,
    ...(input.ownerFactReference ? { ownerFactReference: input.ownerFactReference } : {}),
    ...(input.supportLookupKey ? { supportLookupKey: input.supportLookupKey } : {}),
  };
}
