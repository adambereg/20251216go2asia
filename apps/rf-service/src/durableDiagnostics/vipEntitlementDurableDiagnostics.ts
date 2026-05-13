import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

import type {
  VipEntitlementAdapterStatus,
  VipEntitlementCanonicalDriftClass,
  VipEntitlementDecisionSource,
  VipEntitlementReasonCode,
  VipEntitlementShadowDriftClass,
  VipEntitlementShadowObservation,
  VipEntitlementShadowScenario,
  VipEntitlementSourceReadScenario,
  VipEntitlementSourceType,
} from '../vipEntitlementShadow';

type DbExecutor = Pick<Db, 'execute'>;

export type VipEntitlementDiagnosticsEnvironment = 'local' | 'test' | 'staging' | 'production' | 'unknown';
export type VipEntitlementDiagnosticsSinkMode = 'disabled' | 'aggregate_db' | 'queue_aggregate_db';
export type VipEntitlementDiagnosticsSampleMode = 'all' | 'scenario_only';
export type VipEntitlementDiagnosticsScenario = VipEntitlementShadowScenario | Extract<VipEntitlementSourceReadScenario, 'source_timeout' | 'source_unavailable'>;
export type VipEntitlementDiagnosticsFailureBucket =
  | 'write_failed'
  | 'write_timeout'
  | 'write_dropped'
  | 'invalid_window'
  | 'closed_window'
  | 'disabled_sink'
  | 'version_mismatch'
  | 'unknown_failure';

type EvidenceWindowStatus = 'draft' | 'open' | 'collecting' | 'rollback_pending' | 'closed' | 'archived' | 'expired';

export type VipEntitlementDurableDiagnosticsConfig = {
  enabled: boolean;
  environment: VipEntitlementDiagnosticsEnvironment;
  service: 'rf-service';
  buildSha: string;
  windowId: string;
  sinkMode: VipEntitlementDiagnosticsSinkMode;
  sampleMode: VipEntitlementDiagnosticsSampleMode;
  disabledReason:
    | 'flag_disabled'
    | 'production_disabled'
    | 'sink_mode_disabled'
    | 'unsupported_sink_mode'
    | 'missing_window_id'
    | 'invalid_window_id'
    | 'invalid_build_sha'
    | null;
};

export type VipEntitlementDurableDiagnosticsAggregateRow = {
  windowId: string;
  environment: VipEntitlementDiagnosticsEnvironment;
  service: 'rf-service';
  buildSha: string;
  scenario: VipEntitlementDiagnosticsScenario;
  canonicalDriftClass: VipEntitlementCanonicalDriftClass;
  legacyDriftClass: VipEntitlementShadowDriftClass;
  reasonCodeBucket: VipEntitlementReasonCode;
  sourceBucket: VipEntitlementDecisionSource;
  adapterStatusBucket: VipEntitlementAdapterStatus | 'none';
  sourceTypeBucket: VipEntitlementSourceType | 'none';
  sourceAgeBucket: 'none' | 'fresh' | 'stale' | 'unknown';
  sourceLatencyBucket: 'none' | 'fast' | 'slow' | 'timeout' | 'unknown';
  decisionVersion: number;
  adapterVersion: string;
  auditTracePresent: boolean;
  observationCount: 1;
  firstSeenAt: string;
  lastSeenAt: string;
};

export type VipEntitlementDurableDiagnosticsSnapshot = {
  window: {
    windowId: string;
    environment: VipEntitlementDiagnosticsEnvironment;
    service: 'rf-service';
    buildSha: string;
    status: EvidenceWindowStatus;
    openedAt: string | null;
    closedAt: string | null;
    retentionUntil: string;
  };
  summary: {
    totalObservations: number;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
    byCanonicalDriftClass: Record<string, number>;
    byLegacyDriftClass: Record<string, number>;
    byReasonCodeBucket: Record<string, number>;
    bySourceBucket: Record<string, number>;
    byAdapterStatusBucket: Record<string, number>;
    bySourceTypeBucket: Record<string, number>;
    bySourceAgeBucket: Record<string, number>;
    bySourceLatencyBucket: Record<string, number>;
    byDecisionVersion: Record<string, number>;
    byAdapterVersion: Record<string, number>;
    auditTracePresence: {
      present: number;
      missing: number;
    };
    failures: {
      byFailureBucket: Record<string, number>;
      totalFailures: number;
    };
  };
  safety: {
    aggregateOnly: true;
    forbiddenFieldScanRequiredBeforeDocs: true;
  };
};

