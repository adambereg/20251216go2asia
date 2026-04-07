import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Listing, ListingWithDistance, RentalType } from '@/components/rielt/types';

type CsvRow = Record<string, string>;

type ListingSort = 'newest' | 'price_asc' | 'price_desc';
type ListingTypeFilter = 'rent_short' | 'rent_long' | 'sale';

export interface SeedListParams {
  cityId?: string;
  listingType?: ListingTypeFilter;
  bedroomsMin?: number;
  bedroomsMax?: number;
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
  onlyRF?: boolean;
  onlyPROVerified?: boolean;
}

export interface SeedNearbyParams extends SeedListParams {
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface SeedListResult {
  items: Listing[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface SeedNearbyResult {
  items: ListingWithDistance[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

type SeedCache = {
  listings: Listing[];
  byId: Map<string, Listing>;
  bySlug: Map<string, Listing>;
};

let seedCache: SeedCache | null = null;

const KNOWN_MEDIA_SCARCE_STATES = new Set(['sparse_media']);

function parseCsv(content: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value);
      value = '';
      if (row.some((cell) => cell.trim().length > 0)) rows.push(row);
      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.trim().length > 0)) rows.push(row);
  }

  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const result: CsvRow = {};
    for (let i = 0; i < header.length; i += 1) {
      result[header[i]] = (cells[i] ?? '').trim();
    }
    return result;
  });
}

function parseBool(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parseDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value;
}

function resolveContentRoot(): string {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, 'content', 'rielt'),
    path.resolve(cwd, '..', 'content', 'rielt'),
    path.resolve(cwd, '..', '..', 'content', 'rielt'),
    path.resolve(cwd, '..', '..', '..', 'content', 'rielt'),
  ];

  for (const candidate of candidates) {
    if (existsSync(path.resolve(candidate, 'core', 'rielt_listings_core.csv'))) {
      return candidate;
    }
  }

  throw new Error('Rielt seed content folder not found');
}

function toRentalType(listingType: string): RentalType {
  if (listingType === 'rent_long' || listingType === 'sale') return 'long-term';
  return 'short-term';
}

function toAmenities(raw: string) {
  const tokens = raw
    .split('|')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return {
    wifi: tokens.includes('wifi'),
    workspace: tokens.includes('workspace'),
    ac: tokens.includes('aircon') || tokens.includes('ac'),
    kitchen: tokens.includes('kitchen'),
    parking: tokens.includes('parking'),
    childFriendly: tokens.includes('child_friendly') || tokens.includes('family'),
  };
}

function toListingStatus(status: string): Listing['status'] {
  if (status === 'published') return 'approved';
  if (status === 'draft') return 'draft';
  return 'pending';
}

