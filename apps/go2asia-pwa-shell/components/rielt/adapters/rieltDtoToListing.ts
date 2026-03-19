/**
 * Rielt.Market Asia - Adapter: Backend DTO → Frontend Listing
 * Keeps UI components unchanged; maps API shape to existing Listing type.
 */

import type { RieltListingDto, RieltNearbyListingDto } from '@go2asia/sdk/rielt';
import type { Listing, ListingWithDistance, RentalType } from '../types';

function listingTypeToRentalType(listingType: string): RentalType {
  if (listingType === 'rent_long') return 'long-term';
  return 'short-term';
}

function toPricing(dto: RieltListingDto) {
  const { amount, currency, period } = dto.price;
  const perNight = period === 'day' ? amount : undefined;
  const perMonth = period === 'month' ? amount : undefined;
  return {
    currency,
    perNight,
    perMonth,
    ...(period === 'total' && { perMonth: amount }),
  };
}

function toAddress(dto: RieltListingDto) {
  return {
    country: dto.geo.countryId,
    city: dto.geo.cityId ?? '',
    district: undefined,
    street: undefined,
    building: undefined,
    coordinates: { lat: 0, lng: 0 },
  };
}

function toMedia(dto: RieltListingDto) {
  const photos = Array.isArray(dto.media?.photos) ? dto.media.photos : [];
  const coverUrl = dto.media?.coverUrl ?? null;
  return {
    photos: photos.length > 0 ? photos : [],
    coverPhoto: coverUrl ?? photos[0] ?? undefined,
  };
}

/**
 * Converts RieltListingDto to frontend Listing.
 * Handles nullable coverUrl, empty photos, null cityId.
 */
export function rieltDtoToListing(dto: RieltListingDto): Listing {
  const { photos, coverPhoto } = toMedia(dto);
  const rentalType = listingTypeToRentalType(dto.listingType);
  const pricing = toPricing(dto);

  return {
    id: dto.id,
    title: dto.title,
    description: '', // Backend public DTO does not expose description
    type: 'apartment', // Backend has no property type; use default
    rentalType,
    address: toAddress(dto),
    photos,
    coverPhoto,
    bedrooms: dto.bedrooms ?? undefined,
    beds: undefined,
    bathrooms: dto.bathrooms ?? undefined,
    area: dto.areaSqm ?? undefined,
    maxGuests: 2,
    pricing: {
      ...pricing,
      currency: dto.price.currency,
    },
    amenities: {},
    houseRules: {},
    owner: {
      id: '',
      name: '',
    },
    status: 'approved',
    createdAt: dto.createdAt ?? '',
    updatedAt: dto.updatedAt ?? '',
  };
}

/**
 * Converts RieltNearbyListingDto to ListingWithDistance.
 */
export function rieltNearbyDtoToListingWithDistance(dto: RieltNearbyListingDto): ListingWithDistance {
  const base = rieltDtoToListing(dto);
  const distance = dto.distanceMeters ?? undefined;
  return {
    ...base,
    distance,
    walkingTime: distance != null ? Math.round(distance / 80) : undefined,
  };
}
