import { describe, expect, it } from 'vitest';

import {
  IDENTITY_SCHEMA_VERSION,
  identityGoldenFixtures,
  classifyRoleEvidence,
  extractPlatformRole,
  extractRoleCapabilities,
  isVipCapability,
  normalizeRolePayload,
  normalizeRoleToken,
  type IdentityGoldenFixture,
  type NormalizedRolePayload,
} from '../src';

function expectPayloadMatchesFixture(payload: NormalizedRolePayload, fixture: IdentityGoldenFixture): void {
  expect(payload.schemaVersion, fixture.id).toBe(IDENTITY_SCHEMA_VERSION);
  expect(payload.platformRole, fixture.id).toMatchObject({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    platformRole: fixture.expected.platformRole.value,
    source: fixture.expected.platformRole.source,
    defaulted: fixture.expected.platformRole.defaulted,
  });
  expect(payload.capabilities, fixture.id).toMatchObject({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    capabilities: fixture.expected.capabilities,
  });
  expect(payload.evidence, fixture.id).toMatchObject({
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    alignment: fixture.expected.divergence.alignment,
    roleClaimConflictsWithRoles: fixture.expected.divergence.roleClaimConflictsWithRoles,
    vipAliasOnlyInRoles: fixture.expected.divergence.vipAliasOnlyInRoles,
    rolesOrderSensitive: fixture.expected.divergence.rolesOrderSensitive,
  });
  expect(payload.metadata, fixture.id).toMatchObject({
    containsRawJwt: false,
    containsPii: false,
    defaulted: fixture.expected.platformRole.defaulted,
  });
  expect(JSON.stringify(payload), fixture.id).not.toMatch(/email|wallet|nft|g2a|secret|session|bearer|authorization|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i);
}

