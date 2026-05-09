import {
  IDENTITY_CAPABILITIES,
  IDENTITY_ROLE_SOURCE_PRECEDENCE,
  IDENTITY_SCHEMA_VERSION,
} from './constants';
import type {
  CanonicalPlatformRole,
  CapabilityExtraction,
  IdentityCapability,
  IdentityRolePayload,
  IdentityRoleSource,
  IdentityRoleTokenClass,
  IdentityTokenMetadata,
  NormalizationMetadata,
  NormalizedRolePayload,
  NormalizedRoleToken,
  PlatformRoleExtraction,
  RoleEvidenceClassification,
} from './types';

type RoleValueWithSource = {
  source: IdentityRoleSource;
  value: unknown;
  index?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const token = value.trim().toLowerCase();
  return token.length > 0 ? token : null;
}

function classifyToken(value: unknown, token: string | null): IdentityRoleTokenClass {
  if (value === undefined || value === null) return 'missing';
  if (typeof value !== 'string') return 'non_string';
  if (!token) return 'missing';
  if (token === 'vip' || token === 'vip-spacer') return 'vip_alias';
  if (token === 'member' || token === 'user') return 'spacer_alias';
  if (token === 'admin' || token === 'pro' || token === 'spacer' || token === 'vip_spacer') return 'canonical';
  return 'unknown';
}

function canonicalRoleForToken(token: string | null): CanonicalPlatformRole | null {
  if (!token) return null;
  if (token === 'admin') return 'admin';
  if (token === 'pro') return 'pro';
  if (token === 'vip_spacer' || token === 'vip-spacer' || token === 'vip') return 'vip_spacer';
  if (token === 'spacer' || token === 'member' || token === 'user') return 'spacer';
  return null;
}

function matchedAliasForToken(token: string | null): string | null {
  if (!token) return null;
  if (token === 'vip' || token === 'vip-spacer' || token === 'member' || token === 'user') return token;
  return null;
}

export function normalizeRoleToken(value: unknown): NormalizedRoleToken {
  const token = normalizedString(value);
  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    rawTokenClass: classifyToken(value, token),
    normalizedToken: token,
    canonicalRole: canonicalRoleForToken(token),
    matchedAlias: matchedAliasForToken(token),
  };
}

function roleValues(input: IdentityRolePayload): RoleValueWithSource[] {
  const values: RoleValueWithSource[] = [];
  if (Object.prototype.hasOwnProperty.call(input, 'role')) values.push({ source: 'role', value: input.role });
  if (Object.prototype.hasOwnProperty.call(input, 'go2_role')) values.push({ source: 'go2_role', value: input.go2_role });
  if (isRecord(input.public_metadata) && Object.prototype.hasOwnProperty.call(input.public_metadata, 'role')) {
    values.push({ source: 'public_metadata.role', value: input.public_metadata.role });
  }
  if (isRecord(input.publicMetadata) && Object.prototype.hasOwnProperty.call(input.publicMetadata, 'role')) {
    values.push({ source: 'publicMetadata.role', value: input.publicMetadata.role });
  }

  if (Object.prototype.hasOwnProperty.call(input, 'roles')) {
    const roles = Array.isArray(input.roles) ? input.roles : [input.roles];
    roles.forEach((value, index) => values.push({ source: 'roles[]', value, index }));
  }

  if (Object.prototype.hasOwnProperty.call(input, 'capabilities')) {
    const capabilities = Array.isArray(input.capabilities) ? input.capabilities : [input.capabilities];
    capabilities.forEach((value, index) => values.push({ source: 'capabilities[]', value, index }));
  }

  return values;
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

function tokenMetadata(value: RoleValueWithSource): IdentityTokenMetadata {
  const normalized = normalizeRoleToken(value.value);
  const base = {
    source: value.source,
    tokenClass: normalized.rawTokenClass,
    normalizedToken: normalized.normalizedToken,
    canonicalRole: normalized.canonicalRole,
  };
  return value.index === undefined ? base : { ...base, index: value.index };
}

function scalarRoleValues(input: IdentityRolePayload): RoleValueWithSource[] {
  return roleValues(input).filter((value) => value.source !== 'roles[]' && value.source !== 'capabilities[]');
}

function rolesArrayValues(input: IdentityRolePayload): RoleValueWithSource[] {
  return roleValues(input).filter((value) => value.source === 'roles[]');
}

function allMetadata(input: IdentityRolePayload, defaulted: boolean): NormalizationMetadata {
  return metadata(defaulted, roleValues(input).map(tokenMetadata));
}

export function extractPlatformRole(input: IdentityRolePayload): PlatformRoleExtraction {
  const scalarValues = scalarRoleValues(input);
  const roles = rolesArrayValues(input);

  for (const value of scalarValues) {
    const normalized = normalizeRoleToken(value.value);
    if (normalized.canonicalRole) {
      return {
        schemaVersion: IDENTITY_SCHEMA_VERSION,
        platformRole: normalized.canonicalRole,
        source: value.source,
        defaulted: false,
        metadata: allMetadata(input, false),
      };
    }
  }

  for (const value of roles) {
    const normalized = normalizeRoleToken(value.value);
    if (normalized.canonicalRole) {
      return {
        schemaVersion: IDENTITY_SCHEMA_VERSION,
        platformRole: normalized.canonicalRole,
        source: 'roles[]',
        defaulted: false,
        metadata: allMetadata(input, false),
      };
    }
  }

  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    platformRole: 'spacer',
    source: 'default_spacer',
    defaulted: true,
    metadata: allMetadata(input, true),
  };
}

