import { NextResponse } from 'next/server';
import { listSeedListings, listSeedNearbyListings } from '@/lib/rieltSeedRepo';

function toOptionalNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const cityId = searchParams.get('city_id') ?? undefined;
    const listingType = searchParams.get('listing_type') as 'rent_short' | 'rent_long' | 'sale' | null;
    const bedroomsMin = toOptionalNumber(searchParams.get('bedrooms_min'));
    const bedroomsMax = toOptionalNumber(searchParams.get('bedrooms_max'));
    const sort = (searchParams.get('sort') as 'newest' | 'price_asc' | 'price_desc' | null) ?? undefined;
    const page = toOptionalNumber(searchParams.get('page'));
    const pageSize = toOptionalNumber(searchParams.get('page_size'));
    const onlyRF = searchParams.get('only_rf') === '1';
    const onlyPROVerified = searchParams.get('only_pro_verified') === '1';

    const lat = toOptionalNumber(searchParams.get('lat'));
    const lng = toOptionalNumber(searchParams.get('lng'));
    const radiusKm = toOptionalNumber(searchParams.get('radius_km'));

    if (lat != null && lng != null && radiusKm != null) {
      const nearby = listSeedNearbyListings({
        lat,
        lng,
        radiusKm,
        cityId,
        listingType: listingType ?? undefined,
        bedroomsMin,
        bedroomsMax,
        sort,
        page,
        pageSize,
        onlyRF,
        onlyPROVerified,
      });
      return NextResponse.json({
        source: 'seed',
        mode: 'nearby',
        ...nearby,
      });
    }

    const data = listSeedListings({
      cityId,
      listingType: listingType ?? undefined,
      bedroomsMin,
      bedroomsMax,
      sort,
      page,
      pageSize,
      onlyRF,
      onlyPROVerified,
    });
    return NextResponse.json({
      source: 'seed',
      mode: 'list',
      ...data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'SEED_LOAD_FAILED',
          message: error instanceof Error ? error.message : 'Unable to load Rielt seed data',
        },
      },
      { status: 500 }
    );
  }
}
