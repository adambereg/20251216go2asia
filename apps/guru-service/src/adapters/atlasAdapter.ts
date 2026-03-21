import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class AtlasAdapter implements DomainAdapter {
  public readonly domain = 'atlas' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when Atlas nearby API is available.
    return { items: [], implementation: 'stub' };
  }
}
