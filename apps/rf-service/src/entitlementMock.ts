type EntitlementDecision = 'granted' | 'denied' | 'pending' | 'unknown' | 'not_applicable';
type EntitlementReasonCode =
  | 'entitlement_granted'
  | 'requirement_missing'
  | 'source_unavailable'
  | 'source_timeout'
  | 'insufficient_status'
  | 'invite_required'
  | 'nft_required'
  | 'milestone_required'
  | 'g2a_threshold_not_met'
  | 'temporarily_unavailable'
  | 'policy_not_configured'
  | 'ordinary_resource_no_gate'
  | 'unknown_source';
type EntitlementSource =
  | 'role'
  | 'pro_status'
  | 'vip_status'
  | 'pro_invite'
  | 'partner_whitelist'
  | 'connect_milestone'
  | 'nft_totem'
  | 'badge_bridge'
  | 'g2a_threshold'
  | 'manual_grant'
  | 'event_participation'
  | 'unknown';
type EntitlementEvaluationMode = 'strict' | 'soft_visibility' | 'claim_preview' | 'claim_enforcement' | 'advisory_only';
type EntitlementDegradedMode = 'none' | 'partial_sources' | 'timeout_fallback' | 'stale_cache' | 'source_unavailable' | 'policy_fallback';
type EntitlementAdapterHealthStatus = 'healthy' | 'degraded' | 'unavailable' | 'timeout' | 'stale_cache_only';
type EntitlementAction = 'view' | 'claim' | 'redeem' | 'reserve' | 'unlock' | 'use' | 'invite_accept';
type EntitlementResourceKind = 'rf_premium_voucher' | 'rf_offer' | 'rf_listing_offer' | 'partner_invite' | 'future_ai_unlock' | 'future_access_pass';

export type EntitlementMockScenario =
  | 'granted'
  | 'invite_required'
  | 'source_timeout'
  | 'partial_sources'
  | 'stale_cache'
  | 'manual_grant'
  | 'source_unavailable'
  | 'policy_not_configured'
  | 'ordinary_resource_no_gate';

type EntitlementReadWarningCode =
  | 'partial_result'
  | 'stale_result'
  | 'source_timeout'
  | 'source_unavailable'
  | 'requested_source_not_configured'
  | 'adapter_health_degraded';

type EntitlementPreviewState =
  | 'available'
  | 'requires_condition'
  | 'checking_or_temporarily_unavailable'
  | 'ordinary_no_preview'
  | 'unavailable'
  | 'not_enabled';

type EntitlementSubject = {
  userId: string;
  roleHints?: string[];
  statusHints?: string[];
  profileHints?: Record<string, string | number | boolean | null>;
  progressHints?: Record<string, string | number | boolean | null>;
};

type EntitlementResource =
  | {
      kind: 'rf_premium_voucher' | 'rf_offer' | 'rf_listing_offer';
      offerId: string;
      partnerId: string;
      listingId?: string | null;
    }
  | {
      kind: 'partner_invite';
      partnerId: string;
      inviteId?: string | null;
    }
  | {
      kind: 'future_ai_unlock' | 'future_access_pass';
      resourceId: string;
    };

type EntitlementReadContext = {
  rf?: {
    offerId?: string;
    partnerId?: string;
    listingId?: string | null;
    voucherClass?: 'ordinary' | 'premium';
    offerVisibility?: 'public' | 'pro_only' | 'invite_only' | 'private';
  };
  connect?: {
    milestoneIds?: string[];
    receivedViaProCount?: number;
  };
  mockScenario?: EntitlementMockScenario;
  featureFlags?: Record<string, boolean>;
};

export type EntitlementMockReadRequest = {
  requestId: string;
  subject: EntitlementSubject;
  resource: EntitlementResource;
  action: EntitlementAction;
  evaluationMode: EntitlementEvaluationMode;
  context?: EntitlementReadContext;
  requestedSources?: EntitlementSource[];
  includeAuditTrace?: boolean;
  includeSafeLabels?: boolean;
  requestedAt?: string;
};

type EntitlementAdapterRawFact = {
  source: EntitlementSource;
  factKey: string;
  value: string | number | boolean | null;
  observedAt: string;
};

