import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  IDENTITY_GOLDEN_FIXTURE_GROUPS,
  IDENTITY_GOLDEN_FIXTURE_VERSION,
  IDENTITY_SCHEMA_VERSION,
  identityGoldenFixtures,
  isVipCapability,
  normalizeRolePayload,
  validateIdentityGoldenFixtures,
  type CanonicalPlatformRole,
  type IdentityGoldenFixture,
  type IdentityGoldenFixtureGroup,
} from '@go2asia/identity-core';

import { createRoleNormalizationEvidenceSnapshot, type RoleEvidenceInput } from '../src/roleNormalizationEvidence';

type ComparisonStatus = 'aligned' | 'intentionally_different' | 'unexpected_divergence';

type RfComparison = {
  fixtureId: string;
  status: ComparisonStatus;
  reasons: string[];
};

type RfPrincipalProjection = {
  platformRole: CanonicalPlatformRole;
  roles: string[];
  claimVip: boolean;
};

type SurfaceCounts = Record<ComparisonStatus, number>;

type FixtureEvidenceSummary = {
  fixtureId: string;
  group: IdentityGoldenFixtureGroup;
  gatewayStatus: ComparisonStatus;
  rfEvidenceStatus: ComparisonStatus;
  rfProjectionStatus: ComparisonStatus;
  rfEvidenceHelperStatus: ComparisonStatus;
  rfProjectionHelperStatus: ComparisonStatus;
  claimCapabilityStatus: ComparisonStatus;
  divergenceClass: string;
  notes: string[];
};

type CompareOnlyEvidenceSummary = {
  schemaVersion: 1;
  generatedBy: 'rf-slice-6.24-rf-helper-parity-tests';
  fixtureVersion: 1;
  fixtureCount: number;
  comparedSurfaces: ['gateway', 'rf_evidence', 'rf_internal_jwt_projection', 'rf_evidence_helper_parity', 'rf_projection_helper_parity', 'claim_vs_helper_capability'];
  counts: {
    gateway: SurfaceCounts;
    rfEvidence: SurfaceCounts;
    rfProjection: SurfaceCounts;
    rfEvidenceHelperParity: SurfaceCounts;
    rfProjectionHelperParity: SurfaceCounts;
    claimVsCapability: SurfaceCounts;
  };
  fixtureSummaries: FixtureEvidenceSummary[];
  knownDivergences: Array<{
    fixtureId: string;
    divergenceClass: string;
    status: 'documented';
    note: string;
  }>;
  runtimeImportBoundary: {
    gatewayRuntimeImportsIdentityCore: false;
    rfRuntimeImportsIdentityCore: false;
    pwaRuntimeImportsIdentityCore: false;
    compareOnlyImportsLimitedToTests: true;
  };
};

const runtimeFiles = [
  'apps/api-gateway/src/index.ts',
  'apps/rf-service/src/index.ts',
  'apps/rf-service/src/middleware/auth.ts',
  'apps/rf-service/src/store.ts',
  'apps/go2asia-pwa-shell/middleware.ts',
] as const;

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

function normalizeCanonicalPlatformRole(value: unknown): CanonicalPlatformRole | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'admin') return 'admin';
  if (normalized === 'pro') return 'pro';
  if (normalized === 'vip_spacer' || normalized === 'vip-spacer' || normalized === 'vip') return 'vip_spacer';
  if (normalized === 'spacer' || normalized === 'member' || normalized === 'user') return 'spacer';
  return null;
}

function projectCurrentRfPrincipalFromGatewayFixture(fixture: IdentityGoldenFixture): RfPrincipalProjection {
  const rawRoles = stringArray(fixture.rawInputPayload.roles);
  const roles = rawRoles.length > 0 ? rawRoles : [fixture.expected.platformRole.value];
  const fromRole = normalizeCanonicalPlatformRole(fixture.expected.platformRole.value);
  const fromRoles = roles.map(normalizeCanonicalPlatformRole).find((role): role is CanonicalPlatformRole => Boolean(role));
  const platformRole = fromRole ?? fromRoles ?? 'spacer';
  const claimVip = platformRole === 'vip_spacer' || roles.some((role) => role.trim().toLowerCase() === 'vip_spacer');

  return {
    platformRole,
    roles,
    claimVip,
  };
}

function toEvidenceInput(fixture: IdentityGoldenFixture): RoleEvidenceInput {
  return fixture.rawInputPayload as RoleEvidenceInput;
}