function buildImageUrls(listingId: string, mediaRows: CsvRow[], sparseMedia: boolean): string[] {
  if (mediaRows.length === 0) return [];
  const sorted = [...mediaRows].sort((a, b) => (parseNumber(a.sort_order) ?? 0) - (parseNumber(b.sort_order) ?? 0));
  const takeCount = sparseMedia ? 1 : Math.min(sorted.length, 4);
  return sorted.slice(0, takeCount).map((row, idx) => {
    const mediaId = row.media_id ?? `seed-${idx + 1}`;
    return `/placeholder-listing.jpg?seed=${encodeURIComponent(listingId)}&media=${encodeURIComponent(mediaId)}`;
  });
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function loadSeedCache(): SeedCache {
  if (seedCache) return seedCache;

  const root = resolveContentRoot();
  const read = (segments: string[]) => readFileSync(path.resolve(root, ...segments), 'utf8');

  const listingsRows = parseCsv(read(['core', 'rielt_listings_core.csv']));
  const mediaRows = parseCsv(read(['core', 'rielt_listing_media_core.csv']));
  const actorRows = parseCsv(read(['core', 'rielt_listing_actor_links_core.csv']));
  const partnerRows = parseCsv(read(['extension', 'rielt_partners_extension.csv']));
  const curatorRows = parseCsv(read(['extension', 'rielt_pro_curators_extension.csv']));
  const presentationRows = parseCsv(read(['extension', 'rielt_listing_presentation_extension.csv']));
  const voucherRows = parseCsv(read(['extension', 'rielt_listing_vouchers_extension.csv']));
  const scenarioRows = parseCsv(read(['extension', 'rielt_seed_scenarios_extension.csv']));

  const mediaByListing = new Map<string, CsvRow[]>();
  for (const row of mediaRows) {
    const listingId = row.listing_id;
    if (!listingId) continue;
    const list = mediaByListing.get(listingId) ?? [];
    list.push(row);
    mediaByListing.set(listingId, list);
  }

  const ownerByListing = new Map<string, string>();
  for (const row of actorRows) {
    if (row.actor_role === 'owner' && row.listing_id) ownerByListing.set(row.listing_id, row.actor_user_id);
  }

  const partnerById = new Map(partnerRows.map((row) => [row.partner_id, row]));
  const curatorById = new Map(curatorRows.map((row) => [row.pro_id, row]));
  const presentationByListing = new Map(presentationRows.map((row) => [row.listing_id, row]));
  const vouchersByListing = new Map<string, CsvRow[]>();
  for (const row of voucherRows) {
    if (!row.listing_id || !parseBool(row.is_active)) continue;
    const list = vouchersByListing.get(row.listing_id) ?? [];
    list.push(row);
    vouchersByListing.set(row.listing_id, list);
  }
  const scenarioByListing = new Map(scenarioRows.map((row) => [row.listing_id, row]));

  const listings: Listing[] = listingsRows
    .filter((row) => row.status === 'published')
    .map((row) => {
      const listingId = row.listing_id;
      const listingPresentation = presentationByListing.get(listingId);
      const partner = listingPresentation?.partner_id ? partnerById.get(listingPresentation.partner_id) : undefined;
      const curator = listingPresentation?.pro_id ? curatorById.get(listingPresentation.pro_id) : undefined;
      const vouchers = (vouchersByListing.get(listingId) ?? []).sort(
        (a, b) => (parseNumber(b.priority_weight) ?? 0) - (parseNumber(a.priority_weight) ?? 0)
      );
      const primaryVoucher = vouchers[0];
      const scenario = scenarioByListing.get(listingId);
      const sparseMedia = KNOWN_MEDIA_SCARCE_STATES.has((scenario?.expected_visual_state ?? '').toLowerCase());

      const photos = buildImageUrls(listingId, mediaByListing.get(listingId) ?? [], sparseMedia);
      const lat = parseNumber(row.lat);
      const lng = parseNumber(row.lng);
      const showCoordinates = parseBool(listingPresentation?.show_public_coordinates);
      const coordinates =
        showCoordinates && lat != null && lng != null
          ? {
              lat,
              lng,
            }
          : null;

      const publishedAt = parseDate(row.published_at) ?? parseDate(row.created_at) ?? new Date().toISOString();
      const rentalType = toRentalType(row.listing_type);
      const amount = parseNumber(row.price_amount) ?? 0;
      const period = row.price_period;

      const validityDays = parseNumber(primaryVoucher?.validity_days) ?? 30;
      const validFrom = publishedAt;
      const validUntil = new Date(Date.parse(publishedAt) + validityDays * 24 * 60 * 60 * 1000).toISOString();

      const ownerId = ownerByListing.get(listingId) ?? '';
      const ownerName = curator?.public_name ?? partner?.partner_public_name ?? 'Партнер Rielt';
      const trustLabel = listingPresentation?.trust_score_label || partner?.trust_note || curator?.trust_badge;

      return {
        id: listingId,
        title: row.title,
        description: row.description || listingPresentation?.description_short || '',
        type: 'apartment',
        rentalType,
        address: {
          country: row.country_id,
          city: row.city_id,
          district: row.area_text || undefined,
          atlasPlaceId: listingPresentation?.atlas_place_id || null,
          atlasContainerPlaceId: listingPresentation?.atlas_container_place_id || null,
          coordinates,
        },
        photos,
        coverPhoto: photos[0],
        bedrooms: parseNumber(row.bedrooms),
        bathrooms: parseNumber(row.bathrooms),
        area: parseNumber(row.area_sqm),
        maxGuests: parseNumber(listingPresentation?.max_guests) ?? 2,
        pricing: {
          currency: row.price_currency || 'USD',
          perNight: period === 'day' ? amount : undefined,
          perMonth: period === 'month' || period === 'total' ? amount : undefined,
        },
        amenities: toAmenities(row.amenities || ''),
        houseRules: {},
        owner: {
          id: ownerId,
          name: ownerName,
          isRFPartner: parseBool(listingPresentation?.is_rf_verified),
          isPRO: Boolean(curator),
        },
        isRF: parseBool(listingPresentation?.is_rf_verified),
        rfVoucher: primaryVoucher
          ? {
              id: primaryVoucher.voucher_offer_id,
              title: primaryVoucher.offer_title,
              description: primaryVoucher.offer_description || primaryVoucher.offer_subtitle,
              conditions: primaryVoucher.redeem_window_text || 'См. условия в карточке предложения.',
              validFrom,
              validUntil,
            }
          : undefined,
        proVerification: parseBool(listingPresentation?.is_pro_verified)
          ? {
              verified: true,
              verifiedBy: curator?.user_id,
              notes: trustLabel,
            }
          : undefined,
        isNew: Date.parse(publishedAt) >= Date.now() - 45 * 24 * 60 * 60 * 1000,
        isInstant: parseBool(listingPresentation?.instant_use_possible),
        createdAt: publishedAt,
        updatedAt: publishedAt,
        status: toListingStatus(row.status),
        presentation: {
          source: 'seed',
          subtitle: listingPresentation?.subtitle,
          trustLabel,
          primaryCtaLabel: listingPresentation?.primary_cta_label || primaryVoucher?.cta_label || undefined,
          secondaryCtaLabel: listingPresentation?.secondary_cta_label || undefined,
          voucherEntryMode: listingPresentation?.voucher_entry_mode || undefined,
          partnerName: partner?.partner_public_name,
          curatorName: curator?.public_name,
          vouchersCount: vouchers.length,
          sparseMedia,
          scenarioName: scenario?.scenario_name,
          runtimeNote: scenario?.expected_runtime_note,
          showPublicCoordinates: showCoordinates,
        },
      };
    });

  const slugByListingId = new Map(listingsRows.map((row) => [row.listing_id, row.slug]));
  const byId = new Map<string, Listing>();
  const bySlug = new Map<string, Listing>();
  for (const listing of listings) {
    byId.set(listing.id, listing);
    const slug = slugByListingId.get(listing.id);
    if (slug) bySlug.set(slug, listing);
  }

  seedCache = { listings, byId, bySlug };
  return seedCache;
}

function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; total: number } {
  const offset = (page - 1) * pageSize;
  return {
    items: items.slice(offset, offset + pageSize),
    total: items.length,
  };
}

