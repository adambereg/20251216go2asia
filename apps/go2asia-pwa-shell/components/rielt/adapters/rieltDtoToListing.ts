/**
 * Rielt.Market Asia - Adapter: Backend DTO → Frontend Listing
 * Keeps UI components unchanged; maps API shape to existing Listing type.
 */

import type { RieltListingDto, RieltNearbyListingDto } from '@go2asia/sdk/rielt';
import type { GeoPrecision, Listing, ListingWithDistance, RentalType } from '../types';

function listingTypeToRentalType(listingType: string): RentalType {
  if (listingType === 'rent_long') return 'long-term';
  if (listingType === 'sale') return 'long-term';
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
  const publicGeo = dto.geo.public ?? null;
  const precision: GeoPrecision = publicGeo?.precision ?? (dto.geo.cityId ? 'city' : 'none');
  const publicLat = typeof publicGeo?.lat === 'number' ? publicGeo.lat : null;
  const publicLng = typeof publicGeo?.lng === 'number' ? publicGeo.lng : null;
  return {
    country: dto.geo.countryId,
    city: publicGeo?.cityLabel ?? dto.geo.cityId ?? '',
    cityId: dto.geo.cityId ?? null,
    atlasPlaceId: dto.geo.atlasPlaceId ?? null,
    atlasContainerPlaceId: dto.geo.atlasContainerPlaceId ?? null,
    district: publicGeo?.areaLabel ?? undefined,
    street: undefined,
    building: undefined,
    coordinates: publicLat != null && publicLng != null ? { lat: publicLat, lng: publicLng } : null,
    geoPrecision: precision,
    geoAccuracyRadiusM: publicGeo?.accuracyRadiusM ?? null,
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
    presentation: {
      source: 'runtime',
    },
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

/**
 * Merge forward-compatible seed presentation overlay into runtime listing.
 * Keeps Step 8 listing truth from API as primary source.
 */
export function mergeSeedPresentationOverlay(base: Listing, overlay: Listing | null | undefined): Listing {
  if (!overlay || overlay.id !== base.id) return base;

  const mergedCoordinates = base.address.coordinates ?? overlay.address.coordinates ?? null;
  const mergedDistrict = base.address.district ?? overlay.address.district;
  const mergedPrecision: GeoPrecision =
    base.address.geoPrecision ??
    overlay.address.geoPrecision ??
    (mergedCoordinates
      ? ('approximate' as GeoPrecision)
      : mergedDistrict
        ? 'area'
        : base.address.city
          ? 'city'
          : 'none');

  return {
    ...base,
    address: {
      ...base.address,
      cityId: base.address.cityId ?? overlay.address.cityId ?? null,
      district: mergedDistrict,
      atlasPlaceId: base.address.atlasPlaceId ?? overlay.address.atlasPlaceId ?? null,
      atlasContainerPlaceId: base.address.atlasContainerPlaceId ?? overlay.address.atlasContainerPlaceId ?? null,
      coordinates: mergedCoordinates,
      geoPrecision: mergedPrecision,
      geoAccuracyRadiusM: base.address.geoAccuracyRadiusM ?? overlay.address.geoAccuracyRadiusM ?? null,
    },
    isRF: base.isRF ?? overlay.isRF,
    rfVoucher: base.rfVoucher ?? overlay.rfVoucher,
    proVerification: base.proVerification ?? overlay.proVerification,
    isInstant: base.isInstant ?? overlay.isInstant,
    isNew: base.isNew ?? overlay.isNew,
    owner: {
      ...base.owner,
      isRFPartner: base.owner.isRFPartner ?? overlay.owner.isRFPartner,
      isPRO: base.owner.isPRO ?? overlay.owner.isPRO,
    },
    presentation: {
      ...(base.presentation ?? { source: 'runtime' as const }),
      ...(overlay.presentation ?? {}),
      source: overlay.presentation?.source ?? base.presentation?.source ?? 'runtime',
    },
  };
}
