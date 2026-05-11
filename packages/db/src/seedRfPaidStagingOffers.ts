import { Client } from 'pg';

type Mode = 'dry-run' | 'apply' | 'verify';

type Args = {
  mode: Mode;
};

type SeedOffer = {
  id: string;
  title: string;
  pointsCost: number;
  offerType: 'discount' | 'access';
};

type ResolvedPartner = {
  id: string;
  displayName: string;
  ownerUserId: string;
  source: 'existing' | 'created_or_updated';
};

type SeedSummary = {
  partner: ResolvedPartner;
  itemId: string;
  offers: Array<{
    id: string;
    title: string;
    pointsCost: number;
    status: string;
    visibility: string;
    repeatPolicy: string;
  }>;
};

const EXISTING_PARTNER_NAME = 'Connect Voucher Demo Partner';
const FALLBACK_PARTNER_ID = 'rf_partner_staging_paid_voucher_demo';
const FALLBACK_PARTNER_NAME = 'Staging Paid Voucher Demo Partner';
const FALLBACK_PARTNER_SLUG = 'staging-paid-voucher-demo-partner';
const DEFAULT_COUNTRY_ID = 'country_th';
const DEFAULT_CITY_ID = 'city_phuket';
const DEFAULT_OWNER_USER_ID = 'staging_rf_seed_operator';
const ITEM_ID = 'rf_partner_item_staging_paid_voucher_demo';
const ITEM_TITLE = 'Staging Paid Voucher Demo Item';
const DB_URL_PRODUCTION_HINTS = ['prod', 'production'];

const SEED_OFFERS: SeedOffer[] = [
  {
    id: 'rf_offer_staging_paid_100_points',
    title: '100 Points staging service perk',
    pointsCost: 100,
    offerType: 'access',
  },
  {
    id: 'rf_offer_staging_paid_250_points',
    title: '250 Points staging premium discount',
    pointsCost: 250,
    offerType: 'discount',
  },
  {
    id: 'rf_offer_staging_paid_500_points',
    title: '500 Points staging partner access',
    pointsCost: 500,
    offerType: 'access',
  },
];

function parseArgs(argv: string[]): Args {
  if (argv.includes('--apply')) return { mode: 'apply' };
  if (argv.includes('--verify-only')) return { mode: 'verify' };
  return { mode: 'dry-run' };
}

