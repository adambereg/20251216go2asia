import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeVipEntitlementShadowDiagnosticsFields,
  compareVipEntitlementShadow,
  getVipEntitlementShadowSnapshot,
  recordVipEntitlementShadowObservation,
  resetVipEntitlementShadowForTests,
  resolveVipEntitlementShadowDecision,
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
});