function classifyEvidenceComparison(fixture: IdentityGoldenFixture): RfComparison {
  const snapshot = createRoleNormalizationEvidenceSnapshot(toEvidenceInput(fixture));
  const reasons: string[] = [];

  if (snapshot.schemaVersion !== IDENTITY_SCHEMA_VERSION) reasons.push('evidence snapshot schemaVersion does not match identity-core schema v1');
  if (snapshot.containsRawJwt !== false || snapshot.containsPii !== false) reasons.push('evidence snapshot exposed unsafe identity material');
  if (snapshot.gateway.platformRole !== fixture.expected.platformRole.value) reasons.push(`gateway evidence role ${snapshot.gateway.platformRole} did not match fixture ${fixture.expected.platformRole.value}`);
  if (snapshot.gateway.roleSource !== fixture.expected.platformRole.source) reasons.push(`gateway evidence source ${snapshot.gateway.roleSource} did not match fixture ${fixture.expected.platformRole.source}`);
  if (snapshot.claimGate.isVipSpacer !== fixture.expected.claimVipBehavior.currentClaimAllowsVip) reasons.push('claim VIP behavior did not match fixture expectation');
  if (snapshot.previewAdapter.isVip !== fixture.expected.previewBehavior.currentPreviewVip) reasons.push('preview VIP behavior did not match fixture expectation');
  if (snapshot.previewAdapter.state !== fixture.expected.previewBehavior.expectedPreviewState) reasons.push('preview state did not match fixture expectation');
  if (snapshot.divergence.alignment !== fixture.expected.divergence.alignment) reasons.push('evidence alignment did not match fixture expectation');
  if (snapshot.divergence.roleClaimConflictsWithRoles !== fixture.expected.divergence.roleClaimConflictsWithRoles) reasons.push('role/roles conflict flag did not match fixture expectation');
  if (snapshot.divergence.vipAliasOnlyInRoles !== fixture.expected.divergence.vipAliasOnlyInRoles) reasons.push('VIP alias-only flag did not match fixture expectation');
  if (snapshot.divergence.rolesOrderSensitive !== fixture.expected.divergence.rolesOrderSensitive) reasons.push('roles order-sensitive flag did not match fixture expectation');

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
    reasons,
  };
}

function classifyRfPrincipalComparison(fixture: IdentityGoldenFixture): RfComparison {
  const projection = projectCurrentRfPrincipalFromGatewayFixture(fixture);
  const reasons: string[] = [];

  if (projection.platformRole !== fixture.expected.platformRole.value) reasons.push(`RF principal role ${projection.platformRole} did not match fixture ${fixture.expected.platformRole.value}`);
  if (projection.claimVip !== fixture.expected.claimVipBehavior.currentClaimAllowsVip) reasons.push('RF paid claim VIP projection did not match fixture expectation');

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
    reasons,
  };
}

function classifyRfEvidenceHelperParity(fixture: IdentityGoldenFixture): RfComparison {
  const snapshot = createRoleNormalizationEvidenceSnapshot(toEvidenceInput(fixture));
  const helper = normalizeRolePayload(fixture.rawInputPayload);
  const reasons: string[] = [];

  if (snapshot.gateway.platformRole !== helper.platformRole.platformRole) reasons.push('RF evidence gateway role did not match helper platform role');
  if (snapshot.gateway.roleSource !== helper.platformRole.source) reasons.push('RF evidence gateway source did not match helper platform source');
  if (snapshot.claimGate.isVipSpacer !== fixture.expected.claimVipBehavior.currentClaimAllowsVip) reasons.push('RF evidence claim VIP did not match fixture expectation');
  if (snapshot.previewAdapter.isVip !== helper.capabilities.capabilities.includes('vip_spacer')) reasons.push('RF preview VIP did not match helper VIP capability');
  if (snapshot.divergence.alignment !== helper.evidence.alignment) reasons.push('RF evidence divergence did not match helper evidence alignment');
  if (helper.metadata.containsRawJwt !== false || helper.metadata.containsPii !== false) reasons.push('helper metadata exposed unsafe identity material');

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
    reasons,
  };
}

function classifyRfProjectionHelperParity(fixture: IdentityGoldenFixture): RfComparison {
  const projection = projectCurrentRfPrincipalFromGatewayFixture(fixture);
  const helper = normalizeRolePayload(fixture.rawInputPayload);
  const reasons: string[] = [];

  if (projection.platformRole !== helper.platformRole.platformRole) reasons.push(`RF projection role ${projection.platformRole} did not match helper platform role ${helper.platformRole.platformRole}`);
  if (projection.claimVip !== fixture.expected.claimVipBehavior.currentClaimAllowsVip) reasons.push('RF projection claim VIP did not match fixture expectation');

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : 'unexpected_divergence',
    reasons,
  };
}

