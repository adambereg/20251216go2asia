import {
  classifyRuntimeFreshness,
  classifyRuntimeIdentitySubjectBinding,
  classifyRuntimeReplayIdempotency,
  classifyRuntimeSourceAuthenticityVersion,
  type FreshnessClassificationLabel,
  type LifecyclePolicyReasonLabel,
  type LifecycleStateLabel,
  type RuntimeFreshnessClassification,
  type RuntimeIdentitySubjectBindingClassification,
  type RuntimeReplayIdempotencyClassification,
  type RuntimeSourceAuthenticityVersionClassification,
  type SubjectBindingLabel,
} from '@go2asia/vip-entitlement-runtime-contracts';

import type { VoucherClaimScope } from './store';

export type VipEntitlementShadowScenario = 'role_mirror' | 'grant' | 'deny' | 'stale' | 'degraded' | 'unknown_source';
export type VipEntitlementSourceReadMode = 'disabled' | 'shadow_read_only';
export type VipEntitlementSourceReadScenario =
  | 'role_mirror'
  | 'grant'
  | 'deny'
  | 'stale'
  | 'degraded'
  | 'source_timeout'
  | 'source_unavailable'
  | 'unknown_source';
export type VipEntitlementDecisionState = 'granted' | 'denied' | 'pending' | 'unknown' | 'not_applicable';
export type VipEntitlementReasonCode =
  | 'entitlement_granted'
  | 'not_found'
  | 'not_started'
  | 'expired'
  | 'revoked'
  | 'refunded'
  | 'cancelled'
  | 'grace_not_enabled'
  | 'source_unavailable'
  | 'source_timeout'
  | 'policy_not_configured'
  | 'stale_cache'
  | 'identity_untrusted'
  | 'role_drift'
  | 'unknown_source';
export type VipEntitlementDecisionSource = 'canonical_entitlement' | 'approved_cache' | 'migration_role_shadow' | 'mock' | 'unknown';
export type VipEntitlementSourceType =
  | 'canonical_entitlement_store'
  | 'approved_cache'
  | 'billing_payment'
  | 'billing_subscription'
  | 'admin_grant'
  | 'promo_campaign'
  | 'migration_import'
  | 'reconciliation'
  | 'migration_role_shadow'
  | 'mock'
  | 'unknown';
export type VipEntitlementAdapterStatus = 'disabled' | 'ok' | 'stale' | 'degraded' | 'timeout' | 'unavailable' | 'unknown_source';
export type VipEntitlementShadowPrincipalType = 'spacer' | 'vip_spacer' | 'pro' | 'admin' | 'unknown';
export type VipEntitlementShadowIdentityContext = {
  trustedSubjectPresent: boolean;
  principalType: VipEntitlementShadowPrincipalType;
  vipRoleSignalPresent: boolean;
  rfPrincipalMatchesShadowSubject: boolean;
  entitlementSubjectPresent: boolean;
  entitlementSubjectMatchesPrincipal: boolean | null;
  identityDowngradeSignal?: boolean;
  crossAccountSignal?: boolean;
  identitySourceState?: 'identity_source_current' | 'identity_source_unknown' | 'identity_source_inconsistent' | 'identity_source_degraded';
};
export type VipEntitlementShadowReplayContext = {
  operationSeenBefore?: boolean;
  idempotentRetry?: boolean;
  payloadMatches?: boolean | null;
  subjectMatches?: boolean | null;
  sourceMatches?: boolean | null;
  lifecycleChanged?: boolean;
  sourceChanged?: boolean;
  policyChanged?: boolean;
  staleReplaySignal?: boolean;
  unsupportedRuntime?: boolean;
  replaySourceState?: 'replay_source_current' | 'replay_source_stale' | 'replay_source_unknown' | 'replay_source_inconsistent';
};
export type VipEntitlementCanonicalDriftClass =
  | 'aligned_granted'
  | 'aligned_denied'
  | 'role_granted_entitlement_denied'
  | 'role_denied_entitlement_granted'
  | 'stale_entitlement'
  | 'unavailable_entitlement'
  | 'degraded_runtime'
  | 'unknown';

