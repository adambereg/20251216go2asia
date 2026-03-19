import { normalizeRieltNearbyItemToEntityCard } from '../normalize/entityCard';
import type { NearbyQuery } from '../types/entityCard';

import type { AdapterContext, AdapterResult, DomainAdapter } from './types';

export interface RieltAdapterEnv {
  RIELT_SERVICE_URL?: string;
}

interface RieltNearbyResponse {
  items: Array<{
    id: string;
    slug: string;
    title: string;
    listingType: string;
    distanceMeters?: number;
    geo: {
      countryId: string;
      cityId: string | null;
    };
    price: {
      amount: number;
      currency: string;
      period: string;
    };
    bedrooms: number | null;
    bathrooms: number | null;
    areaSqm: number | null;
    media?: {
      coverUrl: string | null;
      photos: string[];
    };
  }>;
}

export class RieltAdapter implements DomainAdapter {
  public readonly domain = 'rielt' as const;

  constructor(private readonly env: RieltAdapterEnv) {}

  async fetchNearby(query: NearbyQuery, context: AdapterContext): Promise<AdapterResult> {
    if (!this.env.RIELT_SERVICE_URL) {
      return {
        items: [],
        failure: { domain: this.domain, reason: 'service_url_missing' },
      };
    }

    const url = new URL('/v1/rielt/listings/nearby', this.env.RIELT_SERVICE_URL);
    url.searchParams.set('lat', String(query.lat));
    url.searchParams.set('lng', String(query.lng));
    url.searchParams.set('radius_km', String(Number((query.radius_m / 1000).toFixed(3))));
    url.searchParams.set('page', '1');
    url.searchParams.set('page_size', String(Math.min(query.limit, 50)));

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
          failure: {
            domain: this.domain,
            reason: `upstream_${response.status}`,
          },
        };
      }

      const payload = (await response.json()) as RieltNearbyResponse;
      const items = Array.isArray(payload.items)
        ? payload.items.map((item) => normalizeRieltNearbyItemToEntityCard(item, { lat: query.lat, lng: query.lng }))
        : [];

      return { items };
    } catch (error) {
      const reason = error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'request_failed';
      return {
        items: [],
        failure: { domain: this.domain, reason },
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
