export type ProducerClassification = 'ACTIVE' | 'INTERNAL_BETA' | 'FUTURE_ONLY' | 'FORBIDDEN_FOR_STAGE_11';

export type ProducerOperation = 'add' | 'spend';

export type ProducerGateDecision =
  | {
      ok: true;
      classification: 'ACTIVE' | 'INTERNAL_BETA';
      action: string;
    }
  | {
      ok: false;
      classification: ProducerClassification | 'UNKNOWN';
      action: string;
      error: string;
      message: string;
      status: number;
      requiredFlag?: string;
    };

export type ProducerFlagEnv = {
  ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED?: string;
  ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED?: string;
  ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED?: string;
  ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED?: string;
  ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED?: string;
};

const PRODUCER_ALLOWLIST_VERSION = 'stage_11_2_producer_allowlist_v1';

const PRODUCER_CLASSIFICATION: Record<string, ProducerClassification> = {
  registration: 'ACTIVE',
  referral_locked: 'ACTIVE',

  first_login: 'INTERNAL_BETA',
  quest_completed: 'INTERNAL_BETA',
  event_registration: 'INTERNAL_BETA',
  rf_voucher_claim_spend: 'INTERNAL_BETA',
  rf_voucher_claim_spend_compensation: 'INTERNAL_BETA',

  space_post_created: 'FUTURE_ONLY',
  space_repost_created: 'FUTURE_ONLY',
  space_reaction_created: 'FUTURE_ONLY',
  rielt_listing_created: 'FUTURE_ONLY',
  rf_partner_verified: 'FUTURE_ONLY',
  rf_voucher_claimed: 'FUTURE_ONLY',
  rf_voucher_redeemed: 'FUTURE_ONLY',

  network_accrual_level_1: 'FORBIDDEN_FOR_STAGE_11',
  network_accrual_level_2: 'FORBIDDEN_FOR_STAGE_11',
  referral_bonus_referee: 'FORBIDDEN_FOR_STAGE_11',
  referral_bonus_referrer: 'FORBIDDEN_FOR_STAGE_11',
  referral_unlock: 'FORBIDDEN_FOR_STAGE_11',
};

const ACTION_OPERATION: Record<string, ProducerOperation> = {
  registration: 'add',
  referral_locked: 'add',
  first_login: 'add',
  quest_completed: 'add',
  event_registration: 'add',
  rf_voucher_claim_spend: 'spend',
  rf_voucher_claim_spend_compensation: 'add',
};

const INTERNAL_BETA_FLAGS: Partial<Record<string, keyof ProducerFlagEnv>> = {
  first_login: 'ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED',
  quest_completed: 'ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED',
  event_registration: 'ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED',
  rf_voucher_claim_spend: 'ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED',
  rf_voucher_claim_spend_compensation: 'ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED',
};

const PRODUCER_CALLERS: Record<string, readonly string[]> = {
  registration: ['auth-service'],
  first_login: ['auth-service'],
  referral_locked: ['referral-service'],
  quest_completed: ['quest-service'],
  event_registration: ['content-service'],
  rf_voucher_claim_spend: ['rf-service'],
  rf_voucher_claim_spend_compensation: ['rf-service'],
};

export function getProducerAllowlistVersion(): string {
  return PRODUCER_ALLOWLIST_VERSION;
}

export function getProducerClassification(action: string): ProducerClassification | 'UNKNOWN' {
  return PRODUCER_CLASSIFICATION[action] ?? 'UNKNOWN';
}

export function getKnownProducerActions(): string[] {
  return Object.keys(PRODUCER_CLASSIFICATION);
}

function isFlagEnabled(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function evaluateProducerGate(input: {
  action: string;
  operation: ProducerOperation;
  sourceService: string;
  env: ProducerFlagEnv;
}): ProducerGateDecision {
  const classification = getProducerClassification(input.action);

  if (classification === 'UNKNOWN') {
    return reject(input.action, 'UNKNOWN', 'UNKNOWN_POINTS_PRODUCER', 'Unknown points producer', 400);
  }

  if (classification === 'FUTURE_ONLY') {
    return reject(input.action, classification, 'PRODUCER_FUTURE_ONLY', 'Points producer is future-only for Stage 11', 403);
  }

  if (classification === 'FORBIDDEN_FOR_STAGE_11') {
    return reject(
      input.action,
      classification,
      'PRODUCER_FORBIDDEN_FOR_STAGE_11',
      'Points producer is forbidden for Stage 11',
      403
    );
  }

  const expectedOperation = ACTION_OPERATION[input.action];
  if (expectedOperation !== input.operation) {
    return reject(input.action, classification, 'PRODUCER_OPERATION_NOT_ALLOWED', 'Producer is not allowed on this Points operation', 400);
  }

  const allowedCallers = PRODUCER_CALLERS[input.action] ?? [];
  if (!allowedCallers.includes(input.sourceService)) {
    return reject(
      input.action,
      classification,
      'PRODUCER_SOURCE_SERVICE_NOT_ALLOWED',
      'Source service is not allowed for this Points producer',
      403
    );
  }

  if (classification === 'INTERNAL_BETA') {
    const requiredFlag = INTERNAL_BETA_FLAGS[input.action];
    if (!requiredFlag || !isFlagEnabled(input.env[requiredFlag])) {
      return reject(
        input.action,
        classification,
        'PRODUCER_INTERNAL_BETA_DISABLED',
        'Internal-beta Points producer is disabled',
        403,
        requiredFlag
      );
    }
  }

  return { ok: true, classification, action: input.action };
}

function reject(
  action: string,
  classification: ProducerClassification | 'UNKNOWN',
  error: string,
  message: string,
  status: number,
  requiredFlag?: string
): ProducerGateDecision {
  return {
    ok: false,
    classification,
    action,
    error,
    message,
    status,
    requiredFlag,
  };
}