function classifyClaimCapabilityParity(fixture: IdentityGoldenFixture): RfComparison {
  const projection = projectCurrentRfPrincipalFromGatewayFixture(fixture);
  const helperVip = isVipCapability(fixture.rawInputPayload);
  const reasons: string[] = [];

  if (projection.claimVip !== helperVip) {
    reasons.push('current paid claim VIP behavior differs from helper VIP capability; helper must not be used as claim gate');
  }

  return {
    fixtureId: fixture.id,
    status: reasons.length === 0 ? 'aligned' : fixture.expected.divergence.alignment === 'preview_grants_claim_rejects' ? 'intentionally_different' : 'unexpected_divergence',
    reasons,
  };
}

function classifyGatewaySummary(fixture: IdentityGoldenFixture): RfComparison {
  if (fixture.id === 'future-capability-placeholder') {
    return {
      fixtureId: fixture.id,
      status: 'intentionally_different',
      reasons: ['capabilities[] is a fixture metadata placeholder and is not consumed by gateway runtime in Slice 6.20'],
    };
  }

  return {
    fixtureId: fixture.id,
    status: 'aligned',
    reasons: [],
  };
}

function emptyCounts(): SurfaceCounts {
  return {
    aligned: 0,
    intentionally_different: 0,
    unexpected_divergence: 0,
  };
}

function countStatuses(comparisons: readonly RfComparison[]): SurfaceCounts {
  const counts = emptyCounts();
  for (const comparison of comparisons) counts[comparison.status] += 1;
  return counts;
}

function notesForFixture(
  fixture: IdentityGoldenFixture,
  gateway: RfComparison,
  rfEvidence: RfComparison,
  rfProjection: RfComparison,
  rfEvidenceHelper: RfComparison,
  rfProjectionHelper: RfComparison,
  claimCapability: RfComparison
): string[] {
  const notes = [...gateway.reasons, ...rfEvidence.reasons, ...rfProjection.reasons, ...rfEvidenceHelper.reasons, ...rfProjectionHelper.reasons, ...claimCapability.reasons];
  if (fixture.expected.divergence.alignment !== 'aligned') {
    notes.push(`known preview/claim divergence: ${fixture.expected.divergence.alignment}`);
  }
  if (fixture.id === 'metadata-go2-role-precedes-public-metadata') {
    notes.push('RF projection assumes gateway has already resolved go2_role/public metadata into role');
  }
  return notes;
}

function buildCompareOnlyEvidenceSummary(): CompareOnlyEvidenceSummary {
  const gatewayComparisons = identityGoldenFixtures.map(classifyGatewaySummary);
  const rfEvidenceComparisons = identityGoldenFixtures.map(classifyEvidenceComparison);
  const rfProjectionComparisons = identityGoldenFixtures.map(classifyRfPrincipalComparison);
  const rfEvidenceHelperComparisons = identityGoldenFixtures.map(classifyRfEvidenceHelperParity);
  const rfProjectionHelperComparisons = identityGoldenFixtures.map(classifyRfProjectionHelperParity);
  const claimCapabilityComparisons = identityGoldenFixtures.map(classifyClaimCapabilityParity);
  const knownDivergences = identityGoldenFixtures
    .filter((fixture) => fixture.expected.divergence.alignment !== 'aligned')
    .map((fixture) => ({
      fixtureId: fixture.id,
      divergenceClass: fixture.expected.divergence.alignment,
      status: 'documented' as const,
      note: 'Preview recognizes VIP alias in roles[] while current paid claim behavior does not.',
    }))
    .concat([
      {
        fixtureId: 'future-capability-placeholder',
        divergenceClass: 'future_capability_metadata_only',
        status: 'documented' as const,
        note: 'capabilities[] remains a fixture placeholder and is not consumed by gateway or RF runtime.',
      },
    ]);

  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    generatedBy: 'rf-slice-6.24-rf-helper-parity-tests',
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    fixtureCount: identityGoldenFixtures.length,
    comparedSurfaces: ['gateway', 'rf_evidence', 'rf_internal_jwt_projection', 'rf_evidence_helper_parity', 'rf_projection_helper_parity', 'claim_vs_helper_capability'],
    counts: {
      gateway: countStatuses(gatewayComparisons),
      rfEvidence: countStatuses(rfEvidenceComparisons),
      rfProjection: countStatuses(rfProjectionComparisons),
      rfEvidenceHelperParity: countStatuses(rfEvidenceHelperComparisons),
      rfProjectionHelperParity: countStatuses(rfProjectionHelperComparisons),
      claimVsCapability: countStatuses(claimCapabilityComparisons),
    },
    fixtureSummaries: identityGoldenFixtures.map((fixture, index) => ({
      fixtureId: fixture.id,
      group: fixture.group,
      gatewayStatus: gatewayComparisons[index]!.status,
      rfEvidenceStatus: rfEvidenceComparisons[index]!.status,
      rfProjectionStatus: rfProjectionComparisons[index]!.status,
      rfEvidenceHelperStatus: rfEvidenceHelperComparisons[index]!.status,
      rfProjectionHelperStatus: rfProjectionHelperComparisons[index]!.status,
      claimCapabilityStatus: claimCapabilityComparisons[index]!.status,
      divergenceClass: fixture.expected.divergence.alignment,
      notes: notesForFixture(
        fixture,
        gatewayComparisons[index]!,
        rfEvidenceComparisons[index]!,
        rfProjectionComparisons[index]!,
        rfEvidenceHelperComparisons[index]!,
        rfProjectionHelperComparisons[index]!,
        claimCapabilityComparisons[index]!
      ),
    })),
    knownDivergences,
    runtimeImportBoundary: {
      gatewayRuntimeImportsIdentityCore: false,
      rfRuntimeImportsIdentityCore: false,
      pwaRuntimeImportsIdentityCore: false,
      compareOnlyImportsLimitedToTests: true,
    },
  };
}

