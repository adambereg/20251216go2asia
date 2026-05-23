import type { ProjectionMetadataEnvelope } from '@go2asia/sdk/connectDashboard';

const PROJECTION_KIND_LABELS: Record<ProjectionMetadataEnvelope['projectionKind'], string> = {
  ACTIVITY_PROJECTION: 'activity projection',
  POINTS_SUMMARY: 'Points summary projection',
  BADGE_PREVIEW: 'badge preview',
  RF_LIFECYCLE_PROJECTION: 'RF lifecycle projection',
  INQUIRY_PROJECTION: 'inquiry projection',
};

const REFERENCE_SCOPE_LABELS: Record<ProjectionMetadataEnvelope['referenceScope'], string> = {
  READ_ONLY: 'read-only',
  REFERENCE_ONLY: 'reference-only',
  PREVIEW_ONLY: 'preview-only',
  INQUIRY_ONLY: 'inquiry-only',
};

export function formatProjectionMetadata(metadata?: ProjectionMetadataEnvelope | null): string {
  if (!metadata) {
    return 'Projection metadata unavailable; UI remains read-only and not proof.';
  }

  const generated = new Date(metadata.generatedAt);
  const generatedLabel = Number.isNaN(generated.getTime())
    ? 'runtime timestamp unavailable'
    : generated.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

  const kind = PROJECTION_KIND_LABELS[metadata.projectionKind] ?? metadata.projectionKind;
  const scope = REFERENCE_SCOPE_LABELS[metadata.referenceScope] ?? metadata.referenceScope;

  return `${kind} · ${scope} · generated ${generatedLabel}`;
}
