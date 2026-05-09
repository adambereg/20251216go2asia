import { afterEach, describe, expect, it, vi } from 'vitest';

const identityCoreMockState = vi.hoisted(() => ({
  failNormalizeRolePayload: false,
}));

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@go2asia/identity-core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@go2asia/identity-core')>();
  return {
    ...actual,
    normalizeRolePayload: (input: Parameters<typeof actual.normalizeRolePayload>[0]) => {
      if (identityCoreMockState.failNormalizeRolePayload) throw new Error('shadow helper failure');
      return actual.normalizeRolePayload(input);
    },
  };
});

import { verifyToken } from '@clerk/backend';
import {
  IDENTITY_SCHEMA_VERSION,
  classifyRoleEvidence,
  extractPlatformRole,
  extractRoleCapabilities,
  identityGoldenFixtures,
  validateIdentityGoldenFixtures,
  type IdentityGoldenFixture,
} from '@go2asia/identity-core';

import { decodeJwtPayload, readJson } from '../../../tests/helpers/worker-test';
import worker, { getGatewayIdentityShadowAggregateSnapshot, resetGatewayIdentityShadowAggregateForTests, type Env } from '../src/index';

type GatewayComparisonStatus = 'aligned' | 'intentionally_different' | 'unexpected_divergence';

type GatewayComparison = {
  status: GatewayComparisonStatus;
  reasons: string[];
  gatewayClaims: Record<string, unknown>;
  shadowEvidence?: Record<string, unknown> | null;
};

type SurfaceCounts = Record<GatewayComparisonStatus, number>;

type GatewayHelperParity = {
  fixtureId: string;
  status: GatewayComparisonStatus;
  reasons: string[];
  gatewayRole: unknown;
  helperRole: string;
  fixtureRole: string;
  helperSource: string;
  helperDefaulted: boolean;
  helperCapabilities: string[];
  evidenceAlignment: string;
};

type GatewayHelperParitySummary = {
  schemaVersion: 1;
  generatedBy: 'rf-slice-6.25-malformed-scalar-policy-tests';
  fixtureCount: number;
  counts: SurfaceCounts;
  fixtureSummaries: Array<{
    fixtureId: string;
    status: GatewayComparisonStatus;
    gatewayRole: unknown;
    helperRole: string;
    fixtureRole: string;
    helperSource: string;
    helperDefaulted: boolean;
    helperCapabilities: string[];
    evidenceAlignment: string;
    notes: string[];
  }>;
  knownDivergences: Array<{
    fixtureId: string;
    status: 'documented';
    note: string;
  }>;
};

const gatewayEnv: Env = {
  POINTS_SERVICE_URL: 'https://points.example',
  CLERK_SECRET_KEY: 'sk_test_123',
  SERVICE_JWT_SECRET: 'service-secret',
};

type ReplayOptions = {
  env?: Partial<Env>;
  expectShadowEvidence?: boolean;
};

function hasCapabilitiesOnlyFixture(fixture: IdentityGoldenFixture): boolean {
  return fixture.id === 'future-capability-placeholder';
}

function hasUnknownScalarFallbackFixture(fixture: IdentityGoldenFixture): boolean {
  return fixture.id === 'unknown-role-falls-through-go2-role' || fixture.id === 'unknown-role-falls-through-public-metadata-role';
}

