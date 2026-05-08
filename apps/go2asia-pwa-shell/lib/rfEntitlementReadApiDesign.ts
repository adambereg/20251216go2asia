/**
 * RF Slice 6.2 design-only contracts.
 *
 * This file defines the future entitlement read API and adapter orchestration
 * shape. It is runtime-independent and intentionally not wired into RF,
 * Connect, Wallet, or Blockchain Gateway code paths.
 */

import type {
  EntitlementAction,
  EntitlementCachePolicy,
  EntitlementDecision,
  EntitlementEvaluationMode,
  EntitlementReasonCode,
  EntitlementRequirement,
  EntitlementResource,
  EntitlementSource,
  EntitlementSubject,
} from './rfPremiumEntitlementDesign';

export const rfEntitlementReadApiDesignFlags = {
  enableEntitlementReadApiContract: false,
  enableEntitlementAdapterContracts: false,
  enableEntitlementAuditTraceContract: false,
  enableEntitlementMockAdapters: false,
} as const;

export type EntitlementAdapterHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unavailable'
  | 'timeout'
  | 'stale_cache_only';

export type EntitlementDegradedMode =
  | 'none'
  | 'partial_sources'
  | 'timeout_fallback'
  | 'stale_cache'
  | 'source_unavailable'
  | 'policy_fallback';

export type EntitlementReadWarningCode =
  | 'partial_result'
  | 'stale_result'
  | 'source_timeout'
  | 'source_unavailable'
  | 'audit_trace_omitted'
  | 'safe_label_fallback'
  | 'requested_source_not_configured'
  | 'adapter_health_degraded';

export type EntitlementReadEnvironment = 'local' | 'preview' | 'staging' | 'production';
export type EntitlementReadEvaluationMode = EntitlementEvaluationMode | 'claim_preview';

export interface EntitlementReadTimeoutHints {
  totalTimeoutMs?: number;
  perSourceTimeoutMs?: number;
  allowStaleCache?: boolean;
}

export interface EntitlementReadClientCapabilities {
  canRenderPendingState?: boolean;
  canRenderMissingRequirements?: boolean;
  canRenderSoftVisibility?: boolean;
}

export interface EntitlementReadContext {
  rf?: {
    offerId?: string;
    partnerId?: string;
    listingId?: string | null;
    voucherClass?: 'ordinary' | 'premium';
    offerVisibility?: 'public' | 'pro_only' | 'invite_only' | 'private';
  };
  connect?: {
    milestoneIds?: string[];
    receivedViaProCount?: number;
  };
  clientCapabilities?: EntitlementReadClientCapabilities;
  environment?: EntitlementReadEnvironment;
  featureFlags?: Record<string, boolean>;
}

export interface EntitlementReadRequest {
  requestId: string;
  subject: EntitlementSubject;
  resource: EntitlementResource;
  action: EntitlementAction;
  evaluationMode: EntitlementReadEvaluationMode;
  context?: EntitlementReadContext;
  requestedSources?: EntitlementSource[];
  timeoutHints?: EntitlementReadTimeoutHints;
  includeAuditTrace?: boolean;
  includeSafeLabels?: boolean;
  requestedAt?: string;
}

export interface EntitlementSourceEvaluation {
  source: EntitlementSource;
  adapterId?: string;
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  healthStatus?: EntitlementAdapterHealthStatus;
  stale?: boolean;
  cacheHit?: boolean;
  evaluatedAt?: string;
  expiresAt?: string | null;
}

export interface EntitlementMissingRequirement {
  requirementId?: string;
  source: EntitlementSource;
  reasonCode: EntitlementReasonCode;
  safeLabel?: string;
}

export interface EntitlementPartialResult {
  source: EntitlementSource;
  adapterId?: string;
  reasonCode: Extract<EntitlementReasonCode, 'source_timeout' | 'source_unavailable' | 'unknown_source'>;
  degradedMode: EntitlementDegradedMode;
}

export interface EntitlementReadResponse {
  requestId: string;
  requestWindowId: string;
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  evaluationMode: EntitlementReadEvaluationMode;
  safeLabel?: string;
  evaluatedSources: EntitlementSourceEvaluation[];
  missingRequirements: EntitlementMissingRequirement[];
  warnings: EntitlementReadWarningCode[];
  stale: boolean;
  cacheHit: boolean;
  degradedMode: EntitlementDegradedMode;
  partialResults?: EntitlementPartialResult[];
  evaluatedAt: string;
  expiresAt?: string | null;
  auditTraceId?: string;
}

export interface EntitlementAdapterHealth {
  adapterId: string;
  sourceType: EntitlementSource;
  status: EntitlementAdapterHealthStatus;
  checkedAt: string;
  message?: string;
}

export interface EntitlementAdapterTimeoutPolicy {
  perRequestTimeoutMs: number;
  allowStaleCacheOnTimeout: boolean;
}

