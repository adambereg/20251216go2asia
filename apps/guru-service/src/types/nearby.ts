import type { EntityType, PresenceMode } from './entityCard';

export interface NearbyQueryParams {
  mode?: PresenceMode;
  lat: number;
  lng: number;
  radius_m?: number;
  limit?: number;
  types?: EntityType[];
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
  rf_only?: boolean;
}

export interface NearbyByTypeQueryParams {
  mode?: PresenceMode;
  lat: number;
  lng: number;
  radius_m?: number;
  limit?: number;
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
  rf_only?: boolean;
}

export interface WhatToDoQueryParams {
  mode?: PresenceMode;
  lat: number;
  lng: number;
  radius_m?: number;
  limit?: number;
  time_window?: string;
  open_now?: boolean;
  verified_only?: boolean;
}
