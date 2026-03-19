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
