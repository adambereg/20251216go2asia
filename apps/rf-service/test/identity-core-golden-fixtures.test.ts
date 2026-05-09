import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  IDENTITY_SCHEMA_VERSION,
  identityGoldenFixtures,
  validateIdentityGoldenFixtures,
  type CanonicalPlatformRole,
  type IdentityGoldenFixture,
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

  it('keeps identity-core out of selected runtime entrypoints', () => {
    const runtimeFiles = [
      'apps/api-gateway/src/index.ts',
      'apps/rf-service/src/index.ts',
      'apps/rf-service/src/middleware/auth.ts',
      'apps/rf-service/src/store.ts',
      'apps/go2asia-pwa-shell/middleware.ts',
    ];

    for (const file of runtimeFiles) {
      const content = readFileSync(resolve(process.cwd(), '..', '..', file), 'utf8');
      expect(content, file).not.toContain('@go2asia/identity-core');
    }
  });
});
