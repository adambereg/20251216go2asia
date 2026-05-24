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

export type SupportLookupPointer = {
  ownerNamespace: string;
  ownerEntity: string;
  ownerLookupId: string;
};

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    if (typeof atob !== 'function') return null;
    return atob(normalized + pad);
  } catch {
    return null;
  }
}

export function parseSupportLookupPointer(supportLookupKey?: string | null): SupportLookupPointer | null {
  if (!supportLookupKey) return null;
  const [ownerNamespace, ownerEntity, encodedLookupId, ...extra] = supportLookupKey.split(':');
  if (!ownerNamespace || !ownerEntity || !encodedLookupId || extra.length > 0) return null;

  const ownerLookupId = decodeBase64Url(encodedLookupId);
  if (!ownerLookupId || ownerLookupId.trim().length === 0) return null;

  return {
    ownerNamespace,
    ownerEntity,
    ownerLookupId,
  };
}

export function buildAdminDiagnosticsHref(metadata?: ProjectionMetadataEnvelope | null): string | null {
  if (!metadata) return null;
  const supportLookupKey = metadata.supportLookupKey?.trim();
  if (!supportLookupKey) return null;
  const params = new URLSearchParams();
  params.set('supportLookupKey', supportLookupKey);
  params.set('projectionKind', metadata.projectionKind);
  params.set('referenceScope', metadata.referenceScope);
  return `/admin/points-diagnostics?${params.toString()}`;
}
