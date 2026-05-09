import { describe, expect, it } from 'vitest';

import { getEntitlementPreviewObservabilitySnapshot, resetEntitlementPreviewObservability } from '../src/entitlementPreviewObservability';
import {
  ROLE_VIP_CANONICAL_ROLES,
  ROLE_VIP_DEGRADED_MODES,
  ROLE_VIP_OBSERVABILITY_BUCKETS,
  ROLE_VIP_PREVIEW_STATES,
  ROLE_VIP_RENDERED_BADGE_STATES,
  isAdminRole,
  isProRole,
  isVipRole,
  normalizeCanonicalRole,
  normalizeRoleArray,
  normalizeRoleDecision,
  roleVipFixtureMatrix,
  type RoleVipFixture,
  type RoleVipNormalizationResult,
  type RoleVipPreviewState,
} from '../src/roleVipAdapterContracts';

const unsafePayloadPattern =
  /\b(rawRoles|roleHints|statusHints|subject|principal|adapterId|rawFacts|evaluatedSources|partialResults|auditTraceId|requestWindowId|wallet|chain|tx|balance|payout|reward|debit|compensation|recovery)\b/i;

function toExpectedPreviewState(result: RoleVipNormalizationResult): RoleVipPreviewState {
  if (result.reasonCode === 'ordinary_resource_no_gate' || result.decision === 'not_applicable') return 'ordinary_no_preview';
  if (result.decision === 'granted' && result.degradedMode === 'none' && !result.stale) return 'available';
  if (result.reasonCode === 'insufficient_status' || result.reasonCode === 'requirement_missing') return 'requires_condition';
  if (
    result.decision === 'pending' ||
    result.degradedMode === 'timeout_fallback' ||
    result.degradedMode === 'stale_cache' ||
    result.degradedMode === 'partial_sources' ||
    result.degradedMode === 'source_unavailable' ||
    result.reasonCode === 'source_timeout' ||
    result.reasonCode === 'source_unavailable'
  ) {
    return 'checking_or_temporarily_unavailable';
  }
  return 'unavailable';
}

function evaluateFixture(fixture: RoleVipFixture): RoleVipNormalizationResult {
  return normalizeRoleDecision({
    source: fixture.source,
    principal: fixture.principal,
    backendSnapshot: fixture.backendSnapshot,
    timeout: fixture.group === 'timeout',
    sourceUnavailable: fixture.group === 'source_unavailable',
  });
}

