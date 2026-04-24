export type ExistingExternalIdTx = {
  transactionId: string;
  userId: string;
  amount: number;
  action: string;
  sourceService?: string | null;
  sourceEventId?: string | null;
  metadata?: unknown;
};

export type ExternalIdDecision =
  | { kind: 'proceed' }
  | { kind: 'duplicate'; transactionId: string }
  | { kind: 'conflict' };

/**
 * Decide what to do when we receive a request with a given externalId.
 * SSOT policy:
 * - same ledger write => duplicate (applied=false)
 * - different ledger write => conflict (409)
 * - missing => proceed (apply)
 */
export function decideExternalIdIdempotency(
  existing: ExistingExternalIdTx | null,
  incoming: {
    userId: string;
    amount: number;
    action: string;
    sourceService?: string | null;
    sourceEventId?: string | null;
    metadata?: unknown;
  }
): ExternalIdDecision {
  if (!existing) return { kind: 'proceed' };

  const coreConflict =
    existing.userId !== incoming.userId || existing.amount !== incoming.amount || existing.action !== incoming.action;
  if (coreConflict) return { kind: 'conflict' };

  const existingSourceService = normalizeOptionalString(existing.sourceService);
  const incomingSourceService = normalizeOptionalString(incoming.sourceService);
  if (existingSourceService && incomingSourceService && existingSourceService !== incomingSourceService) {
    return { kind: 'conflict' };
  }

  const existingSourceEventId = normalizeOptionalString(existing.sourceEventId);
  const incomingSourceEventId = normalizeOptionalString(incoming.sourceEventId);
  if (existingSourceEventId && incomingSourceEventId && existingSourceEventId !== incomingSourceEventId) {
    return { kind: 'conflict' };
  }

  const existingMetadata = stableSerializeJson(existing.metadata);
  const incomingMetadata = stableSerializeJson(incoming.metadata);
  const metadataConflict =
    existingMetadata !== EMPTY_JSON_OBJECT &&
    incomingMetadata !== EMPTY_JSON_OBJECT &&
    existingMetadata !== incomingMetadata;

  const conflict = metadataConflict;
  if (conflict) return { kind: 'conflict' };
  return { kind: 'duplicate', transactionId: existing.transactionId };
}

const EMPTY_JSON_OBJECT = '{}';

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function stableSerializeJson(value: unknown): string {
  return JSON.stringify(sortJsonValue(value ?? {}));
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortJsonValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, sortJsonValue(nested)])
    );
  }

  return value;
}



