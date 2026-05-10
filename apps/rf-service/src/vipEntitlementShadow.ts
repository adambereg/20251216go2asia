import type { VoucherClaimScope } from './store';

export type VipEntitlementShadowScenario = 'role_mirror' | 'grant' | 'deny' | 'stale' | 'degraded' | 'unknown_source';

export type VipEntitlementShadowDecision = {
  allowed: boolean;
  decision: 'granted' | 'denied' | 'pending' | 'unknown' | 'not_applicable';
  reasonCode:
    | 'entitlement_granted'
    | 'not_found'
    | 'expired'
    | 'revoked'
    | 'refunded'
    | 'cancelled'
    | 'source_unavailable'
    | 'source_timeout'
    | 'policy_not_configured'
    | 'stale_cache'
    | 'unknown_source';
  stale: boolean;
  degraded: boolean;
  source: 'canonical_entitlement' | 'approved_cache' | 'migration_role_shadow' | 'mock' | 'unknown';
  evaluatedAt: string;
  decisionVersion: number;
  auditTraceId: string;
};

export type VipEntitlementShadowDriftClass =
  | 'aligned_granted'
  | 'aligned_denied'
  | 'role_granted_entitlement_denied'
  | 'role_denied_entitlement_granted'
  | 'stale_shadow'
  | 'degraded_shadow'
  | 'unknown_source';

export type VipEntitlementShadowObservation = {
  driftClass: VipEntitlementShadowDriftClass;
  runtimeAllowed: boolean;
  entitlementAllowed: boolean;
  reasonCode: VipEntitlementShadowDecision['reasonCode'];
  stale: boolean;
  degraded: boolean;
  source: VipEntitlementShadowDecision['source'];
  claimScope: VoucherClaimScope;
  evaluatedAt: string;
  auditTraceId: string;
};

export type VipEntitlementShadowSnapshot = {
  total: number;
  stale: number;
  degraded: number;
  byDriftClass: Record<VipEntitlementShadowDriftClass, number>;
  byReasonCode: Partial<Record<VipEntitlementShadowDecision['reasonCode'], number>>;
  bySource: Partial<Record<VipEntitlementShadowDecision['source'], number>>;
  lastObservation: Omit<VipEntitlementShadowObservation, 'runtimeAllowed' | 'entitlementAllowed'> | null;
};

const DRIFT_CLASSES: VipEntitlementShadowDriftClass[] = [
  'aligned_granted',
  'aligned_denied',
  'role_granted_entitlement_denied',
  'role_denied_entitlement_granted',
  'stale_shadow',
  'degraded_shadow',
  'unknown_source',
];

const snapshot: VipEntitlementShadowSnapshot = {
  total: 0,
  stale: 0,
  degraded: 0,
  byDriftClass: Object.fromEntries(DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementShadowDriftClass, number>,
  byReasonCode: {},
  bySource: {},
  lastObservation: null,
};

function stableId(prefix: string, input: string): string {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return `${prefix}_${hash.toString(36)}`;
}

function nowIso(now?: Date): string {
  return (now ?? new Date()).toISOString();
}

export function parseVipEntitlementShadowScenario(value: string | undefined): VipEntitlementShadowScenario {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === 'grant' ||
    normalized === 'deny' ||
    normalized === 'stale' ||
    normalized === 'degraded' ||
    normalized === 'unknown_source' ||
    normalized === 'role_mirror'
  ) {
    return normalized;
  }
  return 'role_mirror';
}

export function resolveVipEntitlementShadowDecision(input: {
  userId: string;
  currentRoleAllowed: boolean;
  scenario?: VipEntitlementShadowScenario;
  correlationId?: string | null;
  now?: Date;
}): VipEntitlementShadowDecision {
  const scenario = input.scenario ?? 'role_mirror';
  const evaluatedAt = nowIso(input.now);
  const auditTraceId = stableId('vip_shadow_trace', `${input.userId}:${input.correlationId ?? ''}:${scenario}:${evaluatedAt}`);

  if (scenario === 'grant') {
    return {
      allowed: true,
      decision: 'granted',
      reasonCode: 'entitlement_granted',
      stale: false,
      degraded: false,
      source: 'mock',
      evaluatedAt,
      decisionVersion: 1,
      auditTraceId,
    };
  }

  if (scenario === 'deny') {
    return {
      allowed: false,
      decision: 'denied',
      reasonCode: 'not_found',
      stale: false,
      degraded: false,
      source: 'mock',
      evaluatedAt,
      decisionVersion: 1,
      auditTraceId,
    };
  }

  if (scenario === 'stale') {
    return {
      allowed: false,
      decision: 'unknown',
      reasonCode: 'stale_cache',
      stale: true,
      degraded: false,
      source: 'approved_cache',
      evaluatedAt,
      decisionVersion: 1,
      auditTraceId,
    };
  }

  if (scenario === 'degraded') {
    return {
      allowed: false,
      decision: 'unknown',
      reasonCode: 'source_unavailable',
      stale: false,
      degraded: true,
      source: 'unknown',
      evaluatedAt,
      decisionVersion: 1,
      auditTraceId,
    };
  }

  if (scenario === 'unknown_source') {
    return {
      allowed: false,
      decision: 'unknown',
      reasonCode: 'unknown_source',
      stale: false,
      degraded: true,
      source: 'unknown',
      evaluatedAt,
      decisionVersion: 1,
      auditTraceId,
    };
  }

  return {
    allowed: input.currentRoleAllowed,
    decision: input.currentRoleAllowed ? 'granted' : 'denied',
    reasonCode: input.currentRoleAllowed ? 'entitlement_granted' : 'not_found',
    stale: false,
    degraded: false,
    source: 'migration_role_shadow',
    evaluatedAt,
    decisionVersion: 1,
    auditTraceId,
  };
}

