// Experimental Slice 6.12 contract surface only.
// This module is intentionally not wired into RF preview or claim runtime.

export type CanonicalRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';
export type RoleVipSource = 'role' | 'vip_status';
export type RoleVipTrustSource = 'gateway_principal' | 'backend_user_role' | 'hybrid_comparison' | 'fixture_only';
export type RoleVipDriftScenario = 'none' | 'gateway_vip_backend_non_vip' | 'gateway_non_vip_backend_vip' | 'missing_backend' | 'malformed_backend';

export type RoleVipNormalizedDecision = 'granted' | 'denied' | 'pending' | 'unknown' | 'not_applicable';
export type RoleVipNormalizedReason =
  | 'entitlement_granted'
  | 'insufficient_status'
  | 'requirement_missing'
  | 'source_unavailable'
  | 'source_timeout'
  | 'temporarily_unavailable'
  | 'policy_not_configured'
  | 'ordinary_resource_no_gate'
  | 'unknown_source';

export type RoleVipDegradedMode = 'none' | 'partial_sources' | 'timeout_fallback' | 'stale_cache' | 'source_unavailable' | 'policy_fallback';
export type RoleVipPreviewState = 'available' | 'requires_condition' | 'checking_or_temporarily_unavailable' | 'ordinary_no_preview' | 'unavailable' | 'not_enabled';
export type RoleVipObservabilityBucket = RoleVipPreviewState;

export type RoleVipPrincipalInput = {
  userId: string;
  platformRole?: string | null;
  roles?: unknown;
};

export type RoleVipBackendRoleSnapshot = {
  role?: unknown;
  roles?: unknown;
  stale?: boolean;
  available?: boolean;
  malformed?: boolean;
};

export type RoleVipNormalizationResult = {
  source: RoleVipSource;
  trustSource: RoleVipTrustSource;
  decision: RoleVipNormalizedDecision;
  reasonCode: RoleVipNormalizedReason;
  canonicalRole: CanonicalRole | null;
  canonicalRoles: CanonicalRole[];
  isVip: boolean;
  isAdmin: boolean;
  isPro: boolean;
  degradedMode: RoleVipDegradedMode;
  driftScenario: RoleVipDriftScenario;
  stale: boolean;
};

export type RoleVipPreviewExpectation = {
  state: RoleVipPreviewState;
  informationalOnly: true;
  claimBehaviorUnchanged: true;
};

export type RoleVipObservabilityExpectation = {
  bucket: RoleVipObservabilityBucket;
  degradedMode: RoleVipDegradedMode;
  isTemporary: boolean;
};

export type RoleVipLeakPreventionExpectation = {
  forbidsRawRoles: true;
  forbidsSubjectPayload: true;
  forbidsDiagnostics: true;
  forbidsFinancialVocabulary: true;
};

export type RoleVipFixtureExpectation = {
  decision: RoleVipNormalizedDecision;
  reasonCode: RoleVipNormalizedReason;
  degradedMode: RoleVipDegradedMode;
  driftScenario: RoleVipDriftScenario;
  preview: RoleVipPreviewExpectation;
  observability: RoleVipObservabilityExpectation;
  leakPrevention: RoleVipLeakPreventionExpectation;
};

export type RoleVipFixture = {
  id: string;
  group:
    | 'regular'
    | 'vip'
    | 'admin'
    | 'pro'
    | 'mixed_roles'
    | 'missing_role'
    | 'drift_gateway_vs_backend'
    | 'source_unavailable'
    | 'timeout'
    | 'malformed_role';
  description: string;
  source: RoleVipSource;
  principal: RoleVipPrincipalInput;
  backendSnapshot?: RoleVipBackendRoleSnapshot;
  expectation: RoleVipFixtureExpectation;
};

export const ROLE_VIP_CANONICAL_ROLES: readonly CanonicalRole[] = ['spacer', 'vip_spacer', 'pro', 'admin'] as const;
export const ROLE_VIP_PREVIEW_STATES: readonly RoleVipPreviewState[] = [
  'available',
  'requires_condition',
  'checking_or_temporarily_unavailable',
  'ordinary_no_preview',
  'unavailable',
  'not_enabled',
] as const;
export const ROLE_VIP_OBSERVABILITY_BUCKETS: readonly RoleVipObservabilityBucket[] = ROLE_VIP_PREVIEW_STATES;
export const ROLE_VIP_DEGRADED_MODES: readonly RoleVipDegradedMode[] = ['none', 'partial_sources', 'timeout_fallback', 'stale_cache', 'source_unavailable', 'policy_fallback'] as const;
export const ROLE_VIP_RENDERED_BADGE_STATES: readonly RoleVipPreviewState[] = ['available', 'requires_condition', 'checking_or_temporarily_unavailable', 'unavailable'] as const;

