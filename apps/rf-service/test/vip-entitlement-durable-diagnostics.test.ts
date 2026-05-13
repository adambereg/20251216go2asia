import { readFileSync } from 'node:fs';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeMock } = vi.hoisted(() => ({
  executeMock: vi.fn(),
}));

vi.mock('@go2asia/db', () => ({
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

import {
  buildVipEntitlementDurableDiagnosticsSnapshot,
  parseVipEntitlementDurableDiagnosticsConfig,
  recordVipEntitlementDurableDiagnosticsObservation,
  scheduleVipEntitlementDurableDiagnosticsObservation,
  toVipEntitlementDurableDiagnosticsAggregateRow,
} from '../src/durableDiagnostics/vipEntitlementDurableDiagnostics';
import {
  compareVipEntitlementShadow,
  createLocalVipEntitlementSourceReadAdapter,
  createVipEntitlementSourceReadRequest,
  resolveVipEntitlementShadowDecision,
  toVipEntitlementShadowDecisionFromSourceRead,
  type VipEntitlementShadowObservation,
} from '../src/vipEntitlementShadow';

function db() {
  return { execute: executeMock };
}

function executedStatements(): Array<{ text: string; values: unknown[] }> {
  return executeMock.mock.calls.map(([query]) => {
    const typed = query as { strings?: string[]; values?: unknown[] } | undefined;
    return {
      text: (typed?.strings ?? []).join(' ? '),
      values: typed?.values ?? [],
    };
  });
}

function enabledConfig() {
  return parseVipEntitlementDurableDiagnosticsConfig({
    ENVIRONMENT: 'staging',
    VERSION: '6449eff',
    RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS: 'true',
    RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID: 'slice_5b_2_window',
    RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE: 'aggregate_db',
    RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE: 'scenario_only',
  });
}

function collectingWindowRow() {
  return {
    window_id: 'slice_5b_2_window',
    environment: 'staging',
    service: 'rf-service',
    build_sha: '6449eff',
    status: 'collecting',
  };
}

function shadowObservation(): VipEntitlementShadowObservation {
  const decision = resolveVipEntitlementShadowDecision({
    userId: 'user_1',
    currentRoleAllowed: false,
    scenario: 'grant',
    correlationId: 'req_1',
    now: new Date('2026-05-13T10:00:00.000Z'),
  });
  return compareVipEntitlementShadow({ currentRoleAllowed: false, decision, claimScope: 'partner' });
}

function sourceReadObservation(): VipEntitlementShadowObservation {
  const request = createVipEntitlementSourceReadRequest({
    userId: 'user_1',
    offerId: 'rf_offer_1',
    claimScope: 'listing',
    scopeRef: 'listing_1',
    correlationId: 'req_1',
    diagnosticsEnabled: true,
    requestedAt: new Date('2026-05-13T10:00:00.000Z'),
  });
  const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
    request,
    currentRoleAllowed: true,
    scenario: 'source_timeout',
  });
  return compareVipEntitlementShadow({
    currentRoleAllowed: true,
    decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
    claimScope: 'listing',
    sourceRead,
  });
}

describe('VIP entitlement durable diagnostics contract', () => {
  beforeEach(() => {
    executeMock.mockReset();
  });

  it('adds the aggregate-safe migration tables, constraints and indexes', () => {
    const migration = readFileSync(new URL('../../../packages/db/migrations/0057_rf_entitlement_shadow_diagnostics_v1.sql', import.meta.url), 'utf8');

    expect(migration).toContain('CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_evidence_window"');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_diagnostics_aggregate"');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_diagnostics_failures"');
    expect(migration).toContain('"rf_entitlement_shadow_diag_aggregate_pk"');
    expect(migration).toContain('"rf_entitlement_shadow_diag_aggregate_canonical_idx"');
    expect(migration).toContain('"rf_entitlement_shadow_window_retention_idx"');
    expect(migration).not.toMatch(/user_id|email|authorization|jwt|voucher_id|transaction_id|correlation_id|dedupe/i);
  });

  it('keeps durable diagnostics disabled by default and in production', () => {
    expect(parseVipEntitlementDurableDiagnosticsConfig({}).enabled).toBe(false);
    expect(
      parseVipEntitlementDurableDiagnosticsConfig({
        ENVIRONMENT: 'production',
        VERSION: '6449eff',
        RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS: 'true',
        RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID: 'prod_window',
        RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE: 'aggregate_db',
      })
    ).toMatchObject({ enabled: false, disabledReason: 'production_disabled' });
  });

  it('maps observations through a strict aggregate allow-list with sentinel values', () => {
    const row = toVipEntitlementDurableDiagnosticsAggregateRow({
      config: enabledConfig(),
      scenario: 'grant',
      observation: shadowObservation(),
    });

    expect(row).toMatchObject({
      windowId: 'slice_5b_2_window',
      environment: 'staging',
      service: 'rf-service',
      buildSha: '6449eff',
      scenario: 'grant',
      canonicalDriftClass: 'role_denied_entitlement_granted',
      legacyDriftClass: 'role_denied_entitlement_granted',
      adapterStatusBucket: 'none',
      sourceTypeBucket: 'none',
      sourceAgeBucket: 'none',
      sourceLatencyBucket: 'none',
      adapterVersion: 'none',
      auditTracePresent: false,
      observationCount: 1,
    });
    expect(JSON.stringify(row)).not.toMatch(/user_1|req_1|authorization|jwt|voucher|transaction|correlation|dedupe|payment|sourceRef/i);
  });

  it('maps source-read fields without raw trace or identity values', () => {
    const row = toVipEntitlementDurableDiagnosticsAggregateRow({
      config: enabledConfig(),
      scenario: 'source_timeout',
      observation: sourceReadObservation(),
    });

    expect(row).toMatchObject({
      scenario: 'source_timeout',
      canonicalDriftClass: 'unavailable_entitlement',
      adapterStatusBucket: 'timeout',
      sourceTypeBucket: 'unknown',
      sourceLatencyBucket: 'timeout',
      auditTracePresent: true,
    });
    expect(JSON.stringify(row)).not.toMatch(/user_1|listing_1|req_1|vip_source_trace|auditTraceId|correlation/i);
  });

  it('upserts aggregate counts for the same durable window key', async () => {
    executeMock.mockResolvedValueOnce({ rows: [collectingWindowRow()] }).mockResolvedValueOnce({ rows: [] });

    await recordVipEntitlementDurableDiagnosticsObservation(db(), {
      config: enabledConfig(),
      scenario: 'grant',
      observation: shadowObservation(),
    });

    const aggregate = executedStatements().find((statement) => statement.text.includes('INSERT INTO rf_entitlement_shadow_diagnostics_aggregate'));
    expect(aggregate?.text).toContain('ON CONFLICT');
    expect(aggregate?.text).toContain('observation_count = rf_entitlement_shadow_diagnostics_aggregate.observation_count + EXCLUDED.observation_count');
    expect(aggregate?.text).toContain('LEAST');
    expect(aggregate?.text).toContain('GREATEST');
    expect(aggregate?.values).toContain('slice_5b_2_window');
    expect(aggregate?.values).toContain('role_denied_entitlement_granted');
  });

  it('aggregates writes from two simulated workers through the same durable window', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [collectingWindowRow()] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [collectingWindowRow()] })
      .mockResolvedValueOnce({ rows: [] });

    await recordVipEntitlementDurableDiagnosticsObservation(db(), {
      config: enabledConfig(),
      scenario: 'grant',
      observation: shadowObservation(),
    });
    await recordVipEntitlementDurableDiagnosticsObservation(db(), {
      config: enabledConfig(),
      scenario: 'grant',
      observation: shadowObservation(),
    });

    const aggregateWrites = executedStatements().filter((statement) => statement.text.includes('INSERT INTO rf_entitlement_shadow_diagnostics_aggregate'));
    expect(aggregateWrites).toHaveLength(2);
    expect(aggregateWrites.every((statement) => statement.values.includes('slice_5b_2_window'))).toBe(true);
  });

  it('records closed-window and invalid-window failures without aggregate writes', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [{ ...collectingWindowRow(), status: 'closed' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await recordVipEntitlementDurableDiagnosticsObservation(db(), {
      config: enabledConfig(),
      scenario: 'grant',
      observation: shadowObservation(),
    });
    await recordVipEntitlementDurableDiagnosticsObservation(db(), {
      config: { ...enabledConfig(), windowId: 'missing_window' },
      scenario: 'grant',
      observation: shadowObservation(),
    });

    const statements = executedStatements();
    expect(statements.filter((statement) => statement.text.includes('rf_entitlement_shadow_diagnostics_aggregate'))).toHaveLength(0);
    expect(statements.filter((statement) => statement.text.includes('rf_entitlement_shadow_diagnostics_failures'))).toHaveLength(2);
    expect(statements.some((statement) => statement.values.includes('closed_window'))).toBe(true);
    expect(statements.some((statement) => statement.values.includes('invalid_window'))).toBe(true);
  });

  it('records write failures without throwing', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [collectingWindowRow()] })
      .mockRejectedValueOnce(new Error('database down with sensitive stack'))
      .mockResolvedValueOnce({ rows: [] });

    await expect(
      recordVipEntitlementDurableDiagnosticsObservation(db(), {
        config: enabledConfig(),
        scenario: 'grant',
        observation: shadowObservation(),
      })
    ).resolves.toBeUndefined();

    const failure = executedStatements().find((statement) => statement.text.includes('rf_entitlement_shadow_diagnostics_failures'));
    expect(failure?.values).toContain('write_failed');
    expect(JSON.stringify(failure)).not.toMatch(/database down|sensitive stack/i);
  });

  it('short-circuits without DB work when the durable flag is disabled', () => {
    scheduleVipEntitlementDurableDiagnosticsObservation({
      db: db(),
      config: parseVipEntitlementDurableDiagnosticsConfig({ ENVIRONMENT: 'staging', VERSION: '6449eff' }),
      scenario: 'grant',
      observation: shadowObservation(),
    });

    expect(executeMock).not.toHaveBeenCalled();
  });

  it('builds an aggregate-only admin snapshot without raw rows or lastObservation', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            ...collectingWindowRow(),
            opened_at: '2026-05-13T10:00:00.000Z',
            closed_at: null,
            retention_until: '2026-06-12T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ total_observations: '4', first_seen_at: '2026-05-13T10:01:00.000Z', last_seen_at: '2026-05-13T10:04:00.000Z' }],
      })
      .mockResolvedValueOnce({ rows: [{ key: 'aligned_granted', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'aligned_granted', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'entitlement_granted', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'migration_role_shadow', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'ok', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'migration_role_shadow', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'fresh', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'fast', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 1, count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'rf-slice2-shadow-read-v1', count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ key: true, count: '3' }, { key: false, count: '1' }] })
      .mockResolvedValueOnce({ rows: [{ key: 'write_failed', count: '1' }] })
      .mockResolvedValueOnce({ rows: [{ total_failures: '1' }] });

    const snapshot = await buildVipEntitlementDurableDiagnosticsSnapshot(db(), 'slice_5b_2_window');

    expect(snapshot).toMatchObject({
      window: {
        windowId: 'slice_5b_2_window',
        environment: 'staging',
        service: 'rf-service',
        buildSha: '6449eff',
        status: 'collecting',
      },
      summary: {
        totalObservations: 4,
        byCanonicalDriftClass: { aligned_granted: 2 },
        byDecisionVersion: { '1': 2 },
        auditTracePresence: { present: 3, missing: 1 },
        failures: { byFailureBucket: { write_failed: 1 }, totalFailures: 1 },
      },
      safety: {
        aggregateOnly: true,
        forbiddenFieldScanRequiredBeforeDocs: true,
      },
    });
    const serialized = JSON.stringify(snapshot);
    expect(serialized).not.toMatch(/lastObservation|user_1|Authorization|X-Gateway-Auth|JWT|payment|voucher|transaction|correlation|dedupe|sourceRef|wallet|G2A|NFT|on-chain/i);
  });
});