type EvidenceWindowRow = {
  window_id: string;
  environment: VipEntitlementDiagnosticsEnvironment;
  service: 'rf-service';
  build_sha: string;
  status: EvidenceWindowStatus;
};

type SnapshotEvidenceWindowRow = EvidenceWindowRow & {
  opened_at: string | Date | null;
  closed_at: string | Date | null;
  retention_until: string | Date;
};

type CountRow = {
  key: string | number | boolean | null;
  count: number | string | bigint | null;
};

type TotalsRow = {
  total_observations?: number | string | bigint | null;
  total_failures?: number | string | bigint | null;
  first_seen_at?: string | Date | null;
  last_seen_at?: string | Date | null;
};

type ScheduleWaitUntil = (promise: Promise<unknown>) => void;

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const ENVIRONMENTS = new Set<VipEntitlementDiagnosticsEnvironment>(['local', 'test', 'staging', 'production', 'unknown']);
const SINK_MODES = new Set<VipEntitlementDiagnosticsSinkMode>(['disabled', 'aggregate_db', 'queue_aggregate_db']);
const SAMPLE_MODES = new Set<VipEntitlementDiagnosticsSampleMode>(['all', 'scenario_only']);
const SCENARIOS = new Set<VipEntitlementDiagnosticsScenario>(['role_mirror', 'grant', 'deny', 'stale', 'degraded', 'unknown_source', 'source_timeout', 'source_unavailable']);
const CANONICAL_DRIFT_CLASSES = new Set<VipEntitlementCanonicalDriftClass>([
  'aligned_granted',
  'aligned_denied',
  'role_granted_entitlement_denied',
  'role_denied_entitlement_granted',
  'stale_entitlement',
  'unavailable_entitlement',
  'degraded_runtime',
  'unknown',
]);
const LEGACY_DRIFT_CLASSES = new Set<VipEntitlementShadowDriftClass>([
  'aligned_granted',
  'aligned_denied',
  'role_granted_entitlement_denied',
  'role_denied_entitlement_granted',
  'stale_shadow',
  'degraded_shadow',
  'unknown_source',
]);
const REASON_CODE_BUCKETS = new Set<VipEntitlementReasonCode>([
  'entitlement_granted',
  'not_found',
  'not_started',
  'expired',
  'revoked',
  'refunded',
  'cancelled',
  'grace_not_enabled',
  'source_unavailable',
  'source_timeout',
  'policy_not_configured',
  'stale_cache',
  'identity_untrusted',
  'role_drift',
  'unknown_source',
]);
const SOURCE_BUCKETS = new Set<VipEntitlementDecisionSource>(['canonical_entitlement', 'approved_cache', 'migration_role_shadow', 'mock', 'unknown']);
const ADAPTER_STATUS_BUCKETS = new Set<VipEntitlementAdapterStatus | 'none'>(['none', 'disabled', 'ok', 'stale', 'degraded', 'timeout', 'unavailable', 'unknown_source']);
const SOURCE_TYPE_BUCKETS = new Set<VipEntitlementSourceType | 'none'>([
  'none',
  'canonical_entitlement_store',
  'approved_cache',
  'billing_payment',
  'billing_subscription',
  'admin_grant',
  'promo_campaign',
  'migration_import',
  'reconciliation',
  'migration_role_shadow',
  'mock',
  'unknown',
]);
const SOURCE_AGE_BUCKETS = new Set<VipEntitlementDurableDiagnosticsAggregateRow['sourceAgeBucket']>(['none', 'fresh', 'stale', 'unknown']);
const SOURCE_LATENCY_BUCKETS = new Set<VipEntitlementDurableDiagnosticsAggregateRow['sourceLatencyBucket']>(['none', 'fast', 'slow', 'timeout', 'unknown']);
const SAFE_WINDOW_ID = /^[a-z0-9_-]{1,120}$/;
const SAFE_BUILD_SHA = /^[0-9a-f]{7,40}$/;

