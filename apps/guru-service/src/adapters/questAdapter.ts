import { normalizeQuestToEntityCard } from '../normalize/entityCard';
import type { NearbyQuery } from '../types/entityCard';

import type { AdapterContext, AdapterResult, DomainAdapter } from './types';

export interface QuestAdapterEnv {
  QUEST_SERVICE_URL?: string;
}

interface QuestListResponse {
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    cityId: string | null;
    type: string | null;
    theme: string | null;
    difficulty: 'easy' | 'medium' | 'hard' | null;
    rewardPoints: number | null;
    stepsCount: number;
  }>;
}

export class QuestAdapter implements DomainAdapter {
  public readonly domain = 'quest' as const;

  constructor(private readonly env: QuestAdapterEnv) {}

  async fetchNearby(query: NearbyQuery, context: AdapterContext): Promise<AdapterResult> {
    if (!this.env.QUEST_SERVICE_URL) {
      return {
        items: [],
        failure: { domain: this.domain, reason: 'service_url_missing' },
        implementation: 'live',
      };
    }

    const url = new URL('/v1/quests', this.env.QUEST_SERVICE_URL);
    url.searchParams.set('page', '1');
    url.searchParams.set('pageSize', String(Math.min(query.limit, 50)));
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

      const payload = (await response.json()) as QuestListResponse;
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) {
        return {
          items: [],
          failure: { domain: this.domain, reason: 'invalid_payload' },
          implementation: 'live',
        };
      }

      try {
        const items = payload.items
          .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string')
          .map((item) => normalizeQuestToEntityCard(item, { lat: query.lat, lng: query.lng }));
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
