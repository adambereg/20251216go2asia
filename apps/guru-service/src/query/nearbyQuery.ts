import type { EntityType, NearbyQuery, PresenceMode } from '../types/entityCard';

const ENTITY_TYPES: EntityType[] = ['place', 'event', 'listing', 'partner', 'quest', 'pro', 'blog_tag'];
const DEFAULT_RADIUS_M = 2000;
const MAX_RADIUS_M = 50000;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

function parseMode(raw: string | null): PresenceMode | null {
  if (!raw) return 'real';
  if (raw === 'real' || raw === 'virtual') return raw;
  return null;
}

function parseNumber(raw: string | null): number | null {
  if (raw === null || raw.trim().length === 0) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function parseBoolean(raw: string | null): boolean | undefined {
  if (raw === null || raw.trim().length === 0) return undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return undefined;
}

function parseEntityType(raw: string): EntityType | null {
  return ENTITY_TYPES.includes(raw as EntityType) ? (raw as EntityType) : null;
}

function parseTypes(raw: string | null): EntityType[] | undefined | null {
  if (!raw || raw.trim().length === 0) return undefined;
  const types = raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => parseEntityType(item));

  if (types.some((item) => item === null)) return null;
  return types as EntityType[];
}

export function parseNearbyQuery(searchParams: URLSearchParams): NearbyQuery | null {
  const mode = parseMode(searchParams.get('mode'));
  if (!mode) return null;

  const lat = parseNumber(searchParams.get('lat'));
  const lng = parseNumber(searchParams.get('lng'));
  if (lat === null || lng === null || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const radiusRaw = parseNumber(searchParams.get('radius_m'));
  const radius_m = radiusRaw === null ? DEFAULT_RADIUS_M : Math.round(radiusRaw);
  if (!Number.isInteger(radius_m) || radius_m <= 0 || radius_m > MAX_RADIUS_M) return null;

  const limitRaw = parseNumber(searchParams.get('limit'));
  const limit = limitRaw === null ? DEFAULT_LIMIT : Math.round(limitRaw);
  if (!Number.isInteger(limit) || limit <= 0 || limit > MAX_LIMIT) return null;

  const types = parseTypes(searchParams.get('types'));
  if (types === null) return null;

  const open_now = parseBoolean(searchParams.get('open_now'));
  if (searchParams.has('open_now') && open_now === undefined) return null;

  const verified_only = parseBoolean(searchParams.get('verified_only'));
  if (searchParams.has('verified_only') && verified_only === undefined) return null;

  const rf_only = parseBoolean(searchParams.get('rf_only'));
  if (searchParams.has('rf_only') && rf_only === undefined) return null;

  const time_windowRaw = searchParams.get('time_window');
  const time_window = time_windowRaw && time_windowRaw.trim().length > 0 ? time_windowRaw.trim() : undefined;

  return {
    mode,
    lat,
    lng,
    radius_m,
    limit,
    types,
    time_window,
    open_now,
    verified_only,
    rf_only,
  };
}

export function parseNearbyByTypeQuery(searchParams: URLSearchParams, type: EntityType): NearbyQuery | null {
  if (searchParams.has('types')) return null;
  const query = parseNearbyQuery(searchParams);
  if (!query) return null;
  return {
    ...query,
    types: [type],
  };
}

export function parseWhatToDoQuery(searchParams: URLSearchParams): NearbyQuery | null {
  if (searchParams.has('types') || searchParams.has('rf_only')) return null;
  const query = parseNearbyQuery(searchParams);
  if (!query) return null;
  return query;
}

export function parseTypeParam(raw: string): EntityType | null {
  return parseEntityType(raw);
}

export const QUERY_LIMITS = {
  DEFAULT_RADIUS_M,
  MAX_RADIUS_M,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