export function getSeedListingByIdOrSlug(idOrSlug: string): Listing | null {
  const cache = loadSeedCache();
  return cache.byId.get(idOrSlug) ?? cache.bySlug.get(idOrSlug) ?? null;
}

export function listSeedListings(params: SeedListParams = {}): SeedListResult {
  const cache = loadSeedCache();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));

  let items = [...cache.listings];

  if (params.cityId) items = items.filter((item) => item.address.city === params.cityId);
  if (params.listingType) {
    const rentalType: RentalType = params.listingType === 'rent_long' || params.listingType === 'sale' ? 'long-term' : 'short-term';
    items = items.filter((item) => item.rentalType === rentalType);
  }
  if (params.bedroomsMin != null) items = items.filter((item) => (item.bedrooms ?? 0) >= params.bedroomsMin!);
  if (params.bedroomsMax != null) items = items.filter((item) => (item.bedrooms ?? 99) <= params.bedroomsMax!);
  if (params.onlyRF) items = items.filter((item) => item.isRF);
  if (params.onlyPROVerified) items = items.filter((item) => Boolean(item.proVerification?.verified));
  if (params.sort === 'price_asc') {
    items.sort((a, b) => {
      const left = a.rentalType === 'long-term' ? a.pricing.perMonth ?? Number.MAX_SAFE_INTEGER : a.pricing.perNight ?? Number.MAX_SAFE_INTEGER;
      const right = b.rentalType === 'long-term' ? b.pricing.perMonth ?? Number.MAX_SAFE_INTEGER : b.pricing.perNight ?? Number.MAX_SAFE_INTEGER;
      return left - right;
    });
  } else if (params.sort === 'price_desc') {
    items.sort((a, b) => {
      const left = a.rentalType === 'long-term' ? a.pricing.perMonth ?? 0 : a.pricing.perNight ?? 0;
      const right = b.rentalType === 'long-term' ? b.pricing.perMonth ?? 0 : b.pricing.perNight ?? 0;
      return right - left;
    });
  } else {
    items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  const paged = paginate(items, page, pageSize);
  return {
    items: paged.items,
    pagination: {
      page,
      pageSize,
      total: paged.total,
    },
  };
}

export function listSeedNearbyListings(params: SeedNearbyParams): SeedNearbyResult {
  const base = listSeedListings(params).items;
  const withDistance = base
    .filter((item) => item.address.coordinates)
    .map((item) => {
      const distance = haversineMeters(params.lat, params.lng, item.address.coordinates!.lat, item.address.coordinates!.lng);
      return {
        ...item,
        distance,
        walkingTime: Math.round(distance / 80),
      } as ListingWithDistance;
    })
    .filter((item) => item.distance != null && item.distance <= params.radiusKm * 1000)
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));
  const paged = paginate(withDistance, page, pageSize);

  return {
    items: paged.items,
    pagination: {
      page,
      pageSize,
      total: paged.total,
    },
  };
}
