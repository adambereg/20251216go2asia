export type SpendabilityShadowDriftClass =
  | 'aligned_allowed'
  | 'aligned_denied'
  | 'legacy_allowed_target_denied'
  | 'legacy_denied_target_allowed'
  | 'target_unavailable'
  | 'target_stale'
  | 'target_error';

export type SpendabilityShadowReasonCode =
  | 'legacy_and_target_allow'
  | 'legacy_and_target_deny'
  | 'locked_or_conditional_value_may_fund_spend'
  | 'materialized_balance_lags_available_projection'
  | 'target_unavailable'
  | 'target_stale'
  | 'target_error';

export type SpendabilityShadowDecision = {
  legacySpendable: number;
  targetAvailableSpendable: number | null;
  legacyAllows: boolean;
  targetAllows: boolean | null;
  driftClass: SpendabilityShadowDriftClass;
  reasonCode: SpendabilityShadowReasonCode;
  stale: boolean;
  evaluatedAt: string;
  auditTraceId: string;
};

export type SpendabilityShadowObservation = {
  driftClass: SpendabilityShadowDriftClass;
  action: string;
  amountRange: '1_99' | '100_999' | '1000_4999' | '5000_plus';
  legacyAllows: boolean;
  targetAllows: boolean | null;
  reasonCode: SpendabilityShadowReasonCode;
  stale: boolean;
  evaluatedAt: string;
  auditTraceId: string;
};

export type SpendabilityShadowDiagnosticsSnapshot = {
  total: number;
  stale: number;
  byDriftClass: Record<SpendabilityShadowDriftClass, number>;
  byReasonCode: Partial<Record<SpendabilityShadowReasonCode, number>>;
  byAction: Partial<Record<string, number>>;
  byAmountRange: Partial<Record<SpendabilityShadowObservation['amountRange'], number>>;
  lastObservation: SpendabilityShadowObservation | null;
};

const DRIFT_CLASSES: SpendabilityShadowDriftClass[] = [
  'aligned_allowed',
  'aligned_denied',
  'legacy_allowed_target_denied',
  'legacy_denied_target_allowed',
  'target_unavailable',
  'target_stale',
  'target_error',
];

let snapshot: SpendabilityShadowDiagnosticsSnapshot = emptySnapshot();

function emptySnapshot(): SpendabilityShadowDiagnosticsSnapshot {
  return {
    total: 0,
    stale: 0,
    byDriftClass: Object.fromEntries(DRIFT_CLASSES.map((item) => [item, 0])) as Record<SpendabilityShadowDriftClass, number>,
    byReasonCode: {},
    byAction: {},
    byAmountRange: {},
    lastObservation: null,
  };
}

function stableId(prefix: string, input: string): string {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return `${prefix}_${hash.toString(36)}`;
}

export function amountRange(amount: number): SpendabilityShadowObservation['amountRange'] {
  if (amount >= 5000) return '5000_plus';
  if (amount >= 1000) return '1000_4999';
  if (amount >= 100) return '100_999';
  return '1_99';
}

