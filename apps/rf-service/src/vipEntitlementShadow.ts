import {
  classifyRuntimeFreshness,
  classifyRuntimeIdentitySubjectBinding,
  classifyRuntimeReplayIdempotency,
  classifyRuntimeSourceAuthenticityVersion,
  resolveRuntimeSourceAvailabilityGuardSkeleton,
  resolveRuntimeStagingEnvelopeSkeleton,
  type FreshnessClassificationLabel,
  type LifecyclePolicyReasonLabel,
  type LifecycleStateLabel,
  type RuntimeFreshnessClassification,
  type RuntimeIdentitySubjectBindingClassification,
  type RuntimeReplayIdempotencyClassification,
  type RuntimeSourceAvailabilityGuardSkeleton,
  type RuntimeSourceAuthenticityVersionClassification,
  type RuntimeStagingEnvelopeSkeleton,
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
export type VipEntitlementReplayObservationScope =
  | 'rf_paid_claim_shadow_observation'
  | 'rf_paid_claim_idempotency_lookup'
  | 'rf_paid_claim_repeat_policy_barrier'
  | 'replay_context_not_observed'
  | 'replay_context_unsupported';
export type VipEntitlementReplayOutcomeBucket =
  | 'first_seen_operation'
  | 'idempotent_retry_observed'
  | 'context_mismatch_observed'
  | 'repeat_policy_barrier_observed'
  | 'replay_context_not_observed'
  | 'replay_context_unsupported';
export type VipEntitlementReplayConfidenceBucket = 'observed_from_rf_idempotency' | 'observed_from_repeat_policy' | 'observed_from_shadow_entry' | 'not_observed' | 'unsupported';
export type VipEntitlementReplayGovernanceGradeStatus = 'rf_idempotency_partial_not_governance_grade' | 'not_governance_grade_replay_runtime';
export type VipEntitlementRfIdempotencyCoverageStatus =
  | 'rf_idempotency_outcome_observed'
  | 'rf_repeat_policy_barrier_observed'
  | 'rf_idempotency_context_not_observed'
  | 'rf_idempotency_unsupported_for_governance_grade_replay';
export type VipEntitlementReplayOutcomeContext = {
  replayOutcomeBucket: VipEntitlementReplayOutcomeBucket;
  replayObservationScope?: VipEntitlementReplayObservationScope;
};
export type VipEntitlementReplayOutcomeSummary = {
  replayObservationScope: VipEntitlementReplayObservationScope;
  replayOutcomeBucket: VipEntitlementReplayOutcomeBucket;
  replayContextObserved: boolean;
  replayConfidence: VipEntitlementReplayConfidenceBucket;
  replayGovernanceGradeStatus: VipEntitlementReplayGovernanceGradeStatus;
  rfIdempotencyCoverageStatus: VipEntitlementRfIdempotencyCoverageStatus;
};
export type VipEntitlementStagingEnvelopeContext = {
  requestedEnvelopeEnabled?: boolean;
  requestedRuntimeEnabled?: boolean;
  requestedAuthorityEnabled?: boolean;
  requestedProductionRoutingEnabled?: boolean;
  requestedFailClosedEnabled?: boolean;
  requestedReplayRejectionEnabled?: boolean;
  requestedCacheInvalidationEnabled?: boolean;
  namedScopePresent?: boolean;
  safeActorsPresent?: boolean;
  safeWindowPresent?: boolean;
};
export type VipEntitlementSourceAvailabilityGuardContext = {
  requestedGuardEnabled?: boolean;
  requestedFailClosedEnabled?: boolean;
  requestedProductionRoutingEnabled?: boolean;
  requestedAuthorityEnabled?: boolean;
  requestedReplayRejectionEnabled?: boolean;
  requestedInvalidationEnabled?: boolean;
};
export type VipEntitlementFailClosedInputSummary = {
  failClosedCandidateInputStatus: 'candidate_inputs_observed_partial' | 'candidate_inputs_missing_source_read' | 'candidate_inputs_unsupported_without_runtime';
  failClosedInputCompleteness: 'partial_shadow_inputs_only' | 'missing_authoritative_inputs' | 'unsupported_without_runtime_change';
  failClosedInputAuthorityStatus: 'shadow_only_not_authoritative';
  failClosedDiagnosticsIndependenceStatus: 'diagnostics_non_authoritative_not_runtime_input';
  failClosedCandidateReadiness: 'not_ready_shadow_summary_only';
  freshnessInputStatus: 'freshness_observed' | 'freshness_missing' | 'freshness_inconclusive';
  sourceInputStatus: 'source_observed' | 'source_missing' | 'source_inconclusive';
  identityInputStatus: 'identity_observed' | 'identity_inconclusive';
  replayInputStatus: 'replay_outcome_observed' | 'replay_context_not_observed' | 'replay_context_unsupported';
  stagingEnvelopeStatus: 'disabled_not_activated';
  diagnosticsInputStatus: 'diagnostics_available_non_authoritative';
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
  replayOutcome: VipEntitlementReplayOutcomeSummary;
  subjectBinding: RuntimeIdentitySubjectBindingClassification;
  replaySemantics: RuntimeReplayIdempotencyClassification;
  stagingEnvelope: RuntimeStagingEnvelopeSkeleton;
  sourceAvailabilityGuard: RuntimeSourceAvailabilityGuardSkeleton;
  failClosedInputSummary: VipEntitlementFailClosedInputSummary;
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

export function resolveVipEntitlementReplayOutcome(input: {
  replayOutcomeContext?: VipEntitlementReplayOutcomeContext;
  replayContext?: VipEntitlementShadowReplayContext;
} = {}): VipEntitlementReplayOutcomeSummary {
  const replayOutcomeBucket =
    input.replayOutcomeContext?.replayOutcomeBucket ??
    (input.replayContext?.idempotentRetry === true
      ? 'idempotent_retry_observed'
      : input.replayContext
        ? 'first_seen_operation'
        : 'replay_context_not_observed');
  const replayObservationScope =
    input.replayOutcomeContext?.replayObservationScope ??
    (replayOutcomeBucket === 'idempotent_retry_observed' || replayOutcomeBucket === 'context_mismatch_observed'
      ? 'rf_paid_claim_idempotency_lookup'
      : replayOutcomeBucket === 'repeat_policy_barrier_observed'
        ? 'rf_paid_claim_repeat_policy_barrier'
        : replayOutcomeBucket === 'replay_context_unsupported'
          ? 'replay_context_unsupported'
          : replayOutcomeBucket === 'replay_context_not_observed'
            ? 'replay_context_not_observed'
            : 'rf_paid_claim_shadow_observation');
  const replayContextObserved = replayOutcomeBucket !== 'replay_context_not_observed' && replayOutcomeBucket !== 'replay_context_unsupported';
  const replayConfidence: VipEntitlementReplayConfidenceBucket =
    replayOutcomeBucket === 'idempotent_retry_observed' || replayOutcomeBucket === 'context_mismatch_observed'
      ? 'observed_from_rf_idempotency'
      : replayOutcomeBucket === 'repeat_policy_barrier_observed'
        ? 'observed_from_repeat_policy'
        : replayOutcomeBucket === 'first_seen_operation'
          ? 'observed_from_shadow_entry'
          : replayOutcomeBucket === 'replay_context_unsupported'
            ? 'unsupported'
            : 'not_observed';
  const rfIdempotencyCoverageStatus: VipEntitlementRfIdempotencyCoverageStatus =
    replayOutcomeBucket === 'idempotent_retry_observed' || replayOutcomeBucket === 'context_mismatch_observed'
      ? 'rf_idempotency_outcome_observed'
      : replayOutcomeBucket === 'repeat_policy_barrier_observed'
        ? 'rf_repeat_policy_barrier_observed'
        : replayOutcomeBucket === 'replay_context_unsupported'
          ? 'rf_idempotency_unsupported_for_governance_grade_replay'
          : 'rf_idempotency_context_not_observed';

  return {
    replayObservationScope,
    replayOutcomeBucket,
    replayContextObserved,
    replayConfidence,
    replayGovernanceGradeStatus: 'rf_idempotency_partial_not_governance_grade',
    rfIdempotencyCoverageStatus,
  };
}

function replayContextFromOutcome(replayOutcome: VipEntitlementReplayOutcomeSummary): VipEntitlementShadowReplayContext | undefined {
  if (replayOutcome.replayOutcomeBucket === 'idempotent_retry_observed') {
    return {
      operationSeenBefore: true,
      idempotentRetry: true,
      payloadMatches: true,
      subjectMatches: true,
      sourceMatches: true,
      lifecycleChanged: false,
      policyChanged: false,
    };
  }
  if (replayOutcome.replayOutcomeBucket === 'context_mismatch_observed') {
    return {
      operationSeenBefore: true,
      payloadMatches: false,
      sourceMatches: false,
    };
  }
  if (replayOutcome.replayOutcomeBucket === 'repeat_policy_barrier_observed') {
    return {
      operationSeenBefore: true,
      idempotentRetry: false,
    };
  }
  if (replayOutcome.replayOutcomeBucket === 'replay_context_unsupported') {
    return {
      unsupportedRuntime: true,
    };
  }
  if (replayOutcome.replayOutcomeBucket === 'first_seen_operation') {
    return {
      operationSeenBefore: false,
      idempotentRetry: false,
    };
  }
  return undefined;
}

export function resolveVipEntitlementStagingEnvelopeSkeleton(input: {
  stagingEnvelopeContext?: VipEntitlementStagingEnvelopeContext;
} = {}): RuntimeStagingEnvelopeSkeleton {
  return resolveRuntimeStagingEnvelopeSkeleton({
    requestedEnvelopeEnabled: input.stagingEnvelopeContext?.requestedEnvelopeEnabled ?? false,
    requestedRuntimeEnabled: input.stagingEnvelopeContext?.requestedRuntimeEnabled ?? false,
    requestedAuthorityEnabled: input.stagingEnvelopeContext?.requestedAuthorityEnabled ?? false,
    requestedProductionRoutingEnabled: input.stagingEnvelopeContext?.requestedProductionRoutingEnabled ?? false,
    requestedFailClosedEnabled: input.stagingEnvelopeContext?.requestedFailClosedEnabled ?? false,
    requestedReplayRejectionEnabled: input.stagingEnvelopeContext?.requestedReplayRejectionEnabled ?? false,
    requestedCacheInvalidationEnabled: input.stagingEnvelopeContext?.requestedCacheInvalidationEnabled ?? false,
    namedScopePresent: input.stagingEnvelopeContext?.namedScopePresent ?? false,
    safeActorsPresent: input.stagingEnvelopeContext?.safeActorsPresent ?? false,
    safeWindowPresent: input.stagingEnvelopeContext?.safeWindowPresent ?? false,
    diagnosticsAvailable: true,
  });
}

function sourceAvailabilitySignalFromSourceRead(sourceRead?: VipEntitlementSourceReadResult): string | undefined {
  if (!sourceRead) return undefined;
  if (sourceRead.adapterStatus === 'timeout' || sourceRead.reasonCode === 'source_timeout') return 'source_timeout';
  if (sourceRead.adapterStatus === 'unavailable' || sourceRead.reasonCode === 'source_unavailable') return 'source_unavailable';
  if (sourceRead.adapterStatus === 'degraded') return 'source_degraded';
  if (sourceRead.adapterStatus === 'unknown_source') return 'source_inconsistent';
  return undefined;
}

export function resolveVipEntitlementSourceAvailabilityGuardSkeleton(input: {
  sourceRead?: VipEntitlementSourceReadResult;
  guardContext?: VipEntitlementSourceAvailabilityGuardContext;
} = {}): RuntimeSourceAvailabilityGuardSkeleton {
  return resolveRuntimeSourceAvailabilityGuardSkeleton({
    sourceAvailabilitySignal: sourceAvailabilitySignalFromSourceRead(input.sourceRead),
    requestedGuardEnabled: input.guardContext?.requestedGuardEnabled ?? false,
    requestedFailClosedEnabled: input.guardContext?.requestedFailClosedEnabled ?? false,
    requestedProductionRoutingEnabled: input.guardContext?.requestedProductionRoutingEnabled ?? false,
    requestedAuthorityEnabled: input.guardContext?.requestedAuthorityEnabled ?? false,
    requestedReplayRejectionEnabled: input.guardContext?.requestedReplayRejectionEnabled ?? false,
    requestedInvalidationEnabled: input.guardContext?.requestedInvalidationEnabled ?? false,
    diagnosticsAvailable: true,
  });
}

export function resolveVipEntitlementFailClosedInputSummary(input: {
  sourceRead?: VipEntitlementSourceReadResult;
  subjectBinding: RuntimeIdentitySubjectBindingClassification;
  replayOutcome: VipEntitlementReplayOutcomeSummary;
  stagingEnvelope: RuntimeStagingEnvelopeSkeleton;
}): VipEntitlementFailClosedInputSummary {
  const freshness = input.sourceRead ? classifyVipEntitlementSourceReadFreshness(input.sourceRead) : undefined;
  const sourceClassification = input.sourceRead ? classifyVipEntitlementSourceReadSource(input.sourceRead) : undefined;
  const unsupportedReplay = input.replayOutcome.replayOutcomeBucket === 'replay_context_unsupported';
  const unsupportedSource =
    freshness?.freshnessClassification === 'unsupported_without_runtime_change' ||
    sourceClassification?.sourceConsistencyClass === 'unsupported_without_runtime_change' ||
    sourceClassification?.sourceAuthenticityClass === 'unsupported_without_runtime_change';
  const candidateInputsUnsupported = unsupportedReplay || unsupportedSource;

  return {
    failClosedCandidateInputStatus: candidateInputsUnsupported ? 'candidate_inputs_unsupported_without_runtime' : input.sourceRead ? 'candidate_inputs_observed_partial' : 'candidate_inputs_missing_source_read',
    failClosedInputCompleteness: candidateInputsUnsupported ? 'unsupported_without_runtime_change' : input.sourceRead ? 'partial_shadow_inputs_only' : 'missing_authoritative_inputs',
    failClosedInputAuthorityStatus: 'shadow_only_not_authoritative',
    failClosedDiagnosticsIndependenceStatus: 'diagnostics_non_authoritative_not_runtime_input',
    failClosedCandidateReadiness: 'not_ready_shadow_summary_only',
    freshnessInputStatus: freshness
      ? freshness.actualResultClass === 'passed_for_observation_only'
        ? 'freshness_observed'
        : 'freshness_inconclusive'
      : 'freshness_missing',
    sourceInputStatus: sourceClassification
      ? sourceClassification.actualResultClass === 'passed_for_observation_only'
        ? 'source_observed'
        : 'source_inconclusive'
      : 'source_missing',
    identityInputStatus: input.subjectBinding.actualResultClass === 'passed_for_observation_only' ? 'identity_observed' : 'identity_inconclusive',
    replayInputStatus: unsupportedReplay ? 'replay_context_unsupported' : input.replayOutcome.replayContextObserved ? 'replay_outcome_observed' : 'replay_context_not_observed',
    stagingEnvelopeStatus: 'disabled_not_activated',
    diagnosticsInputStatus: 'diagnostics_available_non_authoritative',
  };
}

export function compareVipEntitlementShadow(input: {
  currentRoleAllowed: boolean;
  decision: VipEntitlementShadowDecision;
  claimScope: VoucherClaimScope;
  sourceRead?: VipEntitlementSourceReadResult;
  identityContext?: VipEntitlementShadowIdentityContext;
  replayContext?: VipEntitlementShadowReplayContext;
  replayOutcomeContext?: VipEntitlementReplayOutcomeContext;
  stagingEnvelopeContext?: VipEntitlementStagingEnvelopeContext;
  sourceAvailabilityGuardContext?: VipEntitlementSourceAvailabilityGuardContext;
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
  const replayOutcome = resolveVipEntitlementReplayOutcome({
    replayOutcomeContext: input.replayOutcomeContext,
    replayContext: input.replayContext,
  });
  const replayContext = input.replayContext ?? replayContextFromOutcome(replayOutcome);
  const stagingEnvelope = resolveVipEntitlementStagingEnvelopeSkeleton({
    stagingEnvelopeContext: input.stagingEnvelopeContext,
  });
  const sourceAvailabilityGuard = resolveVipEntitlementSourceAvailabilityGuardSkeleton({
    sourceRead: input.sourceRead,
    guardContext: input.sourceAvailabilityGuardContext,
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
    replayOutcome,
    subjectBinding,
    replaySemantics: classifyVipEntitlementShadowReplaySemantics({
      replayContext,
      sourceRead: input.sourceRead,
      subjectBinding,
    }),
    stagingEnvelope,
    sourceAvailabilityGuard,
    failClosedInputSummary: resolveVipEntitlementFailClosedInputSummary({
      sourceRead: input.sourceRead,
      subjectBinding,
      replayOutcome,
      stagingEnvelope,
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
  // Guard against sensitive key leakage without false-positives from random ids/hashes.
  const forbiddenKeyPatterns: ReadonlyArray<{ label: string; pattern: RegExp }> = [
    { label: 'x-gateway-auth', pattern: /"x-gateway-auth"\s*:/ },
    { label: 'authorization', pattern: /"authorization"\s*:/ },
    { label: 'jwt', pattern: /"jwt"\s*:/ },
    { label: 'clerk', pattern: /"clerk"\s*:/ },
    { label: 'payment', pattern: /"payment"\s*:/ },
    { label: 'receipt', pattern: /"receipt"\s*:/ },
    { label: 'sourceref', pattern: /"sourceref"\s*:/ },
    { label: 'source_ref', pattern: /"source_ref"\s*:/ },
    { label: 'metadata', pattern: /"metadata"\s*:/ },
    { label: 'roles', pattern: /"roles"\s*:/ },
    { label: 'userid', pattern: /"userid"\s*:/ },
    { label: 'email', pattern: /"email"\s*:/ },
    { label: 'ledger', pattern: /"ledger"\s*:/ },
    { label: 'transaction', pattern: /"transaction"\s*:/ },
    { label: 'externalid', pattern: /"externalid"\s*:/ },
    { label: 'external_id', pattern: /"external_id"\s*:/ },
    { label: 'correlation', pattern: /"correlation"\s*:/ },
    { label: 'dedupe', pattern: /"dedupe"\s*:/ },
    { label: 'settlement', pattern: /"settlement"\s*:/ },
    { label: 'on-chain', pattern: /"on-chain"\s*:/ },
  ];
  for (const { label, pattern } of forbiddenKeyPatterns) {
    if (pattern.test(serialized)) {
      throw new Error(`Unsafe VIP entitlement shadow diagnostics field leaked: ${label}`);
    }
  }
  if (/\bbearer\s+[a-z0-9\-_]+\.[a-z0-9\-_]+\.[a-z0-9\-_]+\b/.test(serialized)) {
    throw new Error('Unsafe VIP entitlement shadow diagnostics field leaked: bearer-token');
  }
}