type MockAdapterResult = {
  adapterId: string;
  source: EntitlementSource;
  rawFacts: EntitlementAdapterRawFact[];
  decisionHint: EntitlementDecision;
  reasonCodeHint: EntitlementReasonCode;
  healthStatus: EntitlementAdapterHealthStatus;
  stale: boolean;
  cacheHit: boolean;
  evaluatedAt: string;
  expiresAt?: string | null;
};

type EntitlementSourceEvaluation = {
  source: EntitlementSource;
  adapterId?: string;
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  healthStatus?: EntitlementAdapterHealthStatus;
  stale?: boolean;
  cacheHit?: boolean;
  evaluatedAt?: string;
  expiresAt?: string | null;
};

type EntitlementMissingRequirement = {
  requirementId?: string;
  source: EntitlementSource;
  reasonCode: EntitlementReasonCode;
  safeLabel?: string;
};

type EntitlementPartialResult = {
  source: EntitlementSource;
  adapterId?: string;
  reasonCode: Extract<EntitlementReasonCode, 'source_timeout' | 'source_unavailable' | 'unknown_source'>;
  degradedMode: EntitlementDegradedMode;
};

export type EntitlementMockReadResponse = {
  requestId: string;
  requestWindowId: string;
  decision: EntitlementDecision;
  reasonCode: EntitlementReasonCode;
  evaluationMode: EntitlementEvaluationMode;
  safeLabel?: string;
  evaluatedSources: EntitlementSourceEvaluation[];
  missingRequirements: EntitlementMissingRequirement[];
  warnings: EntitlementReadWarningCode[];
  stale: boolean;
  cacheHit: boolean;
  degradedMode: EntitlementDegradedMode;
  partialResults?: EntitlementPartialResult[];
  evaluatedAt: string;
  expiresAt?: string | null;
  auditTraceId?: string;
};

export type EntitlementPreviewProxyRequest = {
  requestId: string;
  resource: EntitlementResource;
  context?: EntitlementReadContext;
  requestedSources?: EntitlementSource[];
};

export type EntitlementPreviewProxyResponse = {
  state: EntitlementPreviewState;
  label: string;
  caption: string;
  informationalOnly: true;
  claimBehaviorUnchanged: true;
  missingRequirementLabels: string[];
  isTemporary: boolean;
  isPremiumPreview: boolean;
  updatedAt: string;
};

const DEFAULT_SOURCES: EntitlementSource[] = ['role', 'pro_invite', 'connect_milestone', 'manual_grant'];
const FUTURE_ONLY_SOURCES = new Set<EntitlementSource>(['nft_totem', 'badge_bridge', 'g2a_threshold']);

