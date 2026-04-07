import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

type MediaRow = {
  listing_id: string;
  listing_slug: string;
  listing_status: 'draft' | 'published' | 'archived';
  country_id: string;
  city_id: string | null;
  media_id: string;
  sort_order: number;
  is_cover: boolean;
  media_file_id: string | null;
  media_file_key: string | null;
};

type ListingGap = {
  listingId: string;
  slug: string;
  status: string;
  cityId: string | null;
  reason: 'no_media_rows' | 'missing_01' | 'bad_r2_path_suspected' | 'partial_gallery_missing' | 'city_slug_missing';
  details?: string;
};

function getDatabaseUrl(): string {
  const direct = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (direct) return direct;

  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const envPath = path.resolve(repoRoot, '.env.local');
  if (!existsSync(envPath)) {
    throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL and .env.local not found');
  }
  const envRaw = readFileSync(envPath, 'utf8');
  const match = envRaw.match(/^STAGING_DATABASE_URL=(.+)$/m) || envRaw.match(/^DATABASE_URL=(.+)$/m);
  if (!match?.[1]) {
    throw new Error('STAGING_DATABASE_URL / DATABASE_URL not found in .env.local');
  }
  return match[1].trim();
}

function normalizeSlug(value: string | null): string | null {
  if (!value) return null;
  return value.trim().toLowerCase().replace(/_/g, '-');
}

function toPhotoName(sortOrder: number): string {
  return String(sortOrder + 1).padStart(2, '0');
}

async function headStatus(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status;
  } catch {
    return -1;
  }
}