export type VipEntitlementDecision = {
  allowed: boolean;
  decision: VipEntitlementDecisionState;
  reasonCode: VipEntitlementReasonCode;
  entitlementId: string | null;
  status: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  stale: boolean;
  degraded: boolean;
  cacheHit: boolean;
  evaluatedAt: string;
  decisionTtlSeconds: number;
  source: VipEntitlementDecisionSource;
  decisionVersion: number;
  auditTraceId: string;
};

export type VipEntitlementShadowDecision = Pick<
  VipEntitlementDecision,
  'allowed' | 'decision' | 'reasonCode' | 'stale' | 'degraded' | 'source' | 'evaluatedAt' | 'decisionVersion' | 'auditTraceId'
>;

export type VipEntitlementSourceReadRequest = {
  requestId: string;
  subject: {
    userId: string;
    trustedIdentityContextPresent: boolean;
  };
  action: 'spend_points' | 'shadow_compare';
  resource: {
    type: 'rf_offer' | 'rf_listing_offer';
    id: string | null;
    scope: 'rf_paid_claim';
  };
  requestedEntitlementKind: 'vip_spend_access';
  evaluationMode: 'shadow_read_only';
  requestedAt: string;
  environment: 'local' | 'test' | 'staging' | 'production' | 'unknown';
  consumerId: 'rf-service';
  featureFlagContext: {
    adapterEnabled: boolean;
    diagnosticsEnabled: boolean;
    enforcementEnabled: false;
  };
  maxSourceLatencyMs: number | null;
  correlationId: string | null;
};

export type VipEntitlementSourceReadResult = VipEntitlementDecision & {
  sourceType: VipEntitlementSourceType;
  adapterStatus: VipEntitlementAdapterStatus;
  adapterVersion: string;
  sourceFresh: boolean;
  sourceAgeMs: number | null;
  sourceLatencyMs: number | null;
  trustedIdentityContextPresent: boolean;
};

export type VipEntitlementSourceReadAdapter = {
  version: string;
  read(input: {
    request: VipEntitlementSourceReadRequest;
    currentRoleAllowed: boolean;
    scenario: VipEntitlementSourceReadScenario;
  }): VipEntitlementSourceReadResult;
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
  canonicalDriftClass: VipEntitlementCanonicalDriftClass;
  runtimeAllowed: boolean;
  entitlementAllowed: boolean;
  reasonCode: VipEntitlementShadowDecision['reasonCode'];
  stale: boolean;
  degraded: boolean;
  source: VipEntitlementShadowDecision['source'];
  claimScope: VoucherClaimScope;
  evaluatedAt: string;
  auditTraceId: string;
  subjectBinding: RuntimeIdentitySubjectBindingClassification;
  replaySemantics: RuntimeReplayIdempotencyClassification;
  sourceRead?: {
    sourceType: VipEntitlementSourceType;
    adapterStatus: VipEntitlementAdapterStatus;
    adapterVersion: string;
    sourceFresh: boolean;
    sourceAgeBucket: 'none' | 'fresh' | 'stale' | 'unknown';
    sourceLatencyBucket: 'none' | 'fast' | 'slow' | 'timeout' | 'unknown';
    decisionVersion: number;
    auditTracePresent: boolean;
    freshness: RuntimeFreshnessClassification;
    sourceClassification: RuntimeSourceAuthenticityVersionClassification;
  };
};

