/**
 * RF Slice 6 design-only contracts.
 *
 * This file intentionally contains only experimental, backward-compatible
 * abstractions for future premium voucher gating. It is not wired into runtime.
 */

export const rfPremiumDesignFlags = {
  enablePremiumVoucherClassification: false,
  enableEntitlementCheckContract: false,
  enableNftGateAbstraction: false,
} as const;

export type RfVoucherClass = 'ordinary' | 'premium';

export type RfPremiumAccessMode =
  | 'entitlement_gated'
  | 'partner_invitation'
  | 'collectible_linked'
  | 'future_exclusive';

export type RfEntitlementSource =
  | 'nft_badge'
  | 'pro_status'
  | 'connect_milestone'
  | 'partner_whitelist'
  | 'manual_invite'
  | 'event_participation'
  | 'g2a_threshold_future'
  | 'unknown';

export type RfEntitlementDecision = 'granted' | 'denied' | 'pending';

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

