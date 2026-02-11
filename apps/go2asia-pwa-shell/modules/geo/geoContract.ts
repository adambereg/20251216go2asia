export type GeoContractVersion = 'v1';

export type GeoLayerKey = 'cities' | 'places' | 'events' | 'quests' | 'user';

export type GeoItemType =
  | 'country'
  | 'city'
  | 'district'
  | 'place'
  | 'event'
  | 'property'
  | 'quest_point'
  | 'user';

export interface GeoItem {
  id: string;
  type: GeoItemType;
  subtype?: string;
  title: string;
  lat: number;
  lng: number;
  priority: number;
  meta?: Record<string, unknown>;
}

export interface GeoMapResponseMeta {
  contractVersion: GeoContractVersion;
  generatedAt: string; // ISO
  source: 'mock' | 'content-service' | 'geo-service';
}

export interface GeoMapResponse {
  layers: Partial<Record<GeoLayerKey, GeoItem[]>>;
  meta?: GeoMapResponseMeta;
}

