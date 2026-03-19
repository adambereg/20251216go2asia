import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class BlogAdapter implements DomainAdapter {
  public readonly domain = 'blog' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when Blog geo-context tags API is available.
    return { items: [] };
  }
}
