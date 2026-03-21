import { AtlasAdapter, type AtlasAdapterEnv } from '../adapters/atlasAdapter';
import { BlogAdapter } from '../adapters/blogAdapter';
import { PulseAdapter } from '../adapters/pulseAdapter';
import { QuestAdapter, type QuestAdapterEnv } from '../adapters/questAdapter';
import { RFAdapter, type RFAdapterEnv } from '../adapters/rfAdapter';
import { RieltAdapter, type RieltAdapterEnv } from '../adapters/rieltAdapter';
import { SpaceAdapter } from '../adapters/spaceAdapter';
import type { DomainAdapter } from '../adapters/types';
import { applyNearbyFilters } from '../filter/filterLayer';
import { rankNearbyCards, rankWhatToDoCards } from '../ranking/rankingEngine';
import type { GuruListResponse, NearbyQuery, PartialFailure, SourceDomain } from '../types/entityCard';

const ADAPTER_TIMEOUT_MS = 1500;
type GuruAdaptersEnv = RieltAdapterEnv & RFAdapterEnv & QuestAdapterEnv & AtlasAdapterEnv;

function getAdapters(env: GuruAdaptersEnv): DomainAdapter[] {
  return [
    new RieltAdapter(env),
    new AtlasAdapter(env),
    new PulseAdapter(),
    new RFAdapter(env),
    new QuestAdapter(env),
    new SpaceAdapter(),
    new BlogAdapter(),
  ];
}

async function collectCards(
  query: NearbyQuery,
  env: GuruAdaptersEnv,
  requestId: string
): Promise<{
  cards: GuruListResponse['data'];
  partialFailures: PartialFailure[];
  sourcesActive: SourceDomain[];
  sourcesStub: SourceDomain[];
  sourceItemCounts: Partial<Record<SourceDomain, number>>;
}> {
  const adapters = getAdapters(env);
  const results = await Promise.all(adapters.map((adapter) => adapter.fetchNearby(query, { requestId, timeoutMs: ADAPTER_TIMEOUT_MS })));

  const cards = results.flatMap((result) => result.items);
  const partialFailures = results.flatMap((result) => (result.failure ? [result.failure] : []));
  const sourcesActive: SourceDomain[] = [];
  const sourcesStub: SourceDomain[] = [];
  const sourceItemCounts: Partial<Record<SourceDomain, number>> = {};

  for (let i = 0; i < adapters.length; i++) {
    const adapter = adapters[i];
    const result = results[i];
    const domain = adapter.domain;
    sourceItemCounts[domain] = result.items.length;
    if (result.implementation === 'stub') {
      sourcesStub.push(domain);
      continue;
    }
    sourcesActive.push(domain);
  }

  return { cards, partialFailures, sourcesActive, sourcesStub, sourceItemCounts };
}

function toResponse(
  query: NearbyQuery,
  cards: GuruListResponse['data'],
  partialFailures: PartialFailure[],
  sourcesActive: SourceDomain[],
  sourcesStub: SourceDomain[],
  sourceItemCounts: Partial<Record<SourceDomain, number>>
): GuruListResponse {
  const limited = cards.slice(0, query.limit);
  return {
    data: limited,
    meta: {
      mode: query.mode,
      lat: query.lat,
      lng: query.lng,
      radius_m: query.radius_m,
      count: limited.length,
      sources_active: sourcesActive,
      sources_stub: sourcesStub,
      source_item_counts: sourceItemCounts,
    },
    ...(partialFailures.length > 0 ? { partial_failures: partialFailures } : {}),
  };
}

export async function getNearbyResponse(query: NearbyQuery, env: GuruAdaptersEnv, requestId: string): Promise<GuruListResponse> {
  const { cards, partialFailures, sourcesActive, sourcesStub, sourceItemCounts } = await collectCards(query, env, requestId);
  const ranked = rankNearbyCards(cards, query);
  const filtered = applyNearbyFilters(ranked, query);
  return toResponse(query, filtered, partialFailures, sourcesActive, sourcesStub, sourceItemCounts);
}

export async function getWhatToDoResponse(query: NearbyQuery, env: GuruAdaptersEnv, requestId: string): Promise<GuruListResponse> {
  const { cards, partialFailures, sourcesActive, sourcesStub, sourceItemCounts } = await collectCards(query, env, requestId);
  const ranked = rankWhatToDoCards(cards, query);
  const filtered = applyNearbyFilters(ranked, query);
  return toResponse(query, filtered, partialFailures, sourcesActive, sourcesStub, sourceItemCounts);
}