function isFlagEnabled(value: string | undefined): boolean {
  return TRUE_VALUES.has(value?.trim().toLowerCase() ?? '');
}

function environmentFrom(value: string | undefined): VipEntitlementDiagnosticsEnvironment {
  const normalized = value?.trim().toLowerCase();
  return normalized && ENVIRONMENTS.has(normalized as VipEntitlementDiagnosticsEnvironment) ? (normalized as VipEntitlementDiagnosticsEnvironment) : 'unknown';
}

function sinkModeFrom(value: string | undefined): VipEntitlementDiagnosticsSinkMode {
  const normalized = value?.trim().toLowerCase();
  return normalized && SINK_MODES.has(normalized as VipEntitlementDiagnosticsSinkMode) ? (normalized as VipEntitlementDiagnosticsSinkMode) : 'disabled';
}

function sampleModeFrom(value: string | undefined): VipEntitlementDiagnosticsSampleMode {
  const normalized = value?.trim().toLowerCase();
  return normalized && SAMPLE_MODES.has(normalized as VipEntitlementDiagnosticsSampleMode) ? (normalized as VipEntitlementDiagnosticsSampleMode) : 'scenario_only';
}

function normalizeBuildSha(value: string | undefined): string {
  const normalized = value?.trim().toLowerCase() ?? '';
  return SAFE_BUILD_SHA.test(normalized) ? normalized : '0000000';
}

export function parseVipEntitlementDurableDiagnosticsConfig(env: {
  ENVIRONMENT?: string;
  VERSION?: string;
  RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS?: string;
  RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID?: string;
  RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE?: string;
  RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE?: string;
}): VipEntitlementDurableDiagnosticsConfig {
  const environment = environmentFrom(env.ENVIRONMENT);
  const sinkMode = sinkModeFrom(env.RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE);
  const sampleMode = sampleModeFrom(env.RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE);
  const windowId = env.RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID?.trim() ?? '';
  const rawBuildSha = env.VERSION?.trim().toLowerCase() ?? '';
  const buildSha = normalizeBuildSha(rawBuildSha);
  const flagEnabled = isFlagEnabled(env.RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS);

  let disabledReason: VipEntitlementDurableDiagnosticsConfig['disabledReason'] = null;
  if (!flagEnabled) disabledReason = 'flag_disabled';
  else if (environment === 'production') disabledReason = 'production_disabled';
  else if (sinkMode === 'disabled') disabledReason = 'sink_mode_disabled';
  else if (sinkMode !== 'aggregate_db') disabledReason = 'unsupported_sink_mode';
  else if (windowId.length === 0) disabledReason = 'missing_window_id';
  else if (!SAFE_WINDOW_ID.test(windowId)) disabledReason = 'invalid_window_id';
  else if (rawBuildSha.length > 0 && !SAFE_BUILD_SHA.test(rawBuildSha)) disabledReason = 'invalid_build_sha';

  return {
    enabled: disabledReason === null,
    environment,
    service: 'rf-service',
    buildSha,
    windowId,
    sinkMode,
    sampleMode,
    disabledReason,
  };
}

export function resolveVipEntitlementDurableDiagnosticsScenario(input: {
  shadowScenario: VipEntitlementShadowScenario;
  sourceReadScenario: VipEntitlementSourceReadScenario;
  sourceReadEnabled: boolean;
}): VipEntitlementDiagnosticsScenario {
  return input.sourceReadEnabled ? input.sourceReadScenario : input.shadowScenario;
}

function requireAllowed<T extends string>(value: T, allowed: Set<T>, field: string): T {
  if (!allowed.has(value)) {
    throw new Error(`Unsafe VIP entitlement durable diagnostics field: ${field}`);
  }
  return value;
}

function safeSeenAt(value: string): string {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
}

function safeAdapterVersion(value: string | undefined): string {
  const normalized = value?.trim() || 'none';
  return normalized.length > 128 ? normalized.slice(0, 128) : normalized;
}

export function isSafeVipEntitlementDiagnosticsWindowId(value: string): boolean {
  return SAFE_WINDOW_ID.test(value);
}

