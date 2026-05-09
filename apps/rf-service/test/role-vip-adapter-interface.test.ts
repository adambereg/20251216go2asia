import { describe, expect, it } from 'vitest';

import { evaluateEntitlementPreviewProxyRequestWithObservation, type EntitlementPreviewProxyRequest } from '../src/entitlementMock';
import { roleVipPreviewAdapter } from '../src/roleVipAdapter';
import { roleVipFixtureMatrix, type RoleVipFixture } from '../src/roleVipAdapterContracts';
import {
  assertRoleVipAdapterOutputCompatibility,
  compareRoleVipAdapterOutputToFixture,
  createFixtureBackedRoleVipAdapter,
  executeRoleVipAdapterContract,
  runRoleVipFixtureThroughAdapter,
  toRoleVipAdapterInputFromFixture,
} from '../src/roleVipAdapterInterface';

const unsafePayloadPattern =
  /\b(rawRoles|roleHints|statusHints|subject|principal|adapterId|rawFacts|evaluatedSources|partialResults|auditTraceId|requestWindowId|wallet|chain|tx|balance|payout|reward|debit|compensation|recovery)\b/i;

function toMockPreview(fixture: RoleVipFixture) {
  const request: EntitlementPreviewProxyRequest = {
    requestId: `mock-vs-contract:${fixture.id}`,
    resource: {
      kind: 'rf_premium_voucher',
      offerId: 'offer_role_vip_contract',
      partnerId: 'partner_role_vip_contract',
    },
    context: {
      rf: {
        voucherClass: 'premium',
      },
      mockScenario: fixture.group === 'source_unavailable' ? 'source_unavailable' : fixture.group === 'timeout' ? 'source_timeout' : 'granted',
    },
    requestedSources: [fixture.source],
  };

  return evaluateEntitlementPreviewProxyRequestWithObservation(
    request,
    {
      userId: fixture.principal.userId,
      platformRole: fixture.principal.platformRole ?? 'spacer',
      roles: Array.isArray(fixture.principal.roles) ? fixture.principal.roles.filter((role): role is string => typeof role === 'string') : [],
    },
    new Date('2026-05-09T00:00:00.000Z'),
  );
}

function toAdapterPreview(fixture: RoleVipFixture) {
  const request: EntitlementPreviewProxyRequest = {
    requestId: `adapter-vs-mock:${fixture.id}`,
    resource: {
      kind: 'rf_premium_voucher',
      offerId: 'offer_role_vip_contract',
      partnerId: 'partner_role_vip_contract',
    },
    context: {
      rf: {
        voucherClass: 'premium',
      },
      mockScenario: fixture.group === 'source_unavailable' ? 'source_unavailable' : fixture.group === 'timeout' ? 'source_timeout' : 'granted',
    },
    requestedSources: [fixture.source],
  };

  return evaluateEntitlementPreviewProxyRequestWithObservation(
    request,
    {
      userId: fixture.principal.userId,
      platformRole: fixture.principal.platformRole ?? 'spacer',
      roles: Array.isArray(fixture.principal.roles) ? fixture.principal.roles.filter((role): role is string => typeof role === 'string') : [],
    },
    new Date('2026-05-09T00:00:00.000Z'),
    {
      enableRealAdapters: true,
      enableRoleAdapter: fixture.source === 'role',
      enableVipAdapter: fixture.source === 'vip_status',
    },
  );
}

type ComparisonClassification = 'aligned' | 'intentionally_different' | 'unexpected_divergence';

function classifyMockAdapterComparison(fixture: RoleVipFixture): ComparisonClassification {
  if (fixture.group === 'source_unavailable' || fixture.group === 'timeout') return 'aligned';
  if (
    [
      'regular_spacer_requires_condition',
      'admin_does_not_auto_grant_vip',
      'pro_does_not_auto_grant_vip',
      'mixed_roles_without_vip_requires_condition',
      'missing_role_unavailable',
    ].includes(fixture.id)
  ) {
    return 'intentionally_different';
  }
  return 'aligned';
}

