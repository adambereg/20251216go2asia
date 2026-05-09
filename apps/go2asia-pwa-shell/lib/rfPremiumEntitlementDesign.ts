/**
 * RF Slice 6/6.1 design-only contracts.
 *
 * This file intentionally contains only experimental, backward-compatible
 * abstractions for future premium voucher gating and entitlement checks.
 * It is not wired into runtime.
 */

export const rfPremiumDesignFlags = {
  enablePremiumVoucherClassification: false,
  enableEntitlementCheckContract: false,
  enableNftGateAbstraction: false,
  enableEntitlementPolicyModel: false,
} as const;

export type RfVoucherClass = 'ordinary' | 'premium';

export type RfPremiumAccessMode =
  | 'entitlement_gated'
  | 'partner_invitation'
  | 'collectible_linked'
  | 'future_exclusive';

export type EntitlementSubject = {
  userId: string;
  roleHints?: string[];
  statusHints?: string[];
  profileHints?: Record<string, string | number | boolean | null>;
  progressHints?: Record<string, string | number | boolean | null>;
};

export type EntitlementResource =
  | {
      kind: 'rf_premium_voucher' | 'rf_offer' | 'rf_listing_offer';
      offerId: string;
      partnerId: string;
      listingId?: string | null;
    }
  | {
      kind: 'partner_invite';
      partnerId: string;
      inviteId?: string | null;
    }
  | {
      kind: 'future_ai_unlock' | 'future_access_pass';
      resourceId: string;
    };

export type EntitlementAction =
  | 'view'
  | 'claim'
  | 'redeem'
  | 'reserve'
  | 'unlock'
  | 'use'
  | 'invite_accept';

export type EntitlementSource =
  | 'role'
  | 'pro_status'
  | 'vip_status'
  | 'pro_invite'
  | 'partner_whitelist'
  | 'connect_milestone'
  | 'nft_totem'
  | 'badge_bridge'
  | 'g2a_threshold'
  | 'manual_grant'
  | 'event_participation'
  | 'unknown';

export type EntitlementDecision =
  | 'granted'
  | 'denied'
  | 'pending'
  | 'unknown'
  | 'not_applicable';

export type EntitlementReasonCode =
  | 'entitlement_granted'
  | 'requirement_missing'
  | 'source_unavailable'
  | 'source_timeout'
  | 'insufficient_status'
  | 'invite_required'
  | 'nft_required'
  | 'milestone_required'
  | 'points_requirement_not_met'
  | 'g2a_threshold_not_met'
  | 'already_used'
  | 'expired'
  | 'temporarily_unavailable'
  | 'policy_not_configured'
  | 'ordinary_resource_no_gate'
  | 'unknown_source'
  | 'source_conflict';

export type EntitlementRequirementKind =
  | 'has_role'
  | 'has_pro_status'
  | 'has_vip_status'
  | 'has_nft_totem'
  | 'has_badge_bridge'
  | 'has_connect_milestone'
  | 'has_partner_invite'
  | 'has_partner_whitelist'
  | 'meets_g2a_threshold'
  | 'completed_event'
  | 'manual_grant_exists';

export type EntitlementPolicyOperator = 'all_of' | 'any_of' | 'none_of' | 'optional';

export type EntitlementEvaluationMode =
  | 'strict'
  | 'soft_visibility'
  | 'claim_enforcement'
  | 'advisory_only';

export type EntitlementFailureMode =
  | 'deny_closed'
  | 'allow_soft_visibility'
  | 'pending_on_timeout'
  | 'use_stale_cache'
  | 'manual_review';

export type EntitlementCacheMode = 'cacheable' | 'stale_while_revalidate' | 'never_cache';

export interface EntitlementCachePolicy {
  mode: EntitlementCacheMode;
  ttlSeconds?: number;
  staleWhileRevalidateSeconds?: number;
}

export interface EntitlementRequirement {
  id: string;
  kind: EntitlementRequirementKind;
  source: EntitlementSource;
  reasonCode?: EntitlementReasonCode;
  params?: Record<string, string | number | boolean | null>;
}

export interface EntitlementPolicy {
  id: string;
  version: number;
  operator: EntitlementPolicyOperator;
  requirements: EntitlementRequirement[];
  evaluationMode: EntitlementEvaluationMode;
  failureMode: EntitlementFailureMode;
  cachePolicy: EntitlementCachePolicy;
  priority?: number;
  fallbackPolicyId?: string | null;
}