function toCount(value: number | string | bigint | null | undefined): number {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toIsoOrNull(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function toIso(value: string | Date): string {
  return toIsoOrNull(value) ?? new Date(0).toISOString();
}

function countMap(rows: CountRow[]): Record<string, number> {
  return Object.fromEntries(
    rows
      .filter((row) => row.key !== null)
      .map((row) => [String(row.key), toCount(row.count)])
  );
}

export function toVipEntitlementDurableDiagnosticsAggregateRow(input: {
  config: VipEntitlementDurableDiagnosticsConfig;
  scenario: VipEntitlementDiagnosticsScenario;
  observation: VipEntitlementShadowObservation;
}): VipEntitlementDurableDiagnosticsAggregateRow {
  if (!input.config.enabled) {
    throw new Error('VIP entitlement durable diagnostics are disabled');
  }

  const observation = input.observation;
  const sourceRead = observation.sourceRead;
  const seenAt = safeSeenAt(observation.evaluatedAt);
  const decisionVersion = sourceRead?.decisionVersion;

  return {
    windowId: input.config.windowId,
    environment: input.config.environment,
    service: input.config.service,
    buildSha: input.config.buildSha,
    scenario: requireAllowed(input.scenario, SCENARIOS, 'scenario'),
    canonicalDriftClass: requireAllowed(observation.canonicalDriftClass, CANONICAL_DRIFT_CLASSES, 'canonical_drift_class'),
    legacyDriftClass: requireAllowed(observation.driftClass, LEGACY_DRIFT_CLASSES, 'legacy_drift_class'),
    reasonCodeBucket: requireAllowed(observation.reasonCode, REASON_CODE_BUCKETS, 'reason_code_bucket'),
    sourceBucket: requireAllowed(observation.source, SOURCE_BUCKETS, 'source_bucket'),
    adapterStatusBucket: requireAllowed(sourceRead?.adapterStatus ?? 'none', ADAPTER_STATUS_BUCKETS, 'adapter_status_bucket'),
    sourceTypeBucket: requireAllowed(sourceRead?.sourceType ?? 'none', SOURCE_TYPE_BUCKETS, 'source_type_bucket'),
    sourceAgeBucket: requireAllowed(sourceRead?.sourceAgeBucket ?? 'none', SOURCE_AGE_BUCKETS, 'source_age_bucket'),
    sourceLatencyBucket: requireAllowed(sourceRead?.sourceLatencyBucket ?? 'none', SOURCE_LATENCY_BUCKETS, 'source_latency_bucket'),
    decisionVersion: Number.isInteger(decisionVersion) && decisionVersion !== undefined && decisionVersion >= 0 ? decisionVersion : 0,
    adapterVersion: safeAdapterVersion(sourceRead?.adapterVersion),
    auditTracePresent: sourceRead?.auditTracePresent ?? false,
    observationCount: 1,
    firstSeenAt: seenAt,
    lastSeenAt: seenAt,
  };
}

export async function lookupVipEntitlementEvidenceWindow(db: DbExecutor, windowId: string): Promise<EvidenceWindowRow | null> {
  const result = await db.execute(sql`
    SELECT window_id, environment, service, build_sha, status
    FROM rf_entitlement_shadow_evidence_window
    WHERE window_id = ${windowId}
    LIMIT 1
  `);
  return (result.rows[0] as EvidenceWindowRow | undefined) ?? null;
}

export async function getVipEntitlementDurableDiagnosticsEvidenceWindow(db: DbExecutor, windowId: string): Promise<SnapshotEvidenceWindowRow | null> {
  const result = await db.execute(sql`
    SELECT window_id, environment, service, build_sha, status, opened_at, closed_at, retention_until
    FROM rf_entitlement_shadow_evidence_window
    WHERE window_id = ${windowId}
    LIMIT 1
  `);
  return (result.rows[0] as SnapshotEvidenceWindowRow | undefined) ?? null;
}

async function getTotalObservationRow(db: DbExecutor, windowId: string): Promise<TotalsRow> {
  const result = await db.execute(sql`
    SELECT
      COALESCE(SUM(observation_count), 0)::bigint AS total_observations,
      MIN(first_seen_at) AS first_seen_at,
      MAX(last_seen_at) AS last_seen_at
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
  `);
  return (result.rows[0] as TotalsRow | undefined) ?? {};
}

async function getCanonicalDriftCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT canonical_drift_class AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY canonical_drift_class
  `);
  return result.rows as CountRow[];
}

async function getLegacyDriftCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT legacy_drift_class AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY legacy_drift_class
  `);
  return result.rows as CountRow[];
}

