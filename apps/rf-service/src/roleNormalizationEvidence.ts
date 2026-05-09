import {
  normalizeCanonicalRole,
  normalizeRoleArray,
  normalizeRoleDecision,
  type CanonicalRole,
  type RoleVipPreviewState,
} from './roleVipAdapterContracts';

export type RoleEvidenceClaimSource = 'role' | 'go2_role' | 'public_metadata.role' | 'publicMetadata.role' | 'roles[]' | 'default_spacer';
export type RoleEvidenceAlignment = 'aligned' | 'preview_grants_claim_rejects' | 'claim_allows_preview_requires_condition';
export type RoleEvidenceTokenClass = 'missing' | 'canonical' | 'vip_alias' | 'spacer_alias' | 'unknown' | 'non_string';

export type RoleEvidenceInput = {
  role?: unknown;
  go2_role?: unknown;
  public_metadata?: {
    role?: unknown;
  };
  publicMetadata?: {
    role?: unknown;
  };
  roles?: unknown;
};

export type RoleEvidenceSnapshot = {
  schemaVersion: 1;
  containsRawJwt: false;
  containsPii: false;
  presence: {
    role: boolean;
    roles: boolean;
    go2_role: boolean;
    public_metadata_role: boolean;
    publicMetadata_role: boolean;
  };
  claimCanonicalization: Array<{
    source: Exclude<RoleEvidenceClaimSource, 'roles[]' | 'default_spacer'>;
    present: boolean;
    tokenClass: RoleEvidenceTokenClass;
    normalizedToken: string | null;
    canonicalRole: CanonicalRole | null;
  }>;
  roleArray: Array<{
    index: number;
    tokenClass: RoleEvidenceTokenClass;
    normalizedToken: string | null;
    canonicalRole: CanonicalRole | null;
  }>;
  gateway: {
    platformRole: CanonicalRole;
    roleSource: RoleEvidenceClaimSource;
    forwardedRoles: string[];
  };
  rfAuth: {
    platformRole: CanonicalRole;
    roleSource: 'role' | 'roles[]' | 'default_spacer';
  };
  claimGate: {
    isVipSpacer: boolean;
    exactVipSpacerRoleInArray: boolean;
  };
  previewAdapter: {
    state: RoleVipPreviewState;
    isVip: boolean;
    reasonCode: string;
    degradedMode: string;
  };
  divergence: {
    alignment: RoleEvidenceAlignment;
    roleClaimConflictsWithRoles: boolean;
    vipAliasOnlyInRoles: boolean;
    rolesOrderSensitive: boolean;
  };
};

function normalizedToken(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const token = value.trim().toLowerCase();
  return token.length > 0 ? token : null;
}

function tokenClass(value: unknown): RoleEvidenceTokenClass {
  if (value === undefined || value === null) return 'missing';
  if (typeof value !== 'string') return 'non_string';
  const token = normalizedToken(value);
  if (!token) return 'missing';
  if (token === 'vip' || token === 'vip-spacer') return 'vip_alias';
  if (token === 'member' || token === 'user') return 'spacer_alias';
  return normalizeCanonicalRole(token) ? 'canonical' : 'unknown';
}

