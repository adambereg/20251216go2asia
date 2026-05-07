import type { RfClaimAttributionPayload, RfClaimSource } from '@go2asia/sdk/rf';

export const rfProAttributionStorageKey = 'go2asia.rf.proAttribution.v1';
export const rfProAttributionTtlMs = 24 * 60 * 60 * 1000;

type StoredRfProAttribution = {
  version: 1;
  shareCode: string;
  capturedAt: string;
  expiresAt: string;
  landingPath: string;
};

function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function parseStoredAttribution(value: string | null): StoredRfProAttribution | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<StoredRfProAttribution> | null;
    if (!parsed || parsed.version !== 1) return null;
    if (typeof parsed.shareCode !== 'string' || parsed.shareCode.trim().length === 0) return null;
    if (typeof parsed.capturedAt !== 'string' || typeof parsed.expiresAt !== 'string') return null;
    if (Number.isNaN(new Date(parsed.expiresAt).getTime())) return null;
    return {
      version: 1,
      shareCode: parsed.shareCode.trim(),
      capturedAt: parsed.capturedAt,
      expiresAt: parsed.expiresAt,
      landingPath: typeof parsed.landingPath === 'string' ? parsed.landingPath : '',
    };
  } catch {
    return null;
  }
}

export function captureRfProAttributionFromUrl(searchParams: Pick<URLSearchParams, 'get'>, landingPath: string, now = new Date()): boolean {
  const shareCode = searchParams.get('shareCode')?.trim();
  if (!shareCode || !isBrowserStorageAvailable()) return false;

  const capturedAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + rfProAttributionTtlMs).toISOString();
  const payload: StoredRfProAttribution = {
    version: 1,
    shareCode,
    capturedAt,
    expiresAt,
    landingPath,
  };

  try {
    window.sessionStorage.setItem(rfProAttributionStorageKey, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function getStoredRfProAttribution(now = new Date()): StoredRfProAttribution | null {
  if (!isBrowserStorageAvailable()) return null;
  try {
    const stored = parseStoredAttribution(window.sessionStorage.getItem(rfProAttributionStorageKey));
    if (!stored) return null;
    if (new Date(stored.expiresAt).getTime() <= now.getTime()) {
      window.sessionStorage.removeItem(rfProAttributionStorageKey);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export function buildRfClaimAttributionPayload(claimSource: RfClaimSource, now = new Date()): RfClaimAttributionPayload | null {
  const stored = getStoredRfProAttribution(now);
  if (!stored) return null;
  return {
    version: 1,
    shareCode: stored.shareCode,
    attributionSource: 'pro_link',
    claimSource,
    capturedAt: stored.capturedAt,
    metadata: {
      restoredFromSession: true,
      landingPath: stored.landingPath,
      ttlHours: 24,
    },
  };
}

export function hasActiveRfProAttribution(now = new Date()): boolean {
  return getStoredRfProAttribution(now) !== null;
}
