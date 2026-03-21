import type { EntityCard, ExplainReason } from '../types/entityCard';

function toFiniteNumber(value: string | null | undefined): number | null {
  if (typeof value !== 'string') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function haversineDistanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(bLat - aLat);
  const dLng = toRadians(bLng - aLng);
  const lat1 = toRadians(aLat);
  const lat2 = toRadians(bLat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return earthRadius * c;
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

interface RieltNearbyDto {
  id: string;
  slug: string;
  title: string;
  listingType: string;
  distanceMeters?: number;
  geo: {
    countryId: string;
    cityId: string | null;
  };
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  media?: {
    coverUrl: string | null;
    photos: string[];
  };
}

export function normalizeRieltNearbyItemToEntityCard(item: RieltNearbyDto, anchor: { lat: number; lng: number }): EntityCard {
  const cityId = item.geo.cityId ?? undefined;
  const coverUrl = item.media?.coverUrl ?? undefined;

  return {
    id: item.id,
    type: 'listing',
    title: item.title,
    subtitle: item.listingType,
    description: undefined,
    image_url: coverUrl,
    lat: anchor.lat,
    lng: anchor.lng,
    distance_m: typeof item.distanceMeters === 'number' ? Math.round(item.distanceMeters) : undefined,
    city_id: cityId,
    country_id: item.geo.countryId,
    tags: ['listing', item.listingType],
    rating: undefined,
    price_level: undefined,
    is_verified: false,
    is_rf: false,
    actions: [
      {
        type: 'view_in_rielt',
        label: 'Открыть в Rielt',
        deeplink: `/rielt/listings/${encodeURIComponent(item.slug || item.id)}`,
      },
    ],
    explain: {
      reasons: ['nearby'],
    },
    source: {
      domain: 'rielt',
      source_id: item.id,
      source_slug: item.slug,
    },
    payload: {
      listing_type: item.listingType,
      price: item.price.amount,
      currency: item.price.currency,
      period: item.price.period,
      rooms: item.bedrooms ?? undefined,
      bathrooms: item.bathrooms ?? undefined,
      area_m2: item.areaSqm ?? undefined,
    },
  };
}

interface RFPartnerDto {
  id: string;
  slug: string;
  displayName: string;
  countryId: string;
  cityId: string;
}

export function normalizeRFPartnerToEntityCard(item: RFPartnerDto, anchor: { lat: number; lng: number }): EntityCard {
  return {
    id: item.id,
    type: 'partner',
    title: item.displayName,
    subtitle: 'RF partner',
    description: undefined,
    image_url: undefined,
    lat: anchor.lat,
    lng: anchor.lng,
    distance_m: undefined,
    city_id: item.cityId,
    country_id: item.countryId,
    tags: ['partner', 'rf'],
    rating: undefined,
    price_level: undefined,
    is_verified: false,
    is_rf: true,
    actions: [
      {
        type: 'open_partner',
        label: 'Открыть партнера',
        deeplink: `/rf/partners/${encodeURIComponent(item.slug || item.id)}`,
      },
    ],
    explain: {
      reasons: ['partner'],
    },
    source: {
      domain: 'rf',
      source_id: item.id,
      source_slug: item.slug,
    },
    payload: {
      partner_slug: item.slug,
    },
  };
}

interface QuestDto {
  id: string;
  title: string;
  description: string | null;
  cityId: string | null;
  type: string | null;
  theme: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  rewardPoints: number | null;
  stepsCount: number;
}

export function normalizeQuestToEntityCard(item: QuestDto, anchor: { lat: number; lng: number }): EntityCard {
  const tags = ['quest'];
  if (item.type) tags.push(item.type);
  if (item.theme) tags.push(item.theme);
  if (item.difficulty) tags.push(item.difficulty);

  const subtitleParts = ['Quest'];
  if (item.difficulty) subtitleParts.push(item.difficulty);
  if (item.theme) subtitleParts.push(item.theme);

  return {
    id: item.id,
    type: 'quest',
    title: item.title,
    subtitle: subtitleParts.join(' · '),
    description: item.description ?? undefined,
    image_url: undefined,
    lat: anchor.lat,
    lng: anchor.lng,
    distance_m: undefined,
    city_id: item.cityId ?? undefined,
    country_id: undefined,
    tags,
    rating: undefined,
    price_level: undefined,
    is_verified: false,
    is_rf: false,
    actions: [
      {
        type: 'start_quest',
        label: 'Начать квест',
        deeplink: `/quests/${encodeURIComponent(item.id)}`,
      },
    ],
    explain: {
      reasons: ['recommended'],
    },
    source: {
      domain: 'quest',
      source_id: item.id,
    },
    payload: {
      quest_type: item.type ?? undefined,
      theme: item.theme ?? undefined,
      difficulty: item.difficulty ?? undefined,
      reward_points: item.rewardPoints ?? undefined,
      steps_count: item.stepsCount,
    },
  };
}

interface AtlasPlaceDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  kind: string;
  category: string | null;
  tags: string[] | null;
  countryId: string | null;
  cityId: string | null;
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  heroImage: string | null;
}

export function normalizeAtlasPlaceToEntityCard(
  item: AtlasPlaceDto,
  anchor: { lat: number; lng: number }
): EntityCard | null {
  const lat = toFiniteNumber(item.latitude);
  const lng = toFiniteNumber(item.longitude);
  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const distanceMeters = Math.round(haversineDistanceMeters(anchor.lat, anchor.lng, lat, lng));
  const tags = ['place'];
  if (item.kind) tags.push(item.kind);
  if (item.type) tags.push(item.type);
  if (item.category) tags.push(item.category);
  if (Array.isArray(item.tags)) {
    for (const tag of item.tags) {
      if (typeof tag === 'string' && tag.trim().length > 0) tags.push(tag);
    }
  }

  return {
    id: item.id,
    type: 'place',
    title: item.name,
    subtitle: item.category ?? item.kind,
    description: item.description ?? undefined,
    image_url: item.heroImage ?? undefined,
    lat,
    lng,
    distance_m: distanceMeters,
    city_id: item.cityId ?? undefined,
    country_id: item.countryId ?? undefined,
    tags: Array.from(new Set(tags)),
    rating: undefined,
    price_level: undefined,
    is_verified: false,
    is_rf: false,
    actions: [
      {
        type: 'view_in_atlas',
        label: 'Открыть в Atlas',
        deeplink: `/atlas/places/${encodeURIComponent(item.slug || item.id)}`,
      },
    ],
    explain: {
      reasons: ['nearby'],
    },
    source: {
      domain: 'atlas',
      source_id: item.id,
      source_slug: item.slug,
    },
    payload: {
      place_type: item.type,
      place_kind: item.kind,
      category: item.category ?? undefined,
    },
  };
}

interface PulseEventDto {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category?: string | null;
  startDate: string;
  endDate?: string | null;
  imageUrl?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isActive?: boolean;
}

export function normalizePulseEventToEntityCard(
  item: PulseEventDto,
  anchor: { lat: number; lng: number }
): EntityCard | null {
  const lat = toFiniteNumber(item.latitude);
  const lng = toFiniteNumber(item.longitude);
  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const startMs = parseIsoMs(item.startDate);
  if (startMs === null) return null;
  const endMs = parseIsoMs(item.endDate);
  const now = Date.now();

  const reasons: ExplainReason[] = ['recommended'];
  if (endMs !== null && startMs <= now && now <= endMs) {
    reasons.push('happening_now');
  } else if (startMs > now && startMs - now <= 6 * 60 * 60 * 1000) {
    reasons.push('starting_soon');
  }

  const tags = ['event'];
  if (item.category) tags.push(item.category);

  return {
    id: item.id,
    type: 'event',
    title: item.title,
    subtitle: item.category ?? 'Event',
    description: item.description ?? undefined,
    image_url: item.imageUrl ?? undefined,
    lat,
    lng,
    distance_m: Math.round(haversineDistanceMeters(anchor.lat, anchor.lng, lat, lng)),
    city_id: undefined,
    country_id: undefined,
    tags,
    rating: undefined,
    price_level: undefined,
    is_verified: false,
    is_rf: false,
    is_open_now: undefined,
    starts_at: item.startDate,
    actions: [
      {
        type: 'view_in_pulse',
        label: 'Open in Pulse',
        deeplink: `/pulse/${encodeURIComponent(item.slug || item.id)}`,
      },
    ],
    explain: {
      reasons,
    },
    source: {
      domain: 'pulse',
      source_id: item.id,
      source_slug: item.slug,
    },
    payload: {
      category: item.category ?? undefined,
      end_at: item.endDate ?? undefined,
      is_active: item.isActive ?? undefined,
    },
  };
}