async function getReasonCodeCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT reason_code_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY reason_code_bucket
  `);
  return result.rows as CountRow[];
}

async function getSourceCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT source_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY source_bucket
  `);
  return result.rows as CountRow[];
}

async function getAdapterStatusCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT adapter_status_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY adapter_status_bucket
  `);
  return result.rows as CountRow[];
}

async function getSourceTypeCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT source_type_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY source_type_bucket
  `);
  return result.rows as CountRow[];
}

async function getSourceAgeCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT source_age_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY source_age_bucket
  `);
  return result.rows as CountRow[];
}

async function getSourceLatencyCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT source_latency_bucket AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY source_latency_bucket
  `);
  return result.rows as CountRow[];
}

async function getDecisionVersionCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT decision_version AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY decision_version
  `);
  return result.rows as CountRow[];
}

async function getAdapterVersionCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT adapter_version AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY adapter_version
  `);
  return result.rows as CountRow[];
}

async function getAuditTracePresenceCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT audit_trace_present AS key, SUM(observation_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_aggregate
    WHERE window_id = ${windowId}
    GROUP BY audit_trace_present
  `);
  return result.rows as CountRow[];
}

async function getFailureCounts(db: DbExecutor, windowId: string): Promise<CountRow[]> {
  const result = await db.execute(sql`
    SELECT failure_bucket AS key, SUM(failure_count)::bigint AS count
    FROM rf_entitlement_shadow_diagnostics_failures
    WHERE window_id = ${windowId}
    GROUP BY failure_bucket
  `);
  return result.rows as CountRow[];
}

async function getTotalFailureRow(db: DbExecutor, windowId: string): Promise<TotalsRow> {
  const result = await db.execute(sql`
    SELECT COALESCE(SUM(failure_count), 0)::bigint AS total_failures
    FROM rf_entitlement_shadow_diagnostics_failures
    WHERE window_id = ${windowId}
  `);
  return (result.rows[0] as TotalsRow | undefined) ?? {};
}

export async function buildVipEntitlementDurableDiagnosticsSnapshot(db: DbExecutor, windowId: string): Promise<VipEntitlementDurableDiagnosticsSnapshot | null> {
  if (!isSafeVipEntitlementDiagnosticsWindowId(windowId)) return null;

  const window = await getVipEntitlementDurableDiagnosticsEvidenceWindow(db, windowId);
  if (!window) return null;

  const [
    totals,
    canonical,
    legacy,
    reason,
    source,
    adapterStatus,
    sourceType,
    sourceAge,
    sourceLatency,
    decisionVersion,
    adapterVersion,
    auditTrace,
    failures,
    failureTotals,
  ] = await Promise.all([
    getTotalObservationRow(db, windowId),
    getCanonicalDriftCounts(db, windowId),
    getLegacyDriftCounts(db, windowId),
    getReasonCodeCounts(db, windowId),
    getSourceCounts(db, windowId),
    getAdapterStatusCounts(db, windowId),
    getSourceTypeCounts(db, windowId),
    getSourceAgeCounts(db, windowId),
    getSourceLatencyCounts(db, windowId),
    getDecisionVersionCounts(db, windowId),
    getAdapterVersionCounts(db, windowId),
    getAuditTracePresenceCounts(db, windowId),
    getFailureCounts(db, windowId),
    getTotalFailureRow(db, windowId),
  ]);
  const auditTraceCounts = countMap(auditTrace);

  return {
    window: {
      windowId: window.window_id,
      environment: window.environment,
      service: window.service,
      buildSha: window.build_sha,
      status: window.status,
      openedAt: toIsoOrNull(window.opened_at),
      closedAt: toIsoOrNull(window.closed_at),
      retentionUntil: toIso(window.retention_until),
    },
    summary: {
      totalObservations: toCount(totals.total_observations),
      firstSeenAt: toIsoOrNull(totals.first_seen_at),
      lastSeenAt: toIsoOrNull(totals.last_seen_at),
      byCanonicalDriftClass: countMap(canonical),
      byLegacyDriftClass: countMap(legacy),
      byReasonCodeBucket: countMap(reason),
      bySourceBucket: countMap(source),
      byAdapterStatusBucket: countMap(adapterStatus),
      bySourceTypeBucket: countMap(sourceType),
      bySourceAgeBucket: countMap(sourceAge),
      bySourceLatencyBucket: countMap(sourceLatency),
      byDecisionVersion: countMap(decisionVersion),
      byAdapterVersion: countMap(adapterVersion),
      auditTracePresence: {
        present: auditTraceCounts.true ?? 0,
        missing: auditTraceCounts.false ?? 0,
      },
      failures: {
        byFailureBucket: countMap(failures),
        totalFailures: toCount(failureTotals.total_failures),
      },
    },
    safety: {
      aggregateOnly: true,
      forbiddenFieldScanRequiredBeforeDocs: true,
    },
  };
}

export async function upsertVipEntitlementDurableDiagnosticsAggregate(db: DbExecutor, row: VipEntitlementDurableDiagnosticsAggregateRow): Promise<void> {
  await db.execute(sql`
    INSERT INTO rf_entitlement_shadow_diagnostics_aggregate (
      window_id,
      environment,
      service,
      build_sha,
      scenario,
      canonical_drift_class,
      legacy_drift_class,
      reason_code_bucket,
      source_bucket,
      adapter_status_bucket,
      source_type_bucket,
      source_age_bucket,
      source_latency_bucket,
      decision_version,
      adapter_version,
      audit_trace_present,
      observation_count,
      first_seen_at,
      last_seen_at,
      created_at,
      updated_at
    )
    VALUES (
      ${row.windowId},
      ${row.environment},
      ${row.service},
      ${row.buildSha},
      ${row.scenario},
      ${row.canonicalDriftClass},
      ${row.legacyDriftClass},
      ${row.reasonCodeBucket},
      ${row.sourceBucket},
      ${row.adapterStatusBucket},
      ${row.sourceTypeBucket},
      ${row.sourceAgeBucket},
      ${row.sourceLatencyBucket},
      ${row.decisionVersion},
      ${row.adapterVersion},
      ${row.auditTracePresent},
      ${row.observationCount},
      ${row.firstSeenAt},
      ${row.lastSeenAt},
      now(),
      now()
    )
    ON CONFLICT (
      window_id,
      environment,
      service,
      build_sha,
      scenario,
      canonical_drift_class,
      legacy_drift_class,
      reason_code_bucket,
      source_bucket,
      adapter_status_bucket,
      source_type_bucket,
      source_age_bucket,
      source_latency_bucket,
      decision_version,
      adapter_version,
      audit_trace_present
    )
    DO UPDATE SET
      observation_count = rf_entitlement_shadow_diagnostics_aggregate.observation_count + EXCLUDED.observation_count,
      first_seen_at = LEAST(rf_entitlement_shadow_diagnostics_aggregate.first_seen_at, EXCLUDED.first_seen_at),
      last_seen_at = GREATEST(rf_entitlement_shadow_diagnostics_aggregate.last_seen_at, EXCLUDED.last_seen_at),
      updated_at = now()
  `);
}

export async function upsertVipEntitlementDurableDiagnosticsFailure(
  db: DbExecutor,
  input: {
    config: VipEntitlementDurableDiagnosticsConfig;
    failureBucket: VipEntitlementDiagnosticsFailureBucket;
    seenAt?: string;
  }
): Promise<void> {
  if (!input.config.windowId) return;
  const seenAt = safeSeenAt(input.seenAt ?? new Date().toISOString());
  await db.execute(sql`
    INSERT INTO rf_entitlement_shadow_diagnostics_failures (
      window_id,
      environment,
      service,
      build_sha,
      failure_bucket,
      sink_mode,
      failure_count,
      first_seen_at,
      last_seen_at,
      created_at,
      updated_at
    )
    VALUES (
      ${input.config.windowId},
      ${input.config.environment},
      ${input.config.service},
      ${input.config.buildSha},
      ${input.failureBucket},
      ${input.config.sinkMode === 'queue_aggregate_db' ? 'queue_aggregate_db' : 'aggregate_db'},
      ${1},
      ${seenAt},
      ${seenAt},
      now(),
      now()
    )
    ON CONFLICT (
      window_id,
      environment,
      service,
      build_sha,
      failure_bucket,
      sink_mode
    )
    DO UPDATE SET
      failure_count = rf_entitlement_shadow_diagnostics_failures.failure_count + EXCLUDED.failure_count,
      first_seen_at = LEAST(rf_entitlement_shadow_diagnostics_failures.first_seen_at, EXCLUDED.first_seen_at),
      last_seen_at = GREATEST(rf_entitlement_shadow_diagnostics_failures.last_seen_at, EXCLUDED.last_seen_at),
      updated_at = now()
  `);
}

async function recordFailureBestEffort(
  db: DbExecutor,
  config: VipEntitlementDurableDiagnosticsConfig,
  failureBucket: VipEntitlementDiagnosticsFailureBucket,
  seenAt?: string
): Promise<void> {
  try {
    await upsertVipEntitlementDurableDiagnosticsFailure(db, { config, failureBucket, seenAt });
  } catch {
    // The diagnostics sink is observability-only; failure recording must not affect RF claims.
  }
}

export async function recordVipEntitlementDurableDiagnosticsObservation(
  db: DbExecutor,
  input: {
    config: VipEntitlementDurableDiagnosticsConfig;
    scenario: VipEntitlementDiagnosticsScenario;
    observation: VipEntitlementShadowObservation;
  }
): Promise<void> {
  const { config, observation } = input;
  if (!config.enabled) {
    if (config.disabledReason === 'invalid_window_id' || config.disabledReason === 'missing_window_id') {
      await recordFailureBestEffort(db, config, 'invalid_window', observation.evaluatedAt);
    } else if (config.disabledReason === 'invalid_build_sha') {
      await recordFailureBestEffort(db, config, 'version_mismatch', observation.evaluatedAt);
    }
    return;
  }

  const window = await lookupVipEntitlementEvidenceWindow(db, config.windowId);
  if (!window) {
    await recordFailureBestEffort(db, config, 'invalid_window', observation.evaluatedAt);
    return;
  }
  if (window.status !== 'collecting') {
    await recordFailureBestEffort(db, config, window.status === 'closed' || window.status === 'archived' || window.status === 'expired' ? 'closed_window' : 'invalid_window', observation.evaluatedAt);
    return;
  }
  if (window.environment !== config.environment || window.service !== config.service || window.build_sha !== config.buildSha) {
    await recordFailureBestEffort(db, config, 'version_mismatch', observation.evaluatedAt);
    return;
  }

  const row = toVipEntitlementDurableDiagnosticsAggregateRow(input);
  try {
    await upsertVipEntitlementDurableDiagnosticsAggregate(db, row);
  } catch {
    await recordFailureBestEffort(db, config, 'write_failed', observation.evaluatedAt);
  }
}

export function scheduleVipEntitlementDurableDiagnosticsObservation(input: {
  db: DbExecutor;
  config: VipEntitlementDurableDiagnosticsConfig;
  scenario: VipEntitlementDiagnosticsScenario;
  observation: VipEntitlementShadowObservation;
  waitUntil?: ScheduleWaitUntil;
}): void {
  if (!input.config.enabled && input.config.disabledReason !== 'invalid_window_id' && input.config.disabledReason !== 'missing_window_id' && input.config.disabledReason !== 'invalid_build_sha') {
    return;
  }
  const task = recordVipEntitlementDurableDiagnosticsObservation(input.db, {
    config: input.config,
    scenario: input.scenario,
    observation: input.observation,
  }).catch(() => {
    // Swallow final diagnostics failures. RF claims, Points, and vouchers remain unchanged.
  });
  if (input.waitUntil) {
    input.waitUntil(task);
    return;
  }
  void task;
}
