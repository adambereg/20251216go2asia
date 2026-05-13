import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeVipEntitlementShadowDiagnosticsFields,
  compareVipEntitlementShadow,
  createLocalVipEntitlementSourceReadAdapter,
  createVipEntitlementSourceReadRequest,
  getVipEntitlementShadowSnapshot,
  isVipEntitlementSourceReadEnforcementCapable,
  parseVipEntitlementSourceReadMode,
  parseVipEntitlementSourceReadScenario,
  recordVipEntitlementShadowObservation,
  resetVipEntitlementShadowForTests,
  resolveVipEntitlementShadowDecision,
  toVipEntitlementShadowDecisionFromSourceRead,
  type VipEntitlementSourceReadScenario,
  type VipEntitlementShadowScenario,
} from '../src/vipEntitlementShadow';

describe('VIP entitlement shadow decision model', () => {
  it.each([
    ['role_mirror', true, true, 'aligned_granted'],
    ['role_mirror', false, false, 'aligned_denied'],
    ['deny', true, false, 'role_granted_entitlement_denied'],
    ['grant', false, true, 'role_denied_entitlement_granted'],
    ['stale', true, false, 'stale_shadow'],
    ['degraded', true, false, 'degraded_shadow'],
    ['unknown_source', true, false, 'unknown_source'],
  ] satisfies Array<[VipEntitlementShadowScenario, boolean, boolean, string]>)(
    'compares runtime role gate to entitlement scenario %s',
    (scenario, currentRoleAllowed, expectedEntitlementAllowed, expectedDriftClass) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed,
        scenario,
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({ currentRoleAllowed, decision, claimScope: 'partner' });

      expect(decision.allowed).toBe(expectedEntitlementAllowed);
      expect(observation.driftClass).toBe(expectedDriftClass);
      expect(observation.auditTraceId).toMatch(/^vip_shadow_trace_/);
    }
  );

  it('records aggregate-only safe diagnostics', () => {
    resetVipEntitlementShadowForTests();
    const decision = resolveVipEntitlementShadowDecision({
      userId: 'user_1',
      currentRoleAllowed: true,
      scenario: 'deny',
      correlationId: 'req_1',
      now: new Date('2026-05-10T10:00:00.000Z'),
    });
    const observation = compareVipEntitlementShadow({ currentRoleAllowed: true, decision, claimScope: 'listing' });

    recordVipEntitlementShadowObservation(observation);
    const snapshot = getVipEntitlementShadowSnapshot();

    expect(snapshot.total).toBe(1);
    expect(snapshot.byDriftClass.role_granted_entitlement_denied).toBe(1);
    expect(snapshot.lastObservation).toMatchObject({
      driftClass: 'role_granted_entitlement_denied',
      reasonCode: 'not_found',
      claimScope: 'listing',
    });
    expect(JSON.stringify(snapshot)).not.toContain('user_1');
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(snapshot)).not.toThrow();
  });

  it('keeps source read mode default-off and parses only shadow_read_only', () => {
    expect(parseVipEntitlementSourceReadMode(undefined)).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('')).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('enforcement')).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('shadow_read_only')).toBe('shadow_read_only');
    expect(parseVipEntitlementSourceReadScenario('source_timeout')).toBe('source_timeout');
    expect(parseVipEntitlementSourceReadScenario('unexpected')).toBe('role_mirror');
  });

  it.each([
    ['role_mirror', true, 'migration_role_shadow', 'aligned_granted', false],
    ['grant', false, 'mock', 'role_denied_entitlement_granted', false],
    ['deny', true, 'mock', 'role_granted_entitlement_denied', false],
    ['stale', true, 'approved_cache', 'stale_entitlement', false],
    ['degraded', true, 'unknown', 'degraded_runtime', false],
    ['source_timeout', true, 'unknown', 'unavailable_entitlement', false],
    ['source_unavailable', true, 'unknown', 'unavailable_entitlement', false],
    ['unknown_source', true, 'unknown', 'unknown', false],
  ] satisfies Array<[VipEntitlementSourceReadScenario, boolean, string, string, boolean]>)(
    'maps source read scenario %s to canonical shadow evidence only',
    (scenario, currentRoleAllowed, expectedSourceType, expectedCanonicalDriftClass, expectedEnforcementCapable) => {
      const request = createVipEntitlementSourceReadRequest({
        userId: 'user_1',
        offerId: 'rf_offer_1',
        claimScope: 'partner',
        scopeRef: null,
        correlationId: 'req_1',
        diagnosticsEnabled: true,
        requestedAt: new Date('2026-05-10T10:00:00.000Z'),
      });
      const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
        request,
        currentRoleAllowed,
        scenario,
      });
      const decision = toVipEntitlementShadowDecisionFromSourceRead(sourceRead);
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed,
        decision,
        claimScope: 'partner',
        sourceRead,
      });

      expect(sourceRead.sourceType).toBe(expectedSourceType);
      expect(observation.canonicalDriftClass).toBe(expectedCanonicalDriftClass);
      expect(isVipEntitlementSourceReadEnforcementCapable(sourceRead)).toBe(expectedEnforcementCapable);
      expect(sourceRead.auditTraceId).toMatch(/^vip_source_trace_/);
      if (scenario === 'stale' || scenario === 'degraded' || scenario === 'source_timeout' || scenario === 'source_unavailable' || scenario === 'unknown_source') {
        expect(sourceRead.allowed).toBe(false);
      }
    }
  );

  it('records source read evidence as aggregate-only diagnostics', () => {
    resetVipEntitlementShadowForTests();
    const request = createVipEntitlementSourceReadRequest({
      userId: 'user_1',
      offerId: 'rf_offer_1',
      claimScope: 'listing',
      scopeRef: 'listing_1',
      correlationId: 'req_1',
      diagnosticsEnabled: true,
      requestedAt: new Date('2026-05-10T10:00:00.000Z'),
    });
    const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
      request,
      currentRoleAllowed: true,
      scenario: 'source_timeout',
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: true,
      decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
      claimScope: 'listing',
      sourceRead,
    });

    recordVipEntitlementShadowObservation(observation);
    const snapshot = getVipEntitlementShadowSnapshot();

    expect(snapshot.total).toBe(1);
    expect(snapshot.byCanonicalDriftClass.unavailable_entitlement).toBe(1);
    expect(snapshot.sourceRead.total).toBe(1);
    expect(snapshot.sourceRead.byAdapterStatus.timeout).toBe(1);
    expect(snapshot.sourceRead.auditTracePresent).toBe(1);
    expect(JSON.stringify(snapshot)).not.toMatch(/user_1|listing_1|req_1|correlation|sourceRef|metadata|payment|transaction/i);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(snapshot)).not.toThrow();
  });
});
