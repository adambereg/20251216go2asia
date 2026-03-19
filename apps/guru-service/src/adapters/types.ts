import type { EntityCard, NearbyQuery, PartialFailure, SourceDomain } from '../types/entityCard';

export interface AdapterContext {
  requestId: string;
  timeoutMs: number;
}

export interface AdapterResult {
  items: EntityCard[];
  failure?: PartialFailure;
}

export interface DomainAdapter {
  domain: SourceDomain;
  fetchNearby(query: NearbyQuery, context: AdapterContext): Promise<AdapterResult>;
}
