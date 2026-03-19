import { useQuery } from '@tanstack/react-query';

import { customInstance } from './mutator';

export type PresenceMode = 'real' | 'virtual';

export type GuruEntityType = 'place' | 'event' | 'listing' | 'partner' | 'quest' | 'pro' | 'blog_tag';

export type GuruSourceDomain = 'atlas' | 'pulse' | 'rielt' | 'rf' | 'quest' | 'space' | 'blog';

export interface GuruEntityAction {
  type:
    | 'open'
    | 'navigate'
    | 'book'
    | 'view_in_atlas'
    | 'view_in_pulse'
    | 'view_in_rielt'
    | 'view_in_blog'
    | 'start_quest'
    | 'contact_pro'
    | 'open_partner';
  label: string;
  deeplink: string;
}

export interface GuruEntityCard {
  id: string;
  type: GuruEntityType;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  lat?: number;
  lng?: number;
  distance_m?: number;
  city_id?: string;
  country_id?: string;
  tags?: string[];
  rating?: number;
  price_level?: number;
  is_verified?: boolean;
  is_rf?: boolean;
  is_open_now?: boolean;
  starts_at?: string;
  actions?: GuruEntityAction[];
  explain?: { reasons: string[] };
  source?: {
    domain: GuruSourceDomain;
    source_id: string;
    source_slug?: string;
  };
  payload?: Record<string, unknown>;
}

export interface GuruResponseMeta {
  mode: PresenceMode;
  lat: number;
  lng: number;
  radius_m: number;
  count: number;
}

export interface GuruPartialFailure {
  domain: GuruSourceDomain;
  reason: string;
}

export interface GuruListResponse {
  data: GuruEntityCard[];
  meta: GuruResponseMeta;
  partial_failures?: GuruPartialFailure[];
}

export interface GuruNearbyParams {
  mode?: PresenceMode;
  lat: number;
  lng: number;
  radius_m?: number;
  limit?: number;
  types?: GuruEntityType[];
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
  rf_only?: boolean;
}

export interface GuruWhatToDoParams {
  mode?: PresenceMode;
  lat: number;
  lng: number;
  radius_m?: number;
  limit?: number;
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
}

function buildNearbyQuery(params: GuruNearbyParams | GuruWhatToDoParams): string {
  const sp = new URLSearchParams();
  if (params.mode) sp.set('mode', params.mode);
  sp.set('lat', String(params.lat));
  sp.set('lng', String(params.lng));
  if (params.radius_m != null) sp.set('radius_m', String(params.radius_m));
  if (params.limit != null) sp.set('limit', String(params.limit));
  if ('types' in params && params.types && params.types.length > 0) {
    sp.set('types', params.types.join(','));
  }
  if (params.time_window) sp.set('time_window', params.time_window);
  if (params.open_now != null) sp.set('open_now', String(params.open_now));
  if (params.verified_only != null) sp.set('verified_only', String(params.verified_only));
  if ('rf_only' in params && params.rf_only != null) sp.set('rf_only', String(params.rf_only));
  const query = sp.toString();
  return query ? `?${query}` : '';
}

export async function fetchGuruNearby(params: GuruNearbyParams): Promise<GuruListResponse> {
  return customInstance<GuruListResponse>({ method: 'GET' }, `/v1/guru/nearby${buildNearbyQuery(params)}`);
}

export async function fetchGuruNearbyByType(type: GuruEntityType, params: Omit<GuruNearbyParams, 'types'>): Promise<GuruListResponse> {
  return customInstance<GuruListResponse>(
    { method: 'GET' },
    `/v1/guru/nearby/${encodeURIComponent(type)}${buildNearbyQuery(params)}`
  );
}

export async function fetchGuruWhatToDo(params: GuruWhatToDoParams): Promise<GuruListResponse> {
  return customInstance<GuruListResponse>({ method: 'GET' }, `/v1/guru/what-to-do${buildNearbyQuery(params)}`);
}

export function useGuruNearby(params?: GuruNearbyParams | null) {
  const enabled = Boolean(params && Number.isFinite(params.lat) && Number.isFinite(params.lng));
  return useQuery<GuruListResponse, Error>({
    queryKey: ['guru', 'nearby', params ?? {}],
    enabled,
    queryFn: async () => fetchGuruNearby(params as GuruNearbyParams),
    staleTime: 30_000,
  });
}