function stringRoleArray(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function firstCanonicalFromClaims(input: RoleEvidenceInput): { source: RoleEvidenceClaimSource; role: CanonicalRole } | null {
  const claims: Array<{ source: Exclude<RoleEvidenceClaimSource, 'roles[]' | 'default_spacer'>; value: unknown }> = [
    { source: 'role', value: input.role },
    { source: 'go2_role', value: input.go2_role },
    { source: 'public_metadata.role', value: input.public_metadata?.role },
    { source: 'publicMetadata.role', value: input.publicMetadata?.role },
  ];

  for (const claim of claims) {
    const canonical = normalizeCanonicalRole(claim.value);
    if (canonical) return { source: claim.source, role: canonical };
  }

  return null;
}

function deriveGatewayRole(input: RoleEvidenceInput): { platformRole: CanonicalRole; roleSource: RoleEvidenceClaimSource; forwardedRoles: string[] } {
  const roles = stringRoleArray(input.roles);
  const claimRole = firstCanonicalFromClaims(input);
  if (claimRole) {
    return {
      platformRole: claimRole.role,
      roleSource: claimRole.source,
      forwardedRoles: roles.length > 0 ? roles : [claimRole.role],
    };
  }

  const canonicalRoles = normalizeRoleArray(roles);
  if (canonicalRoles[0]) {
    return {
      platformRole: canonicalRoles[0],
      roleSource: 'roles[]',
      forwardedRoles: roles,
    };
  }

  return {
    platformRole: 'spacer',
    roleSource: 'default_spacer',
    forwardedRoles: roles.length > 0 ? roles : ['spacer'],
  };
}

function deriveRfPlatformRole(role: string, roles: string[]): { platformRole: CanonicalRole; roleSource: 'role' | 'roles[]' | 'default_spacer' } {
  const fromRole = normalizeCanonicalRole(role);
  if (fromRole) return { platformRole: fromRole, roleSource: 'role' };
  const fromRoles = normalizeRoleArray(roles);
  return fromRoles[0] ? { platformRole: fromRoles[0], roleSource: 'roles[]' } : { platformRole: 'spacer', roleSource: 'default_spacer' };
}

function exactVipSpacerRoleInArray(roles: string[]): boolean {
  return roles.some((role) => role.trim().toLowerCase() === 'vip_spacer');
}

function roleClaimConflictsWithRoles(platformRole: CanonicalRole, roles: string[]): boolean {
  const canonicalRoles = normalizeRoleArray(roles);
  return canonicalRoles.some((role) => role !== platformRole);
}

function vipAliasOnlyInRoles(roles: string[]): boolean {
  const hasVipAlias = roles.some((role) => {
    const token = normalizedToken(role);
    return token === 'vip' || token === 'vip-spacer';
  });
  return hasVipAlias && !exactVipSpacerRoleInArray(roles);
}

function rolesOrderSensitive(roles: string[]): boolean {
  const canonicalRoles = normalizeRoleArray(roles);
  return new Set(canonicalRoles).size > 1;
}

function classifyAlignment(previewVip: boolean, claimVip: boolean): RoleEvidenceAlignment {
  if (previewVip === claimVip) return 'aligned';
  return previewVip ? 'preview_grants_claim_rejects' : 'claim_allows_preview_requires_condition';
}

export function createRoleNormalizationEvidenceSnapshot(input: RoleEvidenceInput): RoleEvidenceSnapshot {
  const gateway = deriveGatewayRole(input);
  const rfAuth = deriveRfPlatformRole(gateway.platformRole, gateway.forwardedRoles);
  const claimVip = rfAuth.platformRole === 'vip_spacer' || exactVipSpacerRoleInArray(gateway.forwardedRoles);
  const previewDecision = normalizeRoleDecision({
    source: 'vip_status',
    principal: {
      userId: 'redacted_staging_subject',
      platformRole: rfAuth.platformRole,
      roles: gateway.forwardedRoles,
    },
  });

  return {
    schemaVersion: 1,
    containsRawJwt: false,
    containsPii: false,
    presence: {
      role: Object.prototype.hasOwnProperty.call(input, 'role'),
      roles: Object.prototype.hasOwnProperty.call(input, 'roles'),
      go2_role: Object.prototype.hasOwnProperty.call(input, 'go2_role'),
      public_metadata_role: Object.prototype.hasOwnProperty.call(input.public_metadata ?? {}, 'role'),
      publicMetadata_role: Object.prototype.hasOwnProperty.call(input.publicMetadata ?? {}, 'role'),
    },
    claimCanonicalization: [
      { source: 'role', value: input.role },
      { source: 'go2_role', value: input.go2_role },
      { source: 'public_metadata.role', value: input.public_metadata?.role },
      { source: 'publicMetadata.role', value: input.publicMetadata?.role },
    ].map((claim) => ({
      source: claim.source as Exclude<RoleEvidenceClaimSource, 'roles[]' | 'default_spacer'>,
      present: claim.value !== undefined,
      tokenClass: tokenClass(claim.value),
      normalizedToken: normalizedToken(claim.value),
      canonicalRole: normalizeCanonicalRole(claim.value),
    })),
    roleArray: stringRoleArray(input.roles).map((role, index) => ({
      index,
      tokenClass: tokenClass(role),
      normalizedToken: normalizedToken(role),
      canonicalRole: normalizeCanonicalRole(role),
    })),
    gateway,
    rfAuth,
    claimGate: {
      isVipSpacer: claimVip,
      exactVipSpacerRoleInArray: exactVipSpacerRoleInArray(gateway.forwardedRoles),
    },
    previewAdapter: {
      state:
        previewDecision.decision === 'granted'
          ? 'available'
          : previewDecision.reasonCode === 'insufficient_status'
            ? 'requires_condition'
            : previewDecision.degradedMode !== 'none'
              ? 'unavailable'
              : 'unavailable',
      isVip: previewDecision.isVip,
      reasonCode: previewDecision.reasonCode,
      degradedMode: previewDecision.degradedMode,
    },
    divergence: {
      alignment: classifyAlignment(previewDecision.isVip, claimVip),
      roleClaimConflictsWithRoles: roleClaimConflictsWithRoles(gateway.platformRole, gateway.forwardedRoles),
      vipAliasOnlyInRoles: vipAliasOnlyInRoles(gateway.forwardedRoles),
      rolesOrderSensitive: rolesOrderSensitive(gateway.forwardedRoles),
    },
  };
}