function normalizeRoleToken(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const token = value.trim().toLowerCase();
  return token.length > 0 ? token : null;
}

export function normalizeCanonicalRole(value: unknown): CanonicalRole | null {
  const token = normalizeRoleToken(value);
  if (!token) return null;
  if (token === 'admin') return 'admin';
  if (token === 'pro') return 'pro';
  if (token === 'vip_spacer' || token === 'vip-spacer' || token === 'vip') return 'vip_spacer';
  if (token === 'spacer' || token === 'member' || token === 'user') return 'spacer';
  return null;
}

export function normalizeRoleArray(values: unknown): CanonicalRole[] {
  if (!Array.isArray(values)) return [];
  const normalized: CanonicalRole[] = [];
  for (const value of values) {
    const role = normalizeCanonicalRole(value);
    if (role) normalized.push(role);
  }
  return normalized;
}

export function isVipRole(role: CanonicalRole | null | undefined): boolean {
  return role === 'vip_spacer';
}

export function isAdminRole(role: CanonicalRole | null | undefined): boolean {
  return role === 'admin';
}

export function isProRole(role: CanonicalRole | null | undefined): boolean {
  return role === 'pro';
}

function getPrincipalCanonicalRoles(principal: RoleVipPrincipalInput): { primary: CanonicalRole | null; roles: CanonicalRole[] } {
  const primary = normalizeCanonicalRole(principal.platformRole);
  const roles = normalizeRoleArray(principal.roles);
  return {
    primary: primary ?? roles[0] ?? null,
    roles,
  };
}

function getBackendCanonicalRole(snapshot: RoleVipBackendRoleSnapshot | undefined): CanonicalRole | null {
  if (!snapshot || snapshot.available === false || snapshot.malformed) return null;
  return normalizeCanonicalRole(snapshot.role) ?? normalizeRoleArray(snapshot.roles)[0] ?? null;
}

function getDriftScenario(gatewayRole: CanonicalRole | null, backendRole: CanonicalRole | null, snapshot: RoleVipBackendRoleSnapshot | undefined): RoleVipDriftScenario {
  if (!snapshot) return 'none';
  if (snapshot.malformed) return 'malformed_backend';
  if (snapshot.available === false || !backendRole) return 'missing_backend';
  if (isVipRole(gatewayRole) && !isVipRole(backendRole)) return 'gateway_vip_backend_non_vip';
  if (!isVipRole(gatewayRole) && isVipRole(backendRole)) return 'gateway_non_vip_backend_vip';
  return 'none';
}

export function normalizeRoleDecision(input: {
  source: RoleVipSource;
  principal: RoleVipPrincipalInput;
  backendSnapshot?: RoleVipBackendRoleSnapshot;
  trustSource?: RoleVipTrustSource;
  sourceUnavailable?: boolean;
  timeout?: boolean;
}): RoleVipNormalizationResult {
  const principalRoles = getPrincipalCanonicalRoles(input.principal);
  const backendRole = getBackendCanonicalRole(input.backendSnapshot);
  const driftScenario = getDriftScenario(principalRoles.primary, backendRole, input.backendSnapshot);
  const stale = Boolean(input.backendSnapshot?.stale);
  const trustSource = input.trustSource ?? (input.backendSnapshot ? 'hybrid_comparison' : 'gateway_principal');
  const canonicalRoles = principalRoles.primary ? [principalRoles.primary, ...principalRoles.roles.filter((role) => role !== principalRoles.primary)] : principalRoles.roles;
  const isVip = isVipRole(principalRoles.primary) || principalRoles.roles.some(isVipRole);
  const isAdmin = isAdminRole(principalRoles.primary);
  const isPro = isProRole(principalRoles.primary);

  if (input.timeout) {
    return {
      source: input.source,
      trustSource,
      decision: 'pending',
      reasonCode: 'source_timeout',
      canonicalRole: principalRoles.primary,
      canonicalRoles,
      isVip,
      isAdmin,
      isPro,
      degradedMode: 'timeout_fallback',
      driftScenario,
      stale,
    };
  }

  if (input.sourceUnavailable || input.backendSnapshot?.available === false) {
    return {
      source: input.source,
      trustSource,
      decision: 'pending',
      reasonCode: 'source_unavailable',
      canonicalRole: principalRoles.primary,
      canonicalRoles,
      isVip,
      isAdmin,
      isPro,
      degradedMode: 'source_unavailable',
      driftScenario,
      stale,
    };
  }

  if (input.backendSnapshot?.malformed || driftScenario !== 'none' || stale) {
    return {
      source: input.source,
      trustSource,
      decision: 'pending',
      reasonCode: 'temporarily_unavailable',
      canonicalRole: principalRoles.primary,
      canonicalRoles,
      isVip,
      isAdmin,
      isPro,
      degradedMode: input.backendSnapshot?.malformed ? 'policy_fallback' : 'stale_cache',
      driftScenario,
      stale,
    };
  }

  if (!principalRoles.primary) {
    return {
      source: input.source,
      trustSource,
      decision: 'unknown',
      reasonCode: 'unknown_source',
      canonicalRole: null,
      canonicalRoles,
      isVip: false,
      isAdmin: false,
      isPro: false,
      degradedMode: 'policy_fallback',
      driftScenario,
      stale,
    };
  }

  if (input.source === 'vip_status') {
    return {
      source: input.source,
      trustSource,
      decision: isVip ? 'granted' : 'denied',
      reasonCode: isVip ? 'entitlement_granted' : 'insufficient_status',
      canonicalRole: principalRoles.primary,
      canonicalRoles,
      isVip,
      isAdmin,
      isPro,
      degradedMode: 'none',
      driftScenario,
      stale,
    };
  }

  return {
    source: input.source,
    trustSource,
    decision: 'granted',
    reasonCode: 'entitlement_granted',
    canonicalRole: principalRoles.primary,
    canonicalRoles,
    isVip,
    isAdmin,
    isPro,
    degradedMode: 'none',
    driftScenario,
    stale,
  };
}

