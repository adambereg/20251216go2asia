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

export interface ProjectionOwnerFactReference {
  ownerService: string;
  ownerEntity: string;
  referenceType: 'OWNER_FACT_REFERENCE';
}

export interface ProjectionMetadataEnvelope {
  projectionSource: ProjectionSource;
  projectionKind: ProjectionKind;
  generatedAt: string;
  referenceScope: ProjectionReferenceScope;
  ownerFactReference?: ProjectionOwnerFactReference;
  supportLookupKey?: string;
}
