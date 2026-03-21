import { normalizeRFPartnerToEntityCard } from '../normalize/entityCard';
import type { NearbyQuery } from '../types/entityCard';

import type { AdapterContext, AdapterResult, DomainAdapter } from './types';

export interface RFAdapterEnv {
  RF_SERVICE_URL?: string;
}

interface RFPartnerListResponse {
  items: Array<{
    id: string;
    slug: string;
    displayName: string;
    countryId: string;
    cityId: string;
  }>;
}

export class RFAdapter implements DomainAdapter {
  public readonly domain = 'rf' as const;

  constructor(private readonly env: RFAdapterEnv) {}

  async fetchNearby(query: NearbyQuery, context: AdapterContext): Promise<AdapterResult> {
    if (!this.env.RF_SERVICE_URL) {
      return {
        items: [],
        failure: { domain: this.domain, reason: 'service_url_missing' },
        implementation: 'live',
      };
    }

    const url = new URL('/v1/rf/partners', this.env.RF_SERVICE_URL);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), context.timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Request-ID': context.requestId,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          items: [],
          failure: { domain: this.domain, reason: `upstream_${response.status}` },
          implementation: 'live',
        };
      }

      const payload = (await response.json()) as RFPartnerListResponse;
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) {
        return {
          items: [],
          failure: { domain: this.domain, reason: 'invalid_payload' },
          implementation: 'live',
        };
      }

      try {
        const items = payload.items
          .filter((item) => item && typeof item.id === 'string' && typeof item.displayName === 'string')
          .map((item) => normalizeRFPartnerToEntityCard(item, { lat: query.lat, lng: query.lng }));
        return { items, implementation: 'live' };
      } catch {
        return {
          items: [],
          failure: { domain: this.domain, reason: 'invalid_payload' },
          implementation: 'live',
        };
      }
    } catch (error) {
      const reason = error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'request_failed';
      return {
        items: [],
        failure: { domain: this.domain, reason },
        implementation: 'live',
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