function classifyGatewayComparison(fixture: IdentityGoldenFixture, gatewayClaims: Record<string, unknown>): GatewayComparison {
  const reasons: string[] = [];
  const expected = fixture.expected.platformRole;

  if (gatewayClaims.role !== expected.value) {
    reasons.push(`gateway role ${String(gatewayClaims.role)} did not match fixture role ${expected.value}`);
  }

  if (expected.defaulted && !Array.isArray(gatewayClaims.roles)) {
    reasons.push('defaulted gateway fixtures must still mint a fallback roles[] array');
  }

  if (hasCapabilitiesOnlyFixture(fixture)) {
    return {
      status: reasons.length === 0 ? 'intentionally_different' : 'unexpected_divergence',
      reasons: reasons.length > 0 ? reasons : ['capabilities[] is fixture metadata only; gateway runtime does not consume capabilities yet'],
      gatewayClaims,
    };
  }

  if (hasUnknownScalarFallbackFixture(fixture)) {
    return {
      status: reasons.length > 0 && gatewayClaims.role === 'spacer' ? 'intentionally_different' : 'unexpected_divergence',
      reasons:
        reasons.length > 0
          ? [...reasons, 'current gateway stops at the first present scalar string; helper policy falls through unknown scalar sources']
          : ['unknown scalar fallback fixture unexpectedly matched gateway current behavior'],
      gatewayClaims,
    };
  }

  return {
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
    reasons,
    gatewayClaims,
  };
}

function classifyGatewayHelperParity(fixture: IdentityGoldenFixture, gatewayClaims: Record<string, unknown>): GatewayHelperParity {
  const platformRole = extractPlatformRole(fixture.rawInputPayload);
  const capabilities = extractRoleCapabilities(fixture.rawInputPayload);
  const evidence = classifyRoleEvidence(fixture.rawInputPayload);
  const reasons: string[] = [];
  const helperExpectationReasons: string[] = [];

  if (gatewayClaims.role !== platformRole.platformRole) {
    reasons.push(`gateway role ${String(gatewayClaims.role)} did not match helper role ${platformRole.platformRole}`);
  }
  if (platformRole.platformRole !== fixture.expected.platformRole.value) {
    helperExpectationReasons.push(`helper role ${platformRole.platformRole} did not match fixture role ${fixture.expected.platformRole.value}`);
  }
  if (platformRole.source !== fixture.expected.platformRole.source) {
    helperExpectationReasons.push(`helper source ${platformRole.source} did not match fixture source ${fixture.expected.platformRole.source}`);
  }
  if (platformRole.defaulted !== fixture.expected.platformRole.defaulted) {
    helperExpectationReasons.push('helper defaulted flag did not match fixture expectation');
  }
  if (JSON.stringify(capabilities.capabilities) !== JSON.stringify(fixture.expected.capabilities)) {
    helperExpectationReasons.push('helper capabilities did not match fixture expectation');
  }
  if (evidence.alignment !== fixture.expected.divergence.alignment) {
    helperExpectationReasons.push(`helper evidence alignment ${evidence.alignment} did not match fixture ${fixture.expected.divergence.alignment}`);
  }
  reasons.push(...helperExpectationReasons);

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : helperExpectationReasons.length === 0 && hasUnknownScalarFallbackFixture(fixture) ? 'intentionally_different' : 'unexpected_divergence',
    reasons,
    gatewayRole: gatewayClaims.role,
    helperRole: platformRole.platformRole,
    fixtureRole: fixture.expected.platformRole.value,
    helperSource: platformRole.source,
    helperDefaulted: platformRole.defaulted,
    helperCapabilities: capabilities.capabilities,
    evidenceAlignment: evidence.alignment,
  };
}

function countStatuses(comparisons: readonly GatewayHelperParity[]): SurfaceCounts {
  return comparisons.reduce<SurfaceCounts>(
    (counts, comparison) => {
      counts[comparison.status] += 1;
      return counts;
    },
    { aligned: 0, intentionally_different: 0, unexpected_divergence: 0 }
  );
}