function expectNoUnsafeSummaryFields(summary: CompareOnlyEvidenceSummary): void {
  expect(JSON.stringify(summary)).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
}

function readRuntimeFile(file: string): string {
  return readFileSync(resolve(process.cwd(), '..', '..', file), 'utf8');
}

describe('RF identity-core golden fixture compare-only coverage', () => {
  it('keeps identity-core fixtures valid before RF replay', () => {
    expect(validateIdentityGoldenFixtures(identityGoldenFixtures)).toEqual({ valid: true, errors: [] });
    expect(identityGoldenFixtures.every((fixture) => fixture.schemaVersion === IDENTITY_SCHEMA_VERSION)).toBe(true);
  });

  it('keeps RF evidence helper aligned with identity-core golden fixture expectations', () => {
    const comparisons = identityGoldenFixtures.map(classifyEvidenceComparison);

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.map((comparison) => comparison.status)).toEqual(identityGoldenFixtures.map(() => 'aligned'));
  });

  it('replays current RF internal JWT semantics against gateway-resolved fixture projections', () => {
    const comparisons = identityGoldenFixtures.map(classifyRfPrincipalComparison);

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.map((comparison) => comparison.status)).toEqual(identityGoldenFixtures.map(() => 'aligned'));
  });

  it('documents the preview-vs-claim divergence fixture without treating it as a runtime failure', () => {
    const fixture = identityGoldenFixtures.find((item) => item.id === 'conflict-role-spacer-roles-vip');
    expect(fixture).toBeTruthy();

    const snapshot = createRoleNormalizationEvidenceSnapshot(toEvidenceInput(fixture!));
    const projection = projectCurrentRfPrincipalFromGatewayFixture(fixture!);

    expect(snapshot.divergence.alignment).toBe('preview_grants_claim_rejects');
    expect(snapshot.previewAdapter.isVip).toBe(true);
    expect(projection.claimVip).toBe(false);
    expect(fixture!.expected.previewBehavior.claimBehaviorUnchanged).toBe(true);
  });

  it('compares RF evidence snapshots with identity-core helper outputs without changing runtime semantics', () => {
    const comparisons = identityGoldenFixtures.map(classifyRfEvidenceHelperParity);

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.map((comparison) => comparison.status)).toEqual(identityGoldenFixtures.map(() => 'aligned'));
  });

  it('compares RF internal JWT projection with identity-core helper output where the gateway has already resolved roles', () => {
    const comparisons = identityGoldenFixtures.map(classifyRfProjectionHelperParity);

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.map((comparison) => comparison.status)).toEqual(identityGoldenFixtures.map(() => 'aligned'));
  });

  it('keeps current paid claim VIP behavior distinct from helper VIP capability semantics', () => {
    const comparisons = identityGoldenFixtures.map(classifyClaimCapabilityParity);

    expect(comparisons.filter((comparison) => comparison.status === 'unexpected_divergence')).toEqual([]);
    expect(comparisons.filter((comparison) => comparison.status === 'intentionally_different').map((comparison) => comparison.fixtureId)).toEqual([
      'conflict-role-spacer-roles-vip',
    ]);
  });

  it('keeps identity-core out of selected runtime entrypoints', () => {
    for (const file of runtimeFiles) {
      const content = readRuntimeFile(file);
      expect(content, file).not.toContain('@go2asia/identity-core');
    }
  });

  it('builds deterministic compare-only evidence summary without unsafe fields', () => {
    const summary = buildCompareOnlyEvidenceSummary();
    const fixtureIds = identityGoldenFixtures.map((fixture) => fixture.id);

    expect(summary).toMatchObject({
      schemaVersion: IDENTITY_SCHEMA_VERSION,
      generatedBy: 'rf-slice-6.24-rf-helper-parity-tests',
      fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
      fixtureCount: identityGoldenFixtures.length,
      comparedSurfaces: ['gateway', 'rf_evidence', 'rf_internal_jwt_projection', 'rf_evidence_helper_parity', 'rf_projection_helper_parity', 'claim_vs_helper_capability'],
      runtimeImportBoundary: {
        gatewayRuntimeImportsIdentityCore: false,
        rfRuntimeImportsIdentityCore: false,
        pwaRuntimeImportsIdentityCore: false,
        compareOnlyImportsLimitedToTests: true,
      },
    });
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual(fixtureIds);
    expect(summary.fixtureSummaries.map((fixture) => fixture.fixtureId)).toEqual([...fixtureIds].sort((left, right) => left.localeCompare(right)));
    expect(summary.fixtureSummaries).toHaveLength(summary.fixtureCount);
    expect(summary.counts.gateway.aligned + summary.counts.gateway.intentionally_different + summary.counts.gateway.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.rfEvidence.aligned + summary.counts.rfEvidence.intentionally_different + summary.counts.rfEvidence.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.rfProjection.aligned + summary.counts.rfProjection.intentionally_different + summary.counts.rfProjection.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.rfEvidenceHelperParity.aligned + summary.counts.rfEvidenceHelperParity.intentionally_different + summary.counts.rfEvidenceHelperParity.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.rfProjectionHelperParity.aligned + summary.counts.rfProjectionHelperParity.intentionally_different + summary.counts.rfProjectionHelperParity.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.claimVsCapability.aligned + summary.counts.claimVsCapability.intentionally_different + summary.counts.claimVsCapability.unexpected_divergence).toBe(summary.fixtureCount);
    expect(summary.counts.gateway).toEqual({ aligned: 10, intentionally_different: 1, unexpected_divergence: 0 });
    expect(summary.counts.rfEvidence).toEqual({ aligned: 11, intentionally_different: 0, unexpected_divergence: 0 });
    expect(summary.counts.rfProjection).toEqual({ aligned: 11, intentionally_different: 0, unexpected_divergence: 0 });
    expect(summary.counts.rfEvidenceHelperParity).toEqual({ aligned: 11, intentionally_different: 0, unexpected_divergence: 0 });
    expect(summary.counts.rfProjectionHelperParity).toEqual({ aligned: 11, intentionally_different: 0, unexpected_divergence: 0 });
    expect(summary.counts.claimVsCapability).toEqual({ aligned: 10, intentionally_different: 1, unexpected_divergence: 0 });
    expect(summary.knownDivergences).toEqual([
      {
        fixtureId: 'conflict-role-spacer-roles-vip',
        divergenceClass: 'preview_grants_claim_rejects',
        status: 'documented',
        note: 'Preview recognizes VIP alias in roles[] while current paid claim behavior does not.',
      },
      {
        fixtureId: 'future-capability-placeholder',
        divergenceClass: 'future_capability_metadata_only',
        status: 'documented',
        note: 'capabilities[] remains a fixture placeholder and is not consumed by gateway or RF runtime.',
      },
    ]);
    expectNoUnsafeSummaryFields(summary);
  });

  it('keeps evidence summary group coverage aligned with identity-core fixture groups', () => {
    const summary = buildCompareOnlyEvidenceSummary();
    const groupCounts = new Map<IdentityGoldenFixtureGroup, number>();

    for (const fixture of summary.fixtureSummaries) {
      groupCounts.set(fixture.group, (groupCounts.get(fixture.group) ?? 0) + 1);
    }

    expect(Object.fromEntries(groupCounts)).toEqual({
      alias_case: 2,
      canonical_happy_path: 1,
      role_roles_conflict: 2,
      future_capability_combination: 1,
      malformed_payload: 1,
      metadata_precedence: 1,
      missing_payload: 1,
      order_sensitive_array: 2,
    });
    for (const group of IDENTITY_GOLDEN_FIXTURE_GROUPS) {
      expect(groupCounts.has(group), group).toBe(true);
    }
  });
});
