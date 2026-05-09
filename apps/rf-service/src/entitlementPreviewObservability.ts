import type {
  EntitlementPreviewBucket,
  EntitlementPreviewDegradedCategory,
  EntitlementPreviewObservation,
  EntitlementPreviewSurface,
} from './entitlementMock';

type BatchSizeBucket = 'single' | 'small' | 'medium' | 'large';
type PreviewRouteKind = 'single' | 'batch';

export type EntitlementPreviewObservabilitySnapshot = {
  startedAt: string;
  updatedAt: string | null;
  previewRequestsTotal: number;
  previewBatchRequestsTotal: number;
  previewItemsTotal: number;
  premiumPreviewItemsTotal: number;
  temporaryPreviewItemsTotal: number;
  bucketTotals: Record<EntitlementPreviewBucket, number>;
  degradedTotals: Record<EntitlementPreviewDegradedCategory, number>;
  surfaceTotals: Record<EntitlementPreviewSurface, number>;
  batchSizeTotals: Record<BatchSizeBucket, number>;
};

const bucketOrder: EntitlementPreviewBucket[] = [
  'available',
  'requires_condition',
  'checking_or_temporarily_unavailable',
  'ordinary_no_preview',
  'unavailable',
  'not_enabled',
];

const degradedOrder: EntitlementPreviewDegradedCategory[] = ['none', 'partial_sources', 'timeout_fallback', 'stale_cache', 'source_unavailable', 'policy_fallback'];
const surfaceOrder: EntitlementPreviewSurface[] = ['catalog', 'listing', 'other'];
const batchSizeOrder: BatchSizeBucket[] = ['single', 'small', 'medium', 'large'];

function zeroRecord<T extends string>(keys: T[]): Record<T, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

function createSnapshot(now = new Date()): EntitlementPreviewObservabilitySnapshot {
  return {
    startedAt: now.toISOString(),
    updatedAt: null,
    previewRequestsTotal: 0,
    previewBatchRequestsTotal: 0,
    previewItemsTotal: 0,
    premiumPreviewItemsTotal: 0,
    temporaryPreviewItemsTotal: 0,
    bucketTotals: zeroRecord(bucketOrder),
    degradedTotals: zeroRecord(degradedOrder),
    surfaceTotals: zeroRecord(surfaceOrder),
    batchSizeTotals: zeroRecord(batchSizeOrder),
  };
}

let snapshot = createSnapshot();

function getBatchSizeBucket(kind: PreviewRouteKind, itemCount: number): BatchSizeBucket {
  if (kind === 'single' || itemCount <= 1) return 'single';
  if (itemCount <= 5) return 'small';
  if (itemCount <= 15) return 'medium';
  return 'large';
}

export function recordEntitlementPreviewObservations(input: {
  kind: PreviewRouteKind;
  observations: EntitlementPreviewObservation[];
  now?: Date;
}): void {
  if (input.observations.length === 0) return;
  const nowIso = (input.now ?? new Date()).toISOString();

  if (input.kind === 'single') snapshot.previewRequestsTotal += 1;
  else snapshot.previewBatchRequestsTotal += 1;

  snapshot.previewItemsTotal += input.observations.length;
  snapshot.batchSizeTotals[getBatchSizeBucket(input.kind, input.observations.length)] += 1;

  for (const observation of input.observations) {
    snapshot.bucketTotals[observation.bucket] += 1;
    snapshot.degradedTotals[observation.degradedMode] += 1;
    snapshot.surfaceTotals[observation.surface] += 1;
    if (observation.isPremiumPreview) snapshot.premiumPreviewItemsTotal += 1;
    if (observation.isTemporary) snapshot.temporaryPreviewItemsTotal += 1;
  }

  snapshot.updatedAt = nowIso;
}

export function getEntitlementPreviewObservabilitySnapshot(): EntitlementPreviewObservabilitySnapshot {
  return structuredClone(snapshot);
}

export function resetEntitlementPreviewObservability(now = new Date()): EntitlementPreviewObservabilitySnapshot {
  snapshot = createSnapshot(now);
  return getEntitlementPreviewObservabilitySnapshot();
}

export function assertNoUnsafeEntitlementPreviewObservabilityFields(payload: string): boolean {
  return !/\b(userId|subject|roleHints|statusHints|auditTraceId|requestWindowId|adapterId|rawFacts|evaluatedSources|partialResults|wallet|chain|tx|balance|payout|reward|debit|compensation|recovery)\b/i.test(
    payload,
  );
}
