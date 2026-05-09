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
  evaluateEntitlementPreviewProxyRequestWithObservation,
  ENTITLEMENT_PREVIEW_PROXY_BATCH_MAX_ITEMS,
  type EntitlementMockReadRequest,
  type EntitlementMockReadResponse,
  type EntitlementPreviewProxyBatchResponse,
  type EntitlementPreviewProxyResponse,
} from '../src/entitlementMock';
import {
  assertNoUnsafeEntitlementPreviewObservabilityFields,
  getEntitlementPreviewObservabilitySnapshot,
  recordEntitlementPreviewObservations,
  resetEntitlementPreviewObservability,
  type EntitlementPreviewObservabilitySnapshot,
} from '../src/entitlementPreviewObservability';
import worker, { type Env } from '../src/index';
import type { RoleVipAdapter } from '../src/roleVipAdapterInterface';

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

async function getEntitlementPreviewObservability(env: Env, tokenOverrides: Record<string, unknown> | null = { sub: 'admin_1', role: 'admin', roles: ['admin'] }): Promise<Response> {
  const headers: Record<string, string> = {};
  if (tokenOverrides) {
    headers['X-Gateway-Auth'] = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, tokenOverrides);
  }

  return worker.fetch(
    new Request('https://rf.example/v1/rf/internal/entitlement/preview-observability', {
      method: 'GET',
      headers,
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

  it('rejects unauthenticated and non-admin internal mock requests when enabled', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_MOCK_READ_API: 'true' };
    const unauthenticated = await worker.fetch(
      new Request('https://rf.example/v1/rf/internal/entitlement/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseRequest()),
      }),
      env,
    );
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const nonAdmin = await worker.fetch(
      new Request('https://rf.example/v1/rf/internal/entitlement/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': userToken },
        body: JSON.stringify(baseRequest()),
      }),
      env,
    );
    const unauthenticatedBody = await readJson<{ error: { code: string } }>(unauthenticated);
    const nonAdminBody = await readJson<{ error: { code: string } }>(nonAdmin);

    expect(unauthenticated.status).toBe(401);
    expect(unauthenticatedBody.error.code).toBe('UNAUTHORIZED');
    expect(nonAdmin.status).toBe(403);
    expect(nonAdminBody.error.code).toBe('FORBIDDEN');
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
    const response = await postEntitlementPreview(env, {
      ...previewBody(),
      subject: { userId: 'spoofed_user', roleHints: ['admin'] },
    });
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
    expect(JSON.stringify(body)).not.toMatch(
      /auditTraceId|requestWindowId|evaluatedSources|partialResults|rawFacts|adapterId|healthStatus|subject|roleHints|wallet|chain|balance|payout|nft|g2a/i,
    );
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

  it('maps source_unavailable to temporary state without leaking internals', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const response = await postEntitlementPreview(
      env,
      previewBody({
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'source_unavailable' },
        requestedSources: ['role'],
      }),
    );
    const body = await readJson<EntitlementPreviewProxyResponse>(response);

    expect(response.status).toBe(200);
    expect(body.state).toBe('checking_or_temporarily_unavailable');
    expect(body.isTemporary).toBe(true);
    expect(JSON.stringify(body)).not.toMatch(/source_unavailable|adapter|rawFacts|evaluatedSources|partialResults|auditTrace|subject|roleHints/i);
  });

  it('keeps Role/VIP adapter disabled unless umbrella and source flags are enabled', async () => {
    const body = previewBody({
      requestedSources: ['vip_status'],
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
    });
    const baseEnv: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const perSourceOnly = await postEntitlementPreview(
      { ...baseEnv, RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true' },
      body,
      { sub: 'user_regular', role: 'spacer', roles: ['spacer'] },
    );
    const umbrellaOnly = await postEntitlementPreview(
      { ...baseEnv, RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true' },
      body,
      { sub: 'user_regular', role: 'spacer', roles: ['spacer'] },
    );
    const perSourceOnlyBody = await readJson<EntitlementPreviewProxyResponse>(perSourceOnly);
    const umbrellaOnlyBody = await readJson<EntitlementPreviewProxyResponse>(umbrellaOnly);

    expect(perSourceOnlyBody.state).toBe('available');
    expect(umbrellaOnlyBody.state).toBe('available');
  });

  it('uses VIP adapter semantics for preview only when flags are enabled', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
    };
    const body = previewBody({
      requestedSources: ['vip_status'],
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
    });

    const regular = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview(env, body, { sub: 'user_regular', role: 'spacer', roles: ['spacer'] }),
    );
    const admin = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview(env, body, { sub: 'user_admin', role: 'admin', roles: ['admin'] }),
    );
    const pro = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview(env, body, { sub: 'user_pro', role: 'pro', roles: ['pro'] }),
    );
    const vip = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview(env, body, { sub: 'user_vip', role: 'vip_spacer', roles: ['vip_spacer'] }),
    );

    expect(regular.state).toBe('requires_condition');
    expect(admin.state).toBe('requires_condition');
    expect(pro.state).toBe('requires_condition');
    expect(vip.state).toBe('available');
    expect(JSON.stringify([regular, admin, pro, vip])).not.toMatch(/roleHints|subject|adapterId|rawFacts|evaluatedSources|partialResults|wallet|chain|g2a/i);
  });

  it('keeps Role adapter source independently gated from VIP adapter source', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'false',
    };
    const roleResponse = await postEntitlementPreview(
      env,
      previewBody({
        requestedSources: ['role'],
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
      }),
      { sub: 'user_regular', role: 'spacer', roles: ['spacer'] },
    );
    const vipResponse = await postEntitlementPreview(
      env,
      previewBody({
        requestedSources: ['vip_status'],
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
      }),
      { sub: 'user_regular', role: 'spacer', roles: ['spacer'] },
    );
    const roleBody = await readJson<EntitlementPreviewProxyResponse>(roleResponse);
    const vipBody = await readJson<EntitlementPreviewProxyResponse>(vipResponse);

    expect(roleBody.state).toBe('available');
    expect(vipBody.state).toBe('available');
  });

  it('maps Role/VIP adapter unavailable and timeout scenarios to temporary preview state', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
    };

    for (const mockScenario of ['source_unavailable', 'source_timeout']) {
      const body = await readJson<EntitlementPreviewProxyResponse>(
        await postEntitlementPreview(
          env,
          previewBody({
            requestedSources: ['vip_status'],
            context: { rf: { voucherClass: 'premium' }, mockScenario },
          }),
          { sub: 'user_vip', role: 'vip_spacer', roles: ['vip_spacer'] },
        ),
      );

      expect(body.state).toBe('checking_or_temporarily_unavailable');
      expect(body.isTemporary).toBe(true);
    }
  });

  it('lets preview proxy off override all adapter flags after authentication', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
      RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY: 'true',
    };
    const response = await postEntitlementPreview(
      env,
      previewBody({ requestedSources: ['vip_status'] }),
      { sub: 'user_vip', role: 'vip_spacer', roles: ['vip_spacer'] },
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_ENTITLEMENT_PREVIEW_PROXY_DISABLED');
    expect(JSON.stringify(body)).not.toMatch(/adapter|roleHints|subject|vip_status/i);
  });

  it('ignores client-provided context feature flags and uses server flags only', async () => {
    const request = previewBody({
      requestedSources: ['vip_status'],
      context: {
        rf: { voucherClass: 'premium' },
        mockScenario: 'granted',
        featureFlags: {
          RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: true,
          RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: true,
        },
      },
    });
    const token = { sub: 'user_regular', role: 'spacer', roles: ['spacer'] };
    const clientOnlyFlags = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview({ SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' }, request, token),
    );
    const serverFlags = await readJson<EntitlementPreviewProxyResponse>(
      await postEntitlementPreview(
        {
          SERVICE_JWT_SECRET: 'service-secret',
          RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
          RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
          RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
        },
        request,
        token,
      ),
    );

    expect(clientOnlyFlags.state).toBe('available');
    expect(serverFlags.state).toBe('requires_condition');
  });

  it('supports rollback by returning to mock behavior when adapter flags are disabled', async () => {
    const request = previewBody({
      requestedSources: ['vip_status'],
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
    });
    const token = { sub: 'user_regular', role: 'spacer', roles: ['spacer'] };
    const enabledEnv: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
    };
    const disabledEnv: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
    };

    const enabled = await readJson<EntitlementPreviewProxyResponse>(await postEntitlementPreview(enabledEnv, request, token));
    const rolledBack = await readJson<EntitlementPreviewProxyResponse>(await postEntitlementPreview(disabledEnv, request, token));
    const reEnabled = await readJson<EntitlementPreviewProxyResponse>(await postEntitlementPreview(enabledEnv, request, token));

    expect(enabled.state).toBe('requires_condition');
    expect(rolledBack.state).toBe('available');
    expect(reEnabled.state).toBe('requires_condition');
    expect([enabled, rolledBack, reEnabled].every((item) => item.informationalOnly && item.claimBehaviorUnchanged)).toBe(true);
  });

  it('fails closed to temporary preview when adapter execution errors', () => {
    const throwingAdapter: RoleVipAdapter = {
      id: 'throwing-role-vip-adapter',
      execute() {
        throw new Error('staging validation injected failure');
      },
    };
    const result = evaluateEntitlementPreviewProxyRequestWithObservation(
      previewBody({
        requestedSources: ['vip_status'],
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
      }) as never,
      { userId: 'user_vip', platformRole: 'vip_spacer', roles: ['vip_spacer'] },
      new Date('2026-05-09T00:00:00.000Z'),
      {
        enableRealAdapters: true,
        enableVipAdapter: true,
        roleVipAdapter: throwingAdapter,
      },
    );

    expect(result.preview).toMatchObject({
      state: 'checking_or_temporarily_unavailable',
      informationalOnly: true,
      claimBehaviorUnchanged: true,
      isTemporary: true,
    });
    expect(result.observation).toMatchObject({
      bucket: 'checking_or_temporarily_unavailable',
      degradedMode: 'source_unavailable',
      isTemporary: true,
    });
    expect(JSON.stringify(result)).not.toMatch(/throwing-role-vip-adapter|injected failure|adapterId|rawFacts|evaluatedSources|roleHints|subject/i);
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

  it('rejects empty and fully invalid batch bodies', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const empty = await postEntitlementPreviewBatch(env, { items: [] });
    const invalidOnly = await postEntitlementPreviewBatch(env, { items: [{ clientKey: '', resource: { kind: 'rf_premium_voucher' } }] });
    const emptyBody = await readJson<{ error: { code: string } }>(empty);
    const invalidBody = await readJson<{ error: { code: string } }>(invalidOnly);

    expect(empty.status).toBe(400);
    expect(emptyBody.error.code).toBe('INVALID_REQUEST');
    expect(invalidOnly.status).toBe(400);
    expect(invalidBody.error.code).toBe('INVALID_REQUEST');
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

  it('keeps equivalent single and batch preview states consistent', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true' };
    const body = previewBody({
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'invite_required' },
      requestedSources: ['pro_invite'],
    });
    const singleResponse = await postEntitlementPreview(env, body);
    const batchResponse = await postEntitlementPreviewBatch(env, { items: [{ clientKey: 'same_offer', ...body }] });
    const single = await readJson<EntitlementPreviewProxyResponse>(singleResponse);
    const batch = await readJson<EntitlementPreviewProxyBatchResponse>(batchResponse);

    expect(batch.items[0]?.preview.state).toBe(single.state);
    expect(batch.items[0]?.preview.informationalOnly).toBe(true);
    expect(batch.items[0]?.preview.claimBehaviorUnchanged).toBe(true);
  });

  it('keeps Role/VIP adapter single and batch preview states consistent', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
    };
    const body = previewBody({
      requestedSources: ['vip_status'],
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
    });
    const token = { sub: 'user_regular', role: 'spacer', roles: ['spacer'] };
    const single = await readJson<EntitlementPreviewProxyResponse>(await postEntitlementPreview(env, body, token));
    const batch = await readJson<EntitlementPreviewProxyBatchResponse>(await postEntitlementPreviewBatch(env, { items: [{ clientKey: 'same_offer', ...body }] }, token));

    expect(single.state).toBe('requires_condition');
    expect(batch.items[0]?.preview.state).toBe(single.state);
    expect(batch.items[0]?.preview.informationalOnly).toBe(true);
    expect(batch.items[0]?.preview.claimBehaviorUnchanged).toBe(true);
  });
});

