import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeSpendabilityShadowDiagnosticsFields,
  createSpendabilityShadowDedupeKey,
  evaluateSpendabilityShadow,
  exportSpendabilityShadowObservation,
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

  it('exports safe durable compare and duplicate-suppressed events', () => {
    resetSpendabilityShadowDiagnosticsForTests();
    const exported: unknown[] = [];
    const decision = evaluateSpendabilityShadow({
      legacySpendable: 500,
      targetAvailableSpendable: 50,
      amount: 100,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_export',
      correlationId: 'corr_export',
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
      externalId: 'rf:voucher-claim-spend:voucher_export',
      action: 'rf_voucher_claim_spend',
      amount: 100,
    });

    const first = exportSpendabilityShadowObservation({
      observation,
      dedupeKey,
      emit: (event) => exported.push(event),
      exportTimestamp: new Date('2026-05-11T00:01:00.000Z'),
    });
    const second = exportSpendabilityShadowObservation({
      observation,
      dedupeKey,
      emit: (event) => exported.push(event),
      exportTimestamp: new Date('2026-05-11T00:02:00.000Z'),
    });

    expect(first).toMatchObject({ exported: true, reason: 'exported' });
    expect(second).toMatchObject({ exported: false, reason: 'duplicate_suppressed' });
    expect(exported).toHaveLength(2);
    expect(exported[0]).toMatchObject({
      schemaVersion: 'points_spendability_durable_export_v1',
      diagnosticsVersion: 'points_spendability_shadow_diagnostics_v1',
      service: 'points-service',
      environment: 'staging',
      eventType: 'points_spendability_shadow_compare',
      driftClass: 'legacy_allowed_target_denied',
      reasonCode: 'locked_or_conditional_value_may_fund_spend',
      action: 'rf_voucher_claim_spend',
      amountRange: '100_999',
      legacyAllows: true,
      targetAllows: false,
      duplicateSuppressed: false,
      sampled: false,
      sampleRate: 1,
    });
    expect(exported[1]).toMatchObject({
      eventType: 'points_spendability_shadow_duplicate_suppressed',
      duplicateSuppressed: true,
      action: 'rf_voucher_claim_spend',
      amountRange: '100_999',
    });
    expect(JSON.stringify(exported)).not.toContain('user_1');
    expect(JSON.stringify(exported)).not.toContain('voucher_export');
    expect(JSON.stringify(exported)).not.toContain(dedupeKey);
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(exported)).not.toThrow();

    const snapshot = getSpendabilityShadowDiagnosticsSnapshot();
    expect(snapshot.exportedEvents).toBe(1);
    expect(snapshot.exportDuplicateSuppressed).toBe(1);
    expect(snapshot.exportFailures).toBe(0);
  });

  it('captures durable export failures without throwing', () => {
    resetSpendabilityShadowDiagnosticsForTests();
    const decision = evaluateSpendabilityShadow({
      legacySpendable: 500,
      targetAvailableSpendable: 50,
      amount: 100,
      action: 'rf_voucher_claim_spend',
      userId: 'user_1',
      externalId: 'rf:voucher-claim-spend:voucher_export_failure',
      correlationId: 'corr_export_failure',
      now: new Date('2026-05-11T00:00:00.000Z'),
    });
    const observation = toSpendabilityShadowObservation({
      decision,
      action: 'rf_voucher_claim_spend',
      amount: 100,
      environment: 'staging',
    });

    const result = exportSpendabilityShadowObservation({
      observation,
      emit: () => {
        throw new Error('export sink failed');
      },
      exportTimestamp: new Date('2026-05-11T00:01:00.000Z'),
    });

    expect(result).toMatchObject({ exported: false, reason: 'export_failed' });
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(result.event)).not.toThrow();
    expect(getSpendabilityShadowDiagnosticsSnapshot().exportFailures).toBe(1);
  });
});
