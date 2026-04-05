import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

type CsvRow = Record<string, string>;

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  listingType: 'rent_long' | 'rent_short' | 'sale';
  status: 'draft' | 'published' | 'archived';
  priceAmount: string;
  priceCurrency: string;
  pricePeriod: 'month' | 'day' | 'total';
  countryId: string;
  cityId: string | null;
  areaText: string | null;
  lat: string | null;
  lng: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: string | null;
  amenities: string[];
  createdByUserId: string;
  publishedAt: string | null;
  archivedAt: string | null;
  deletedAt: string | null;
};

type ListingMediaRow = {
  id: string;
  listingId: string;
  mediaId: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
  deletedAt: string | null;
};

type ListingActorLinkRow = {
  id: string;
  listingId: string;
  actorUserId: string;
  actorRole: 'owner' | 'agent';
  createdAt: string;
  revokedAt: string | null;
  deletedAt: string | null;
};

type ListingInquiryRow = {
  id: string;
  listingId: string;
  requesterUserId: string;
  message: string;
  contactName: string | null;
  contactPhone: string | null;
  contactTelegram: string | null;
  status: 'new' | 'viewed' | 'closed';
  idempotencyKey: string;
  createdAt: string;
  closedAt: string | null;
  deletedAt: string | null;
};

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
    const out: CsvRow = {};
    for (let i = 0; i < header.length; i += 1) {
      out[header[i]] = (cells[i] ?? '').trim();
    }
    return out;
  });
}

function toOptional(value: string | undefined): string | null {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : null;
}

function toOptionalInt(value: string | undefined): number | null {
  const raw = toOptional(value);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) throw new Error(`Expected integer, got "${value}"`);
  return parsed;
}

function toBool(value: string | undefined): boolean {
  return (value ?? '').trim().toLowerCase() === 'true';
}

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
  if (!match?.[1]) throw new Error('STAGING_DATABASE_URL / DATABASE_URL not found in .env.local');
  return match[1].trim();
}

function getCoreDir(): string {
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  return path.resolve(repoRoot, 'content', 'rielt', 'core');
}

function loadListings(coreDir: string): ListingRow[] {
  const rows = parseCsv(readFileSync(path.resolve(coreDir, 'rielt_listings_core.csv'), 'utf8'));
  return rows.map((row) => {
    const listingType = row.listing_type as ListingRow['listingType'];
    const status = row.status as ListingRow['status'];
    const pricePeriod = row.price_period as ListingRow['pricePeriod'];
    if (!['rent_long', 'rent_short', 'sale'].includes(listingType)) {
      throw new Error(`Unsupported listing_type: ${row.listing_type}`);
    }
    if (!['draft', 'published', 'archived'].includes(status)) {
      throw new Error(`Unsupported status: ${row.status}`);
    }
    if (!['month', 'day', 'total'].includes(pricePeriod)) {
      throw new Error(`Unsupported price_period: ${row.price_period}`);
    }
    return {
      id: row.listing_id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      listingType,
      status,
      priceAmount: row.price_amount,
      priceCurrency: row.price_currency,
      pricePeriod,
      countryId: row.country_id,
      cityId: toOptional(row.city_id),
      areaText: toOptional(row.area_text),
      lat: toOptional(row.lat),
      lng: toOptional(row.lng),
      bedrooms: toOptionalInt(row.bedrooms),
      bathrooms: toOptionalInt(row.bathrooms),
      areaSqm: toOptional(row.area_sqm),
      amenities: (row.amenities ?? '')
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean),
      createdByUserId: row.created_by_user_id,
      publishedAt: toOptional(row.published_at),
      archivedAt: toOptional(row.archived_at),
      deletedAt: toOptional(row.deleted_at),
    };
  });
}

function loadListingMedia(coreDir: string): ListingMediaRow[] {
  const rows = parseCsv(readFileSync(path.resolve(coreDir, 'rielt_listing_media_core.csv'), 'utf8'));
  return rows.map((row) => ({
    id: row.listing_media_id,
    listingId: row.listing_id,
    mediaId: row.media_id,
    sortOrder: Number.parseInt(row.sort_order, 10),
    isCover: toBool(row.is_cover),
    createdAt: row.created_at,
    deletedAt: toOptional(row.deleted_at),
  }));
}

