import { describe, expect, it, vi } from 'vitest';

const { createDbMock } = vi.hoisted(() => ({
  createDbMock: vi.fn(),
}));

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import {
  evaluateMockEntitlementReadRequest,
  type EntitlementMockReadRequest,
  type EntitlementMockReadResponse,
} from '../src/entitlementMock';
import worker, { type Env } from '../src/index';

function baseRequest(overrides: Partial<EntitlementMockReadRequest> = {}): EntitlementMockReadRequest {
  return {
    requestId: 'ent_req_1',
    subject: {
      userId: 'user_1',
      roleHints: ['vip_spacer'],
    },
    resource: {
      kind: 'rf_premium_voucher',
      offerId: 'rf_offer_1',
      partnerId: 'rf_partner_1',
    },
    action: 'claim',
    evaluationMode: 'soft_visibility',
    context: {
      rf: {
        offerId: 'rf_offer_1',
        partnerId: 'rf_partner_1',
        voucherClass: 'premium',
      },
      mockScenario: 'granted',
    },
    requestedSources: ['role', 'pro_invite', 'connect_milestone', 'manual_grant'],
    includeSafeLabels: true,
    ...overrides,
  };
}

async function postEntitlementCheck(env: Env, body: EntitlementMockReadRequest): Promise<Response> {
  const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
    sub: 'admin_1',
    role: 'admin',
    roles: ['admin'],
  });

  return worker.fetch(
    new Request('https://rf.example/v1/rf/internal/entitlement/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Auth': token,
      },
      body: JSON.stringify(body),
    }),
    env,
  );
}

describe('RF entitlement mock read endpoint', () => {
  it('is disabled by default and does not require DB initialization', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const response = await postEntitlementCheck(env, baseRequest());
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_ENTITLEMENT_MOCK_READ_API_DISABLED');
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('returns a normalized granted response when enabled', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'true' };
    const response = await postEntitlementCheck(env, baseRequest({ includeAuditTrace: true }));
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      requestId: 'ent_req_1',
      decision: 'granted',
      reasonCode: 'entitlement_granted',
      safeLabel: 'Доступ открыт',
      stale: false,
      cacheHit: false,
      degradedMode: 'none',
    });
    expect(body.auditTraceId).toMatch(/^ent_trace_/);
    expect(JSON.stringify(body)).not.toContain('rawFacts');
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('returns denied invite_required without leaking adapter facts', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: '1' };
    const response = await postEntitlementCheck(
      env,
      baseRequest({
        context: { mockScenario: 'invite_required', rf: { voucherClass: 'premium' } },
        requestedSources: ['pro_invite'],
      }),
    );
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body.decision).toBe('denied');
    expect(body.reasonCode).toBe('invite_required');
    expect(body.missingRequirements).toEqual([
      {
        source: 'pro_invite',
        reasonCode: 'invite_required',
        safeLabel: 'Требуется условие',
      },
    ]);
    expect(JSON.stringify(body)).not.toContain('mockScenario');
  });

  it('returns pending timeout state for soft visibility', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'yes' };
    const response = await postEntitlementCheck(
      env,
      baseRequest({
        context: { mockScenario: 'source_timeout', rf: { voucherClass: 'premium' } },
        requestedSources: ['role'],
      }),
    );
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body.decision).toBe('pending');
    expect(body.reasonCode).toBe('source_timeout');
    expect(body.degradedMode).toBe('timeout_fallback');
    expect(body.warnings).toContain('source_timeout');
    expect(body.partialResults?.[0]).toMatchObject({
      source: 'role',
      reasonCode: 'source_timeout',
      degradedMode: 'timeout_fallback',
    });
  });

  it('does not grant claim enforcement on degraded results', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'on' };
    const response = await postEntitlementCheck(
      env,
      baseRequest({
        evaluationMode: 'claim_enforcement',
        context: { mockScenario: 'partial_sources', rf: { voucherClass: 'premium' } },
        requestedSources: ['role', 'pro_invite'],
      }),
    );
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body.decision).toBe('denied');
    expect(body.degradedMode).toBe('timeout_fallback');
    expect(body.warnings).toContain('partial_result');
  });

  it('marks stale cache as soft-visibility pending only', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'true' };
    const response = await postEntitlementCheck(
      env,
      baseRequest({
        context: { mockScenario: 'stale_cache', rf: { voucherClass: 'premium' } },
        requestedSources: ['manual_grant'],
      }),
    );
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body.decision).toBe('pending');
    expect(body.stale).toBe(true);
    expect(body.cacheHit).toBe(true);
    expect(body.degradedMode).toBe('stale_cache');
    expect(body.warnings).toContain('stale_result');
  });

  it('returns not_applicable for ordinary resources without a gate', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'true' };
    const response = await postEntitlementCheck(
      env,
      baseRequest({
        context: { mockScenario: 'ordinary_resource_no_gate', rf: { voucherClass: 'ordinary' } },
      }),
    );
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body).toMatchObject({
      decision: 'not_applicable',
      reasonCode: 'ordinary_resource_no_gate',
      safeLabel: 'Обычный доступ',
      evaluatedSources: [],
      degradedMode: 'none',
    });
  });

  it('omits auditTraceId unless requested', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'true' };
    const response = await postEntitlementCheck(env, baseRequest({ includeAuditTrace: false }));
    const body = await readJson<EntitlementMockReadResponse>(response);

    expect(body.auditTraceId).toBeUndefined();
  });
});

describe('RF entitlement mock orchestrator', () => {
  it('is deterministic within the same request window input', () => {
    const request = baseRequest({
      context: { mockScenario: 'manual_grant', rf: { voucherClass: 'premium' } },
      requestedSources: ['manual_grant'],
    });
    const now = new Date('2026-05-08T00:00:00.000Z');

    expect(evaluateMockEntitlementReadRequest(request, now)).toEqual(evaluateMockEntitlementReadRequest(request, now));
  });
});

