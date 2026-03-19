import { AtlasAdapter } from '../adapters/atlasAdapter';
import { BlogAdapter } from '../adapters/blogAdapter';
import { PulseAdapter } from '../adapters/pulseAdapter';
import { QuestAdapter } from '../adapters/questAdapter';
import { RFAdapter } from '../adapters/rfAdapter';
import { RieltAdapter, type RieltAdapterEnv } from '../adapters/rieltAdapter';
import { SpaceAdapter } from '../adapters/spaceAdapter';
import type { DomainAdapter } from '../adapters/types';
import { applyNearbyFilters } from '../filter/filterLayer';
import { rankNearbyCards, rankWhatToDoCards } from '../ranking/rankingEngine';
import type { GuruListResponse, NearbyQuery, PartialFailure } from '../types/entityCard';

const ADAPTER_TIMEOUT_MS = 1500;

function getAdapters(env: RieltAdapterEnv): DomainAdapter[] {
  return [
    new RieltAdapter(env),
    new AtlasAdapter(),
    new PulseAdapter(),
    new RFAdapter(),
    new QuestAdapter(),
    new SpaceAdapter(),
    new BlogAdapter(),
  ];
}

async function collectCards(query: NearbyQuery, env: RieltAdapterEnv, requestId: string): Promise<{ cards: GuruListResponse['data']; partialFailures: PartialFailure[] }> {
  const adapters = getAdapters(env);
  const results = await Promise.all(adapters.map((adapter) => adapter.fetchNearby(query, { requestId, timeoutMs: ADAPTER_TIMEOUT_MS })));

  const cards = results.flatMap((result) => result.items);
  const partialFailures = results.flatMap((result) => (result.failure ? [result.failure] : []));

  return { cards, partialFailures };
}

function toResponse(query: NearbyQuery, cards: GuruListResponse['data'], partialFailures: PartialFailure[]): GuruListResponse {
  const limited = cards.slice(0, query.limit);
  return {
    data: limited,
    meta: {
      mode: query.mode,
      lat: query.lat,
      lng: query.lng,
      radius_m: query.radius_m,
      count: limited.length,
    },
    ...(partialFailures.length > 0 ? { partial_failures: partialFailures } : {}),
  };
}

export async function getNearbyResponse(query: NearbyQuery, env: RieltAdapterEnv, requestId: string): Promise<GuruListResponse> {
  const { cards, partialFailures } = await collectCards(query, env, requestId);
  const ranked = rankNearbyCards(cards, query);
  const filtered = applyNearbyFilters(ranked, query);
  return toResponse(query, filtered, partialFailures);
}

export async function getWhatToDoResponse(query: NearbyQuery, env: RieltAdapterEnv, requestId: string): Promise<GuruListResponse> {
  const { cards, partialFailures } = await collectCards(query, env, requestId);
  const ranked = rankWhatToDoCards(cards, query);
  const filtered = applyNearbyFilters(ranked, query);
  return toResponse(query, filtered, partialFailures);
}