export function compareVipEntitlementShadow(input: {
  currentRoleAllowed: boolean;
  decision: VipEntitlementShadowDecision;
  claimScope: VoucherClaimScope;
}): VipEntitlementShadowObservation {
  let driftClass: VipEntitlementShadowDriftClass;
  if (input.decision.stale) driftClass = 'stale_shadow';
  else if (input.decision.degraded && input.decision.reasonCode !== 'unknown_source') driftClass = 'degraded_shadow';
  else if (input.decision.source === 'unknown') driftClass = 'unknown_source';
  else if (input.currentRoleAllowed && input.decision.allowed) driftClass = 'aligned_granted';
  else if (!input.currentRoleAllowed && !input.decision.allowed) driftClass = 'aligned_denied';
  else if (input.currentRoleAllowed && !input.decision.allowed) driftClass = 'role_granted_entitlement_denied';
  else driftClass = 'role_denied_entitlement_granted';

  return {
    driftClass,
    runtimeAllowed: input.currentRoleAllowed,
    entitlementAllowed: input.decision.allowed,
    reasonCode: input.decision.reasonCode,
    stale: input.decision.stale,
    degraded: input.decision.degraded,
    source: input.decision.source,
    claimScope: input.claimScope,
    evaluatedAt: input.decision.evaluatedAt,
    auditTraceId: input.decision.auditTraceId,
  };
}

export function recordVipEntitlementShadowObservation(observation: VipEntitlementShadowObservation): void {
  snapshot.total += 1;
  if (observation.stale) snapshot.stale += 1;
  if (observation.degraded) snapshot.degraded += 1;
  snapshot.byDriftClass[observation.driftClass] += 1;
  snapshot.byReasonCode[observation.reasonCode] = (snapshot.byReasonCode[observation.reasonCode] ?? 0) + 1;
  snapshot.bySource[observation.source] = (snapshot.bySource[observation.source] ?? 0) + 1;
  const { runtimeAllowed: _runtimeAllowed, entitlementAllowed: _entitlementAllowed, ...safeObservation } = observation;
  snapshot.lastObservation = safeObservation;
}

export function getVipEntitlementShadowSnapshot(): VipEntitlementShadowSnapshot {
  return {
    total: snapshot.total,
    stale: snapshot.stale,
    degraded: snapshot.degraded,
    byDriftClass: { ...snapshot.byDriftClass },
    byReasonCode: { ...snapshot.byReasonCode },
    bySource: { ...snapshot.bySource },
    lastObservation: snapshot.lastObservation ? { ...snapshot.lastObservation } : null,
  };
}

export function resetVipEntitlementShadowForTests(): void {
  snapshot.total = 0;
  snapshot.stale = 0;
  snapshot.degraded = 0;
  snapshot.byDriftClass = Object.fromEntries(DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementShadowDriftClass, number>;
  snapshot.byReasonCode = {};
  snapshot.bySource = {};
  snapshot.lastObservation = null;
}

export function assertNoUnsafeVipEntitlementShadowDiagnosticsFields(value: unknown): void {
  const serialized = JSON.stringify(value).toLowerCase();
  const forbidden = ['x-gateway-auth', 'authorization', 'bearer ', 'jwt', 'clerk', 'payment', 'receipt', 'sourceref', 'metadata', 'roles', 'userid'];
  for (const token of forbidden) {
    if (serialized.includes(token)) {
      throw new Error(`Unsafe VIP entitlement shadow diagnostics field leaked: ${token}`);
    }
  }
}
