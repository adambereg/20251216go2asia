import { describe, expect, it } from 'vitest';

import {
  evaluateProducerGate,
  getProducerClassification,
  type ProducerFlagEnv,
} from '../src/producerAllowlist';

const allInternalBetaFlags: ProducerFlagEnv = {
  ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED: 'true',
  ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED: 'true',
  ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED: 'true',
  ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED: 'true',
  ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED: 'true',
};

describe('Stage 11.2 producer allowlist', () => {
  it('classifies active, internal-beta, future-only and forbidden producers', () => {
    expect(getProducerClassification('registration')).toBe('ACTIVE');
    expect(getProducerClassification('referral_locked')).toBe('ACTIVE');
    expect(getProducerClassification('quest_completed')).toBe('INTERNAL_BETA');
    expect(getProducerClassification('rf_voucher_claim_spend')).toBe('INTERNAL_BETA');
    expect(getProducerClassification('space_post_created')).toBe('FUTURE_ONLY');
    expect(getProducerClassification('rf_voucher_claimed')).toBe('FUTURE_ONLY');
    expect(getProducerClassification('network_accrual_level_1')).toBe('FORBIDDEN_FOR_STAGE_11');
    expect(getProducerClassification('referral_bonus_referrer')).toBe('FORBIDDEN_FOR_STAGE_11');
    expect(getProducerClassification('mock_reward')).toBe('UNKNOWN');
  });

  it('allows active producers without flags only from approved services', () => {
    expect(
      evaluateProducerGate({
        action: 'registration',
        operation: 'add',
        sourceService: 'auth-service',
        env: {},
      }).ok
    ).toBe(true);

    expect(
      evaluateProducerGate({
        action: 'registration',
        operation: 'add',
        sourceService: 'mock-service',
        env: {},
      })
    ).toMatchObject({
      ok: false,
      error: 'PRODUCER_SOURCE_SERVICE_NOT_ALLOWED',
    });
  });

  it('fails closed for internal-beta producers when the required flag is missing', () => {
    expect(
      evaluateProducerGate({
        action: 'quest_completed',
        operation: 'add',
        sourceService: 'quest-service',
        env: {},
      })
    ).toMatchObject({
      ok: false,
      error: 'PRODUCER_INTERNAL_BETA_DISABLED',
      requiredFlag: 'ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED',
    });
  });

  it('allows internal-beta producers only for the right operation and source service', () => {
    expect(
      evaluateProducerGate({
        action: 'rf_voucher_claim_spend',
        operation: 'spend',
        sourceService: 'rf-service',
        env: allInternalBetaFlags,
      }).ok
    ).toBe(true);

    expect(
      evaluateProducerGate({
        action: 'rf_voucher_claim_spend',
        operation: 'add',
        sourceService: 'rf-service',
        env: allInternalBetaFlags,
      })
    ).toMatchObject({
      ok: false,
      error: 'PRODUCER_OPERATION_NOT_ALLOWED',
    });
  });

  it('rejects unknown, future-only and forbidden producers', () => {
    expect(
      evaluateProducerGate({
        action: 'mock_reward',
        operation: 'add',
        sourceService: 'mock-service',
        env: allInternalBetaFlags,
      })
    ).toMatchObject({ ok: false, error: 'UNKNOWN_POINTS_PRODUCER' });

    expect(
      evaluateProducerGate({
        action: 'space_post_created',
        operation: 'add',
        sourceService: 'space-service',
        env: allInternalBetaFlags,
      })
    ).toMatchObject({ ok: false, error: 'PRODUCER_FUTURE_ONLY' });

    expect(
      evaluateProducerGate({
        action: 'network_accrual_level_1',
        operation: 'add',
        sourceService: 'referral-service',
        env: allInternalBetaFlags,
      })
    ).toMatchObject({ ok: false, error: 'PRODUCER_FORBIDDEN_FOR_STAGE_11' });
  });
});