export interface EntitlementAdapterEvaluationRequest {
  requestId: string;
  subject: EntitlementSubject;
  resource: EntitlementResource;
  action: EntitlementAction;
  requirement?: EntitlementRequirement;
  context?: EntitlementReadContext;
}

export interface EntitlementAdapterRawFact {
  source: EntitlementSource;
  factKey: string;
  value: string | number | boolean | null;
  observedAt: string;
  expiresAt?: string | null;
}

export interface EntitlementAdapterEvaluationResult {
  adapterId: string;
  source: EntitlementSource;
  rawFacts: EntitlementAdapterRawFact[];
  decisionHint: EntitlementDecision;
  reasonCodeHint: EntitlementReasonCode;
  stale?: boolean;
  cacheHit?: boolean;
  evaluatedAt: string;
  expiresAt?: string | null;
}

export interface EntitlementSourceAdapter {
  adapterId: string;
  sourceType: EntitlementSource;
  supportsActions: EntitlementAction[];
  supportsResources: EntitlementResource['kind'][];
  evaluate(request: EntitlementAdapterEvaluationRequest): Promise<EntitlementAdapterEvaluationResult>;
  health(): Promise<EntitlementAdapterHealth>;
  timeoutPolicy(): EntitlementAdapterTimeoutPolicy;
  cachePolicy(): EntitlementCachePolicy;
}

export interface EntitlementAdapterNormalizedResult {
  source: EntitlementSource;
  adapterId?: string;
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  rawFactsOmitted: true;
  stale: boolean;
  cacheHit: boolean;
  degradedMode: EntitlementDegradedMode;
  evaluatedAt: string;
  expiresAt?: string | null;
}

export interface EntitlementAuditTraceEvent {
  eventId: string;
  source?: EntitlementSource;
  adapterId?: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  healthStatus?: EntitlementAdapterHealthStatus;
  cacheHit?: boolean;
  stale?: boolean;
  degradedMode?: EntitlementDegradedMode;
  reasonCode?: EntitlementReasonCode;
}

export interface EntitlementAuditTrace {
  traceId: string;
  requestId: string;
  requestWindowId: string;
  events: EntitlementAuditTraceEvent[];
  partialEvaluation: boolean;
  degradedSources: EntitlementSource[];
  cacheUsed: boolean;
  createdAt: string;
}

export function isEntitlementDecisionUsable(
  result: Pick<EntitlementReadResponse, 'decision' | 'degradedMode'>,
): boolean {
  return result.decision === 'granted' && result.degradedMode === 'none';
}

export function isEntitlementResultStale(result: Pick<EntitlementReadResponse, 'stale' | 'degradedMode'>): boolean {
  return result.stale || result.degradedMode === 'stale_cache';
}

export function shouldAllowSoftVisibility(
  result: Pick<EntitlementReadResponse, 'decision' | 'evaluationMode' | 'degradedMode'>,
): boolean {
  if (result.evaluationMode !== 'soft_visibility') return false;
  if (result.decision === 'granted') return true;
  return result.decision === 'pending' && ['timeout_fallback', 'stale_cache', 'partial_sources'].includes(result.degradedMode);
}

export function getSafeEntitlementMessage(
  result: Pick<EntitlementReadResponse, 'decision' | 'reasonCode' | 'degradedMode'>,
): string {
  if (result.decision === 'granted') return 'Доступ открыт';
  if (result.decision === 'pending') return 'Проверка выполняется';
  if (result.degradedMode !== 'none') return 'Доступ временно ограничен';
  if (result.reasonCode === 'invite_required') return 'Требуется условие';
  if (result.reasonCode === 'nft_required' || result.reasonCode === 'milestone_required') return 'Требуется условие';
  return 'Премиум-доступ недоступен';
}

export function normalizeAdapterResult(
  result: EntitlementAdapterEvaluationResult,
  healthStatus: EntitlementAdapterHealthStatus = 'healthy',
): EntitlementAdapterNormalizedResult {
  const degradedMode: EntitlementDegradedMode =
    healthStatus === 'timeout'
      ? 'timeout_fallback'
      : healthStatus === 'stale_cache_only' || result.stale
        ? 'stale_cache'
        : healthStatus === 'unavailable'
          ? 'source_unavailable'
          : healthStatus === 'degraded'
            ? 'partial_sources'
            : 'none';

  return {
    source: result.source,
    adapterId: result.adapterId,
    decision: result.decisionHint,
    reasonCode: result.reasonCodeHint,
    rawFactsOmitted: true,
    stale: Boolean(result.stale),
    cacheHit: Boolean(result.cacheHit),
    degradedMode,
    evaluatedAt: result.evaluatedAt,
    expiresAt: result.expiresAt,
  };
}