export interface EntitlementCheckRequest {
  subject: EntitlementSubject;
  resource: EntitlementResource;
  action: EntitlementAction;
  policyId?: string | null;
  requestId?: string;
  requestedAt?: string;
}

export interface EntitlementCheckResult {
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  sourcesEvaluated: EntitlementSource[];
  grantedSources: EntitlementSource[];
  pendingSources?: EntitlementSource[];
  deniedSources?: EntitlementSource[];
  cachePolicy?: EntitlementCachePolicy;
  evaluatedAt?: string;
  expiresAt?: string | null;
  requestId?: string;
  auditTraceId?: string;
}

export interface EntitlementDecisionSnapshot {
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  policyId?: string | null;
  policyVersion?: number;
  sourcesEvaluated: EntitlementSource[];
  grantedSources: EntitlementSource[];
  evaluatedAt: string;
  expiresAt?: string | null;
  requestId?: string;
}

export type RfEntitlementSource =
  | 'nft_badge'
  | 'pro_status'
  | 'connect_milestone'
  | 'partner_whitelist'
  | 'manual_invite'
  | 'event_participation'
  | 'g2a_threshold_future'
  | 'unknown';

export type RfEntitlementDecision = Extract<EntitlementDecision, 'granted' | 'denied' | 'pending'>;

/**
 * Design-only gate policy metadata attached to premium offers in future slices.
 * This model is optional and non-breaking for ordinary offers.
 */
export interface RfPremiumGatePolicy {
  voucherClass: RfVoucherClass;
  accessMode?: RfPremiumAccessMode;
  requiredSources?: RfEntitlementSource[];
  minSourcesToGrant?: number;
  visibilityRequiresEligibility?: boolean;
}

/**
 * Neutral entitlement check request that avoids wallet/blockchain coupling.
 * Deprecated for new design docs; prefer EntitlementCheckRequest.
 */
export interface RfEntitlementCheckRequest {
  userId: string;
  offerId: string;
  partnerId: string;
  claimScope: 'partner' | 'listing';
  listingId?: string | null;
}

/**
 * RF-facing eligibility result. No chain-specific fields are exposed here.
 * Deprecated for new design docs; prefer EntitlementCheckResult.
 */
export interface RfEntitlementCheckResult {
  decision: RfEntitlementDecision;
  sourcesEvaluated: RfEntitlementSource[];
  grantedSources: RfEntitlementSource[];
  reasonCode?:
    | 'ENTITLEMENT_GRANTED'
    | 'ENTITLEMENT_NOT_FOUND'
    | 'ENTITLEMENT_PENDING'
    | 'ENTITLEMENT_SOURCE_UNAVAILABLE'
    | 'ENTITLEMENT_POLICY_MISMATCH'
    | 'ENTITLEMENT_UNKNOWN';
  expiresAt?: string | null;
}

export function isEntitlementGranted(result: Pick<EntitlementCheckResult, 'decision'>): boolean {
  return result.decision === 'granted';
}

export function isEntitlementPending(result: Pick<EntitlementCheckResult, 'decision'>): boolean {
  return result.decision === 'pending' || result.decision === 'unknown';
}

export function getSafeEntitlementLabel(result: Pick<EntitlementCheckResult, 'decision' | 'reasonCode'>): string {
  if (result.decision === 'granted') return 'Доступ открыт';
  if (result.reasonCode === 'invite_required') return 'Требуется приглашение';
  if (result.reasonCode === 'nft_required') return 'Нужно выполнить условие доступа';
  if (result.reasonCode === 'milestone_required') return 'Нужно выполнить условие';
  if (result.reasonCode === 'source_timeout' || result.reasonCode === 'source_unavailable') {
    return 'Проверка доступа временно недоступна';
  }
  if (result.reasonCode === 'ordinary_resource_no_gate') return 'Обычный доступ';
  if (result.decision === 'pending' || result.decision === 'unknown') return 'Доступ уточняется';
  return 'Премиум-доступ пока недоступен';
}

export function assertNoFinancialVocabularyInEntitlementCopy(copy: string): boolean {
  return !/\b(tx|transaction|hash|chain|balance|payout|compensation|debit|recovery|wallet)\b/i.test(copy);
}

