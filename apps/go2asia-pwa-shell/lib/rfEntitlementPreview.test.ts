import { describe, expect, it, vi } from 'vitest';
import {
  assertNoUnsafeVocabularyInEntitlementPreviewCopy,
  buildClaimPayloadWithoutEntitlementPreview,
  buildRfListingOfferEntitlementPreviewRequest,
  buildRfOfferEntitlementPreviewRequest,
  fetchRfEntitlementPreviewBatch,
  fetchRfEntitlementPreview,
  RF_ENTITLEMENT_PREVIEW_BATCH_MAX_ITEMS,
  RF_ENTITLEMENT_PREVIEW_BATCH_PROXY_PATH,
  mapEntitlementReadResponseToPreviewState,
  RF_ENTITLEMENT_PREVIEW_PROXY_PATH,
  rfEntitlementPreviewCopyByState,
  sanitizeEntitlementPreviewProxyForUi,
  sanitizeEntitlementPreviewForUi,
  type RfEntitlementPreviewBatchProxyResponse,
  type RfEntitlementPreviewOfferInput,
  type RfEntitlementPreviewProxyResponse,
} from './rfEntitlementPreview';
import type { EntitlementReadResponse } from './rfEntitlementReadApiDesign';

function response(overrides: Partial<EntitlementReadResponse>): EntitlementReadResponse {
  return {
    requestId: 'ent_req_1',
    requestWindowId: 'window_1',
    decision: 'denied',
    reasonCode: 'requirement_missing',
    evaluationMode: 'claim_preview',
    evaluatedSources: [],
    missingRequirements: [],
    warnings: [],
    stale: false,
    cacheHit: false,
    degradedMode: 'none',
    evaluatedAt: '2026-05-08T00:00:00.000Z',
    auditTraceId: 'trace_should_not_surface',
    partialResults: [{ source: 'pro_invite', reasonCode: 'source_timeout', degradedMode: 'timeout_fallback' }],
    ...overrides,
  };
}

function proxyResponse(overrides: Partial<RfEntitlementPreviewProxyResponse> = {}): RfEntitlementPreviewProxyResponse {
  return {
    state: 'available',
    label: 'Премиум-доступ доступен',
    caption: 'Это информационный preview. Получение ваучера работает как раньше.',
    informationalOnly: true,
    claimBehaviorUnchanged: true,
    missingRequirementLabels: [],
    isTemporary: false,
    isPremiumPreview: true,
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...overrides,
  };
}

function batchResponse(overrides: Partial<RfEntitlementPreviewBatchProxyResponse> = {}): RfEntitlementPreviewBatchProxyResponse {
  return {
    items: [
      {
        clientKey: 'offer_1',
        preview: proxyResponse(),
      },
    ],
    ...overrides,
  };
}

const offerInput: RfEntitlementPreviewOfferInput = {
  subject: {
    userId: 'user_1',
    roleHints: ['vip_spacer'],
  },
  offer: {
    id: 'offer_1',
    partnerId: 'partner_1',
    visibility: 'public',
    offerType: 'gift',
  },
  voucherClass: 'premium',
};

