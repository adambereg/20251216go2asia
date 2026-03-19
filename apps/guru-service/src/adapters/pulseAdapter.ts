import type { NearbyQuery } from '../types/entityCard';

import type { AdapterResult, DomainAdapter } from './types';

export class PulseAdapter implements DomainAdapter {
  public readonly domain = 'pulse' as const;

  async fetchNearby(_query: NearbyQuery): Promise<AdapterResult> {
    // TODO(step9-v1): replace stub when Pulse nearby API is available.
    return { items: [] };
  }
}
