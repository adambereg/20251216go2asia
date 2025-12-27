export type ExistingExternalIdTx = {
  transactionId: string;
  amount: number;
  action: string;
};

export type ExternalIdDecision =
  | { kind: 'proceed' }
  | { kind: 'duplicate'; transactionId: string }
  | { kind: 'conflict' };

/**
 * Decide what to do when we receive a request with a given externalId.
 * SSOT policy:
 * - same payload (amount+action) => duplicate (applied=false)
 * - different payload => conflict (409)
 * - missing => proceed (apply)
 */
export function decideExternalIdIdempotency(
  existing: ExistingExternalIdTx | null,
  incoming: { amount: number; action: string }
): ExternalIdDecision {
  if (!existing) return { kind: 'proceed' };
  const conflict = existing.amount !== incoming.amount || existing.action !== incoming.action;
  if (conflict) return { kind: 'conflict' };
  return { kind: 'duplicate', transactionId: existing.transactionId };
}