export type VipEntitlementShadowSnapshot = {
  total: number;
  stale: number;
  degraded: number;
  byDriftClass: Record<VipEntitlementShadowDriftClass, number>;
  byCanonicalDriftClass: Record<VipEntitlementCanonicalDriftClass, number>;
  byReasonCode: Partial<Record<VipEntitlementShadowDecision['reasonCode'], number>>;
  bySource: Partial<Record<VipEntitlementShadowDecision['source'], number>>;
  sourceRead: {
    total: number;
    byAdapterStatus: Partial<Record<VipEntitlementAdapterStatus, number>>;
    bySourceType: Partial<Record<VipEntitlementSourceType, number>>;
    byAdapterVersion: Partial<Record<string, number>>;
    byDecisionVersion: Partial<Record<string, number>>;
    auditTracePresent: number;
    auditTraceMissing: number;
  };
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
const CANONICAL_DRIFT_CLASSES: VipEntitlementCanonicalDriftClass[] = [
  'aligned_granted',
  'aligned_denied',
  'role_granted_entitlement_denied',
  'role_denied_entitlement_granted',
  'stale_entitlement',
  'unavailable_entitlement',
  'degraded_runtime',
  'unknown',
];

const snapshot: VipEntitlementShadowSnapshot = {
  total: 0,
  stale: 0,
  degraded: 0,
  byDriftClass: Object.fromEntries(DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementShadowDriftClass, number>,
  byCanonicalDriftClass: Object.fromEntries(CANONICAL_DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementCanonicalDriftClass, number>,
  byReasonCode: {},
  bySource: {},
  sourceRead: {
    total: 0,
    byAdapterStatus: {},
    bySourceType: {},
    byAdapterVersion: {},
    byDecisionVersion: {},
    auditTracePresent: 0,
    auditTraceMissing: 0,
  },
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

export function parseVipEntitlementSourceReadMode(value: string | undefined): VipEntitlementSourceReadMode {
  return value?.trim().toLowerCase() === 'shadow_read_only' ? 'shadow_read_only' : 'disabled';
}

export function parseVipEntitlementSourceReadScenario(value: string | undefined): VipEntitlementSourceReadScenario {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === 'grant' ||
    normalized === 'deny' ||
    normalized === 'stale' ||
    normalized === 'degraded' ||
    normalized === 'source_timeout' ||
    normalized === 'source_unavailable' ||
    normalized === 'unknown_source' ||
    normalized === 'role_mirror'
  ) {
    return normalized;
  }
  return 'role_mirror';
}

function toFullDecision(decision: VipEntitlementShadowDecision): VipEntitlementDecision {
  return {
    ...decision,
    entitlementId: null,
    status: decision.allowed ? 'active' : null,
    startsAt: null,
    expiresAt: null,
    cacheHit: decision.source === 'approved_cache',
    decisionTtlSeconds: 0,
  };
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

export function createVipEntitlementSourceReadRequest(input: {
  userId: string;
  offerId: string;
  claimScope: VoucherClaimScope;
  scopeRef: string | null;
  correlationId: string | null;
  diagnosticsEnabled: boolean;
  trustedIdentityContextPresent?: boolean;
  requestedAt?: Date;
  environment?: VipEntitlementSourceReadRequest['environment'];
}): VipEntitlementSourceReadRequest {
  const requestedAt = nowIso(input.requestedAt);
  return {
    requestId: stableId('vip_source_read_req', `${input.userId}:${input.offerId}:${input.claimScope}:${input.scopeRef ?? ''}:${input.correlationId ?? ''}:${requestedAt}`),
    subject: {
      userId: input.userId,
      trustedIdentityContextPresent: input.trustedIdentityContextPresent ?? true,
    },
    action: 'shadow_compare',
    resource: {
      type: input.claimScope === 'listing' ? 'rf_listing_offer' : 'rf_offer',
      id: input.offerId,
      scope: 'rf_paid_claim',
    },
    requestedEntitlementKind: 'vip_spend_access',
    evaluationMode: 'shadow_read_only',
    requestedAt,
    environment: input.environment ?? 'unknown',
    consumerId: 'rf-service',
    featureFlagContext: {
      adapterEnabled: true,
      diagnosticsEnabled: input.diagnosticsEnabled,
      enforcementEnabled: false,
    },
    maxSourceLatencyMs: null,
    correlationId: input.correlationId,
  };
}

function toSourceReadResult(input: {
  request: VipEntitlementSourceReadRequest;
  decision: VipEntitlementShadowDecision;
  sourceType: VipEntitlementSourceType;
  adapterStatus: VipEntitlementAdapterStatus;
  adapterVersion: string;
  sourceFresh: boolean;
  sourceAgeMs: number | null;
  sourceLatencyMs: number | null;
}): VipEntitlementSourceReadResult {
  return {
    ...toFullDecision(input.decision),
    sourceType: input.sourceType,
    adapterStatus: input.adapterStatus,
    adapterVersion: input.adapterVersion,
    sourceFresh: input.sourceFresh,
    sourceAgeMs: input.sourceAgeMs,
    sourceLatencyMs: input.sourceLatencyMs,
    trustedIdentityContextPresent: input.request.subject.trustedIdentityContextPresent,
  };
}

export function createLocalVipEntitlementSourceReadAdapter(version = 'rf-slice2-shadow-read-v1'): VipEntitlementSourceReadAdapter {
  return {
    version,
    read(input) {
      const evaluatedAt = input.request.requestedAt;
      const auditTraceId = stableId('vip_source_trace', `${input.request.requestId}:${input.scenario}:${evaluatedAt}`);
      const baseDecision = resolveVipEntitlementShadowDecision({
        userId: input.request.subject.userId,
        currentRoleAllowed: input.currentRoleAllowed,
        scenario:
          input.scenario === 'source_timeout' || input.scenario === 'source_unavailable'
            ? 'degraded'
            : input.scenario === 'unknown_source'
              ? 'unknown_source'
              : input.scenario,
        correlationId: input.request.correlationId,
        now: new Date(evaluatedAt),
      });
      const decision: VipEntitlementShadowDecision = {
        ...baseDecision,
        auditTraceId,
        evaluatedAt,
      };

      if (input.scenario === 'source_timeout') {
        return toSourceReadResult({
          request: input.request,
          decision: {
            ...decision,
            allowed: false,
            decision: 'unknown',
            reasonCode: 'source_timeout',
            degraded: true,
            source: 'unknown',
          },
          sourceType: 'unknown',
          adapterStatus: 'timeout',
          adapterVersion: this.version,
          sourceFresh: false,
          sourceAgeMs: null,
          sourceLatencyMs: null,
        });
      }

      if (input.scenario === 'source_unavailable') {
        return toSourceReadResult({
          request: input.request,
          decision: {
            ...decision,
            allowed: false,
            decision: 'unknown',
            reasonCode: 'source_unavailable',
            degraded: true,
            source: 'unknown',
          },
          sourceType: 'unknown',
          adapterStatus: 'unavailable',
          adapterVersion: this.version,
          sourceFresh: false,
          sourceAgeMs: null,
          sourceLatencyMs: null,
        });
      }

      if (input.scenario === 'degraded') {
        return toSourceReadResult({
          request: input.request,
          decision: {
            ...decision,
            allowed: false,
            decision: 'unknown',
            reasonCode: 'role_drift',
            degraded: true,
            source: 'unknown',
          },
          sourceType: 'unknown',
          adapterStatus: 'degraded',
          adapterVersion: this.version,
          sourceFresh: false,
          sourceAgeMs: null,
          sourceLatencyMs: 0,
        });
      }

      return toSourceReadResult({
        request: input.request,
        decision,
        sourceType: decision.source === 'migration_role_shadow' ? 'migration_role_shadow' : decision.source === 'approved_cache' ? 'approved_cache' : decision.source === 'mock' ? 'mock' : 'unknown',
        adapterStatus: decision.stale ? 'stale' : decision.degraded && decision.reasonCode === 'unknown_source' ? 'unknown_source' : decision.degraded ? 'degraded' : 'ok',
        adapterVersion: this.version,
        sourceFresh: !decision.stale && !decision.degraded,
        sourceAgeMs: decision.stale ? 300_000 : 0,
        sourceLatencyMs: 0,
      });
    },
  };
}

export function toVipEntitlementShadowDecisionFromSourceRead(result: VipEntitlementSourceReadResult): VipEntitlementShadowDecision {
  return {
    allowed: result.allowed,
    decision: result.decision,
    reasonCode: result.reasonCode,
    stale: result.stale,
    degraded: result.degraded,
    source: result.source,
    evaluatedAt: result.evaluatedAt,
    decisionVersion: result.decisionVersion,
    auditTraceId: result.auditTraceId,
  };
}

export function isVipEntitlementSourceReadEnforcementCapable(result: VipEntitlementSourceReadResult): boolean {
  return (
    result.allowed &&
    result.decision === 'granted' &&
    result.status === 'active' &&
    !result.stale &&
    !result.degraded &&
    (result.sourceType === 'canonical_entitlement_store' || result.sourceType === 'approved_cache') &&
    (result.source === 'canonical_entitlement' || result.source === 'approved_cache')
  );
}

function getCanonicalDriftClass(input: {
  currentRoleAllowed: boolean;
  decision: VipEntitlementShadowDecision;
  sourceRead?: VipEntitlementSourceReadResult;
}): VipEntitlementCanonicalDriftClass {
  if (input.decision.stale || input.sourceRead?.adapterStatus === 'stale') return 'stale_entitlement';
  if (
    input.decision.reasonCode === 'source_timeout' ||
    input.decision.reasonCode === 'source_unavailable' ||
    input.decision.reasonCode === 'policy_not_configured' ||
    input.sourceRead?.adapterStatus === 'timeout' ||
    input.sourceRead?.adapterStatus === 'unavailable'
  ) {
    return 'unavailable_entitlement';
  }
  if (input.decision.degraded && input.decision.reasonCode !== 'unknown_source') return 'degraded_runtime';
  if (input.decision.reasonCode === 'unknown_source' || input.decision.source === 'unknown' || input.sourceRead?.adapterStatus === 'unknown_source') return 'unknown';
  if (input.currentRoleAllowed && input.decision.allowed) return 'aligned_granted';
  if (!input.currentRoleAllowed && !input.decision.allowed) return 'aligned_denied';
  if (input.currentRoleAllowed && !input.decision.allowed) return 'role_granted_entitlement_denied';
  return 'role_denied_entitlement_granted';
}

function getSourceAgeBucket(sourceAgeMs: number | null): 'none' | 'fresh' | 'stale' | 'unknown' {
  if (sourceAgeMs === null) return 'none';
  if (!Number.isFinite(sourceAgeMs)) return 'unknown';
  return sourceAgeMs <= 60_000 ? 'fresh' : 'stale';
}

function getSourceLatencyBucket(sourceLatencyMs: number | null, adapterStatus: VipEntitlementAdapterStatus): 'none' | 'fast' | 'slow' | 'timeout' | 'unknown' {
  if (adapterStatus === 'timeout') return 'timeout';
  if (sourceLatencyMs === null) return 'none';
  if (!Number.isFinite(sourceLatencyMs)) return 'unknown';
  return sourceLatencyMs <= 250 ? 'fast' : 'slow';
}

function toLifecycleStateLabel(status: string | null): LifecycleStateLabel {
  if (
    status === 'scheduled' ||
    status === 'pending' ||
    status === 'active' ||
    status === 'grace' ||
    status === 'expired' ||
    status === 'revoked' ||
    status === 'refunded' ||
    status === 'cancelled' ||
    status === 'migrated'
  ) {
    return status;
  }
  return 'unknown';
}

function toFreshnessReasonLabel(result: VipEntitlementSourceReadResult): LifecyclePolicyReasonLabel {
  if (result.reasonCode === 'stale_cache') return 'stale_cache';
  if (result.reasonCode === 'source_timeout') return 'source_timeout';
  if (result.reasonCode === 'source_unavailable') return 'source_unavailable';
  if (result.reasonCode === 'policy_not_configured') return 'policy_version_unknown';
  if (result.adapterStatus === 'degraded') return 'source_degraded';
  if (result.adapterStatus === 'unavailable') return 'source_unavailable';
  if (result.adapterStatus === 'timeout') return 'source_timeout';
  if (result.adapterStatus === 'unknown_source') return 'unknown_freshness';
  return result.sourceFresh ? 'active' : 'unknown_freshness';
}

export function classifyVipEntitlementSourceReadFreshness(result: VipEntitlementSourceReadResult): RuntimeFreshnessClassification {
  return classifyRuntimeFreshness({
    sourceFresh: result.sourceFresh,
    sourceAgeMs: result.sourceAgeMs,
    stale: result.stale,
    degraded: result.degraded,
    adapterStatus: result.adapterStatus,
    reason: toFreshnessReasonLabel(result),
    policyVersionLabel: result.reasonCode === 'policy_not_configured' ? 'policy_version_unknown' : 'policy_version_not_applicable',
    lifecycleStateLabel: toLifecycleStateLabel(result.status),
    diagnosticsAvailable: true,
  });
}

function toSourceStateLabel(result: VipEntitlementSourceReadResult): string {
  if (result.adapterStatus === 'timeout') return 'source_timeout';
  if (result.adapterStatus === 'unavailable') return 'source_unavailable';
  if (result.adapterStatus === 'degraded') return 'source_degraded';
  if (result.adapterStatus === 'unknown_source') return 'source_inconsistent';
  return 'source_auth_unknown';
}

export function classifyVipEntitlementSourceReadSource(result: VipEntitlementSourceReadResult): RuntimeSourceAuthenticityVersionClassification {
  return classifyRuntimeSourceAuthenticityVersion({
    sourceType: result.sourceType,
    decisionSource: result.source,
    adapterStatus: result.adapterStatus,
    adapterVersion: result.adapterVersion,
    expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
    decisionVersion: result.decisionVersion,
    expectedDecisionVersion: 1,
    sourceState: toSourceStateLabel(result),
    diagnosticsAvailable: true,
  });
}

function defaultIdentityContext(sourceRead?: VipEntitlementSourceReadResult): VipEntitlementShadowIdentityContext {
  return {
    trustedSubjectPresent: sourceRead?.trustedIdentityContextPresent ?? false,
    principalType: 'unknown',
    vipRoleSignalPresent: false,
    rfPrincipalMatchesShadowSubject: sourceRead !== undefined,
    entitlementSubjectPresent: false,
    entitlementSubjectMatchesPrincipal: null,
    identitySourceState: sourceRead?.trustedIdentityContextPresent ? 'identity_source_current' : 'identity_source_unknown',
  };
}

export function classifyVipEntitlementShadowSubjectBinding(input: {
  identityContext?: VipEntitlementShadowIdentityContext;
  sourceRead?: VipEntitlementSourceReadResult;
}): RuntimeIdentitySubjectBindingClassification {
  const identityContext = input.identityContext ?? defaultIdentityContext(input.sourceRead);
  return classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: identityContext.trustedSubjectPresent,
    rfPrincipalPresent: identityContext.principalType !== 'unknown',
    rfPrincipalMatchesSubject: identityContext.rfPrincipalMatchesShadowSubject,
    entitlementSubjectPresent: identityContext.entitlementSubjectPresent,
    entitlementSubjectMatchesPrincipal: identityContext.entitlementSubjectMatchesPrincipal,
    crossAccountSignal: identityContext.crossAccountSignal,
    identityDowngradeSignal: identityContext.identityDowngradeSignal,
    principalType: identityContext.principalType,
    identitySourceState: identityContext.identitySourceState ?? 'identity_source_current',
    diagnosticsAvailable: true,
  });
}

function toReplaySourceState(sourceRead?: VipEntitlementSourceReadResult): VipEntitlementShadowReplayContext['replaySourceState'] {
  if (!sourceRead) return 'replay_source_unknown';
  if (sourceRead.adapterStatus === 'stale' || sourceRead.stale) return 'replay_source_stale';
  if (sourceRead.adapterStatus === 'unknown_source' || sourceRead.adapterStatus === 'degraded' || sourceRead.adapterStatus === 'timeout' || sourceRead.adapterStatus === 'unavailable') {
    return 'replay_source_inconsistent';
  }
  return 'replay_source_current';
}

export function classifyVipEntitlementShadowReplaySemantics(input: {
  replayContext?: VipEntitlementShadowReplayContext;
  sourceRead?: VipEntitlementSourceReadResult;
  subjectBinding: RuntimeIdentitySubjectBindingClassification;
}): RuntimeReplayIdempotencyClassification {
  const replaySourceState = input.replayContext?.replaySourceState ?? toReplaySourceState(input.sourceRead);
  const freshness: RuntimeFreshnessClassification | undefined = input.sourceRead ? classifyVipEntitlementSourceReadFreshness(input.sourceRead) : undefined;
  return classifyRuntimeReplayIdempotency({
    operationSeenBefore: input.replayContext?.operationSeenBefore ?? false,
    idempotentRetry: input.replayContext?.idempotentRetry ?? false,
    payloadMatches: input.replayContext?.payloadMatches ?? null,
    subjectMatches: input.replayContext?.subjectMatches ?? null,
    sourceMatches: input.replayContext?.sourceMatches ?? null,
    lifecycleChanged: input.replayContext?.lifecycleChanged ?? false,
    sourceChanged: input.replayContext?.sourceChanged ?? false,
    policyChanged: input.replayContext?.policyChanged ?? false,
    staleReplaySignal: input.replayContext?.staleReplaySignal ?? false,
    unsupportedRuntime: input.replayContext?.unsupportedRuntime ?? false,
    replaySourceState,
    lifecycleStateLabel: freshness?.lifecycleStateLabel ?? 'unknown',
    policyVersionLabel: freshness?.policyVersionLabel ?? 'policy_version_not_applicable',
    freshnessClassification: (freshness?.freshnessClassification ?? 'unknown_freshness') as FreshnessClassificationLabel,
    identityBindingLabel: input.subjectBinding.subjectBindingLabel as SubjectBindingLabel,
    identityDowngradeSignal: input.subjectBinding.subjectRelationClass === 'identity_downgrade_detected',
    crossSubjectSignal: input.subjectBinding.subjectRelationClass === 'cross_account_ambiguity',
    diagnosticsAvailable: true,
  });
}

export function compareVipEntitlementShadow(input: {
  currentRoleAllowed: boolean;
  decision: VipEntitlementShadowDecision;
  claimScope: VoucherClaimScope;
  sourceRead?: VipEntitlementSourceReadResult;
  identityContext?: VipEntitlementShadowIdentityContext;
  replayContext?: VipEntitlementShadowReplayContext;
}): VipEntitlementShadowObservation {
  let driftClass: VipEntitlementShadowDriftClass;
  if (input.decision.stale) driftClass = 'stale_shadow';
  else if (input.decision.degraded && input.decision.reasonCode !== 'unknown_source') driftClass = 'degraded_shadow';
  else if (input.decision.source === 'unknown') driftClass = 'unknown_source';
  else if (input.currentRoleAllowed && input.decision.allowed) driftClass = 'aligned_granted';
  else if (!input.currentRoleAllowed && !input.decision.allowed) driftClass = 'aligned_denied';
  else if (input.currentRoleAllowed && !input.decision.allowed) driftClass = 'role_granted_entitlement_denied';
  else driftClass = 'role_denied_entitlement_granted';

  const subjectBinding = classifyVipEntitlementShadowSubjectBinding({
    identityContext: input.identityContext,
    sourceRead: input.sourceRead,
  });

  return {
    driftClass,
    canonicalDriftClass: getCanonicalDriftClass(input),
    runtimeAllowed: input.currentRoleAllowed,
    entitlementAllowed: input.decision.allowed,
    reasonCode: input.decision.reasonCode,
    stale: input.decision.stale,
    degraded: input.decision.degraded,
    source: input.decision.source,
    claimScope: input.claimScope,
    evaluatedAt: input.decision.evaluatedAt,
    auditTraceId: input.decision.auditTraceId,
    subjectBinding,
    replaySemantics: classifyVipEntitlementShadowReplaySemantics({
      replayContext: input.replayContext,
      sourceRead: input.sourceRead,
      subjectBinding,
    }),
    sourceRead: input.sourceRead
      ? {
          sourceType: input.sourceRead.sourceType,
          adapterStatus: input.sourceRead.adapterStatus,
          adapterVersion: input.sourceRead.adapterVersion,
          sourceFresh: input.sourceRead.sourceFresh,
          sourceAgeBucket: getSourceAgeBucket(input.sourceRead.sourceAgeMs),
          sourceLatencyBucket: getSourceLatencyBucket(input.sourceRead.sourceLatencyMs, input.sourceRead.adapterStatus),
          decisionVersion: input.sourceRead.decisionVersion,
          auditTracePresent: input.sourceRead.auditTraceId.trim().length > 0,
          freshness: classifyVipEntitlementSourceReadFreshness(input.sourceRead),
          sourceClassification: classifyVipEntitlementSourceReadSource(input.sourceRead),
        }
      : undefined,
  };
}

export function recordVipEntitlementShadowObservation(observation: VipEntitlementShadowObservation): void {
  snapshot.total += 1;
  if (observation.stale) snapshot.stale += 1;
  if (observation.degraded) snapshot.degraded += 1;
  snapshot.byDriftClass[observation.driftClass] += 1;
  snapshot.byCanonicalDriftClass[observation.canonicalDriftClass] += 1;
  snapshot.byReasonCode[observation.reasonCode] = (snapshot.byReasonCode[observation.reasonCode] ?? 0) + 1;
  snapshot.bySource[observation.source] = (snapshot.bySource[observation.source] ?? 0) + 1;
  if (observation.sourceRead) {
    snapshot.sourceRead.total += 1;
    snapshot.sourceRead.byAdapterStatus[observation.sourceRead.adapterStatus] = (snapshot.sourceRead.byAdapterStatus[observation.sourceRead.adapterStatus] ?? 0) + 1;
    snapshot.sourceRead.bySourceType[observation.sourceRead.sourceType] = (snapshot.sourceRead.bySourceType[observation.sourceRead.sourceType] ?? 0) + 1;
    snapshot.sourceRead.byAdapterVersion[observation.sourceRead.adapterVersion] = (snapshot.sourceRead.byAdapterVersion[observation.sourceRead.adapterVersion] ?? 0) + 1;
    const decisionVersion = String(observation.sourceRead.decisionVersion);
    snapshot.sourceRead.byDecisionVersion[decisionVersion] = (snapshot.sourceRead.byDecisionVersion[decisionVersion] ?? 0) + 1;
    if (observation.sourceRead.auditTracePresent) snapshot.sourceRead.auditTracePresent += 1;
    else snapshot.sourceRead.auditTraceMissing += 1;
  }
  const { runtimeAllowed: _runtimeAllowed, entitlementAllowed: _entitlementAllowed, ...safeObservation } = observation;
  snapshot.lastObservation = safeObservation;
}

export function getVipEntitlementShadowSnapshot(): VipEntitlementShadowSnapshot {
  return {
    total: snapshot.total,
    stale: snapshot.stale,
    degraded: snapshot.degraded,
    byDriftClass: { ...snapshot.byDriftClass },
    byCanonicalDriftClass: { ...snapshot.byCanonicalDriftClass },
    byReasonCode: { ...snapshot.byReasonCode },
    bySource: { ...snapshot.bySource },
    sourceRead: {
      total: snapshot.sourceRead.total,
      byAdapterStatus: { ...snapshot.sourceRead.byAdapterStatus },
      bySourceType: { ...snapshot.sourceRead.bySourceType },
      byAdapterVersion: { ...snapshot.sourceRead.byAdapterVersion },
      byDecisionVersion: { ...snapshot.sourceRead.byDecisionVersion },
      auditTracePresent: snapshot.sourceRead.auditTracePresent,
      auditTraceMissing: snapshot.sourceRead.auditTraceMissing,
    },
    lastObservation: snapshot.lastObservation ? { ...snapshot.lastObservation } : null,
  };
}

export function resetVipEntitlementShadowForTests(): void {
  snapshot.total = 0;
  snapshot.stale = 0;
  snapshot.degraded = 0;
  snapshot.byDriftClass = Object.fromEntries(DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementShadowDriftClass, number>;
  snapshot.byCanonicalDriftClass = Object.fromEntries(CANONICAL_DRIFT_CLASSES.map((item) => [item, 0])) as Record<VipEntitlementCanonicalDriftClass, number>;
  snapshot.byReasonCode = {};
  snapshot.bySource = {};
  snapshot.sourceRead = {
    total: 0,
    byAdapterStatus: {},
    bySourceType: {},
    byAdapterVersion: {},
    byDecisionVersion: {},
    auditTracePresent: 0,
    auditTraceMissing: 0,
  };
  snapshot.lastObservation = null;
}

export function assertNoUnsafeVipEntitlementShadowDiagnosticsFields(value: unknown): void {
  const serialized = JSON.stringify(value).toLowerCase();
  const forbidden = [
    'x-gateway-auth',
    'authorization',
    'bearer ',
    'jwt',
    'clerk',
    'payment',
    'receipt',
    'sourceref',
    'source_ref',
    'metadata',
    'roles',
    'userid',
    'email',
    'ledger',
    'transaction',
    'externalid',
    'external_id',
    'correlation',
    'dedupe',
    'settlement',
    'on-chain',
  ];
  for (const token of forbidden) {
    if (serialized.includes(token)) {
      throw new Error(`Unsafe VIP entitlement shadow diagnostics field leaked: ${token}`);
    }
  }
}