export function evaluateSpendabilityShadow(input: {
  legacySpendable: number;
  targetAvailableSpendable: number | null;
  amount: number;
  action: string;
  userId: string;
  externalId: string;
  correlationId: string | null;
  stale?: boolean;
  error?: boolean;
  now?: Date;
}): SpendabilityShadowDecision {
  const evaluatedAt = (input.now ?? new Date()).toISOString();
  const auditTraceId = stableId('points_spend_shadow', `${input.userId}:${input.externalId}:${input.correlationId ?? ''}:${evaluatedAt}`);
  const legacyAllows = input.legacySpendable >= input.amount;

  if (input.error) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: null,
      legacyAllows,
      targetAllows: null,
      driftClass: 'target_error',
      reasonCode: 'target_error',
      stale: false,
      evaluatedAt,
      auditTraceId,
    };
  }

  if (input.targetAvailableSpendable === null) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: null,
      legacyAllows,
      targetAllows: null,
      driftClass: 'target_unavailable',
      reasonCode: 'target_unavailable',
      stale: Boolean(input.stale),
      evaluatedAt,
      auditTraceId,
    };
  }

  const targetAllows = input.targetAvailableSpendable >= input.amount;
  if (input.stale) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: input.targetAvailableSpendable,
      legacyAllows,
      targetAllows,
      driftClass: 'target_stale',
      reasonCode: 'target_stale',
      stale: true,
      evaluatedAt,
      auditTraceId,
    };
  }

  if (legacyAllows && targetAllows) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: input.targetAvailableSpendable,
      legacyAllows,
      targetAllows,
      driftClass: 'aligned_allowed',
      reasonCode: 'legacy_and_target_allow',
      stale: false,
      evaluatedAt,
      auditTraceId,
    };
  }

  if (!legacyAllows && !targetAllows) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: input.targetAvailableSpendable,
      legacyAllows,
      targetAllows,
      driftClass: 'aligned_denied',
      reasonCode: 'legacy_and_target_deny',
      stale: false,
      evaluatedAt,
      auditTraceId,
    };
  }

  if (legacyAllows && !targetAllows) {
    return {
      legacySpendable: input.legacySpendable,
      targetAvailableSpendable: input.targetAvailableSpendable,
      legacyAllows,
      targetAllows,
      driftClass: 'legacy_allowed_target_denied',
      reasonCode: 'locked_or_conditional_value_may_fund_spend',
      stale: false,
      evaluatedAt,
      auditTraceId,
    };
  }

  return {
    legacySpendable: input.legacySpendable,
    targetAvailableSpendable: input.targetAvailableSpendable,
    legacyAllows,
    targetAllows,
    driftClass: 'legacy_denied_target_allowed',
    reasonCode: 'materialized_balance_lags_available_projection',
    stale: false,
    evaluatedAt,
    auditTraceId,
  };
}

export function toSpendabilityShadowObservation(input: {
  decision: SpendabilityShadowDecision;
  action: string;
  amount: number;
}): SpendabilityShadowObservation {
  return {
    driftClass: input.decision.driftClass,
    action: input.action,
    amountRange: amountRange(input.amount),
    legacyAllows: input.decision.legacyAllows,
    targetAllows: input.decision.targetAllows,
    reasonCode: input.decision.reasonCode,
    stale: input.decision.stale,
    evaluatedAt: input.decision.evaluatedAt,
    auditTraceId: input.decision.auditTraceId,
  };
}

export function recordSpendabilityShadowObservation(observation: SpendabilityShadowObservation): void {
  snapshot.total += 1;
  if (observation.stale) snapshot.stale += 1;
  snapshot.byDriftClass[observation.driftClass] += 1;
  snapshot.byReasonCode[observation.reasonCode] = (snapshot.byReasonCode[observation.reasonCode] ?? 0) + 1;
  snapshot.byAction[observation.action] = (snapshot.byAction[observation.action] ?? 0) + 1;
  snapshot.byAmountRange[observation.amountRange] = (snapshot.byAmountRange[observation.amountRange] ?? 0) + 1;
  snapshot.lastObservation = { ...observation };
}

export function getSpendabilityShadowDiagnosticsSnapshot(): SpendabilityShadowDiagnosticsSnapshot {
  return {
    total: snapshot.total,
    stale: snapshot.stale,
    byDriftClass: { ...snapshot.byDriftClass },
    byReasonCode: { ...snapshot.byReasonCode },
    byAction: { ...snapshot.byAction },
    byAmountRange: { ...snapshot.byAmountRange },
    lastObservation: snapshot.lastObservation ? { ...snapshot.lastObservation } : null,
  };
}

export function resetSpendabilityShadowDiagnosticsForTests(): void {
  snapshot = emptySnapshot();
}

export function assertNoUnsafeSpendabilityShadowDiagnosticsFields(value: unknown): void {
  const serialized = JSON.stringify(value).toLowerCase();
  const forbidden = [
    'authorization',
    'bearer ',
    'jwt',
    'token',
    'metadata',
    'transactions',
    'ledger',
    'userid',
    'user_id',
    'externalid',
    'external_id',
    'payment',
    'referee',
    'referrer',
  ];
  for (const token of forbidden) {
    if (serialized.includes(token)) {
      throw new Error(`Unsafe spendability shadow diagnostics field leaked: ${token}`);
    }
  }
}