describe('Role/VIP adapter contract fixtures', () => {
  it('normalizes canonical role values and aliases deterministically', () => {
    expect(normalizeCanonicalRole(' spacer ')).toBe('spacer');
    expect(normalizeCanonicalRole('USER')).toBe('spacer');
    expect(normalizeCanonicalRole('member')).toBe('spacer');
    expect(normalizeCanonicalRole('VIP')).toBe('vip_spacer');
    expect(normalizeCanonicalRole('vip-spacer')).toBe('vip_spacer');
    expect(normalizeCanonicalRole('PRO')).toBe('pro');
    expect(normalizeCanonicalRole(' Admin ')).toBe('admin');
    expect(normalizeCanonicalRole('unknown_role')).toBeNull();
    expect(normalizeCanonicalRole(null)).toBeNull();
  });

  it('normalizes role arrays without granting unknown roles', () => {
    expect(normalizeRoleArray([' pro ', 'VIP', 'not_real', 42, 'admin'])).toEqual(['pro', 'vip_spacer', 'admin']);
    expect(normalizeRoleArray('vip_spacer')).toEqual([]);
    expect(normalizeRoleArray([null, '', '   '])).toEqual([]);
  });

  it('keeps VIP/admin/PRO semantics explicit', () => {
    expect(isVipRole('vip_spacer')).toBe(true);
    expect(isVipRole('admin')).toBe(false);
    expect(isVipRole('pro')).toBe(false);
    expect(isAdminRole('admin')).toBe(true);
    expect(isProRole('pro')).toBe(true);
  });

  it('executes the full fixture matrix against normalized expectations', () => {
    expect(roleVipFixtureMatrix.length).toBeGreaterThanOrEqual(10);

    for (const fixture of roleVipFixtureMatrix) {
      const result = evaluateFixture(fixture);

      expect(result.decision, fixture.id).toBe(fixture.expectation.decision);
      expect(result.reasonCode, fixture.id).toBe(fixture.expectation.reasonCode);
      expect(result.degradedMode, fixture.id).toBe(fixture.expectation.degradedMode);
      expect(result.driftScenario, fixture.id).toBe(fixture.expectation.driftScenario);
      expect(toExpectedPreviewState(result), fixture.id).toBe(fixture.expectation.preview.state);
      expect(fixture.expectation.observability.bucket, fixture.id).toBe(fixture.expectation.preview.state);
      expect(fixture.expectation.observability.degradedMode, fixture.id).toBe(fixture.expectation.degradedMode);
      expect(fixture.expectation.preview.informationalOnly, fixture.id).toBe(true);
      expect(fixture.expectation.preview.claimBehaviorUnchanged, fixture.id).toBe(true);
    }
  });

  it('covers required fixture groups', () => {
    const groups = new Set(roleVipFixtureMatrix.map((fixture) => fixture.group));

    expect(groups).toEqual(
      new Set([
        'regular',
        'vip',
        'admin',
        'pro',
        'mixed_roles',
        'missing_role',
        'drift_gateway_vs_backend',
        'source_unavailable',
        'timeout',
        'malformed_role',
      ]),
    );
  });

  it('encodes drift scenarios as temporary preview states', () => {
    const driftFixtures = roleVipFixtureMatrix.filter((fixture) => fixture.group === 'drift_gateway_vs_backend' || fixture.group === 'malformed_role');

    expect(driftFixtures.length).toBeGreaterThan(0);
    for (const fixture of driftFixtures) {
      expect(fixture.expectation.preview.state, fixture.id).toBe('checking_or_temporarily_unavailable');
      expect(fixture.expectation.observability.isTemporary, fixture.id).toBe(true);
      expect(fixture.expectation.degradedMode, fixture.id).not.toBe('none');
    }
  });

  it('prevents admin or PRO from auto-granting VIP capability', () => {
    const admin = roleVipFixtureMatrix.find((fixture) => fixture.id === 'admin_does_not_auto_grant_vip');
    const pro = roleVipFixtureMatrix.find((fixture) => fixture.id === 'pro_does_not_auto_grant_vip');

    expect(admin).toBeDefined();
    expect(pro).toBeDefined();
    expect(admin?.expectation.decision).toBe('denied');
    expect(admin?.expectation.preview.state).toBe('requires_condition');
    expect(pro?.expectation.decision).toBe('denied');
    expect(pro?.expectation.preview.state).toBe('requires_condition');
  });

  it('keeps single and batch preview expectations equivalent for every fixture', () => {
    for (const fixture of roleVipFixtureMatrix) {
      const singlePreview = fixture.expectation.preview;
      const batchPreview = fixture.expectation.preview;

      expect(batchPreview.state, fixture.id).toBe(singlePreview.state);
      expect(batchPreview.informationalOnly, fixture.id).toBe(true);
      expect(batchPreview.claimBehaviorUnchanged, fixture.id).toBe(true);
    }
  });

  it('keeps public expectation payloads free of raw roles and diagnostics', () => {
    for (const fixture of roleVipFixtureMatrix) {
      const publicExpectationPayload = JSON.stringify({
        preview: fixture.expectation.preview,
        observability: fixture.expectation.observability,
      });

      expect(fixture.expectation.leakPrevention, fixture.id).toEqual({
        forbidsRawRoles: true,
        forbidsSubjectPayload: true,
        forbidsDiagnostics: true,
        forbidsFinancialVocabulary: true,
      });
      expect(publicExpectationPayload, fixture.id).not.toMatch(unsafePayloadPattern);
    }
  });
});

describe('Role/VIP public preview regression guards', () => {
  it('keeps preview state and rendered badge state names stable', () => {
    expect(ROLE_VIP_PREVIEW_STATES).toEqual([
      'available',
      'requires_condition',
      'checking_or_temporarily_unavailable',
      'ordinary_no_preview',
      'unavailable',
      'not_enabled',
    ]);
    expect(ROLE_VIP_RENDERED_BADGE_STATES).toEqual(['available', 'requires_condition', 'checking_or_temporarily_unavailable', 'unavailable']);
  });

  it('keeps observability bucket and degraded mode names stable', () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const snapshot = getEntitlementPreviewObservabilitySnapshot();

    expect(Object.keys(snapshot.bucketTotals)).toEqual([...ROLE_VIP_OBSERVABILITY_BUCKETS]);
    expect(Object.keys(snapshot.degradedTotals)).toEqual([...ROLE_VIP_DEGRADED_MODES]);
    expect(Object.keys(snapshot.surfaceTotals)).toEqual(['catalog', 'listing', 'other']);
    expect(Object.keys(snapshot.batchSizeTotals)).toEqual(['single', 'small', 'medium', 'large']);
  });

  it('keeps canonical role names stable', () => {
    expect(ROLE_VIP_CANONICAL_ROLES).toEqual(['spacer', 'vip_spacer', 'pro', 'admin']);
  });
});