describe('RF entitlement preview observability', () => {
  it('maps preview and degraded buckets without exposing unsafe fields', () => {
    const granted = evaluateEntitlementPreviewProxyRequestWithObservation(previewBody() as never, { userId: 'user_1', platformRole: 'user', roles: [] });
    const degraded = evaluateEntitlementPreviewProxyRequestWithObservation(
      previewBody({
        requestId: 'preview_req_degraded',
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'source_timeout' },
        requestedSources: ['role'],
      }) as never,
      { userId: 'user_1', platformRole: 'user', roles: [] },
    );
    const ordinary = evaluateEntitlementPreviewProxyRequestWithObservation(
      previewBody({
        requestId: 'preview_req_ordinary',
        context: { rf: { voucherClass: 'ordinary' }, mockScenario: 'ordinary_resource_no_gate' },
      }) as never,
      { userId: 'user_1', platformRole: 'user', roles: [] },
    );

    expect(granted.observation).toMatchObject({ bucket: 'available', degradedMode: 'none', surface: 'catalog' });
    expect(degraded.observation).toMatchObject({ bucket: 'checking_or_temporarily_unavailable', degradedMode: 'timeout_fallback', isTemporary: true });
    expect(ordinary.observation).toMatchObject({ bucket: 'ordinary_no_preview', isPremiumPreview: false });
    expect(assertNoUnsafeEntitlementPreviewObservabilityFields(JSON.stringify([granted.observation, degraded.observation, ordinary.observation]))).toBe(true);
  });

  it('aggregates single and batch counters safely', () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const available = evaluateEntitlementPreviewProxyRequestWithObservation(previewBody() as never, { userId: 'user_1', platformRole: 'user', roles: [] });
    const temporary = evaluateEntitlementPreviewProxyRequestWithObservation(
      previewBody({
        requestId: 'preview_req_temporary',
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'stale_cache' },
        requestedSources: ['manual_grant'],
      }) as never,
      { userId: 'user_1', platformRole: 'user', roles: [] },
    );

    recordEntitlementPreviewObservations({ kind: 'single', observations: [available.observation], now: new Date('2026-05-09T00:00:01.000Z') });
    recordEntitlementPreviewObservations({ kind: 'batch', observations: [available.observation, temporary.observation], now: new Date('2026-05-09T00:00:02.000Z') });

    const snapshot = getEntitlementPreviewObservabilitySnapshot();
    expect(snapshot.previewRequestsTotal).toBe(1);
    expect(snapshot.previewBatchRequestsTotal).toBe(1);
    expect(snapshot.previewItemsTotal).toBe(3);
    expect(snapshot.bucketTotals.available).toBe(2);
    expect(snapshot.bucketTotals.checking_or_temporarily_unavailable).toBe(1);
    expect(snapshot.degradedTotals.stale_cache).toBe(1);
    expect(snapshot.batchSizeTotals.small).toBe(1);
    expect(assertNoUnsafeEntitlementPreviewObservabilityFields(JSON.stringify(snapshot))).toBe(true);
  });

  it('does not count disabled preview proxy path incorrectly', async () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY: 'true',
    };
    const response = await postEntitlementPreview(env, previewBody());
    const snapshot = getEntitlementPreviewObservabilitySnapshot();

    expect(response.status).toBe(404);
    expect(snapshot.previewRequestsTotal).toBe(0);
    expect(snapshot.previewItemsTotal).toBe(0);
  });

  it('does not count preview requests when observability flag is disabled', async () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
    };

    await postEntitlementPreview(env, previewBody());
    await postEntitlementPreviewBatch(env, { items: [{ clientKey: 'offer_1', ...previewBody() }] });

    const snapshot = getEntitlementPreviewObservabilitySnapshot();
    expect(snapshot.previewRequestsTotal).toBe(0);
    expect(snapshot.previewBatchRequestsTotal).toBe(0);
    expect(snapshot.previewItemsTotal).toBe(0);
  });

  it('exposes admin-only snapshot when observability flag is enabled', async () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY: 'true',
    };

    await postEntitlementPreview(env, previewBody());

    const unauthenticated = await getEntitlementPreviewObservability(env, null);
    expect(unauthenticated.status).toBe(401);

    const forbidden = await getEntitlementPreviewObservability(env, { sub: 'user_1' });
    expect(forbidden.status).toBe(403);

    const response = await getEntitlementPreviewObservability(env);
    const body = await readJson<EntitlementPreviewObservabilitySnapshot>(response);

    expect(response.status).toBe(200);
    expect(body.previewRequestsTotal).toBe(1);
    expect(body.bucketTotals.available).toBe(1);
    expect(assertNoUnsafeEntitlementPreviewObservabilityFields(JSON.stringify(body))).toBe(true);
  });

  it('counts Role/VIP adapter-backed preview output in existing safe buckets', async () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY: 'true',
      RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY: 'true',
      RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS: 'true',
      RF_ENABLE_ENTITLEMENT_VIP_ADAPTER: 'true',
    };

    await postEntitlementPreview(
      env,
      previewBody({
        requestedSources: ['vip_status'],
        context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
      }),
      { sub: 'user_regular', role: 'spacer', roles: ['spacer'] },
    );

    const snapshot = getEntitlementPreviewObservabilitySnapshot();
    expect(snapshot.previewRequestsTotal).toBe(1);
    expect(snapshot.bucketTotals.requires_condition).toBe(1);
    expect(snapshot.degradedTotals.none).toBe(1);
    expect(assertNoUnsafeEntitlementPreviewObservabilityFields(JSON.stringify(snapshot))).toBe(true);
  });

  it('keeps adapter-backed single and batch observability parity without new buckets', () => {
    resetEntitlementPreviewObservability(new Date('2026-05-09T00:00:00.000Z'));
    const request = previewBody({
      requestedSources: ['vip_status'],
      context: { rf: { voucherClass: 'premium' }, mockScenario: 'granted' },
    }) as never;
    const principal = { userId: 'user_regular', platformRole: 'spacer', roles: ['spacer'] };
    const adapterOptions = {
      enableRealAdapters: true,
      enableVipAdapter: true,
    };
    const single = evaluateEntitlementPreviewProxyRequestWithObservation(request, principal, new Date('2026-05-09T00:00:00.000Z'), adapterOptions);
    const batchEquivalent = evaluateEntitlementPreviewProxyRequestWithObservation(request, principal, new Date('2026-05-09T00:00:00.000Z'), adapterOptions);

    recordEntitlementPreviewObservations({ kind: 'single', observations: [single.observation], now: new Date('2026-05-09T00:00:01.000Z') });
    recordEntitlementPreviewObservations({ kind: 'batch', observations: [batchEquivalent.observation], now: new Date('2026-05-09T00:00:02.000Z') });

    const snapshot = getEntitlementPreviewObservabilitySnapshot();
    expect(single.preview.state).toBe('requires_condition');
    expect(batchEquivalent.observation).toEqual(single.observation);
    expect(Object.keys(snapshot.bucketTotals).sort()).toEqual([
      'available',
      'checking_or_temporarily_unavailable',
      'not_enabled',
      'ordinary_no_preview',
      'requires_condition',
      'unavailable',
    ]);
    expect(snapshot.previewRequestsTotal).toBe(1);
    expect(snapshot.previewBatchRequestsTotal).toBe(1);
    expect(snapshot.previewItemsTotal).toBe(2);
    expect(snapshot.bucketTotals.requires_condition).toBe(2);
    expect(snapshot.degradedTotals.none).toBe(2);
    expect(snapshot.batchSizeTotals.single).toBe(2);
    expect(assertNoUnsafeEntitlementPreviewObservabilityFields(JSON.stringify(snapshot))).toBe(true);
  });

  it('keeps internal debug snapshot disabled by default', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const response = await getEntitlementPreviewObservability(env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_ENTITLEMENT_PREVIEW_OBSERVABILITY_DISABLED');
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