async function main() {
  const dbUrl = getDatabaseUrl();
  const mediaBase = (process.env.MEDIA_PUBLIC_BASE_URL || 'https://media.go2asia.space').replace(/\/+$/, '');
  const bucket = process.env.RIELT_MEDIA_BUCKET || 'go2asia-media';
  const provider = 'r2';
  const mimeType = 'image/jpeg';

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const listingResult = await client.query<{
      id: string;
      slug: string;
      status: 'draft' | 'published' | 'archived';
      country_id: string;
      city_id: string | null;
    }>(
      `SELECT id, slug, status, country_id, city_id
       FROM rielt_listing
       WHERE deleted_at IS NULL
       ORDER BY slug ASC`
    );
    const rowsResult = await client.query<MediaRow>(
      `SELECT
         l.id AS listing_id,
         l.slug AS listing_slug,
         l.status AS listing_status,
         l.country_id,
         l.city_id,
         lm.media_id,
         lm.sort_order,
         lm.is_cover,
         mf.id AS media_file_id,
         mf.key AS media_file_key
       FROM rielt_listing l
       JOIN rielt_listing_media lm
         ON lm.listing_id = l.id
        AND lm.deleted_at IS NULL
       LEFT JOIN media_files mf
         ON mf.id = lm.media_id
       WHERE l.deleted_at IS NULL
       ORDER BY l.slug ASC, lm.sort_order ASC`
    );

    const byListing = new Map<string, MediaRow[]>();
    for (const row of rowsResult.rows) {
      const list = byListing.get(row.listing_id) ?? [];
      list.push(row);
      byListing.set(row.listing_id, list);
    }

    const alreadyBoundBefore = new Set<string>();
    for (const row of rowsResult.rows) {
      if (row.media_file_id && row.is_cover) {
        alreadyBoundBefore.add(row.listing_id);
      }
    }

    const upsertedMediaIds = new Set<string>();
    const alreadyBoundRows = new Set<string>();
    const missingCanonicalRows: Array<{ row: MediaRow; canonicalKey: string }> = [];
    const badPathRows: Array<{ row: MediaRow; foundAltKey: string }> = [];
    const citySlugMissingRows: MediaRow[] = [];

    await client.query('BEGIN');
    for (const row of rowsResult.rows) {
      const countrySlug = normalizeSlug(row.country_id);
      const citySlug = normalizeSlug(row.city_id);
      if (!countrySlug || !citySlug) {
        citySlugMissingRows.push(row);
        continue;
      }
      const photoName = toPhotoName(row.sort_order);
      const canonicalKey = `rielt/listings/${countrySlug}/${citySlug}/${row.listing_slug}/${photoName}.jpg`;
      const canonicalUrl = `${mediaBase}/${canonicalKey}`;
      const status = await headStatus(canonicalUrl);
      if (status === 200) {
        if (row.media_file_id) {
          alreadyBoundRows.add(row.media_id);
        } else {
          upsertedMediaIds.add(row.media_id);
        }
        await client.query(
          `INSERT INTO media_files (
             id, provider, bucket, key, public_url, mime_type, size, created_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, now())
           ON CONFLICT (id) DO UPDATE
             SET provider = EXCLUDED.provider,
                 bucket = EXCLUDED.bucket,
                 key = EXCLUDED.key,
                 public_url = EXCLUDED.public_url,
                 mime_type = EXCLUDED.mime_type`,
          [row.media_id, provider, bucket, canonicalKey, canonicalUrl, mimeType, 0]
        );
        continue;
      }

      missingCanonicalRows.push({ row, canonicalKey });
      const photoNameAlt = `${photoName}.jpg`;
      const slugUnderscore = row.listing_slug.replace(/-/g, '_');
      const cityRaw = row.city_id ?? '';
      const idUnderscore = row.listing_id;
      const idHyphen = row.listing_id.replace(/_/g, '-');
      const altCandidates = [
        `rielt/listings/${row.country_id}/${cityRaw}/${slugUnderscore}/${photoNameAlt}`,
        `rielt/listings/${row.country_id}/${cityRaw}/${idUnderscore}/${photoNameAlt}`,
        `rielt/listings/${row.country_id}/${cityRaw}/${idHyphen}/${photoNameAlt}`,
        `rielt/listings/${row.listing_slug}/${photoNameAlt}`,
      ];
      for (const altKey of altCandidates) {
        const altStatus = await headStatus(`${mediaBase}/${altKey}`);
        if (altStatus === 200) {
          badPathRows.push({ row, foundAltKey: altKey });
          break;
        }
      }
    }
    await client.query('COMMIT');

    const afterResult = await client.query<MediaRow>(
      `SELECT
         l.id AS listing_id,
         l.slug AS listing_slug,
         l.status AS listing_status,
         l.country_id,
         l.city_id,
         lm.media_id,
         lm.sort_order,
         lm.is_cover,
         mf.id AS media_file_id,
         mf.key AS media_file_key
       FROM rielt_listing l
       JOIN rielt_listing_media lm
         ON lm.listing_id = l.id
        AND lm.deleted_at IS NULL
       LEFT JOIN media_files mf
         ON mf.id = lm.media_id
       WHERE l.deleted_at IS NULL
       ORDER BY l.slug ASC, lm.sort_order ASC`
    );

    const boundAfterByListing = new Set<string>();
    const afterRowsByListing = new Map<string, MediaRow[]>();
    for (const row of afterResult.rows) {
      const list = afterRowsByListing.get(row.listing_id) ?? [];
      list.push(row);
      afterRowsByListing.set(row.listing_id, list);
      if (row.media_file_id && row.is_cover) {
        boundAfterByListing.add(row.listing_id);
      }
    }

    const listingMap = new Map(listingResult.rows.map((row) => [row.id, row]));
    const newlyBoundListings = [...boundAfterByListing].filter((id) => !alreadyBoundBefore.has(id));
    const missingGaps: ListingGap[] = [];
    for (const listing of listingResult.rows) {
      const rows = afterRowsByListing.get(listing.id) ?? [];
      if (rows.length === 0) {
        missingGaps.push({
          listingId: listing.id,
          slug: listing.slug,
          status: listing.status,
          cityId: listing.city_id,
          reason: 'no_media_rows',
        });
        continue;
      }

      const hasCoverBound = rows.some((row) => row.is_cover && Boolean(row.media_file_id));
      const hasAnyBound = rows.some((row) => Boolean(row.media_file_id));
      const hasMissingRows = rows.some((row) => !row.media_file_id);
      if (!hasCoverBound) {
        const badPathForListing = badPathRows.find((entry) => entry.row.listing_id === listing.id);
        const cityMissing = citySlugMissingRows.find((row) => row.listing_id === listing.id);
        const reason: ListingGap['reason'] = cityMissing
          ? 'city_slug_missing'
          : badPathForListing
            ? 'bad_r2_path_suspected'
            : 'missing_01';
        missingGaps.push({
          listingId: listing.id,
          slug: listing.slug,
          status: listing.status,
          cityId: listing.city_id,
          reason,
          details: badPathForListing?.foundAltKey,
        });
      } else if (hasAnyBound && hasMissingRows) {
        missingGaps.push({
          listingId: listing.id,
          slug: listing.slug,
          status: listing.status,
          cityId: listing.city_id,
          reason: 'partial_gallery_missing',
        });
      }
    }

    const missingByReason = missingGaps.reduce<Record<string, number>>((acc, gap) => {
      acc[gap.reason] = (acc[gap.reason] ?? 0) + 1;
      return acc;
    }, {});

    const summary = {
      mediaBase,
      bucket,
      totals: {
        listings: listingResult.rows.length,
        listingMediaRows: rowsResult.rows.length,
        alreadyBoundBefore: alreadyBoundBefore.size,
        boundAfter: boundAfterByListing.size,
        newlyBound: newlyBoundListings.length,
        stillMissingMedia: missingGaps.filter((gap) => gap.reason !== 'partial_gallery_missing').length,
      },
      rowOps: {
        newlyUpsertedMediaIds: upsertedMediaIds.size,
        alreadyBoundRowsTouched: alreadyBoundRows.size,
        missingCanonicalRows: missingCanonicalRows.length,
        badPathRowsDetected: badPathRows.length,
      },
      missingByReason,
      samples: {
        newlyBoundListings: newlyBoundListings.slice(0, 20).map((id) => listingMap.get(id)),
        badPathExamples: badPathRows.slice(0, 20).map((entry) => ({
          listingId: entry.row.listing_id,
          slug: entry.row.listing_slug,
          sortOrder: entry.row.sort_order,
          foundAltKey: entry.foundAltKey,
        })),
        remainingGaps: missingGaps.slice(0, 40),
      },
    };

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[sync-rielt-media-r2] FATAL', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
