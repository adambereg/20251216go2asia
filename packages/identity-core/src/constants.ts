import type {
  CanonicalPlatformRole,
  IdentityCapability,
  IdentityEvidenceAlignment,
  IdentityGoldenFixtureGroup,
  IdentityGoldenFixtureVersion,
  IdentityPreviewState,
  IdentityRoleSource,
  IdentityRoleTokenClass,
  IdentitySchemaVersion,
} from './types';

export const IDENTITY_SCHEMA_VERSION: IdentitySchemaVersion = 1;
export const IDENTITY_GOLDEN_FIXTURE_VERSION: IdentityGoldenFixtureVersion = 1;

export const CANONICAL_PLATFORM_ROLES: readonly CanonicalPlatformRole[] = ['spacer', 'vip_spacer', 'pro', 'admin'] as const;

export const IDENTITY_CAPABILITIES: readonly IdentityCapability[] = ['vip_spacer'] as const;

export const IDENTITY_ROLE_TOKEN_CLASSES: readonly IdentityRoleTokenClass[] = ['missing', 'canonical', 'vip_alias', 'spacer_alias', 'unknown', 'non_string'] as const;

export const IDENTITY_ROLE_SOURCES: readonly IdentityRoleSource[] = [
  'role',
  'go2_role',
  'public_metadata.role',
  'publicMetadata.role',
  'roles[]',
  'capabilities[]',
  'default_spacer',
] as const;

export const IDENTITY_ROLE_SOURCE_PRECEDENCE: readonly IdentityRoleSource[] = [
  'role',
  'go2_role',
  'public_metadata.role',
  'publicMetadata.role',
  'roles[]',
  'default_spacer',
] as const;

export const IDENTITY_EVIDENCE_ALIGNMENTS: readonly IdentityEvidenceAlignment[] = [
  'aligned',
  'preview_grants_claim_rejects',
  'claim_allows_preview_requires_condition',
] as const;

export const IDENTITY_PREVIEW_STATES: readonly IdentityPreviewState[] = [
  'available',
  'requires_condition',
  'checking_or_temporarily_unavailable',
  'ordinary_no_preview',
  'unavailable',
  'not_enabled',
] as const;

export const IDENTITY_GOLDEN_FIXTURE_GROUPS: readonly IdentityGoldenFixtureGroup[] = [
  'canonical_happy_path',
  'alias_case',
  'role_roles_conflict',
  'metadata_precedence',
  'order_sensitive_array',
  'malformed_payload',
  'missing_payload',
  'future_capability_combination',
] as const;