function buildGatewayHelperParitySummary(comparisons: readonly GatewayHelperParity[]): GatewayHelperParitySummary {
  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    generatedBy: 'rf-slice-6.25-malformed-scalar-policy-tests',
    fixtureCount: comparisons.length,
    counts: countStatuses(comparisons),
    fixtureSummaries: comparisons.map((comparison) => ({
      fixtureId: comparison.fixtureId,
      status: comparison.status,
      gatewayRole: comparison.gatewayRole,
      helperRole: comparison.helperRole,
      fixtureRole: comparison.fixtureRole,
      helperSource: comparison.helperSource,
      helperDefaulted: comparison.helperDefaulted,
      helperCapabilities: comparison.helperCapabilities,
      evidenceAlignment: comparison.evidenceAlignment,
      notes:
        comparison.fixtureId === 'future-capability-placeholder'
          ? ['Gateway role parity is aligned; capabilities[] remains intentionally out-of-runtime for gateway behavior.']
          : comparison.fixtureId === 'unknown-role-falls-through-go2-role' || comparison.fixtureId === 'unknown-role-falls-through-public-metadata-role'
            ? [...comparison.reasons, 'Migration blocker: gateway scalar fallback policy must be accepted or changed before runtime migration.']
          : comparison.reasons,
    })),
    knownDivergences: [
      {
        fixtureId: 'future-capability-placeholder',
        status: 'documented',
        note: 'Gateway does not consume capabilities[]; helper also keeps future capability placeholders out of platform-role extraction.',
      },
      {
        fixtureId: 'unknown-role-falls-through-go2-role',
        status: 'documented',
        note: 'Current gateway defaults to spacer when top-level role is an unknown string; helper falls through to canonical go2_role.',
      },
      {
        fixtureId: 'unknown-role-falls-through-public-metadata-role',
        status: 'documented',
        note: 'Current gateway defaults to spacer when top-level role is an unknown string; helper falls through to canonical public_metadata.role.',
      },
    ],
  };
}

