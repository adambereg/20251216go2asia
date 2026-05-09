import {
  CANONICAL_PLATFORM_ROLES,
  IDENTITY_CAPABILITIES,
  IDENTITY_EVIDENCE_ALIGNMENTS,
  IDENTITY_GOLDEN_FIXTURE_GROUPS,
  IDENTITY_GOLDEN_FIXTURE_VERSION,
  IDENTITY_PREVIEW_STATES,
  IDENTITY_ROLE_SOURCES,
  IDENTITY_ROLE_SOURCE_PRECEDENCE,
  IDENTITY_SCHEMA_VERSION,
} from './constants';
import type {
  CanonicalPlatformRole,
  IdentityCapability,
  IdentityEvidenceAlignment,
  IdentityFixtureValidationResult,
  IdentityGoldenFixture,
  IdentityGoldenFixtureGroup,
  IdentityPreviewState,
  IdentityRoleSource,
  IdentityTokenMetadata,
  NormalizationMetadata,
} from './types';

function tokenClass(source: IdentityRoleSource, tokenClass: IdentityTokenMetadata['tokenClass'], normalizedToken: string | null, canonicalRole: CanonicalPlatformRole | null, index?: number): IdentityTokenMetadata {
  return index === undefined
    ? { source, tokenClass, normalizedToken, canonicalRole }
    : { source, index, tokenClass, normalizedToken, canonicalRole };
}

function metadata(defaulted: boolean, tokenClasses: IdentityTokenMetadata[]): NormalizationMetadata {
  return {
    containsRawJwt: false,
    containsPii: false,
    defaulted,
    sourcePrecedence: [...IDENTITY_ROLE_SOURCE_PRECEDENCE],
    tokenClasses,
  };
}

function fixture(input: IdentityGoldenFixture): IdentityGoldenFixture {
  return input;
}

