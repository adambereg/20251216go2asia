import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

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
import worker, { type Env } from '../src/index';

type GatewayComparisonStatus = 'aligned' | 'intentionally_different' | 'unexpected_divergence';

type GatewayComparison = {
  status: GatewayComparisonStatus;
  reasons: string[];
  gatewayClaims: Record<string, unknown>;
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
  generatedBy: 'rf-slice-6.23-gateway-helper-parity-tests';
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

function hasCapabilitiesOnlyFixture(fixture: IdentityGoldenFixture): boolean {
  return fixture.id === 'future-capability-placeholder';
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

  if (gatewayClaims.role !== platformRole.platformRole) {
    reasons.push(`gateway role ${String(gatewayClaims.role)} did not match helper role ${platformRole.platformRole}`);
  }
  if (platformRole.platformRole !== fixture.expected.platformRole.value) {
    reasons.push(`helper role ${platformRole.platformRole} did not match fixture role ${fixture.expected.platformRole.value}`);
  }
  if (platformRole.source !== fixture.expected.platformRole.source) {
    reasons.push(`helper source ${platformRole.source} did not match fixture source ${fixture.expected.platformRole.source}`);
  }
  if (platformRole.defaulted !== fixture.expected.platformRole.defaulted) {
    reasons.push('helper defaulted flag did not match fixture expectation');
  }
  if (JSON.stringify(capabilities.capabilities) !== JSON.stringify(fixture.expected.capabilities)) {
    reasons.push('helper capabilities did not match fixture expectation');
  }
  if (evidence.alignment !== fixture.expected.divergence.alignment) {
    reasons.push(`helper evidence alignment ${evidence.alignment} did not match fixture ${fixture.expected.divergence.alignment}`);
  }

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
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
    generatedBy: 'rf-slice-6.23-gateway-helper-parity-tests',
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
          : comparison.reasons,
    })),
    knownDivergences: [
      {
        fixtureId: 'future-capability-placeholder',
        status: 'documented',
        note: 'Gateway does not consume capabilities[]; helper also keeps future capability placeholders out of platform-role extraction.',
      },
    ],
  };
}

async function replayGatewayFixture(fixture: IdentityGoldenFixture): Promise<GatewayComparison> {
  let gatewayClaims: Record<string, unknown> | null = null;
  const fetchMock = vi.fn(async (request: Request) => {
    expect(request.url).toBe('https://points.example/v1/points/balance');
    expect(request.headers.get('X-User-ID')).toBe(`fixture_${fixture.id}`);
    const token = request.headers.get('X-Gateway-Auth');
    expect(token).toBeTruthy();
    gatewayClaims = decodeJwtPayload<Record<string, unknown>>(token!);
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
    gatewayEnv
  );
  const body = await readJson<{ ok: boolean }>(response);

  expect(response.status, fixture.id).toBe(200);
  expect(body.ok, fixture.id).toBe(true);
  expect(fetchMock, fixture.id).toHaveBeenCalledTimes(1);
  expect(gatewayClaims, fixture.id).toBeTruthy();
  expect(gatewayClaims?.iss, fixture.id).toBe('api-gateway');
  expect(gatewayClaims?.aud, fixture.id).toBe('internal');
  expect(gatewayClaims?.sub, fixture.id).toBe(`fixture_${fixture.id}`);
  expect(gatewayClaims?.role, fixture.id).toBe(fixture.expected.platformRole.value);
  expect(gatewayClaims?.roles, fixture.id).toEqual(expect.any(Array));

  return classifyGatewayComparison(fixture, gatewayClaims!);
}

describe('api-gateway identity-core golden fixture compare-only coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps package fixtures valid before gateway replay', () => {
    expect(validateIdentityGoldenFixtures(identityGoldenFixtures)).toEqual({ valid: true, errors: [] });
    expect(identityGoldenFixtures.every((fixture) => fixture.schemaVersion === IDENTITY_SCHEMA_VERSION)).toBe(true);
  });

  it('replays current gateway extraction against identity-core golden fixtures without runtime imports', async () => {
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
    ]);
    expect(comparisons.filter((comparison) => comparison.status === 'aligned').map((comparison) => comparison.id)).toEqual(
      identityGoldenFixtures.filter((fixture) => !hasCapabilitiesOnlyFixture(fixture)).map((fixture) => fixture.id)
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
    expect(summary.counts).toEqual({ aligned: identityGoldenFixtures.length, intentionally_different: 0, unexpected_divergence: 0 });
    expect(summary.fixtureCount).toBe(identityGoldenFixtures.length);
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual(fixtureIds);
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual([...fixtureIds].sort((left, right) => left.localeCompare(right)));
    expect(summary.knownDivergences).toEqual([
      {
        fixtureId: 'future-capability-placeholder',
        status: 'documented',
        note: 'Gateway does not consume capabilities[]; helper also keeps future capability placeholders out of platform-role extraction.',
      },
    ]);
    expect(JSON.stringify(summary)).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
  });
});
