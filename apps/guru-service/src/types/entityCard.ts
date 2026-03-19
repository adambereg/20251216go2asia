export type PresenceMode = 'real' | 'virtual';

export type EntityType =
  | 'place'
  | 'event'
  | 'listing'
  | 'partner'
  | 'quest'
  | 'pro'
  | 'blog_tag';

export type ExplainReason =
  | 'nearby'
  | 'happening_now'
  | 'starting_soon'
  | 'verified'
  | 'popular'
  | 'recommended'
  | 'partner'
  | 'new';

export type EntityActionType =
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

export interface EntityAction {
  type: EntityActionType;
  label: string;
  deeplink: string;
}

export interface ExplainBlock {
  reasons: ExplainReason[];
}

export type SourceDomain = 'atlas' | 'pulse' | 'rielt' | 'rf' | 'quest' | 'space' | 'blog';

export interface SourceRef {
  domain: SourceDomain;
  source_id: string;
  source_slug?: string;
}

interface EntityCardBase {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
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
  actions?: EntityAction[];
  explain?: ExplainBlock;
  source: SourceRef;
  payload?: Record<string, unknown>;
}

interface GeoEntityCard extends EntityCardBase {
  type: Exclude<EntityType, 'blog_tag'>;
  lat: number;
  lng: number;
}

interface BlogTagEntityCard extends EntityCardBase {
  type: 'blog_tag';
  lat?: number;
  lng?: number;
}

export type EntityCard = GeoEntityCard | BlogTagEntityCard;

export interface NearbyQuery {
  mode: PresenceMode;
  lat: number;
  lng: number;
  radius_m: number;
  limit: number;
  types?: EntityType[];
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
  rf_only?: boolean;
}

export interface PartialFailure {
  domain: SourceDomain;
  reason: string;
}

export interface GuruResponseMeta {
  mode: PresenceMode;
  lat: number;
  lng: number;
  radius_m: number;
  count: number;
}

export interface GuruListResponse {
  data: EntityCard[];
  meta: GuruResponseMeta;
  partial_failures?: PartialFailure[];
}
