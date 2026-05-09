import { describe, expect, it } from 'vitest';

import {
  CANONICAL_PLATFORM_ROLES,
  IDENTITY_CAPABILITIES,
  IDENTITY_EVIDENCE_ALIGNMENTS,
  IDENTITY_GOLDEN_FIXTURE_GROUPS,
  IDENTITY_GOLDEN_FIXTURE_VERSION,
  IDENTITY_ROLE_SOURCES,
  IDENTITY_SCHEMA_VERSION,
  assertNoUnsafeIdentityFixtureFields,
  identityGoldenFixtures,
  validateIdentityGoldenFixture,
  validateIdentityGoldenFixtures,
} from '../src';
import type { IdentityGoldenFixture } from '../src';

const requiredFixtureIds = [
  'alias-role-vip',
  'alias-role-vip-spacer',
  'canonical-role-vip-spacer',
  'conflict-role-spacer-roles-vip',
  'conflict-role-spacer-roles-vip-spacer',
  'future-capability-placeholder',
  'malformed-role-falls-through-roles-vip',
  'metadata-go2-role-precedes-public-metadata',
  'missing-role-defaults-spacer',
  'order-roles-admin-member',
  'order-roles-member-admin',
] as const;

describe('@go2asia/identity-core golden fixtures', () => {
  it('exports schema constants for the v1 skeleton package', () => {
    expect(IDENTITY_SCHEMA_VERSION).toBe(1);
    expect(IDENTITY_GOLDEN_FIXTURE_VERSION).toBe(1);
    expect(CANONICAL_PLATFORM_ROLES).toEqual(['spacer', 'vip_spacer', 'pro', 'admin']);
    expect(IDENTITY_CAPABILITIES).toEqual(['vip_spacer']);
    expect(IDENTITY_EVIDENCE_ALIGNMENTS).toEqual(['aligned', 'preview_grants_claim_rejects', 'claim_allows_preview_requires_condition']);
  });

  it('keeps all fixture ids unique and deterministically ordered', () => {
    const ids = identityGoldenFixtures.map((fixture) => fixture.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...ids].sort((left, right) => left.localeCompare(right)));
  });

  it('includes every required initial fixture', () => {
    const ids = new Set(identityGoldenFixtures.map((fixture) => fixture.id));
    for (const id of requiredFixtureIds) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it('covers every required fixture group', () => {
    const groups = new Set(identityGoldenFixtures.map((fixture) => fixture.group));
    for (const group of IDENTITY_GOLDEN_FIXTURE_GROUPS) {
      expect(groups.has(group), group).toBe(true);
    }
  });

  it('uses schema v1 and known enum values throughout fixtures', () => {
    for (const fixture of identityGoldenFixtures) {
      expect(fixture.fixtureVersion, fixture.id).toBe(IDENTITY_GOLDEN_FIXTURE_VERSION);
      expect(fixture.schemaVersion, fixture.id).toBe(IDENTITY_SCHEMA_VERSION);
      expect(CANONICAL_PLATFORM_ROLES, fixture.id).toContain(fixture.expected.platformRole.value);
      expect(IDENTITY_ROLE_SOURCES, fixture.id).toContain(fixture.expected.platformRole.source);
      expect(IDENTITY_EVIDENCE_ALIGNMENTS, fixture.id).toContain(fixture.expected.divergence.alignment);
      for (const capability of fixture.expected.capabilities) {
        expect(IDENTITY_CAPABILITIES, fixture.id).toContain(capability);
      }
    }
  });

  it('validates all exported fixtures with the package helper', () => {
    expect(validateIdentityGoldenFixtures(identityGoldenFixtures)).toEqual({
      valid: true,
      errors: [],
    });
    for (const fixture of identityGoldenFixtures) {
      expect(validateIdentityGoldenFixture(fixture), fixture.id).toEqual({
        valid: true,
        errors: [],
      });
    }
  });

  it('keeps fixture payloads free of raw JWT and PII-like fields', () => {
    for (const fixture of identityGoldenFixtures) {
      expect(assertNoUnsafeIdentityFixtureFields(fixture.rawInputPayload), fixture.id).toEqual([]);
      expect(JSON.stringify(fixture.rawInputPayload), fixture.id).not.toMatch(/email|wallet|nft|g2a|secret|session|jwt|bearer/i);
    }
  });

  it('rejects unsafe payload examples without performing role normalization', () => {
    const unsafeFixture: IdentityGoldenFixture = {
      ...identityGoldenFixtures[0],
      id: 'unsafe-example',
      rawInputPayload: {
        role: 'vip',
        email: 'person@example.test',
        jwt: 'aaa.bbb.ccc',
      },
    };

    const result = validateIdentityGoldenFixture(unsafeFixture);
    expect(result.valid).toBe(false);
    expect(result.errors.join('\n')).toMatch(/unsafe identity field name|unsafe string value/);
  });
});