function sortedCapabilities(values: Iterable<IdentityCapability>): IdentityCapability[] {
  const selected = new Set(values);
  return IDENTITY_CAPABILITIES.filter((capability) => selected.has(capability));
}

function uniqueSources(values: IdentityRoleSource[]): IdentityRoleSource[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}

export function extractRoleCapabilities(input: IdentityRolePayload): CapabilityExtraction {
  const platformRole = extractPlatformRole(input);
  const capabilities = new Set<IdentityCapability>();
  const sources: IdentityRoleSource[] = [];

  if (platformRole.platformRole === 'vip_spacer') {
    capabilities.add('vip_spacer');
    sources.push(platformRole.source);
  }

  for (const value of rolesArrayValues(input)) {
    const normalized = normalizeRoleToken(value.value);
    if (normalized.canonicalRole === 'vip_spacer') {
      capabilities.add('vip_spacer');
      sources.push('roles[]');
    }
  }

  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    capabilities: sortedCapabilities(capabilities),
    sources: uniqueSources(sources),
    metadata: allMetadata(input, platformRole.defaulted),
  };
}

export function isVipCapability(input: IdentityRolePayload): boolean {
  return extractRoleCapabilities(input).capabilities.includes('vip_spacer');
}

function exactVipSpacerRoleInArray(input: IdentityRolePayload): boolean {
  return rolesArrayValues(input).some((value) => normalizedString(value.value) === 'vip_spacer');
}

function normalizedRoles(input: IdentityRolePayload): CanonicalPlatformRole[] {
  return rolesArrayValues(input)
    .map((value) => normalizeRoleToken(value.value).canonicalRole)
    .filter((role): role is CanonicalPlatformRole => Boolean(role));
}

function roleClaimConflictsWithRoles(platformRole: CanonicalPlatformRole, input: IdentityRolePayload): boolean {
  return normalizedRoles(input).some((role) => role !== platformRole);
}

function vipAliasOnlyInRoles(input: IdentityRolePayload): boolean {
  const hasVipAlias = rolesArrayValues(input).some((value) => {
    const token = normalizedString(value.value);
    return token === 'vip' || token === 'vip-spacer';
  });
  return hasVipAlias && !exactVipSpacerRoleInArray(input);
}

function rolesOrderSensitive(input: IdentityRolePayload): boolean {
  return new Set(normalizedRoles(input)).size > 1;
}

export function classifyRoleEvidence(input: IdentityRolePayload): RoleEvidenceClassification {
  const platformRole = extractPlatformRole(input);
  const claimVip = platformRole.platformRole === 'vip_spacer' || exactVipSpacerRoleInArray(input);
  const previewVip = isVipCapability(input);
  const alignment = previewVip === claimVip ? 'aligned' : previewVip ? 'preview_grants_claim_rejects' : 'claim_allows_preview_requires_condition';

  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    alignment,
    roleClaimConflictsWithRoles: roleClaimConflictsWithRoles(platformRole.platformRole, input),
    vipAliasOnlyInRoles: vipAliasOnlyInRoles(input),
    rolesOrderSensitive: rolesOrderSensitive(input),
    metadata: allMetadata(input, platformRole.defaulted),
  };
}

export function normalizeRolePayload(input: IdentityRolePayload): NormalizedRolePayload {
  const platformRole = extractPlatformRole(input);
  const capabilities = extractRoleCapabilities(input);
  const evidence = classifyRoleEvidence(input);

  return {
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    platformRole,
    capabilities,
    evidence,
    metadata: allMetadata(input, platformRole.defaulted),
  };
}