const safeLeakExpectation: RoleVipLeakPreventionExpectation = {
  forbidsRawRoles: true,
  forbidsSubjectPayload: true,
  forbidsDiagnostics: true,
  forbidsFinancialVocabulary: true,
};

function expectation(input: {
  decision: RoleVipNormalizedDecision;
  reasonCode: RoleVipNormalizedReason;
  degradedMode?: RoleVipDegradedMode;
  driftScenario?: RoleVipDriftScenario;
  previewState: RoleVipPreviewState;
  temporary?: boolean;
}): RoleVipFixtureExpectation {
  const degradedMode = input.degradedMode ?? 'none';
  const isTemporary = input.temporary ?? input.previewState === 'checking_or_temporarily_unavailable';
  return {
    decision: input.decision,
    reasonCode: input.reasonCode,
    degradedMode,
    driftScenario: input.driftScenario ?? 'none',
    preview: {
      state: input.previewState,
      informationalOnly: true,
      claimBehaviorUnchanged: true,
    },
    observability: {
      bucket: input.previewState,
      degradedMode,
      isTemporary,
    },
    leakPrevention: safeLeakExpectation,
  };
}

export const roleVipFixtureMatrix: readonly RoleVipFixture[] = [
  {
    id: 'role_source_regular_available',
    group: 'regular',
    description: 'Canonical regular role is a valid role source signal without implying VIP capability.',
    source: 'role',
    principal: { userId: 'user_role_regular', platformRole: 'spacer', roles: ['spacer'] },
    expectation: expectation({ decision: 'granted', reasonCode: 'entitlement_granted', previewState: 'available' }),
  },
  {
    id: 'regular_spacer_requires_condition',
    group: 'regular',
    description: 'Regular spacer does not satisfy VIP status source.',
    source: 'vip_status',
    principal: { userId: 'user_regular', platformRole: 'spacer', roles: ['spacer'] },
    expectation: expectation({ decision: 'denied', reasonCode: 'insufficient_status', previewState: 'requires_condition' }),
  },
  {
    id: 'vip_platform_role_available',
    group: 'vip',
    description: 'Canonical vip_spacer platform role satisfies VIP status.',
    source: 'vip_status',
    principal: { userId: 'user_vip', platformRole: 'vip_spacer', roles: ['spacer'] },
    expectation: expectation({ decision: 'granted', reasonCode: 'entitlement_granted', previewState: 'available' }),
  },
  {
    id: 'vip_roles_array_available',
    group: 'vip',
    description: 'VIP role in roles array satisfies VIP status when primary role is regular.',
    source: 'vip_status',
    principal: { userId: 'user_vip_roles', platformRole: 'spacer', roles: ['vip_spacer'] },
    expectation: expectation({ decision: 'granted', reasonCode: 'entitlement_granted', previewState: 'available' }),
  },
  {
    id: 'admin_does_not_auto_grant_vip',
    group: 'admin',
    description: 'Admin platform role is not automatically treated as VIP.',
    source: 'vip_status',
    principal: { userId: 'user_admin', platformRole: 'admin', roles: ['admin'] },
    expectation: expectation({ decision: 'denied', reasonCode: 'insufficient_status', previewState: 'requires_condition' }),
  },
  {
    id: 'pro_does_not_auto_grant_vip',
    group: 'pro',
    description: 'PRO platform role is not automatically treated as VIP.',
    source: 'vip_status',
    principal: { userId: 'user_pro', platformRole: 'pro', roles: ['pro'] },
    expectation: expectation({ decision: 'denied', reasonCode: 'insufficient_status', previewState: 'requires_condition' }),
  },
  {
    id: 'mixed_roles_vip_present_available',
    group: 'mixed_roles',
    description: 'Mixed role array with VIP present grants VIP capability.',
    source: 'vip_status',
    principal: { userId: 'user_mixed_vip', platformRole: 'spacer', roles: [' pro ', ' VIP '] },
    expectation: expectation({ decision: 'granted', reasonCode: 'entitlement_granted', previewState: 'available' }),
  },
  {
    id: 'mixed_roles_without_vip_requires_condition',
    group: 'mixed_roles',
    description: 'Mixed role array without VIP does not grant VIP capability.',
    source: 'vip_status',
    principal: { userId: 'user_mixed_no_vip', platformRole: 'spacer', roles: ['admin', 'pro'] },
    expectation: expectation({ decision: 'denied', reasonCode: 'insufficient_status', previewState: 'requires_condition' }),
  },
  {
    id: 'missing_role_unavailable',
    group: 'missing_role',
    description: 'Missing and malformed role signal is safe-failed as unknown.',
    source: 'vip_status',
    principal: { userId: 'user_missing', roles: [] },
    expectation: expectation({ decision: 'unknown', reasonCode: 'unknown_source', degradedMode: 'policy_fallback', previewState: 'unavailable' }),
  },
  {
    id: 'drift_gateway_vip_backend_regular_temporary',
    group: 'drift_gateway_vs_backend',
    description: 'Gateway VIP but backend regular degrades preview due to drift.',
    source: 'vip_status',
    principal: { userId: 'user_drift_1', platformRole: 'vip_spacer', roles: ['vip_spacer'] },
    backendSnapshot: { role: 'spacer' },
    expectation: expectation({
      decision: 'pending',
      reasonCode: 'temporarily_unavailable',
      degradedMode: 'stale_cache',
      driftScenario: 'gateway_vip_backend_non_vip',
      previewState: 'checking_or_temporarily_unavailable',
    }),
  },
  {
    id: 'drift_gateway_regular_backend_vip_temporary',
    group: 'drift_gateway_vs_backend',
    description: 'Gateway regular but backend VIP degrades preview due to drift.',
    source: 'vip_status',
    principal: { userId: 'user_drift_2', platformRole: 'spacer', roles: ['spacer'] },
    backendSnapshot: { role: 'vip_spacer' },
    expectation: expectation({
      decision: 'pending',
      reasonCode: 'temporarily_unavailable',
      degradedMode: 'stale_cache',
      driftScenario: 'gateway_non_vip_backend_vip',
      previewState: 'checking_or_temporarily_unavailable',
    }),
  },
  {
    id: 'source_unavailable_temporary',
    group: 'source_unavailable',
    description: 'Unavailable backend role source produces temporary preview state.',
    source: 'vip_status',
    principal: { userId: 'user_unavailable', platformRole: 'vip_spacer', roles: ['vip_spacer'] },
    backendSnapshot: { available: false },
    expectation: expectation({
      decision: 'pending',
      reasonCode: 'source_unavailable',
      degradedMode: 'source_unavailable',
      driftScenario: 'missing_backend',
      previewState: 'checking_or_temporarily_unavailable',
    }),
  },
  {
    id: 'timeout_temporary',
    group: 'timeout',
    description: 'Timeout produces temporary preview state.',
    source: 'vip_status',
    principal: { userId: 'user_timeout', platformRole: 'vip_spacer', roles: ['vip_spacer'] },
    expectation: expectation({ decision: 'pending', reasonCode: 'source_timeout', degradedMode: 'timeout_fallback', previewState: 'checking_or_temporarily_unavailable' }),
  },
  {
    id: 'malformed_backend_temporary',
    group: 'malformed_role',
    description: 'Malformed backend role snapshot safe-fails through policy fallback.',
    source: 'vip_status',
    principal: { userId: 'user_malformed', platformRole: 'vip_spacer', roles: ['vip_spacer'] },
    backendSnapshot: { malformed: true },
    expectation: expectation({
      decision: 'pending',
      reasonCode: 'temporarily_unavailable',
      degradedMode: 'policy_fallback',
      driftScenario: 'malformed_backend',
      previewState: 'checking_or_temporarily_unavailable',
    }),
  },
] as const;

