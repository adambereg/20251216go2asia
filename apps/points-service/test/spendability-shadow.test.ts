import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeSpendabilityShadowDiagnosticsFields,
  evaluateSpendabilityShadow,
  getSpendabilityShadowDiagnosticsSnapshot,
  recordSpendabilityShadowObservation,
  resetSpendabilityShadowDiagnosticsForTests,
  toSpendabilityShadowObservation,
} from '../src/spendabilityShadow';

describe('points spendability shadow model', () => {
  it.each([
    [500, 500, 100, 'aligned_allowed'],
    [50, 50, 100, 'aligned_denied'],
    [500, 50, 100, 'legacy_allowed_target_denied'],
    [50, 500, 100, 'legacy_denied_target_allowed'],
  ] as const)('classifies legacy=%s target=%s amount=%s', (legacySpendable, targetAvailableSpendable, amount, driftClass) => {
    const decision = evaluateSpendabilityShadow({
      legacySpendable,
      targetAvailableSpendable,
      amount,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_1',
      correlationId: 'corr_1',
      now: new Date('2026-05-11T00:00:00.000Z'),
    });

    expect(decision.driftClass).toBe(driftClass);
    expect(decision.auditTraceId).toMatch(/^points_spend_shadow_/);
  });

  it('classifies target stale, unavailable and error states safely', () => {
    const base = {
      legacySpendable: 500,
      amount: 100,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_1',
      correlationId: 'corr_1',
      now: new Date('2026-05-11T00:00:00.000Z'),
    };

    expect(evaluateSpendabilityShadow({ ...base, targetAvailableSpendable: 500, stale: true }).driftClass).toBe('target_stale');
    expect(evaluateSpendabilityShadow({ ...base, targetAvailableSpendable: null }).driftClass).toBe('target_unavailable');
    expect(evaluateSpendabilityShadow({ ...base, targetAvailableSpendable: null, error: true }).driftClass).toBe('target_error');
  });

  it('records aggregate-only diagnostics without unsafe payloads', () => {
    resetSpendabilityShadowDiagnosticsForTests();
    const decision = evaluateSpendabilityShadow({
      legacySpendable: 5200,
      targetAvailableSpendable: 200,
      amount: 5000,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_1',
      correlationId: 'corr_1',
      now: new Date('2026-05-11T00:00:00.000Z'),
    });
    recordSpendabilityShadowObservation(toSpendabilityShadowObservation({ decision, action: 'rf_voucher_claim_spend', amount: 5000 }));

    const snapshot = getSpendabilityShadowDiagnosticsSnapshot();

    expect(snapshot.total).toBe(1);
    expect(snapshot.byDriftClass.legacy_allowed_target_denied).toBe(1);
    expect(snapshot.lastObservation).toMatchObject({
      driftClass: 'legacy_allowed_target_denied',
      amountRange: '5000_plus',
      reasonCode: 'locked_or_conditional_value_may_fund_spend',
    });
    expect(JSON.stringify(snapshot)).not.toContain('user_1');
    expect(JSON.stringify(snapshot)).not.toContain('voucher_1');
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(snapshot)).not.toThrow();
  });
});
