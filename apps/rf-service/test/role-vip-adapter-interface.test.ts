import { describe, expect, it } from 'vitest';
import { evaluateEntitlementPreviewProxyRequestWithObservation, type EntitlementPreviewProxyRequest } from '../src/entitlementMock';
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
});

