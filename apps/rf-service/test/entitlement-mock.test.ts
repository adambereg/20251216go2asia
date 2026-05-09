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
  ENTITLEMENT_PREVIEW_PROXY_BATCH_MAX_ITEMS,
  type EntitlementMockReadRequest,
  type EntitlementMockReadResponse,
  type EntitlementPreviewProxyBatchResponse,
  type EntitlementPreviewProxyResponse,
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

function previewBody(overrides: Record<string, unknown> = {}) {
  return {
    requestId: 'preview_req_1',
    resource: {
      kind: 'rf_premium_voucher',
      offerId: 'rf_offer_1',
      partnerId: 'rf_partner_1',
    },
    context: {
      rf: {
        offerId: 'rf_offer_1',
        partnerId: 'rf_partner_1',
        voucherClass: 'premium',
      },
      mockScenario: 'granted',
    },
    requestedSources: ['role', 'pro_invite'],
    ...overrides,
  };
}

async function postEntitlementPreview(env: Env, body: Record<string, unknown>, tokenOverrides: Record<string, unknown> | null = { sub: 'user_1' }): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (tokenOverrides) {
    headers['X-Gateway-Auth'] = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, tokenOverrides);
  }

  return worker.fetch(
    new Request('https://rf.example/v1/rf/entitlement/preview', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
    env,
  );
}

async function postEntitlementPreviewBatch(env: Env, body: Record<string, unknown>, tokenOverrides: Record<string, unknown> | null = { sub: 'user_1' }): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (tokenOverrides) {
    headers['X-Gateway-Auth'] = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, tokenOverrides);
  }

  return worker.fetch(
    new Request('https://rf.example/v1/rf/entitlement/preview/batch', {
      method: 'POST',
      headers,
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

describe('RF entitlement preview proxy endpoint', () => {
  it('is disabled by default and does not require DB initialization', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const response = await postEntitlementPreview(env, previewBody());
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_ENTITLEMENT_PREVIEW_PROXY_DISABLED');
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated preview requests when route is protected', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreview(env, previewBody(), null);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows authenticated user and returns filtered safe DTO', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreview(env, previewBody());
    const body = await readJson<EntitlementPreviewProxyResponse>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      state: 'available',
      label: 'Премиум-доступ доступен',
      caption: 'Это информационный preview. Получение ваучера работает как раньше.',
      informationalOnly: true,
      claimBehaviorUnchanged: true,
      missingRequirementLabels: [],
      isTemporary: false,
      isPremiumPreview: true,
      updatedAt: expect.any(String),
    });
    expect(JSON.stringify(body)).not.toMatch(/auditTraceId|requestWindowId|evaluatedSources|partialResults|rawFacts|adapterId|healthStatus|wallet|chain|balance|payout/i);
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('maps invite_required to requires_condition', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: '1' };
    const response = await postEntitlementPreview(
      env,
      previewBody({
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'invite_required' },
        requestedSources: ['pro_invite'],
      }),
    );
    const body = await readJson<EntitlementPreviewProxyResponse>(response);

    expect(body.state).toBe('requires_condition');
    expect(body.label).toBe('Требуется условие');
    expect(body.missingRequirementLabels).toEqual(['Требуется условие']);
  });

  it('maps timeout stale and partial previews to temporary state', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'yes' };

    for (const mockScenario of ['source_timeout', 'stale_cache', 'partial_sources']) {
      const response = await postEntitlementPreview(
        env,
        previewBody({
          context: { rf: { voucherClass: 'premium' }, mockScenario },
          requestedSources: ['role', 'pro_invite'],
        }),
      );
      const body = await readJson<EntitlementPreviewProxyResponse>(response);

      expect(body.state).toBe('checking_or_temporarily_unavailable');
      expect(body.isTemporary).toBe(true);
    }
  });

  it('maps ordinary resources and unknown decisions safely', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'on' };
    const ordinaryResponse = await postEntitlementPreview(
      env,
      previewBody({
        context: { rf: { voucherClass: 'ordinary' }, mockScenario: 'ordinary_resource_no_gate' },
      }),
    );
    const ordinaryBody = await readJson<EntitlementPreviewProxyResponse>(ordinaryResponse);

    expect(ordinaryBody.state).toBe('ordinary_no_preview');
    expect(ordinaryBody.isPremiumPreview).toBe(false);

    const unknownResponse = await postEntitlementPreview(
      env,
      previewBody({
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'policy_not_configured' },
        requestedSources: ['role'],
      }),
    );
    const unknownBody = await readJson<EntitlementPreviewProxyResponse>(unknownResponse);

    expect(unknownBody.state).toBe('unavailable');
  });
});

describe('RF entitlement preview batch proxy endpoint', () => {
  it('is disabled by default and does not require DB initialization', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const response = await postEntitlementPreviewBatch(env, { items: [{ clientKey: 'offer_1', ...previewBody() }] });
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_ENTITLEMENT_PREVIEW_PROXY_DISABLED');
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated batch requests when route is protected', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreviewBatch(env, { items: [{ clientKey: 'offer_1', ...previewBody() }] }, null);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows authenticated user and maps multiple safe preview items', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreviewBatch(env, {
      items: [
        { clientKey: 'available_offer', ...previewBody() },
        {
          clientKey: 'condition_offer',
          ...previewBody({
            requestId: 'preview_req_2',
            context: { rf: { voucherClass: 'premium' }, mockScenario: 'invite_required' },
            requestedSources: ['pro_invite'],
          }),
        },
        {
          clientKey: 'ordinary_offer',
          ...previewBody({
            requestId: 'preview_req_3',
            context: { rf: { voucherClass: 'ordinary' }, mockScenario: 'ordinary_resource_no_gate' },
          }),
        },
      ],
    });
    const body = await readJson<EntitlementPreviewProxyBatchResponse>(response);

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(3);
    expect(body.items.find((item) => item.clientKey === 'available_offer')?.preview.state).toBe('available');
    expect(body.items.find((item) => item.clientKey === 'condition_offer')?.preview.state).toBe('requires_condition');
    expect(body.items.find((item) => item.clientKey === 'ordinary_offer')?.preview.state).toBe('ordinary_no_preview');
    expect(JSON.stringify(body)).not.toMatch(/auditTraceId|requestWindowId|evaluatedSources|partialResults|rawFacts|adapterId|healthStatus|wallet|chain|balance|payout/i);
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('enforces max batch size', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreviewBatch(env, {
      items: Array.from({ length: ENTITLEMENT_PREVIEW_PROXY_BATCH_MAX_ITEMS + 1 }, (_, index) => ({
        clientKey: `offer_${index}`,
        ...previewBody({ requestId: `preview_req_${index}` }),
      })),
    });
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_REQUEST');
    expect(createDbMock).not.toHaveBeenCalled();
  });

  it('skips invalid batch items safely and maps degraded items', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreviewBatch(env, {
      items: [
        { clientKey: '', ...previewBody() },
        {
          clientKey: 'temporary_offer',
          ...previewBody({
            requestId: 'preview_req_temporary',
            context: { rf: { voucherClass: 'premium' }, mockScenario: 'source_timeout' },
            requestedSources: ['role'],
          }),
        },
      ],
    });
    const body = await readJson<EntitlementPreviewProxyBatchResponse>(response);

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({
      clientKey: 'temporary_offer',
      preview: {
        state: 'checking_or_temporarily_unavailable',
        informationalOnly: true,
        claimBehaviorUnchanged: true,
      },
    });
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

