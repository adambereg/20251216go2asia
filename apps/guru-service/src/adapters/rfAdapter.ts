import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class RFAdapter implements DomainAdapter {
  public readonly domain = 'rf' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when RF service is implemented.
    return { items: [], implementation: 'stub' };
  }
}
