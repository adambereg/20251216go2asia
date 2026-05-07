import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildRfClaimAttributionPayload,
  captureRfProAttributionFromUrl,
  getStoredRfProAttribution,
  rfProAttributionStorageKey,
  rfProAttributionTtlMs,
} from './rfProAttribution';

function createSessionStorageMock() {
  const store = new Map<string, string>();
  return {
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

describe('rf PRO attribution helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { sessionStorage: createSessionStorageMock() });
    window.sessionStorage.clear();
    vi.useRealTimers();
  });

  it('captures shareCode from URL into sessionStorage with 24h TTL', () => {
    const now = new Date('2026-05-07T00:00:00.000Z');
    const captured = captureRfProAttributionFromUrl(new URLSearchParams('shareCode=rfp_abc123&partner=rf_partner_1'), '/rf/vouchers', now);

    expect(captured).toBe(true);
    const stored = getStoredRfProAttribution(now);
    expect(stored?.shareCode).toBe('rfp_abc123');
    expect(new Date(stored?.expiresAt ?? '').getTime() - now.getTime()).toBe(rfProAttributionTtlMs);
  });

  it('drops expired transient attribution and does not build claim payload', () => {
    const capturedAt = new Date('2026-05-07T00:00:00.000Z');
    captureRfProAttributionFromUrl(new URLSearchParams('shareCode=rfp_expired'), '/rf/vouchers', capturedAt);

    const afterTtl = new Date(capturedAt.getTime() + rfProAttributionTtlMs + 1);
    expect(getStoredRfProAttribution(afterTtl)).toBeNull();
    expect(buildRfClaimAttributionPayload('public_rf_catalog', afterTtl)).toBeNull();
    expect(window.sessionStorage.getItem(rfProAttributionStorageKey)).toBeNull();
  });

  it('builds bounded typed claim attribution payload', () => {
    const now = new Date('2026-05-07T00:00:00.000Z');
    captureRfProAttributionFromUrl(new URLSearchParams('shareCode=rfp_payload'), '/rf/vouchers', now);

    expect(buildRfClaimAttributionPayload('public_rf_catalog', now)).toEqual({
      version: 1,
      shareCode: 'rfp_payload',
      attributionSource: 'pro_link',
      claimSource: 'public_rf_catalog',
      capturedAt: now.toISOString(),
      metadata: {
        restoredFromSession: true,
        landingPath: '/rf/vouchers',
        ttlHours: 24,
      },
    });
  });

  it('does not persist without shareCode', () => {
    expect(captureRfProAttributionFromUrl(new URLSearchParams('partner=rf_partner_1'), '/rf/vouchers')).toBe(false);
    expect(getStoredRfProAttribution()).toBeNull();
  });
});