async function replayGatewayFixture(fixture: IdentityGoldenFixture, options: ReplayOptions = {}): Promise<GatewayComparison> {
  let gatewayClaims: Record<string, unknown> | null = null;
  let shadowEvidence: Record<string, unknown> | null = null;
  const fetchMock = vi.fn(async (request: Request) => {
    expect(request.url).toBe('https://points.example/v1/points/balance');
    expect(request.headers.get('X-User-ID')).toBe(`fixture_${fixture.id}`);
    const token = request.headers.get('X-Gateway-Auth');
    expect(token).toBeTruthy();
    gatewayClaims = decodeJwtPayload<Record<string, unknown>>(token!);
    const shadowHeader = request.headers.get('X-Gateway-Identity-Shadow');
    if (options.expectShadowEvidence) {
      expect(shadowHeader, fixture.id).toBeTruthy();
      shadowEvidence = JSON.parse(shadowHeader!);
    } else {
      expect(shadowHeader, fixture.id).toBeNull();
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  vi.mocked(verifyToken).mockResolvedValue({
    sub: `fixture_${fixture.id}`,
    ...fixture.rawInputPayload,
  } as never);

  const response = await worker.fetch(
    new Request('https://gateway.example/v1/points/balance', {
      headers: {
        Authorization: `Bearer fixture-token-${fixture.id}`,
      },
    }),
    { ...gatewayEnv, ...options.env }
  );
  const body = await readJson<{ ok: boolean }>(response);

  expect(response.status, fixture.id).toBe(200);
  expect(body.ok, fixture.id).toBe(true);
  expect(fetchMock, fixture.id).toHaveBeenCalledTimes(1);
  expect(gatewayClaims, fixture.id).toBeTruthy();
  expect(gatewayClaims?.iss, fixture.id).toBe('api-gateway');
  expect(gatewayClaims?.aud, fixture.id).toBe('internal');
  expect(gatewayClaims?.sub, fixture.id).toBe(`fixture_${fixture.id}`);
  if (hasUnknownScalarFallbackFixture(fixture)) {
    expect(gatewayClaims?.role, fixture.id).toBe('spacer');
  } else {
    expect(gatewayClaims?.role, fixture.id).toBe(fixture.expected.platformRole.value);
  }
  expect(gatewayClaims?.roles, fixture.id).toEqual(expect.any(Array));

  return {
    ...classifyGatewayComparison(fixture, gatewayClaims!),
    shadowEvidence,
  };
}

describe('api-gateway identity-core golden fixture compare-only coverage', () => {
  afterEach(() => {
    identityCoreMockState.failNormalizeRolePayload = false;
    resetGatewayIdentityShadowAggregateForTests();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps package fixtures valid before gateway replay', () => {
    expect(validateIdentityGoldenFixtures(identityGoldenFixtures)).toEqual({ valid: true, errors: [] });
    expect(identityGoldenFixtures.every((fixture) => fixture.schemaVersion === IDENTITY_SCHEMA_VERSION)).toBe(true);
  });

  it('replays current gateway extraction against identity-core golden fixtures with legacy output authoritative', async () => {
    const comparisons: Array<{ id: string } & GatewayComparison> = [];

    for (const fixture of identityGoldenFixtures) {
      comparisons.push({
        id: fixture.id,
        ...(await replayGatewayFixture(fixture)),
      });
    }

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.filter((comparison) => comparison.status === 'intentionally_different').map((comparison) => comparison.id)).toEqual([
      'future-capability-placeholder',
      'unknown-role-falls-through-go2-role',
      'unknown-role-falls-through-public-metadata-role',
    ]);
    expect(comparisons.filter((comparison) => comparison.status === 'aligned').map((comparison) => comparison.id)).toEqual(
      identityGoldenFixtures.filter((fixture) => !hasCapabilitiesOnlyFixture(fixture) && !hasUnknownScalarFallbackFixture(fixture)).map((fixture) => fixture.id)
    );
  });

  it('compares current gateway extraction with implemented identity-core helper outputs', async () => {
    const parity: GatewayHelperParity[] = [];

    for (const fixture of identityGoldenFixtures) {
      const comparison = await replayGatewayFixture(fixture);
      parity.push(classifyGatewayHelperParity(fixture, comparison.gatewayClaims));
    }

    const summary = buildGatewayHelperParitySummary(parity);
    const fixtureIds = identityGoldenFixtures.map((fixture) => fixture.id);

    expect(parity.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(summary.counts).toEqual({ aligned: identityGoldenFixtures.length - 2, intentionally_different: 2, unexpected_divergence: 0 });
    expect(summary.fixtureCount).toBe(identityGoldenFixtures.length);
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual(fixtureIds);
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual([...fixtureIds].sort((left, right) => left.localeCompare(right)));
    expect(summary.knownDivergences).toEqual([
      {
        fixtureId: 'future-capability-placeholder',
        status: 'documented',
        note: 'Gateway does not consume capabilities[]; helper also keeps future capability placeholders out of platform-role extraction.',
      },
      {
        fixtureId: 'unknown-role-falls-through-go2-role',
        status: 'documented',
        note: 'Current gateway defaults to spacer when top-level role is an unknown string; helper falls through to canonical go2_role.',
      },
      {
        fixtureId: 'unknown-role-falls-through-public-metadata-role',
        status: 'documented',
        note: 'Current gateway defaults to spacer when top-level role is an unknown string; helper falls through to canonical public_metadata.role.',
      },
    ]);
    expect(JSON.stringify(summary)).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
  });

  it('keeps shadow compare fully silent when gateway shadow flags are disabled', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    const comparison = await replayGatewayFixture(fixture);

    expect(comparison.gatewayClaims.role).toBe('vip_spacer');
    expect(comparison.shadowEvidence).toBeNull();
    expect(getGatewayIdentityShadowAggregateSnapshot()).toEqual({
      schemaVersion: 1,
      total: 0,
      byClassification: {
        aligned: 0,
        migration_blocker: 0,
        unexpected_divergence: 0,
        helper_failed: 0,
      },
      byReasonCode: {
        aligned: 0,
        unknown_scalar_fallback_policy: 0,
        unexpected_role_mismatch: 0,
        helper_failed: 0,
      },
      byHelperSource: {},
    });
  });

  it('runs shadow compare for aligned fixtures without changing minted gateway claims', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE: 'true',
      },
      expectShadowEvidence: true,
    });

    expect(comparison.gatewayClaims.role).toBe('vip_spacer');
    expect(comparison.shadowEvidence).toMatchObject({
      schemaVersion: IDENTITY_SCHEMA_VERSION,
      shadowCompareEnabled: true,
      evidenceEnabled: true,
      classification: 'aligned',
      reasonCode: 'aligned',
      legacyRole: 'vip_spacer',
      helperRole: 'vip_spacer',
      helperSource: 'role',
    });
    expect(JSON.stringify(comparison.shadowEvidence)).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|fixture_|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
  });

  it('aggregates aligned shadow evidence only when aggregation is enabled', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION: 'true',
      },
    });

    const snapshot = getGatewayIdentityShadowAggregateSnapshot();
    expect(snapshot).toEqual({
      schemaVersion: 1,
      total: 1,
      byClassification: {
        aligned: 1,
        migration_blocker: 0,
        unexpected_divergence: 0,
        helper_failed: 0,
      },
      byReasonCode: {
        aligned: 1,
        unknown_scalar_fallback_policy: 0,
        unexpected_role_mismatch: 0,
        helper_failed: 0,
      },
      byHelperSource: {
        role: 1,
      },
    });
    expect(JSON.stringify(snapshot)).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|fixture_|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
  });

  it('keeps evidence hidden when shadow compare is enabled but evidence flag is disabled', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE: 'false',
      },
    });

    expect(comparison.gatewayClaims.role).toBe('vip_spacer');
    expect(comparison.shadowEvidence).toBeNull();
  });

  it('classifies unknown scalar fallback as a migration blocker while legacy JWT stays authoritative', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'unknown-role-falls-through-go2-role')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE: 'true',
      },
      expectShadowEvidence: true,
    });

    expect(comparison.gatewayClaims.role).toBe('spacer');
    expect(comparison.shadowEvidence).toMatchObject({
      classification: 'migration_blocker',
      reasonCode: 'unknown_scalar_fallback_policy',
      legacyRole: 'spacer',
      helperRole: 'vip_spacer',
      helperSource: 'go2_role',
    });
  });

  it('aggregates migration blocker shadow evidence without exposing identity material', async () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'unknown-role-falls-through-go2-role')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION: 'true',
      },
      expectShadowEvidence: true,
    });

    expect(comparison.gatewayClaims.role).toBe('spacer');
    expect(getGatewayIdentityShadowAggregateSnapshot()).toEqual({
      schemaVersion: 1,
      total: 1,
      byClassification: {
        aligned: 0,
        migration_blocker: 1,
        unexpected_divergence: 0,
        helper_failed: 0,
      },
      byReasonCode: {
        aligned: 0,
        unknown_scalar_fallback_policy: 1,
        unexpected_role_mismatch: 0,
        helper_failed: 0,
      },
      byHelperSource: {
        go2_role: 1,
      },
    });
  });

  it('keeps helper failures non-fatal and preserves legacy minted claims', async () => {
    identityCoreMockState.failNormalizeRolePayload = true;
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE: 'true',
      },
      expectShadowEvidence: true,
    });

    expect(comparison.gatewayClaims.role).toBe('vip_spacer');
    expect(comparison.shadowEvidence).toMatchObject({
      classification: 'helper_failed',
      reasonCode: 'helper_failed',
      legacyRole: 'vip_spacer',
      helperRole: null,
      helperSource: null,
    });
  });

  it('aggregates helper failures without breaking legacy requests', async () => {
    identityCoreMockState.failNormalizeRolePayload = true;
    const fixture = identityGoldenFixtures.find((item) => item.id === 'alias-role-vip')!;
    const comparison = await replayGatewayFixture(fixture, {
      env: {
        GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE: 'true',
        GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION: 'true',
      },
    });

    expect(comparison.gatewayClaims.role).toBe('vip_spacer');
    expect(getGatewayIdentityShadowAggregateSnapshot()).toEqual({
      schemaVersion: 1,
      total: 1,
      byClassification: {
        aligned: 0,
        migration_blocker: 0,
        unexpected_divergence: 0,
        helper_failed: 1,
      },
      byReasonCode: {
        aligned: 0,
        unknown_scalar_fallback_policy: 0,
        unexpected_role_mismatch: 0,
        helper_failed: 1,
      },
      byHelperSource: {
        none: 1,
      },
    });
  });
});
