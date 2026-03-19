import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class SpaceAdapter implements DomainAdapter {
  public readonly domain = 'space' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when Space PRO opt-in nearby API is available.
    return { items: [] };
  }
}
