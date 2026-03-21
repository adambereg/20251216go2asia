import { normalizeAtlasPlaceToEntityCard } from '../normalize/entityCard';
import type { NearbyQuery } from '../types/entityCard';

import type { AdapterContext, AdapterResult, DomainAdapter } from './types';

export interface AtlasAdapterEnv {
  CONTENT_SERVICE_URL?: string;
}

interface ListPlacesResponse {
  items: Array<{
    id: string;
    slug: string;
    name: string;
    type: string;
    kind: string;
    category: string | null;
    tags: string[] | null;
    countryId: string | null;
    cityId: string | null;
    description: string | null;
    latitude: string | null;
    longitude: string | null;
    heroImage: string | null;
  }>;
}

export class AtlasAdapter implements DomainAdapter {
  public readonly domain = 'atlas' as const;

  constructor(private readonly env: AtlasAdapterEnv) {}

  async fetchNearby(query: NearbyQuery, context: AdapterContext): Promise<AdapterResult> {
    if (!this.env.CONTENT_SERVICE_URL) {
      return {
        items: [],
        failure: { domain: this.domain, reason: 'service_url_missing' },
        implementation: 'live',
      };
    }

    const url = new URL('/v1/content/places', this.env.CONTENT_SERVICE_URL);
    // Content places API is list/read oriented, not distance-first.
    // Fetch a bounded batch, then rely on honest coordinate-based distance in normalization.
    url.searchParams.set('limit', String(Math.min(200, Math.max(30, query.limit * 5))));

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

      const payload = (await response.json()) as ListPlacesResponse;
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) {
        return {
          items: [],
          failure: { domain: this.domain, reason: 'invalid_payload' },
          implementation: 'live',
        };
      }

      const items = payload.items
        .filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string')
        .map((item) => normalizeAtlasPlaceToEntityCard(item, { lat: query.lat, lng: query.lng }))
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return { items, implementation: 'live' };
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
