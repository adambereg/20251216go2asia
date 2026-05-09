export type IdentitySchemaVersion = 1;
export type IdentityGoldenFixtureVersion = 1;

export type CanonicalPlatformRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';
export type IdentityCapability = 'vip_spacer';

export type IdentityRoleTokenClass = 'missing' | 'canonical' | 'vip_alias' | 'spacer_alias' | 'unknown' | 'non_string';

export type IdentityRoleSource =
  | 'role'
  | 'go2_role'
  | 'public_metadata.role'
  | 'publicMetadata.role'
  | 'roles[]'
  | 'capabilities[]'
  | 'default_spacer';

export type IdentityEvidenceAlignment = 'aligned' | 'preview_grants_claim_rejects' | 'claim_allows_preview_requires_condition';

export type IdentityPreviewState = 'available' | 'requires_condition' | 'checking_or_temporarily_unavailable' | 'ordinary_no_preview' | 'unavailable' | 'not_enabled';

export type IdentityGoldenFixtureGroup =
  | 'canonical_happy_path'
  | 'alias_case'
  | 'role_roles_conflict'
  | 'metadata_precedence'
  | 'order_sensitive_array'
  | 'malformed_payload'
  | 'missing_payload'
  | 'future_capability_combination';

export type IdentityRolePayload = {
  role?: unknown;
  go2_role?: unknown;
  public_metadata?: { role?: unknown } | null;
  publicMetadata?: { role?: unknown } | null;
  roles?: unknown;
  capabilities?: unknown;
};

export type IdentityTokenMetadata = {
  source: IdentityRoleSource;
  index?: number;
  tokenClass: IdentityRoleTokenClass;
  normalizedToken: string | null;
  canonicalRole: CanonicalPlatformRole | null;
};

export type NormalizationMetadata = {
  containsRawJwt: false;
  containsPii: false;
  defaulted: boolean;
  sourcePrecedence: IdentityRoleSource[];
  tokenClasses: IdentityTokenMetadata[];
};

export type PlatformRoleExtraction = {
  schemaVersion: IdentitySchemaVersion;
  platformRole: CanonicalPlatformRole;
  source: IdentityRoleSource;
  defaulted: boolean;
  metadata: NormalizationMetadata;
};

export type CapabilityExtraction = {
  schemaVersion: IdentitySchemaVersion;
  capabilities: IdentityCapability[];
  sources: IdentityRoleSource[];
  metadata: NormalizationMetadata;
};

export type RoleEvidenceClassification = {
  schemaVersion: IdentitySchemaVersion;
  alignment: IdentityEvidenceAlignment;
  roleClaimConflictsWithRoles: boolean;
  vipAliasOnlyInRoles: boolean;
  rolesOrderSensitive: boolean;
  metadata: NormalizationMetadata;
};

export type NormalizedRolePayload = {
  schemaVersion: IdentitySchemaVersion;
  platformRole: PlatformRoleExtraction;
  capabilities: CapabilityExtraction;
  evidence: RoleEvidenceClassification;
  metadata: NormalizationMetadata;
};

export type IdentityClaimVipSource = 'platform_role' | 'exact_roles_array' | 'none';

export type IdentityGoldenFixture = {
  fixtureVersion: IdentityGoldenFixtureVersion;
  schemaVersion: IdentitySchemaVersion;
  id: string;
  group: IdentityGoldenFixtureGroup;
  description: string;
  rawInputPayload: IdentityRolePayload;
  expected: {
    platformRole: {
      value: CanonicalPlatformRole;
      source: IdentityRoleSource;
      defaulted: boolean;
    };
    capabilities: IdentityCapability[];
    claimVipBehavior: {
      currentClaimAllowsVip: boolean;
      source: IdentityClaimVipSource;
    };
    previewBehavior: {
      currentPreviewVip: boolean;
      expectedPreviewState: IdentityPreviewState;
      informationalOnly: true;
      claimBehaviorUnchanged: true;
    };
    divergence: {
      alignment: IdentityEvidenceAlignment;
      roleClaimConflictsWithRoles: boolean;
      vipAliasOnlyInRoles: boolean;
      rolesOrderSensitive: boolean;
    };
    normalizationMetadata: NormalizationMetadata;
  };
  compatibility: {
    breakingIfChanged: boolean;
    notes: string[];
  };
};

export type IdentityFixtureValidationResult = {
  valid: boolean;
  errors: string[];
};