describe('Role/VIP adapter interface skeleton', () => {
  it('replays every fixture through fixture-backed adapter', async () => {
    const adapter = createFixtureBackedRoleVipAdapter();

    for (const fixture of roleVipFixtureMatrix) {
      const replay = await runRoleVipFixtureThroughAdapter(adapter, fixture);

      expect(replay.adapterId).toBe(adapter.id);
      expect(replay.fixtureId).toBe(fixture.id);
      expect(replay.matchesFixture, replay.differences.join(', ')).toBe(true);
      expect(replay.differences).toEqual([]);
      expect(assertRoleVipAdapterOutputCompatibility(replay.execution.output)).toBe(true);
      expect(replay.execution.informationalOnly).toBe(true);
      expect(replay.execution.claimBehaviorUnchanged).toBe(true);
    }
  });

  it('replays every fixture through the runtime preview adapter implementation', async () => {
    for (const fixture of roleVipFixtureMatrix) {
      const replay = await runRoleVipFixtureThroughAdapter(roleVipPreviewAdapter, fixture);

      expect(replay.adapterId).toBe('role-vip-preview-adapter');
      expect(replay.matchesFixture, replay.differences.join(', ')).toBe(true);
      expect(replay.execution.output.health, fixture.id).not.toBe('fixture_only');
      expect(assertRoleVipAdapterOutputCompatibility(replay.execution.output), fixture.id).toBe(true);
    }
  });

  it('keeps direct execution equivalent to fixture replay', () => {
    for (const fixture of roleVipFixtureMatrix) {
      const execution = executeRoleVipAdapterContract(toRoleVipAdapterInputFromFixture(fixture));
      const differences = compareRoleVipAdapterOutputToFixture(execution.output, fixture.expectation);

      expect(differences, fixture.id).toEqual([]);
      expect(execution.output.preview, fixture.id).toEqual(fixture.expectation.preview);
      expect(execution.output.observability, fixture.id).toEqual(fixture.expectation.observability);
      expect(execution.output.safePublicPayload).toMatchObject({
        source: fixture.source,
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      });
    }
  });

  it('keeps safe public payload free of raw roles and diagnostics', async () => {
    const adapter = createFixtureBackedRoleVipAdapter();

    for (const fixture of roleVipFixtureMatrix) {
      const replay = await runRoleVipFixtureThroughAdapter(adapter, fixture);
      const publicPayload = JSON.stringify({
        preview: replay.execution.output.preview,
        observability: replay.execution.output.observability,
        safePublicPayload: replay.execution.output.safePublicPayload,
      });

      expect(publicPayload, fixture.id).not.toMatch(unsafePayloadPattern);
    }
  });

  it('does not require new preview DTO fields, badge states, or observability buckets', async () => {
    const adapter = createFixtureBackedRoleVipAdapter();
    const allowedPublicFields = ['claimBehaviorUnchanged', 'informationalOnly', 'source', 'state'].sort();

    for (const fixture of roleVipFixtureMatrix) {
      const replay = await runRoleVipFixtureThroughAdapter(adapter, fixture);

      expect(Object.keys(replay.execution.output.safePublicPayload).sort(), fixture.id).toEqual(allowedPublicFields);
      expect(assertRoleVipAdapterOutputCompatibility(replay.execution.output), fixture.id).toBe(true);
    }
  });

  it('keeps drift and malformed backend simulations degraded without exposing conflicts', async () => {
    const driftFixtures = roleVipFixtureMatrix.filter((fixture) => fixture.group === 'drift_gateway_vs_backend' || fixture.group === 'malformed_role');

    expect(driftFixtures.map((fixture) => fixture.id)).toEqual([
      'drift_gateway_vip_backend_regular_temporary',
      'drift_gateway_regular_backend_vip_temporary',
      'malformed_backend_temporary',
    ]);

    for (const fixture of driftFixtures) {
      const replay = await runRoleVipFixtureThroughAdapter(roleVipPreviewAdapter, fixture);
      const publicPayload = JSON.stringify({
        preview: replay.execution.output.preview,
        observability: replay.execution.output.observability,
        safePublicPayload: replay.execution.output.safePublicPayload,
      });

      expect(replay.matchesFixture, replay.differences.join(', ')).toBe(true);
      expect(replay.execution.output.health, fixture.id).toBe('degraded');
      expect(replay.execution.output.error, fixture.id).toBe(fixture.group === 'malformed_role' ? 'malformed_source' : 'drift_detected');
      expect(replay.execution.output.preview.state, fixture.id).toBe('checking_or_temporarily_unavailable');
      expect(replay.execution.output.observability.isTemporary, fixture.id).toBe(true);
      expect(publicPayload, fixture.id).not.toMatch(/drift|conflict|backend|rawRoles|principal|subject|adapterId/i);
    }
  });
});