function getEnvironment(): string {
  return (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev').trim().toLowerCase();
}

function assertStagingOnly(mode: Mode): void {
  if (mode === 'dry-run') return;

  const env = getEnvironment();
  if (env !== 'staging') {
    throw new Error('Refusing RF paid offer seed: ENVIRONMENT must be exactly staging');
  }
  if (process.env.NODE_ENV?.trim().toLowerCase() === 'production') {
    throw new Error('Refusing RF paid offer seed: NODE_ENV=production');
  }
  const confirm = (process.env.RF_PAID_STAGING_SEED_CONFIRM ?? '').trim().toLowerCase();
  if (confirm !== 'staging') {
    throw new Error('Set RF_PAID_STAGING_SEED_CONFIRM=staging before running --apply or --verify-only');
  }
}

function getDatabaseUrl(mode: Mode): string | null {
  if (mode === 'dry-run') return null;
  const url = process.env.STAGING_DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL');
  const lowerUrl = url.toLowerCase();
  if (DB_URL_PRODUCTION_HINTS.some((hint) => lowerUrl.includes(hint))) {
    throw new Error('Refusing RF paid offer seed: database URL looks production-like');
  }
  return url;
}

function printDatabaseTarget(url: string): void {
  try {
    const parsed = new URL(url);
    console.log(`[rf-paid-staging-seed] db_host=${parsed.hostname}`);
    console.log(`[rf-paid-staging-seed] db_name=${parsed.pathname.replace(/^\//, '') || '(unknown)'}`);
  } catch {
    console.log('[rf-paid-staging-seed] db_target=(invalid URL format; value not printed)');
  }
}

async function resolvePartner(client: Client): Promise<ResolvedPartner> {
  const existing = await client.query<{
    id: string;
    display_name: string;
    owner_user_id: string;
  }>(
    `
      SELECT id, display_name, owner_user_id
      FROM rf_partner
      WHERE display_name = $1
        AND status = 'active'
      ORDER BY updated_at DESC
      LIMIT 1
    `,
    [EXISTING_PARTNER_NAME]
  );
  const existingPartner = existing.rows[0];
  if (existingPartner) {
    return {
      id: existingPartner.id,
      displayName: existingPartner.display_name,
      ownerUserId: existingPartner.owner_user_id,
      source: 'existing',
    };
  }

  const ownerUserId = process.env.RF_PAID_STAGING_SEED_OWNER_USER_ID?.trim() || DEFAULT_OWNER_USER_ID;
  const inserted = await client.query<{
    id: string;
    display_name: string;
    owner_user_id: string;
  }>(
    `
      INSERT INTO rf_partner (
        id,
        slug,
        display_name,
        country_id,
        city_id,
        atlas_place_id,
        host_atlas_place_id,
        status,
        owner_user_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NULL, NULL, 'active', $6, now(), now())
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        display_name = EXCLUDED.display_name,
        country_id = EXCLUDED.country_id,
        city_id = EXCLUDED.city_id,
        status = 'active',
        owner_user_id = EXCLUDED.owner_user_id,
        updated_at = now()
      RETURNING id, display_name, owner_user_id
    `,
    [FALLBACK_PARTNER_ID, FALLBACK_PARTNER_SLUG, FALLBACK_PARTNER_NAME, DEFAULT_COUNTRY_ID, DEFAULT_CITY_ID, ownerUserId]
  );
  const partner = inserted.rows[0];
  if (!partner) throw new Error('Failed to upsert fallback RF paid staging partner');
  return {
    id: partner.id,
    displayName: partner.display_name,
    ownerUserId: partner.owner_user_id,
    source: 'created_or_updated',
  };
}

async function upsertItem(client: Client, partnerId: string): Promise<string> {
  await client.query(
    `
      INSERT INTO rf_partner_item (
        id,
        partner_id,
        title,
        description,
        category,
        price_from,
        currency,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, 'staging_fixture', NULL, NULL, 'active', now(), now())
      ON CONFLICT (id) DO UPDATE SET
        partner_id = EXCLUDED.partner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        status = 'active',
        updated_at = now()
    `,
    [ITEM_ID, partnerId, ITEM_TITLE, 'Staging-only RF paid voucher validation item.']
  );
  return ITEM_ID;
}

async function upsertOffers(client: Client, partner: ResolvedPartner, itemId: string): Promise<SeedSummary['offers']> {
  const offers: SeedSummary['offers'] = [];
  for (const offer of SEED_OFFERS) {
    const result = await client.query<{
      id: string;
      title: string;
      points_cost: number;
      status: string;
      visibility: string;
      repeat_policy: string;
    }>(
      `
        INSERT INTO rf_offer (
          id,
          partner_id,
          item_id,
          title,
          offer_type,
          visibility,
          status,
          repeat_policy,
          points_cost,
          created_by_user_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, 'public', 'active', 'repeat_after_redeem', $6, $7, now(), now())
        ON CONFLICT (id) DO UPDATE SET
          partner_id = EXCLUDED.partner_id,
          item_id = EXCLUDED.item_id,
          title = EXCLUDED.title,
          offer_type = EXCLUDED.offer_type,
          visibility = 'public',
          status = 'active',
          repeat_policy = 'repeat_after_redeem',
          points_cost = EXCLUDED.points_cost,
          created_by_user_id = EXCLUDED.created_by_user_id,
          updated_at = now()
        RETURNING id, title, points_cost, status, visibility, repeat_policy
      `,
      [offer.id, partner.id, itemId, offer.title, offer.offerType, offer.pointsCost, partner.ownerUserId]
    );
    const row = result.rows[0];
    if (!row) throw new Error(`Failed to upsert RF paid staging offer ${offer.id}`);
    offers.push({
      id: row.id,
      title: row.title,
      pointsCost: Number(row.points_cost),
      status: row.status,
      visibility: row.visibility,
      repeatPolicy: row.repeat_policy,
    });
  }
  return offers;
}

async function verifySeed(client: Client): Promise<SeedSummary> {
  const result = await client.query<{
    offer_id: string;
    title: string;
    points_cost: number;
    status: string;
    visibility: string;
    repeat_policy: string;
    partner_id: string;
    partner_name: string;
    partner_owner_user_id: string;
    partner_status: string;
    item_id: string | null;
    item_status: string | null;
  }>(
    `
      SELECT
        o.id AS offer_id,
        o.title,
        o.points_cost,
        o.status,
        o.visibility,
        o.repeat_policy,
        p.id AS partner_id,
        p.display_name AS partner_name,
        p.owner_user_id AS partner_owner_user_id,
        p.status AS partner_status,
        i.id AS item_id,
        i.status AS item_status
      FROM rf_offer o
      JOIN rf_partner p ON p.id = o.partner_id
      LEFT JOIN rf_partner_item i ON i.id = o.item_id
      WHERE o.id = ANY($1::varchar[])
      ORDER BY o.points_cost ASC
    `,
    [SEED_OFFERS.map((offer) => offer.id)]
  );
  if (result.rows.length !== SEED_OFFERS.length) {
    throw new Error(`Expected ${SEED_OFFERS.length} RF paid staging offers, found ${result.rows.length}`);
  }
  for (const row of result.rows) {
    if (row.partner_status !== 'active') throw new Error(`Partner is not active for offer ${row.offer_id}`);
    if (row.status !== 'active') throw new Error(`Offer is not active: ${row.offer_id}`);
    if (row.visibility !== 'public') throw new Error(`Offer is not public: ${row.offer_id}`);
    if (Number(row.points_cost) <= 0) throw new Error(`Offer is not paid: ${row.offer_id}`);
    if (row.item_id !== ITEM_ID || row.item_status !== 'active') throw new Error(`Offer item is not active: ${row.offer_id}`);
  }
  const first = result.rows[0]!;
  return {
    partner: {
      id: first.partner_id,
      displayName: first.partner_name,
      ownerUserId: first.partner_owner_user_id,
      source: first.partner_id === FALLBACK_PARTNER_ID ? 'created_or_updated' : 'existing',
    },
    itemId: ITEM_ID,
    offers: result.rows.map((row) => ({
      id: row.offer_id,
      title: row.title,
      pointsCost: Number(row.points_cost),
      status: row.status,
      visibility: row.visibility,
      repeatPolicy: row.repeat_policy,
    })),
  };
}

function printPlan(): void {
  console.log('[rf-paid-staging-seed] mode=dry-run');
  console.log('[rf-paid-staging-seed] no DB writes will be performed');
  console.log('[rf-paid-staging-seed] required for apply/verify: ENVIRONMENT=staging RF_PAID_STAGING_SEED_CONFIRM=staging STAGING_DATABASE_URL');
  console.log(`[rf-paid-staging-seed] preferred_partner="${EXISTING_PARTNER_NAME}"`);
  console.log(`[rf-paid-staging-seed] fallback_partner="${FALLBACK_PARTNER_NAME}"`);
  for (const offer of SEED_OFFERS) {
    console.log(`[rf-paid-staging-seed] planned_offer id=${offer.id} points_cost=${offer.pointsCost} title="${offer.title}"`);
  }
}

function printSummary(summary: SeedSummary, mode: Exclude<Mode, 'dry-run'>): void {
  console.log(`[rf-paid-staging-seed] mode=${mode}`);
  console.log(`[rf-paid-staging-seed] partner_id=${summary.partner.id}`);
  console.log(`[rf-paid-staging-seed] partner_name="${summary.partner.displayName}"`);
  console.log(`[rf-paid-staging-seed] partner_source=${summary.partner.source}`);
  console.log(`[rf-paid-staging-seed] item_id=${summary.itemId}`);
  for (const offer of summary.offers) {
    console.log(
      `[rf-paid-staging-seed] offer_id=${offer.id} points_cost=${offer.pointsCost} status=${offer.status} visibility=${offer.visibility} repeat_policy=${offer.repeatPolicy}`
    );
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  assertStagingOnly(args.mode);
  const databaseUrl = getDatabaseUrl(args.mode);

  if (args.mode === 'dry-run') {
    printPlan();
    return;
  }

  if (!databaseUrl) throw new Error('Missing STAGING_DATABASE_URL');

  printDatabaseTarget(databaseUrl);
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    if (args.mode === 'verify') {
      printSummary(await verifySeed(client), 'verify');
      return;
    }

    await client.query('BEGIN');
    try {
      const partner = await resolvePartner(client);
      const itemId = await upsertItem(client, partner.id);
      const offers = await upsertOffers(client, partner, itemId);
      await client.query('COMMIT');
      printSummary({ partner, itemId, offers }, 'apply');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[rf-paid-staging-seed] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

