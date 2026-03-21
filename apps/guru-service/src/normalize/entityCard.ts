import type { EntityCard } from '../types/entityCard';

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