export const identityGoldenFixtures: readonly IdentityGoldenFixture[] = [
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'alias-role-vip',
    group: 'alias_case',
    description: 'Top-level vip alias canonicalizes to vip_spacer for schema v1.',
    rawInputPayload: { role: 'vip' },
    expected: {
      platformRole: { value: 'vip_spacer', source: 'role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'platform_role' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'vip_alias', 'vip', 'vip_spacer')]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Alias additions or removals must not silently change this canonical output.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'alias-role-vip-spacer',
    group: 'alias_case',
    description: 'Top-level vip-spacer alias canonicalizes to vip_spacer.',
    rawInputPayload: { role: 'vip-spacer' },
    expected: {
      platformRole: { value: 'vip_spacer', source: 'role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'platform_role' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'vip_alias', 'vip-spacer', 'vip_spacer')]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Maintains compatibility with existing gateway alias handling.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'canonical-role-vip-spacer',
    group: 'canonical_happy_path',
    description: 'Canonical vip_spacer top-level role remains stable.',
    rawInputPayload: { role: 'vip_spacer' },
    expected: {
      platformRole: { value: 'vip_spacer', source: 'role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'platform_role' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'canonical', 'vip_spacer', 'vip_spacer')]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Canonical role output is a schema v1 compatibility anchor.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'conflict-role-spacer-roles-vip',
    group: 'role_roles_conflict',
    description: 'Top-level spacer wins platform role while VIP alias in roles remains a preview/claim divergence case.',
    rawInputPayload: { role: 'spacer', roles: ['VIP'] },
    expected: {
      platformRole: { value: 'spacer', source: 'role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'preview_grants_claim_rejects',
        roleClaimConflictsWithRoles: true,
        vipAliasOnlyInRoles: true,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'canonical', 'spacer', 'spacer'), tokenClass('roles[]', 'vip_alias', 'vip', 'vip_spacer', 0)]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Documents the current unresolved preview-vs-claim divergence for VIP aliases in roles[].'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'conflict-role-spacer-roles-vip-spacer',
    group: 'role_roles_conflict',
    description: 'Top-level spacer wins platform role while exact vip_spacer in roles is still allowed by current claim behavior.',
    rawInputPayload: { role: 'spacer', roles: ['vip_spacer'] },
    expected: {
      platformRole: { value: 'spacer', source: 'role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'exact_roles_array' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: true,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'canonical', 'spacer', 'spacer'), tokenClass('roles[]', 'canonical', 'vip_spacer', 'vip_spacer', 0)]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Keeps exact roles[] VIP behavior separate from top-level platform role semantics.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'future-capability-placeholder',
    group: 'future_capability_combination',
    description: 'Unknown future capability-like strings are metadata-only until a schema-approved capability is added.',
    rawInputPayload: { role: 'spacer', capabilities: ['future_capability_placeholder'] },
    expected: {
      platformRole: { value: 'spacer', source: 'role', defaulted: false },
      capabilities: [],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: false,
        expectedPreviewState: 'requires_condition',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'canonical', 'spacer', 'spacer'), tokenClass('capabilities[]', 'unknown', 'future_capability_placeholder', null, 0)]),
    },
    compatibility: {
      breakingIfChanged: false,
      notes: ['Placeholder prevents accidental capability grants before a future schema decision.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'malformed-role-falls-through-roles-vip',
    group: 'malformed_payload',
    description: 'Malformed top-level role does not throw and roles[] can still provide a recognized canonical value.',
    rawInputPayload: { role: 42, roles: ['vip'] },
    expected: {
      platformRole: { value: 'vip_spacer', source: 'roles[]', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'platform_role' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: true,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'non_string', null, null), tokenClass('roles[]', 'vip_alias', 'vip', 'vip_spacer', 0)]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Malformed identity payloads must remain deterministic and fail closed unless a safe fallback exists.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'metadata-go2-role-precedes-public-metadata',
    group: 'metadata_precedence',
    description: 'go2_role precedes public metadata and roles[] for platform role extraction.',
    rawInputPayload: { go2_role: 'pro', public_metadata: { role: 'vip_spacer' }, roles: ['vip_spacer'] },
    expected: {
      platformRole: { value: 'pro', source: 'go2_role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'exact_roles_array' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: true,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [
        tokenClass('go2_role', 'canonical', 'pro', 'pro'),
        tokenClass('public_metadata.role', 'canonical', 'vip_spacer', 'vip_spacer'),
        tokenClass('roles[]', 'canonical', 'vip_spacer', 'vip_spacer', 0),
      ]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Source precedence changes require explicit schema review.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'missing-role-defaults-spacer',
    group: 'missing_payload',
    description: 'Missing identity role payload defaults to spacer without granting capabilities.',
    rawInputPayload: {},
    expected: {
      platformRole: { value: 'spacer', source: 'default_spacer', defaulted: true },
      capabilities: [],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: false,
        expectedPreviewState: 'requires_condition',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(true, []),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Default spacer behavior is a schema v1 compatibility anchor.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'order-roles-admin-member',
    group: 'order_sensitive_array',
    description: 'When no scalar role exists, the first recognized roles[] value can determine platform role.',
    rawInputPayload: { roles: ['admin', 'member'] },
    expected: {
      platformRole: { value: 'admin', source: 'roles[]', defaulted: false },
      capabilities: [],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: false,
        expectedPreviewState: 'requires_condition',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: true,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: true,
      },
      normalizationMetadata: metadata(false, [tokenClass('roles[]', 'canonical', 'admin', 'admin', 0), tokenClass('roles[]', 'spacer_alias', 'member', 'spacer', 1)]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Documents order sensitivity until roles[] precedence is migrated or replaced.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'order-roles-member-admin',
    group: 'order_sensitive_array',
    description: 'The inverse roles[] order chooses spacer first and records order sensitivity.',
    rawInputPayload: { roles: ['member', 'admin'] },
    expected: {
      platformRole: { value: 'spacer', source: 'roles[]', defaulted: false },
      capabilities: [],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: false,
        expectedPreviewState: 'requires_condition',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: true,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: true,
      },
      normalizationMetadata: metadata(false, [tokenClass('roles[]', 'spacer_alias', 'member', 'spacer', 0), tokenClass('roles[]', 'canonical', 'admin', 'admin', 1)]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Paired with order-roles-admin-member to lock deterministic ordering expectations.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'unknown-role-falls-through-go2-role',
    group: 'malformed_payload',
    description: 'Unknown top-level role does not block a later canonical go2_role under schema v1 helper policy.',
    rawInputPayload: { role: 'unknown_role', go2_role: 'vip_spacer' },
    expected: {
      platformRole: { value: 'vip_spacer', source: 'go2_role', defaulted: false },
      capabilities: ['vip_spacer'],
      claimVipBehavior: { currentClaimAllowsVip: true, source: 'platform_role' },
      previewBehavior: {
        currentPreviewVip: true,
        expectedPreviewState: 'available',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'unknown', 'unknown_role', null), tokenClass('go2_role', 'canonical', 'vip_spacer', 'vip_spacer')]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Documents schema v1 Option A: unknown scalar sources do not block later canonical scalar sources.'],
    },
  }),
  fixture({
    fixtureVersion: IDENTITY_GOLDEN_FIXTURE_VERSION,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    id: 'unknown-role-falls-through-public-metadata-role',
    group: 'malformed_payload',
    description: 'Unknown top-level role does not block a later canonical public metadata role under schema v1 helper policy.',
    rawInputPayload: { role: 'unknown_role', public_metadata: { role: 'pro' } },
    expected: {
      platformRole: { value: 'pro', source: 'public_metadata.role', defaulted: false },
      capabilities: [],
      claimVipBehavior: { currentClaimAllowsVip: false, source: 'none' },
      previewBehavior: {
        currentPreviewVip: false,
        expectedPreviewState: 'requires_condition',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
      divergence: {
        alignment: 'aligned',
        roleClaimConflictsWithRoles: false,
        vipAliasOnlyInRoles: false,
        rolesOrderSensitive: false,
      },
      normalizationMetadata: metadata(false, [tokenClass('role', 'unknown', 'unknown_role', null), tokenClass('public_metadata.role', 'canonical', 'pro', 'pro')]),
    },
    compatibility: {
      breakingIfChanged: true,
      notes: ['Documents schema v1 Option A for metadata fallback after an unknown scalar role.'],
    },
  }),
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isKnown<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.includes(value as T);
}

function hasUnsafeKey(key: string): boolean {
  return /^(email|wallet|nft|g2a|secret|session|token|jwt|authorization|auth|userId|user_id|subject|sub)$/i.test(key);
}

function hasUnsafeString(value: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value) || /\b(email|wallet|nft|g2a|secret|session|jwt|bearer)\b/i.test(value);
}

export function assertNoUnsafeIdentityFixtureFields(value: unknown, path = 'rawInputPayload'): string[] {
  const errors: string[] = [];
  if (typeof value === 'string') {
    if (hasUnsafeString(value)) errors.push(`${path} contains unsafe string value`);
    return errors;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...assertNoUnsafeIdentityFixtureFields(item, `${path}[${index}]`));
    });
    return errors;
  }

  if (!isRecord(value)) return errors;

  for (const [key, nested] of Object.entries(value)) {
    const nestedPath = `${path}.${key}`;
    if (hasUnsafeKey(key)) errors.push(`${nestedPath} uses an unsafe identity field name`);
    errors.push(...assertNoUnsafeIdentityFixtureFields(nested, nestedPath));
  }

  return errors;
}

export function validateIdentityGoldenFixture(fixtureToValidate: IdentityGoldenFixture): IdentityFixtureValidationResult {
  const errors: string[] = [];

  if (fixtureToValidate.fixtureVersion !== IDENTITY_GOLDEN_FIXTURE_VERSION) errors.push(`${fixtureToValidate.id} has unsupported fixtureVersion`);
  if (fixtureToValidate.schemaVersion !== IDENTITY_SCHEMA_VERSION) errors.push(`${fixtureToValidate.id} has unsupported schemaVersion`);
  if (!fixtureToValidate.id) errors.push('fixture id is required');
  if (!isKnown<IdentityGoldenFixtureGroup>(fixtureToValidate.group, IDENTITY_GOLDEN_FIXTURE_GROUPS)) errors.push(`${fixtureToValidate.id} has unknown group`);
  if (!isRecord(fixtureToValidate.rawInputPayload)) errors.push(`${fixtureToValidate.id} rawInputPayload must be an object`);

  const expected = fixtureToValidate.expected;
  if (!isKnown<CanonicalPlatformRole>(expected.platformRole.value, CANONICAL_PLATFORM_ROLES)) errors.push(`${fixtureToValidate.id} has invalid expected platform role`);
  if (!isKnown<IdentityRoleSource>(expected.platformRole.source, IDENTITY_ROLE_SOURCES)) errors.push(`${fixtureToValidate.id} has invalid platform role source`);
  for (const capability of expected.capabilities) {
    if (!isKnown<IdentityCapability>(capability, IDENTITY_CAPABILITIES)) errors.push(`${fixtureToValidate.id} has invalid capability ${capability}`);
  }
  if (!isKnown<IdentityPreviewState>(expected.previewBehavior.expectedPreviewState, IDENTITY_PREVIEW_STATES)) errors.push(`${fixtureToValidate.id} has invalid preview state`);
  if (!isKnown<IdentityEvidenceAlignment>(expected.divergence.alignment, IDENTITY_EVIDENCE_ALIGNMENTS)) errors.push(`${fixtureToValidate.id} has invalid evidence alignment`);
  if (expected.normalizationMetadata.containsRawJwt !== false) errors.push(`${fixtureToValidate.id} metadata must not contain raw JWTs`);
  if (expected.normalizationMetadata.containsPii !== false) errors.push(`${fixtureToValidate.id} metadata must not contain PII`);
  if (expected.platformRole.defaulted !== expected.normalizationMetadata.defaulted) errors.push(`${fixtureToValidate.id} defaulted metadata is inconsistent`);
  if (fixtureToValidate.compatibility.notes.length === 0) errors.push(`${fixtureToValidate.id} must include compatibility notes`);

  errors.push(...assertNoUnsafeIdentityFixtureFields(fixtureToValidate.rawInputPayload));

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateIdentityGoldenFixtures(fixturesToValidate: readonly IdentityGoldenFixture[] = identityGoldenFixtures): IdentityFixtureValidationResult {
  const errors = fixturesToValidate.flatMap((item) => validateIdentityGoldenFixture(item).errors);
  const seen = new Set<string>();
  const ids = fixturesToValidate.map((item) => item.id);
  for (const id of ids) {
    if (seen.has(id)) errors.push(`duplicate fixture id ${id}`);
    seen.add(id);
  }

  const sortedIds = [...ids].sort((left, right) => left.localeCompare(right));
  if (ids.some((id, index) => id !== sortedIds[index])) errors.push('fixture ids must be sorted for deterministic ordering');

  return {
    valid: errors.length === 0,
    errors,
  };
}