describe('RF entitlement preview helper', () => {
  it('returns no preview when feature flag is disabled', async () => {
    const executor = vi.fn();
    const state = await fetchRfEntitlementPreview(buildRfOfferEntitlementPreviewRequest(offerInput), { enabled: false, executor });

    expect(state).toEqual({
      enabled: false,
      state: 'not_enabled',
      copy: rfEntitlementPreviewCopyByState.not_enabled,
      informationalOnly: true,
      claimBehaviorUnchanged: true,
    });
    expect(executor).not.toHaveBeenCalled();
  });

  it('does not call proxy when request is absent even if preview is enabled', async () => {
    const executor = vi.fn();
    const state = await fetchRfEntitlementPreview(null, { enabled: true, executor });

    expect(state.state).toBe('not_enabled');
    expect(state.enabled).toBe(false);
    expect(executor).not.toHaveBeenCalled();
  });

  it('builds claim-preview request for RF offer without enforcement semantics', () => {
    const request = buildRfOfferEntitlementPreviewRequest({ ...offerInput, mockScenario: 'granted' });

    expect(request).toMatchObject({
      action: 'claim',
      evaluationMode: 'claim_preview',
      includeAuditTrace: false,
      includeSafeLabels: true,
      resource: {
        kind: 'rf_premium_voucher',
        offerId: 'offer_1',
        partnerId: 'partner_1',
      },
      context: {
        rf: {
          offerId: 'offer_1',
          partnerId: 'partner_1',
          voucherClass: 'premium',
          offerVisibility: 'public',
        },
        mockScenario: 'granted',
      },
    });
  });

  it('builds claim-preview request for listing-bound premium offer', () => {
    const request = buildRfListingOfferEntitlementPreviewRequest({
      subject: { userId: 'user_1' },
      listingId: 'listing_1',
      offer: {
        id: 'offer_1',
        partnerId: 'partner_1',
        type: 'premium',
      },
    });

    expect(request).toMatchObject({
      action: 'claim',
      evaluationMode: 'claim_preview',
      resource: {
        kind: 'rf_listing_offer',
        offerId: 'offer_1',
        partnerId: 'partner_1',
        listingId: 'listing_1',
      },
      context: {
        rf: {
          listingId: 'listing_1',
          voucherClass: 'premium',
        },
      },
    });
  });

  it('maps entitlement decisions to safe preview states', () => {
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'granted', reasonCode: 'entitlement_granted' }))).toBe('available');
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'denied', reasonCode: 'invite_required' }))).toBe('requires_condition');
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'pending', reasonCode: 'source_timeout', degradedMode: 'timeout_fallback' }))).toBe(
      'checking_or_temporarily_unavailable',
    );
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'unknown', reasonCode: 'source_unavailable', degradedMode: 'source_unavailable' }))).toBe(
      'checking_or_temporarily_unavailable',
    );
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'not_applicable', reasonCode: 'ordinary_resource_no_gate' }))).toBe('ordinary_no_preview');
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'unknown', reasonCode: 'policy_not_configured' }))).toBe('unavailable');
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'pending', reasonCode: 'source_timeout', degradedMode: 'stale_cache', stale: true }))).toBe(
      'checking_or_temporarily_unavailable',
    );
    expect(mapEntitlementReadResponseToPreviewState(response({ decision: 'pending', reasonCode: 'source_timeout', degradedMode: 'partial_sources' }))).toBe(
      'checking_or_temporarily_unavailable',
    );
  });

  it('does not expose raw adapter or audit fields in UI state', () => {
    const state = sanitizeEntitlementPreviewForUi(
      response({
        decision: 'pending',
        reasonCode: 'source_timeout',
        degradedMode: 'timeout_fallback',
      }),
    );

    expect(state).toEqual({
      enabled: true,
      state: 'checking_or_temporarily_unavailable',
      copy: rfEntitlementPreviewCopyByState.checking_or_temporarily_unavailable,
      informationalOnly: true,
      claimBehaviorUnchanged: true,
    });
    expect(JSON.stringify(state)).not.toMatch(/auditTrace|adapter|rawFacts|raw source/i);
  });

  it('uses proxy route only when enabled and maps successful response', async () => {
    const calls: Array<{ path: string }> = [];
    const state = await fetchRfEntitlementPreview(buildRfOfferEntitlementPreviewRequest(offerInput), {
      enabled: true,
      executor: async (_request, path) => {
        calls.push({ path });
        return proxyResponse();
      },
    });

    expect(state.state).toBe('available');
    expect(state.copy.label).toBe('Премиум-доступ доступен');
    expect(state.informationalOnly).toBe(true);
    expect(state.claimBehaviorUnchanged).toBe(true);
    expect(calls).toEqual([{ path: RF_ENTITLEMENT_PREVIEW_PROXY_PATH }]);
  });

  it('maps single preview network errors to temporary state', async () => {
    const state = await fetchRfEntitlementPreview(buildRfOfferEntitlementPreviewRequest(offerInput), {
      enabled: true,
      executor: async () => {
        throw new Error('network');
      },
    });

    expect(state.enabled).toBe(true);
    expect(state.state).toBe('checking_or_temporarily_unavailable');
    expect(state.informationalOnly).toBe(true);
    expect(state.claimBehaviorUnchanged).toBe(true);
  });

  it('does not call batch proxy when preview is disabled', async () => {
    const executor = vi.fn();
    const state = await fetchRfEntitlementPreviewBatch(
      [{ clientKey: 'offer_1', request: buildRfOfferEntitlementPreviewRequest(offerInput) }],
      { enabled: false, executor },
    );

    expect(state).toEqual({});
    expect(executor).not.toHaveBeenCalled();
  });

  it('does not call batch proxy for empty or oversized collections', async () => {
    const executor = vi.fn();
    const request = buildRfOfferEntitlementPreviewRequest(offerInput);
    const empty = await fetchRfEntitlementPreviewBatch([], { enabled: true, executor });
    const oversized = await fetchRfEntitlementPreviewBatch(
      Array.from({ length: RF_ENTITLEMENT_PREVIEW_BATCH_MAX_ITEMS + 1 }, (_, index) => ({
        clientKey: `offer_${index}`,
        request: buildRfOfferEntitlementPreviewRequest({ ...offerInput, offer: { ...offerInput.offer, id: `offer_${index}` } }) ?? request,
      })),
      { enabled: true, executor },
    );

    expect(empty).toEqual({});
    expect(Object.values(oversized).every((item) => item.state === 'checking_or_temporarily_unavailable')).toBe(true);
    expect(executor).not.toHaveBeenCalled();
  });

  it('filters absent batch requests and returns a map by clientKey', async () => {
    const calls: Array<{ path: string; itemCount: number }> = [];
    const state = await fetchRfEntitlementPreviewBatch(
      [
        { clientKey: 'offer_1', request: buildRfOfferEntitlementPreviewRequest(offerInput) },
        { clientKey: 'ordinary_skipped', request: null },
      ],
      {
        enabled: true,
        executor: async (request, path) => {
          calls.push({ path, itemCount: request.items.length });
          return batchResponse();
        },
      },
    );

    expect(calls).toEqual([{ path: RF_ENTITLEMENT_PREVIEW_BATCH_PROXY_PATH, itemCount: 1 }]);
    expect(state.offer_1?.state).toBe('available');
    expect(state.ordinary_skipped).toBeUndefined();
  });

  it('handles partial batch responses and transport failures safely', async () => {
    const request = buildRfOfferEntitlementPreviewRequest(offerInput);
    const partial = await fetchRfEntitlementPreviewBatch(
      [
        { clientKey: 'offer_1', request },
        { clientKey: 'offer_2', request: buildRfOfferEntitlementPreviewRequest({ ...offerInput, offer: { ...offerInput.offer, id: 'offer_2' } }) },
      ],
      {
        enabled: true,
        executor: async () => batchResponse(),
      },
    );

    expect(partial.offer_1?.state).toBe('available');
    expect(partial.offer_2?.state).toBe('checking_or_temporarily_unavailable');

    const failed = await fetchRfEntitlementPreviewBatch([{ clientKey: 'offer_1', request }], {
      enabled: true,
      executor: async () => {
        throw new Error('network');
      },
    });

    expect(failed.offer_1?.state).toBe('checking_or_temporarily_unavailable');
  });

  it('ignores unsafe proxy fields if they are accidentally present', () => {
    const state = sanitizeEntitlementPreviewProxyForUi({
      ...proxyResponse({
        state: 'checking_or_temporarily_unavailable',
        label: 'Проверка доступа выполняется',
        caption: 'Доступ временно уточняется.',
      }),
      auditTraceId: 'trace_should_not_surface',
      requestWindowId: 'window_should_not_surface',
      evaluatedSources: [{ adapterId: 'adapter_should_not_surface' }],
      rawFacts: [{ source: 'wallet_should_not_surface' }],
    } as unknown as RfEntitlementPreviewProxyResponse);

    expect(state).toEqual({
      enabled: true,
      state: 'checking_or_temporarily_unavailable',
      copy: {
        label: 'Проверка доступа выполняется',
        description: 'Доступ временно уточняется.',
      },
      informationalOnly: true,
      claimBehaviorUnchanged: true,
    });
    expect(JSON.stringify(state)).not.toMatch(/auditTrace|requestWindow|adapter|rawFacts|wallet/i);
  });

  it('falls back to unavailable when proxy state is unexpected', () => {
    const state = sanitizeEntitlementPreviewProxyForUi(
      proxyResponse({
        state: 'unexpected_state' as unknown as RfEntitlementPreviewProxyResponse['state'],
        label: '',
        caption: '',
      }),
    );

    expect(state.state).toBe('unavailable');
    expect(state.copy).toEqual(rfEntitlementPreviewCopyByState.unavailable);
  });

  it('keeps unsafe vocabulary out of preview copy', () => {
    const copy = Object.values(rfEntitlementPreviewCopyByState)
      .map((item) => `${item.label} ${item.description}`)
      .join(' ');

    expect(assertNoUnsafeVocabularyInEntitlementPreviewCopy(copy)).toBe(true);
    expect(assertNoUnsafeVocabularyInEntitlementPreviewCopy('wallet sync failed with tx hash')).toBe(false);
    expect(assertNoUnsafeVocabularyInEntitlementPreviewCopy('adapter raw source audit trace')).toBe(false);
  });

  it('does not add entitlement preview fields to claim payload', () => {
    const payload = {
      attribution: {
        version: 1,
        shareCode: 'pro_1',
      },
    };

    expect(buildClaimPayloadWithoutEntitlementPreview(payload)).toEqual(payload);
    expect(buildClaimPayloadWithoutEntitlementPreview(payload)).not.toHaveProperty('entitlementPreview');
    expect(buildClaimPayloadWithoutEntitlementPreview(payload)).not.toHaveProperty('auditTraceId');
  });
});