describe('Role/VIP contract vs current entitlement mock', () => {
  it('documents that current mock is scenario-driven and does not inspect Role/VIP principal truth', () => {
    const regular = roleVipFixtureMatrix.find((fixture) => fixture.id === 'regular_spacer_requires_condition');
    const vip = roleVipFixtureMatrix.find((fixture) => fixture.id === 'vip_platform_role_available');

    expect(regular).toBeDefined();
    expect(vip).toBeDefined();

    const regularMock = toMockPreview(regular!);
    const vipMock = toMockPreview(vip!);

    expect(regular?.expectation.preview.state).toBe('requires_condition');
    expect(vip?.expectation.preview.state).toBe('available');
    expect(regularMock.preview.state).toBe('available');
    expect(vipMock.preview.state).toBe('available');
    expect(regularMock.preview.state).toBe(vipMock.preview.state);
  });

  it('documents intentional admin/pro differences until the real Role/VIP adapter is wired', () => {
    const fixtures = roleVipFixtureMatrix.filter((fixture) => fixture.id === 'admin_does_not_auto_grant_vip' || fixture.id === 'pro_does_not_auto_grant_vip');

    expect(fixtures).toHaveLength(2);
    for (const fixture of fixtures) {
      const mock = toMockPreview(fixture);

      expect(fixture.expectation.preview.state, fixture.id).toBe('requires_condition');
      expect(mock.preview.state, fixture.id).toBe('available');
      expect(mock.preview.informationalOnly, fixture.id).toBe(true);
      expect(mock.preview.claimBehaviorUnchanged, fixture.id).toBe(true);
    }
  });

  it('keeps degraded mock scenarios aligned with contract temporary preview expectations', () => {
    const fixtures = roleVipFixtureMatrix.filter((fixture) => fixture.group === 'source_unavailable' || fixture.group === 'timeout');

    expect(fixtures).toHaveLength(2);
    for (const fixture of fixtures) {
      const mock = toMockPreview(fixture);

      expect(fixture.expectation.preview.state, fixture.id).toBe('checking_or_temporarily_unavailable');
      expect(mock.preview.state, fixture.id).toBe('checking_or_temporarily_unavailable');
      expect(mock.observation.bucket, fixture.id).toBe(mock.preview.state);
    }
  });

  it('classifies current mock-vs-contract gaps as future adapter responsibilities', () => {
    const comparableFixtures = roleVipFixtureMatrix.filter((fixture) =>
      ['regular_spacer_requires_condition', 'admin_does_not_auto_grant_vip', 'pro_does_not_auto_grant_vip'].includes(fixture.id),
    );

    const gaps = comparableFixtures.map((fixture) => ({
      fixtureId: fixture.id,
      contractState: fixture.expectation.preview.state,
      mockState: toMockPreview(fixture).preview.state,
      futureAdapterResponsibility: true,
    }));

    expect(gaps).toEqual([
      {
        fixtureId: 'regular_spacer_requires_condition',
        contractState: 'requires_condition',
        mockState: 'available',
        futureAdapterResponsibility: true,
      },
      {
        fixtureId: 'admin_does_not_auto_grant_vip',
        contractState: 'requires_condition',
        mockState: 'available',
        futureAdapterResponsibility: true,
      },
      {
        fixtureId: 'pro_does_not_auto_grant_vip',
        contractState: 'requires_condition',
        mockState: 'available',
        futureAdapterResponsibility: true,
      },
    ]);
  });

  it('classifies adapter-vs-mock comparison results as aligned or intentionally different', () => {
    const compared = roleVipFixtureMatrix
      .filter((fixture) => fixture.backendSnapshot === undefined)
      .map((fixture) => {
        const mock = toMockPreview(fixture);
        const adapter = toAdapterPreview(fixture);
        const expectedClassification = classifyMockAdapterComparison(fixture);
        const actualClassification: ComparisonClassification =
          mock.preview.state === adapter.preview.state ? 'aligned' : expectedClassification === 'intentionally_different' ? 'intentionally_different' : 'unexpected_divergence';

        return {
          fixtureId: fixture.id,
          source: fixture.source,
          mockState: mock.preview.state,
          adapterState: adapter.preview.state,
          classification: actualClassification,
        };
      });

    expect(compared).toEqual([
      {
        fixtureId: 'role_source_regular_available',
        source: 'role',
        mockState: 'available',
        adapterState: 'available',
        classification: 'aligned',
      },
      {
        fixtureId: 'regular_spacer_requires_condition',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'requires_condition',
        classification: 'intentionally_different',
      },
      {
        fixtureId: 'vip_platform_role_available',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'available',
        classification: 'aligned',
      },
      {
        fixtureId: 'vip_roles_array_available',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'available',
        classification: 'aligned',
      },
      {
        fixtureId: 'admin_does_not_auto_grant_vip',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'requires_condition',
        classification: 'intentionally_different',
      },
      {
        fixtureId: 'pro_does_not_auto_grant_vip',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'requires_condition',
        classification: 'intentionally_different',
      },
      {
        fixtureId: 'mixed_roles_vip_present_available',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'available',
        classification: 'aligned',
      },
      {
        fixtureId: 'mixed_roles_without_vip_requires_condition',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'requires_condition',
        classification: 'intentionally_different',
      },
      {
        fixtureId: 'missing_role_unavailable',
        source: 'vip_status',
        mockState: 'available',
        adapterState: 'requires_condition',
        classification: 'intentionally_different',
      },
      {
        fixtureId: 'timeout_temporary',
        source: 'vip_status',
        mockState: 'checking_or_temporarily_unavailable',
        adapterState: 'checking_or_temporarily_unavailable',
        classification: 'aligned',
      },
    ]);

    expect(compared.filter((item) => item.classification === 'unexpected_divergence')).toEqual([]);
  });
});