describe('@go2asia/identity-core pure normalization helpers', () => {
  it('normalizes canonical role tokens and aliases deterministically', () => {
    expect(normalizeRoleToken('admin')).toMatchObject({ rawTokenClass: 'canonical', normalizedToken: 'admin', canonicalRole: 'admin', matchedAlias: null });
    expect(normalizeRoleToken(' PRO ')).toMatchObject({ rawTokenClass: 'canonical', normalizedToken: 'pro', canonicalRole: 'pro', matchedAlias: null });
    expect(normalizeRoleToken('spacer')).toMatchObject({ rawTokenClass: 'canonical', normalizedToken: 'spacer', canonicalRole: 'spacer', matchedAlias: null });
    expect(normalizeRoleToken('vip_spacer')).toMatchObject({ rawTokenClass: 'canonical', normalizedToken: 'vip_spacer', canonicalRole: 'vip_spacer', matchedAlias: null });
    expect(normalizeRoleToken('VIP')).toMatchObject({ rawTokenClass: 'vip_alias', normalizedToken: 'vip', canonicalRole: 'vip_spacer', matchedAlias: 'vip' });
    expect(normalizeRoleToken(' vip-spacer ')).toMatchObject({ rawTokenClass: 'vip_alias', normalizedToken: 'vip-spacer', canonicalRole: 'vip_spacer', matchedAlias: 'vip-spacer' });
    expect(normalizeRoleToken('member')).toMatchObject({ rawTokenClass: 'spacer_alias', normalizedToken: 'member', canonicalRole: 'spacer', matchedAlias: 'member' });
    expect(normalizeRoleToken('USER')).toMatchObject({ rawTokenClass: 'spacer_alias', normalizedToken: 'user', canonicalRole: 'spacer', matchedAlias: 'user' });
  });

  it('classifies malformed and unknown role tokens without throwing', () => {
    expect(normalizeRoleToken('not_real')).toMatchObject({ rawTokenClass: 'unknown', normalizedToken: 'not_real', canonicalRole: null, matchedAlias: null });
    expect(normalizeRoleToken('   ')).toMatchObject({ rawTokenClass: 'missing', normalizedToken: null, canonicalRole: null, matchedAlias: null });
    expect(normalizeRoleToken(null)).toMatchObject({ rawTokenClass: 'missing', normalizedToken: null, canonicalRole: null, matchedAlias: null });
    expect(normalizeRoleToken(undefined)).toMatchObject({ rawTokenClass: 'missing', normalizedToken: null, canonicalRole: null, matchedAlias: null });
    expect(normalizeRoleToken(42)).toMatchObject({ rawTokenClass: 'non_string', normalizedToken: null, canonicalRole: null, matchedAlias: null });
    expect(normalizeRoleToken({ role: 'vip' })).toMatchObject({ rawTokenClass: 'non_string', normalizedToken: null, canonicalRole: null, matchedAlias: null });
  });

  it('extracts platform roles with schema v1 source precedence', () => {
    expect(extractPlatformRole({ role: 'spacer', go2_role: 'admin' })).toMatchObject({ platformRole: 'spacer', source: 'role', defaulted: false });
    expect(extractPlatformRole({ role: 42, go2_role: 'pro', public_metadata: { role: 'vip_spacer' } })).toMatchObject({ platformRole: 'pro', source: 'go2_role', defaulted: false });
    expect(extractPlatformRole({ role: 'unknown_role', go2_role: 'vip_spacer' })).toMatchObject({ platformRole: 'vip_spacer', source: 'go2_role', defaulted: false });
    expect(extractPlatformRole({ role: 'unknown_role', public_metadata: { role: 'pro' } })).toMatchObject({ platformRole: 'pro', source: 'public_metadata.role', defaulted: false });
    expect(extractPlatformRole({ public_metadata: { role: 'vip-spacer' }, publicMetadata: { role: 'admin' } })).toMatchObject({ platformRole: 'vip_spacer', source: 'public_metadata.role', defaulted: false });
    expect(extractPlatformRole({ publicMetadata: { role: 'admin' }, roles: ['member'] })).toMatchObject({ platformRole: 'admin', source: 'publicMetadata.role', defaulted: false });
    expect(extractPlatformRole({ roles: ['not_real', 42, 'member', 'admin'] })).toMatchObject({ platformRole: 'spacer', source: 'roles[]', defaulted: false });
    expect(extractPlatformRole({})).toMatchObject({ platformRole: 'spacer', source: 'default_spacer', defaulted: true });
  });

  it('extracts VIP capability without treating admin, pro, or future capabilities as VIP', () => {
    expect(extractRoleCapabilities({ role: 'vip' })).toMatchObject({ capabilities: ['vip_spacer'], sources: ['role'] });
    expect(extractRoleCapabilities({ role: 'spacer', roles: ['VIP'] })).toMatchObject({ capabilities: ['vip_spacer'], sources: ['roles[]'] });
    expect(extractRoleCapabilities({ role: 'admin' })).toMatchObject({ capabilities: [], sources: [] });
    expect(extractRoleCapabilities({ role: 'pro' })).toMatchObject({ capabilities: [], sources: [] });
    expect(extractRoleCapabilities({ role: 'spacer', capabilities: ['vip_spacer'] })).toMatchObject({ capabilities: [], sources: [] });
    expect(isVipCapability({ roles: ['vip-spacer'] })).toBe(true);
    expect(isVipCapability({ role: 'admin' })).toBe(false);
  });

  it('classifies role evidence using current claim behavior versus preview capability behavior', () => {
    expect(classifyRoleEvidence({ role: 'vip' })).toMatchObject({ alignment: 'aligned', roleClaimConflictsWithRoles: false, vipAliasOnlyInRoles: false, rolesOrderSensitive: false });
    expect(classifyRoleEvidence({ role: 'spacer', roles: ['VIP'] })).toMatchObject({
      alignment: 'preview_grants_claim_rejects',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: true,
      rolesOrderSensitive: false,
    });
    expect(classifyRoleEvidence({ role: 'spacer', roles: ['vip_spacer'] })).toMatchObject({
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    });
    expect(classifyRoleEvidence({ roles: ['member', 'admin'] })).toMatchObject({
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: true,
    });
  });

  it('keeps claim_allows_preview_requires_condition reserved under current schema v1 rules', () => {
    const alignments = identityGoldenFixtures.map((fixture) => classifyRoleEvidence(fixture.rawInputPayload).alignment);
    expect(alignments).not.toContain('claim_allows_preview_requires_condition');
  });

  it('normalizes every golden fixture to the expected schema v1 outputs', () => {
    for (const fixture of identityGoldenFixtures) {
      expectPayloadMatchesFixture(normalizeRolePayload(fixture.rawInputPayload), fixture);
    }
  });

  it('keeps normalized payload outputs deterministic', () => {
    for (const fixture of identityGoldenFixtures) {
      expect(normalizeRolePayload(fixture.rawInputPayload), fixture.id).toEqual(normalizeRolePayload(fixture.rawInputPayload));
    }
  });
});