function stableId(prefix: string, input: string): string {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return `${prefix}_${hash.toString(36)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function isEntitlementSource(value: unknown): value is EntitlementSource {
  return (
    value === 'role' ||
    value === 'pro_status' ||
    value === 'vip_status' ||
    value === 'pro_invite' ||
    value === 'partner_whitelist' ||
    value === 'connect_milestone' ||
    value === 'nft_totem' ||
    value === 'badge_bridge' ||
    value === 'g2a_threshold' ||
    value === 'manual_grant' ||
    value === 'event_participation' ||
    value === 'unknown'
  );
}

function isAction(value: unknown): value is EntitlementAction {
  return value === 'view' || value === 'claim' || value === 'redeem' || value === 'reserve' || value === 'unlock' || value === 'use' || value === 'invite_accept';
}

function isEvaluationMode(value: unknown): value is EntitlementEvaluationMode {
  return value === 'strict' || value === 'soft_visibility' || value === 'claim_preview' || value === 'claim_enforcement' || value === 'advisory_only';
}

function isResourceKind(value: unknown): value is EntitlementResourceKind {
  return (
    value === 'rf_premium_voucher' ||
    value === 'rf_offer' ||
    value === 'rf_listing_offer' ||
    value === 'partner_invite' ||
    value === 'future_ai_unlock' ||
    value === 'future_access_pass'
  );
}

function parseContext(value: unknown): EntitlementReadContext | undefined {
  if (!isRecord(value)) return undefined;
  const mockScenario = asString(value.mockScenario);
  return {
    ...(isRecord(value.rf) ? { rf: value.rf as EntitlementReadContext['rf'] } : {}),
    ...(isRecord(value.connect) ? { connect: value.connect as EntitlementReadContext['connect'] } : {}),
    ...(mockScenario ? { mockScenario: mockScenario as EntitlementMockScenario } : {}),
    ...(isRecord(value.featureFlags) ? { featureFlags: value.featureFlags as Record<string, boolean> } : {}),
  };
}

export function parseEntitlementMockReadRequest(body: Record<string, unknown> | null): EntitlementMockReadRequest | null {
  if (!body) return null;
  const requestId = asString(body.requestId);
  const subject = isRecord(body.subject) ? body.subject : null;
  const resource = isRecord(body.resource) ? body.resource : null;
  const action = body.action;
  const evaluationMode = body.evaluationMode;
  if (!requestId || !subject || !resource || !isAction(action) || !isEvaluationMode(evaluationMode)) return null;

  const userId = asString(subject.userId);
  const kind = resource.kind;
  if (!userId || !isResourceKind(kind)) return null;

  const parsedSources = Array.isArray(body.requestedSources) ? body.requestedSources.filter(isEntitlementSource) : undefined;

  return {
    requestId,
    subject: {
      userId,
      roleHints: Array.isArray(subject.roleHints) ? subject.roleHints.filter((item): item is string => typeof item === 'string') : undefined,
      statusHints: Array.isArray(subject.statusHints) ? subject.statusHints.filter((item): item is string => typeof item === 'string') : undefined,
    },
    resource: resource as EntitlementResource,
    action,
    evaluationMode,
    context: parseContext(body.context),
    requestedSources: parsedSources && parsedSources.length > 0 ? parsedSources : undefined,
    includeAuditTrace: body.includeAuditTrace === true,
    includeSafeLabels: body.includeSafeLabels !== false,
    requestedAt: asString(body.requestedAt) ?? undefined,
  };
}

export function parseEntitlementPreviewProxyRequest(body: Record<string, unknown> | null): EntitlementPreviewProxyRequest | null {
  if (!body) return null;
  const requestId = asString(body.requestId);
  const resource = isRecord(body.resource) ? body.resource : null;
  if (!requestId || !resource || !isResourceKind(resource.kind)) return null;

  const parsedSources = Array.isArray(body.requestedSources) ? body.requestedSources.filter(isEntitlementSource) : undefined;

  return {
    requestId,
    resource: resource as EntitlementResource,
    context: parseContext(body.context),
    requestedSources: parsedSources && parsedSources.length > 0 ? parsedSources : undefined,
  };
}

function getMockScenario(request: EntitlementMockReadRequest): EntitlementMockScenario {
  if (request.context?.rf?.voucherClass === 'ordinary') return 'ordinary_resource_no_gate';
  return request.context?.mockScenario ?? 'granted';
}

function getSources(request: EntitlementMockReadRequest): EntitlementSource[] {
  return request.requestedSources && request.requestedSources.length > 0 ? request.requestedSources : DEFAULT_SOURCES;
}

function createAdapterResult(
  source: EntitlementSource,
  nowIso: string,
  scenario: EntitlementMockScenario,
): MockAdapterResult {
  const adapterId = `${source.replace(/_/g, '-')}-mock-adapter`;
  const rawFacts: EntitlementAdapterRawFact[] = [{ source, factKey: 'mockScenario', value: scenario, observedAt: nowIso }];

  if (FUTURE_ONLY_SOURCES.has(source)) {
    return {
      adapterId,
      source,
      rawFacts,
      decisionHint: 'unknown',
      reasonCodeHint: source === 'g2a_threshold' ? 'g2a_threshold_not_met' : 'source_unavailable',
      healthStatus: 'unavailable',
      stale: false,
      cacheHit: false,
      evaluatedAt: nowIso,
    };
  }

  if (scenario === 'source_timeout') {
    return { adapterId, source, rawFacts, decisionHint: 'pending', reasonCodeHint: 'source_timeout', healthStatus: 'timeout', stale: false, cacheHit: false, evaluatedAt: nowIso };
  }

  if (scenario === 'source_unavailable') {
    return { adapterId, source, rawFacts, decisionHint: 'unknown', reasonCodeHint: 'source_unavailable', healthStatus: 'unavailable', stale: false, cacheHit: false, evaluatedAt: nowIso };
  }

  if (scenario === 'policy_not_configured') {
    return { adapterId, source, rawFacts, decisionHint: 'unknown', reasonCodeHint: 'policy_not_configured', healthStatus: 'healthy', stale: false, cacheHit: false, evaluatedAt: nowIso };
  }

  if (scenario === 'stale_cache') {
    return { adapterId, source, rawFacts, decisionHint: 'pending', reasonCodeHint: 'source_timeout', healthStatus: 'stale_cache_only', stale: true, cacheHit: true, evaluatedAt: nowIso };
  }

  if (scenario === 'partial_sources' && (source === 'pro_invite' || source === 'connect_milestone')) {
    return { adapterId, source, rawFacts, decisionHint: 'pending', reasonCodeHint: 'source_timeout', healthStatus: 'timeout', stale: false, cacheHit: false, evaluatedAt: nowIso };
  }

  if (scenario === 'invite_required' && source === 'pro_invite') {
    return { adapterId, source, rawFacts, decisionHint: 'denied', reasonCodeHint: 'invite_required', healthStatus: 'healthy', stale: false, cacheHit: false, evaluatedAt: nowIso };
  }

  if (scenario === 'manual_grant') {
    const granted = source === 'manual_grant';
    return {
      adapterId,
      source,
      rawFacts,
      decisionHint: granted ? 'granted' : 'denied',
      reasonCodeHint: granted ? 'entitlement_granted' : 'requirement_missing',
      healthStatus: 'healthy',
      stale: false,
      cacheHit: false,
      evaluatedAt: nowIso,
    };
  }

  return {
    adapterId,
    source,
    rawFacts,
    decisionHint: 'granted',
    reasonCodeHint: 'entitlement_granted',
    healthStatus: 'healthy',
    stale: false,
    cacheHit: false,
    evaluatedAt: nowIso,
  };
}

function toDegradedMode(result: MockAdapterResult): EntitlementDegradedMode {
  if (result.healthStatus === 'timeout') return 'timeout_fallback';
  if (result.healthStatus === 'stale_cache_only' || result.stale) return 'stale_cache';
  if (result.healthStatus === 'unavailable') return 'source_unavailable';
  if (result.healthStatus === 'degraded') return 'partial_sources';
  return 'none';
}

function getDominantDegradedMode(results: MockAdapterResult[]): EntitlementDegradedMode {
  if (results.some((result) => toDegradedMode(result) === 'timeout_fallback')) return 'timeout_fallback';
  if (results.some((result) => toDegradedMode(result) === 'stale_cache')) return 'stale_cache';
  if (results.some((result) => toDegradedMode(result) === 'source_unavailable')) return 'source_unavailable';
  if (results.some((result) => toDegradedMode(result) === 'partial_sources')) return 'partial_sources';
  return 'none';
}

function getSafeLabel(decision: EntitlementDecision, reasonCode: EntitlementReasonCode, degradedMode: EntitlementDegradedMode): string {
  if (decision === 'not_applicable') return 'Обычный доступ';
  if (decision === 'granted') return 'Доступ открыт';
  if (decision === 'pending') return 'Проверка выполняется';
  if (degradedMode !== 'none') return 'Доступ временно ограничен';
  if (reasonCode === 'invite_required' || reasonCode === 'nft_required' || reasonCode === 'milestone_required') return 'Требуется условие';
  return 'Премиум-доступ недоступен';
}

function aggregateDecision(
  request: EntitlementMockReadRequest,
  results: MockAdapterResult[],
): { decision: EntitlementDecision; reasonCode: EntitlementReasonCode; degradedMode: EntitlementDegradedMode } {
  const scenario = getMockScenario(request);
  if (scenario === 'ordinary_resource_no_gate') {
    return { decision: 'not_applicable', reasonCode: 'ordinary_resource_no_gate', degradedMode: 'none' };
  }

  const degradedMode = getDominantDegradedMode(results);
  const denied = results.find((result) => result.decisionHint === 'denied');
  const unavailable = results.find((result) => result.healthStatus === 'unavailable');
  const timedOut = results.find((result) => result.healthStatus === 'timeout' || result.healthStatus === 'stale_cache_only');

  if (degradedMode !== 'none') {
    if (request.evaluationMode === 'claim_enforcement') {
      return { decision: 'denied', reasonCode: timedOut?.reasonCodeHint ?? unavailable?.reasonCodeHint ?? 'temporarily_unavailable', degradedMode };
    }
    if (request.evaluationMode === 'soft_visibility' || request.evaluationMode === 'claim_preview' || request.evaluationMode === 'advisory_only') {
      return { decision: 'pending', reasonCode: timedOut?.reasonCodeHint ?? unavailable?.reasonCodeHint ?? 'temporarily_unavailable', degradedMode };
    }
  }

  if (denied) return { decision: 'denied', reasonCode: denied.reasonCodeHint, degradedMode };
  if (results.some((result) => result.decisionHint === 'unknown')) return { decision: 'unknown', reasonCode: 'unknown_source', degradedMode };
  if (results.some((result) => result.decisionHint === 'granted')) return { decision: 'granted', reasonCode: 'entitlement_granted', degradedMode };
  return { decision: 'denied', reasonCode: 'requirement_missing', degradedMode };
}

export function evaluateMockEntitlementReadRequest(
  request: EntitlementMockReadRequest,
  now = new Date(),
): EntitlementMockReadResponse {
  const nowIso = now.toISOString();
  const scenario = getMockScenario(request);
  const sources = scenario === 'ordinary_resource_no_gate' ? [] : getSources(request);
  const adapterResults = sources.map((source) => createAdapterResult(source, nowIso, scenario));
  const aggregate = aggregateDecision(request, adapterResults);
  const partialResults = adapterResults
    .filter((result) => ['timeout_fallback', 'source_unavailable'].includes(toDegradedMode(result)) || result.reasonCodeHint === 'unknown_source')
    .map<EntitlementPartialResult>((result) => ({
      source: result.source,
      adapterId: result.adapterId,
      reasonCode:
        result.reasonCodeHint === 'source_timeout' || result.reasonCodeHint === 'source_unavailable' || result.reasonCodeHint === 'unknown_source'
          ? result.reasonCodeHint
          : 'source_unavailable',
      degradedMode: toDegradedMode(result),
    }));
  const warnings = new Set<EntitlementReadWarningCode>();
  if (partialResults.length > 0) warnings.add('partial_result');
  if (adapterResults.some((result) => result.stale)) warnings.add('stale_result');
  if (adapterResults.some((result) => result.healthStatus === 'timeout')) warnings.add('source_timeout');
  if (adapterResults.some((result) => result.healthStatus === 'unavailable')) warnings.add('source_unavailable');
  if (adapterResults.some((result) => result.healthStatus !== 'healthy')) warnings.add('adapter_health_degraded');

  const requestWindowId = stableId('ent_window', `${request.requestId}:${request.subject.userId}:${request.resource.kind}:${request.action}:${request.evaluationMode}`);

  return {
    requestId: request.requestId,
    requestWindowId,
    decision: aggregate.decision,
    reasonCode: aggregate.reasonCode,
    evaluationMode: request.evaluationMode,
    safeLabel: request.includeSafeLabels === false ? undefined : getSafeLabel(aggregate.decision, aggregate.reasonCode, aggregate.degradedMode),
    evaluatedSources: adapterResults.map((result) => ({
      source: result.source,
      adapterId: result.adapterId,
      decision: result.decisionHint,
      reasonCode: result.reasonCodeHint,
      healthStatus: result.healthStatus,
      stale: result.stale,
      cacheHit: result.cacheHit,
      evaluatedAt: result.evaluatedAt,
      expiresAt: result.expiresAt,
    })),
    missingRequirements: adapterResults
      .filter((result) => result.decisionHint === 'denied')
      .map((result) => ({
        source: result.source,
        reasonCode: result.reasonCodeHint,
        safeLabel: getSafeLabel('denied', result.reasonCodeHint, 'none'),
      })),
    warnings: [...warnings],
    stale: adapterResults.some((result) => result.stale),
    cacheHit: adapterResults.some((result) => result.cacheHit),
    degradedMode: aggregate.degradedMode,
    partialResults: partialResults.length > 0 ? partialResults : undefined,
    evaluatedAt: nowIso,
    auditTraceId: request.includeAuditTrace ? stableId('ent_trace', `${request.requestId}:${requestWindowId}`) : undefined,
  };
}

function mapPreviewState(response: EntitlementMockReadResponse): EntitlementPreviewState {
  if (response.decision === 'not_applicable' || response.reasonCode === 'ordinary_resource_no_gate') return 'ordinary_no_preview';
  if (response.decision === 'granted' && response.degradedMode === 'none' && !response.stale) return 'available';
  if (
    response.reasonCode === 'invite_required' ||
    response.reasonCode === 'nft_required' ||
    response.reasonCode === 'milestone_required' ||
    response.reasonCode === 'requirement_missing'
  ) {
    return 'requires_condition';
  }
  if (
    response.decision === 'pending' ||
    response.degradedMode === 'timeout_fallback' ||
    response.degradedMode === 'stale_cache' ||
    response.degradedMode === 'partial_sources' ||
    response.degradedMode === 'source_unavailable' ||
    response.reasonCode === 'source_timeout' ||
    response.reasonCode === 'source_unavailable' ||
    response.reasonCode === 'temporarily_unavailable'
  ) {
    return 'checking_or_temporarily_unavailable';
  }
  return 'unavailable';
}

function getPreviewCopy(state: EntitlementPreviewState): { label: string; caption: string } {
  if (state === 'available') {
    return {
      label: 'Премиум-доступ доступен',
      caption: 'Это информационный preview. Получение ваучера работает как раньше.',
    };
  }
  if (state === 'requires_condition') {
    return {
      label: 'Требуется условие',
      caption: 'Preview показывает условие доступа. Claim-поведение в этом срезе не меняется.',
    };
  }
  if (state === 'checking_or_temporarily_unavailable') {
    return {
      label: 'Проверка доступа выполняется',
      caption: 'Доступ временно уточняется. Это не блокирует текущий сценарий получения ваучера.',
    };
  }
  if (state === 'ordinary_no_preview') {
    return {
      label: 'Обычный ваучер доступен без премиум-проверки',
      caption: 'Для обычного ваучера entitlement preview не применяется.',
    };
  }
  if (state === 'not_enabled') {
    return {
      label: 'Премиум-проверка не включена',
      caption: 'Preview выключен. Получение ваучера работает как раньше.',
    };
  }
  return {
    label: 'Премиум-доступ недоступен',
    caption: 'Preview не подтвердил доступ. Это не является runtime enforcement.',
  };
}

export function toSafeEntitlementPreviewProxyResponse(response: EntitlementMockReadResponse): EntitlementPreviewProxyResponse {
  const state = mapPreviewState(response);
  const copy = getPreviewCopy(state);
  return {
    state,
    label: copy.label,
    caption: copy.caption,
    informationalOnly: true,
    claimBehaviorUnchanged: true,
    missingRequirementLabels: response.missingRequirements.map((requirement) => requirement.safeLabel ?? getPreviewCopy('requires_condition').label),
    isTemporary: state === 'checking_or_temporarily_unavailable',
    isPremiumPreview: state !== 'ordinary_no_preview',
    updatedAt: response.evaluatedAt,
  };
}

export function evaluateEntitlementPreviewProxyRequest(
  request: EntitlementPreviewProxyRequest,
  principal: { userId: string; platformRole: string; roles: string[] },
  now = new Date(),
): EntitlementPreviewProxyResponse {
  const readRequest: EntitlementMockReadRequest = {
    requestId: request.requestId,
    subject: {
      userId: principal.userId,
      roleHints: [principal.platformRole, ...principal.roles].filter(Boolean),
    },
    resource: request.resource,
    action: 'claim',
    evaluationMode: 'claim_preview',
    context: request.context,
    requestedSources: request.requestedSources,
    includeAuditTrace: false,
    includeSafeLabels: true,
  };

  return toSafeEntitlementPreviewProxyResponse(evaluateMockEntitlementReadRequest(readRequest, now));
}

