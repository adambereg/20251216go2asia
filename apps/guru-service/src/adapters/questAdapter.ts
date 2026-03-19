import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class QuestAdapter implements DomainAdapter {
  public readonly domain = 'quest' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when Quest nearby API is available.
    return { items: [] };
  }
}