function loadActorLinks(coreDir: string): ListingActorLinkRow[] {
  const rows = parseCsv(readFileSync(path.resolve(coreDir, 'rielt_listing_actor_links_core.csv'), 'utf8'));
  return rows.map((row) => {
    const role = row.actor_role as ListingActorLinkRow['actorRole'];
    if (!['owner', 'agent'].includes(role)) throw new Error(`Unsupported actor_role: ${row.actor_role}`);
    return {
      id: row.actor_link_id,
      listingId: row.listing_id,
      actorUserId: row.actor_user_id,
      actorRole: role,
      createdAt: row.created_at,
      revokedAt: toOptional(row.revoked_at),
      deletedAt: toOptional(row.deleted_at),
    };
  });
}

function loadInquiries(coreDir: string): ListingInquiryRow[] {
  const rows = parseCsv(readFileSync(path.resolve(coreDir, 'rielt_listing_inquiries_core.csv'), 'utf8'));
  return rows.map((row) => {
    const status = row.status as ListingInquiryRow['status'];
    if (!['new', 'viewed', 'closed'].includes(status)) throw new Error(`Unsupported inquiry status: ${row.status}`);
    return {
      id: row.inquiry_id,
      listingId: row.listing_id,
      requesterUserId: row.requester_user_id,
      message: row.message,
      contactName: toOptional(row.contact_name),
      contactPhone: toOptional(row.contact_phone),
      contactTelegram: toOptional(row.contact_telegram),
      status,
      idempotencyKey: row.idempotency_key,
      createdAt: row.created_at,
      closedAt: toOptional(row.closed_at),
      deletedAt: toOptional(row.deleted_at),
    };
  });
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

async function main() {
  const url = getDatabaseUrl();
  const coreDir = getCoreDir();

  const listings = loadListings(coreDir);
  const listingMedia = loadListingMedia(coreDir);
  const actorLinks = loadActorLinks(coreDir);
  const inquiries = loadInquiries(coreDir);

  const listingIds = unique(listings.map((row) => row.id));
  if (listingIds.length === 0) throw new Error('No listings loaded from CSV');

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM rielt_listing_inquiry WHERE listing_id = ANY($1::text[])', [listingIds]);
    await client.query('DELETE FROM rielt_listing_actor_link WHERE listing_id = ANY($1::text[])', [listingIds]);
    await client.query('DELETE FROM rielt_listing_media WHERE listing_id = ANY($1::text[])', [listingIds]);
    await client.query('DELETE FROM rielt_listing WHERE id = ANY($1::text[])', [listingIds]);

    for (const row of listings) {
      await client.query(
        `INSERT INTO rielt_listing (
          id, slug, title, description, listing_type, status,
          price_amount, price_currency, price_period,
          country_id, city_id, area_text, lat, lng,
          bedrooms, bathrooms, area_sqm, amenities,
          created_by_user_id, published_at, archived_at, deleted_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20, $21, $22
        )`,
        [
          row.id,
          row.slug,
          row.title,
          row.description,
          row.listingType,
          row.status,
          row.priceAmount,
          row.priceCurrency,
          row.pricePeriod,
          row.countryId,
          row.cityId,
          row.areaText,
          row.lat,
          row.lng,
          row.bedrooms,
          row.bathrooms,
          row.areaSqm,
          row.amenities,
          row.createdByUserId,
          row.publishedAt,
          row.archivedAt,
          row.deletedAt,
        ]
      );
    }

    for (const row of listingMedia) {
      await client.query(
        `INSERT INTO rielt_listing_media (
          id, listing_id, media_id, sort_order, is_cover, created_at, deleted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.id, row.listingId, row.mediaId, row.sortOrder, row.isCover, row.createdAt, row.deletedAt]
      );
    }

    for (const row of actorLinks) {
      await client.query(
        `INSERT INTO rielt_listing_actor_link (
          id, listing_id, actor_user_id, actor_role, created_at, revoked_at, deleted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.id, row.listingId, row.actorUserId, row.actorRole, row.createdAt, row.revokedAt, row.deletedAt]
      );
    }

    for (const row of inquiries) {
      await client.query(
        `INSERT INTO rielt_listing_inquiry (
          id, listing_id, requester_user_id, message, contact_name, contact_phone, contact_telegram,
          status, idempotency_key, created_at, closed_at, deleted_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12
        )`,
        [
          row.id,
          row.listingId,
          row.requesterUserId,
          row.message,
          row.contactName,
          row.contactPhone,
          row.contactTelegram,
          row.status,
          row.idempotencyKey,
          row.createdAt,
          row.closedAt,
          row.deletedAt,
        ]
      );
    }

    await client.query('COMMIT');

    const listingCount = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM rielt_listing WHERE id = ANY($1::text[])',
      [listingIds]
    );
    const mediaCount = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM rielt_listing_media WHERE listing_id = ANY($1::text[])',
      [listingIds]
    );
    const actorCount = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM rielt_listing_actor_link WHERE listing_id = ANY($1::text[])',
      [listingIds]
    );
    const inquiryCount = await client.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM rielt_listing_inquiry WHERE listing_id = ANY($1::text[])',
      [listingIds]
    );

    const statusBreakdown = await client.query<{ status: string; count: string }>(
      `SELECT status::text AS status, COUNT(*)::text AS count
       FROM rielt_listing
       WHERE id = ANY($1::text[])
       GROUP BY status
       ORDER BY status`,
      [listingIds]
    );

    const listingTypeBreakdown = await client.query<{ listing_type: string; count: string }>(
      `SELECT listing_type::text AS listing_type, COUNT(*)::text AS count
       FROM rielt_listing
       WHERE id = ANY($1::text[])
       GROUP BY listing_type
       ORDER BY listing_type`,
      [listingIds]
    );

    const pricePeriodBreakdown = await client.query<{ price_period: string; count: string }>(
      `SELECT price_period::text AS price_period, COUNT(*)::text AS count
       FROM rielt_listing
       WHERE id = ANY($1::text[])
       GROUP BY price_period
       ORDER BY price_period`,
      [listingIds]
    );

    const ownerCoverage = await client.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM (
         SELECT listing_id
         FROM rielt_listing_actor_link
         WHERE listing_id = ANY($1::text[])
           AND actor_role = 'owner'
           AND revoked_at IS NULL
           AND deleted_at IS NULL
         GROUP BY listing_id
       ) t`,
      [listingIds]
    );

    const duplicateInquiryKeys = await client.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM (
         SELECT requester_user_id, listing_id, idempotency_key
         FROM rielt_listing_inquiry
         WHERE listing_id = ANY($1::text[])
         GROUP BY requester_user_id, listing_id, idempotency_key
         HAVING COUNT(*) > 1
       ) t`,
      [listingIds]
    );

    const summary = {
      importedFrom: coreDir,
      expected: {
        listings: listings.length,
        listingMedia: listingMedia.length,
        actorLinks: actorLinks.length,
        inquiries: inquiries.length,
      },
      actual: {
        listings: Number(listingCount.rows[0]?.count ?? '0'),
        listingMedia: Number(mediaCount.rows[0]?.count ?? '0'),
        actorLinks: Number(actorCount.rows[0]?.count ?? '0'),
        inquiries: Number(inquiryCount.rows[0]?.count ?? '0'),
      },
      statusBreakdown: statusBreakdown.rows.map((row) => ({ status: row.status, count: Number(row.count) })),
      listingTypeBreakdown: listingTypeBreakdown.rows.map((row) => ({
        listingType: row.listing_type,
        count: Number(row.count),
      })),
      pricePeriodBreakdown: pricePeriodBreakdown.rows.map((row) => ({
        pricePeriod: row.price_period,
        count: Number(row.count),
      })),
      checks: {
        activeOwnerCoverage: Number(ownerCoverage.rows[0]?.count ?? '0'),
        duplicateInquiryIdempotencyGroups: Number(duplicateInquiryKeys.rows[0]?.count ?? '0'),
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
  console.error('[import-rielt-core-csv] FATAL', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
