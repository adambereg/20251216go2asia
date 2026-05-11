import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeSpendabilityShadowDiagnosticsFields,
  createSpendabilityShadowDedupeKey,
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
    expect(snapshot.countedCompares).toBe(1);
    expect(snapshot.byDriftClass.legacy_allowed_target_denied).toBe(1);
    expect(snapshot.byDiagnosticsVersion.points_spendability_shadow_diagnostics_v1).toBe(1);
    expect(snapshot.lastObservation).toMatchObject({
      diagnosticsVersion: 'points_spendability_shadow_diagnostics_v1',
      driftClass: 'legacy_allowed_target_denied',
      amountRange: '5000_plus',
      environment: 'unknown',
      reasonCode: 'locked_or_conditional_value_may_fund_spend',
    });
    expect(JSON.stringify(snapshot)).not.toContain('user_1');
    expect(JSON.stringify(snapshot)).not.toContain('voucher_1');
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(snapshot)).not.toThrow();
  });

  it('aggregates every drift class by safe operational buckets', () => {
    resetSpendabilityShadowDiagnosticsForTests();
    const cases = [
      [500, 500, 100, undefined, undefined, 'aligned_allowed'],
      [50, 50, 100, undefined, undefined, 'aligned_denied'],
      [500, 50, 100, undefined, undefined, 'legacy_allowed_target_denied'],
      [50, 500, 100, undefined, undefined, 'legacy_denied_target_allowed'],
      [500, null, 100, undefined, undefined, 'target_unavailable'],
      [500, 500, 100, true, undefined, 'target_stale'],
      [500, null, 100, undefined, true, 'target_error'],
    ] as const;

    for (const [legacySpendable, targetAvailableSpendable, amount, stale, error] of cases) {
      const decision = evaluateSpendabilityShadow({
        legacySpendable,
        targetAvailableSpendable,
        amount,
        action: 'rf_voucher_claim_spend',
        userId: 'user_1',
        externalId: `rf:voucher-claim-spend:${amount}:${String(stale)}:${String(error)}`,
        correlationId: 'corr_1',
        stale,
        error,
        now: new Date('2026-05-11T00:00:00.000Z'),
      });
      recordSpendabilityShadowObservation(
        toSpendabilityShadowObservation({
          decision,
          action: 'rf_voucher_claim_spend',
          amount,
          environment: 'staging',
        })
      );
    }

    const snapshot = getSpendabilityShadowDiagnosticsSnapshot();

    expect(snapshot.total).toBe(7);
    expect(snapshot.compareFailures).toBe(1);
    expect(snapshot.targetUnavailable).toBe(1);
    expect(snapshot.stale).toBe(1);
    expect(snapshot.byAction.rf_voucher_claim_spend).toBe(7);
    expect(snapshot.byAmountRange['100_999']).toBe(7);
    expect(snapshot.byEnvironment.staging).toBe(7);
    expect(Object.values(snapshot.byDriftClass)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(snapshot)).not.toThrow();
  });

  it('suppresses duplicate compare keys without exposing dedupe material', () => {
    resetSpendabilityShadowDiagnosticsForTests();
    const decision = evaluateSpendabilityShadow({
      legacySpendable: 500,
      targetAvailableSpendable: 50,
      amount: 100,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_retry',
      correlationId: 'corr_retry',
      now: new Date('2026-05-11T00:00:00.000Z'),
    });
    const observation = toSpendabilityShadowObservation({
      decision,
      action: 'rf_voucher_claim_spend',
      amount: 100,
      environment: 'staging',
    });
    const dedupeKey = createSpendabilityShadowDedupeKey({
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_retry',
      action: 'rf_voucher_claim_spend',
      amount: 100,
    });

    expect(recordSpendabilityShadowObservation(observation, { dedupeKey })).toEqual({
      recorded: true,
      reason: 'recorded',
    });
    expect(recordSpendabilityShadowObservation(observation, { dedupeKey })).toEqual({
      recorded: false,
      reason: 'duplicate_suppressed',
    });

    const snapshot = getSpendabilityShadowDiagnosticsSnapshot();
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.total).toBe(1);
    expect(snapshot.duplicateSuppressed).toBe(1);
    expect(snapshot.byDriftClass.legacy_allowed_target_denied).toBe(1);
    expect(serialized).not.toContain(dedupeKey);
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(snapshot)).not.toThrow();
  });
});
