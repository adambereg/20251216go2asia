import { Client } from 'pg';
import { CONNECT_DEMO_AWARDED_BADGE_CODES, CONNECT_DEMO_BADGES } from './connectDemoData';

type Args = {
  userId: string | null;
  userEmail: string | null;
};

type Check = {
  name: string;
  value: number;
  expected: string;
  ok: boolean;
};

const DB_URL_PRODUCTION_HINTS = ['prod', 'production'];

function parseArgs(argv: string[]): Args {
  const args: Args = { userId: null, userEmail: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;
    const next = argv[index + 1]?.trim() ?? '';

    if (arg === '--user-id') {
      args.userId = next || null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-id=')) {
      args.userId = arg.slice('--user-id='.length).trim() || null;
      continue;
    }
    if (arg === '--user-email') {
      args.userEmail = next.toLowerCase() || null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-email=')) {
      args.userEmail = arg.slice('--user-email='.length).trim().toLowerCase() || null;
    }
  }

  return args;
}

function getDatabaseUrl(): string {
  const env = (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev').toLowerCase();
  if (env === 'production' || process.env.NODE_ENV?.toLowerCase() === 'production') {
    throw new Error('Refusing to verify Connect demo data in production environment');
  }

  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');

  const lowerUrl = url.toLowerCase();
  if (DB_URL_PRODUCTION_HINTS.some((hint) => lowerUrl.includes(hint))) {
    throw new Error('Refusing to verify Connect demo data: database URL looks production-like');
  }

  return url;
}

function requireExplicitTarget(args: Args): void {
  if (!args.userId && !args.userEmail) {
    throw new Error('Connect demo verification requires --user-id or --user-email');
  }
}

async function resolveUserId(client: Client, args: Args): Promise<string> {
  if (args.userId) {
    const result = await client.query<{ id: string }>(
      `
        SELECT id
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [args.userId]
    );
    const id = result.rows[0]?.id;
    if (!id) throw new Error(`Target user not found by id: ${args.userId}`);
    return id;
  }

  const result = await client.query<{ id: string }>(
    `
      SELECT id
      FROM users
      WHERE lower(email) = $1
      LIMIT 1
    `,
    [args.userEmail]
  );
  const id = result.rows[0]?.id;
  if (!id) throw new Error(`Target user not found by email: ${args.userEmail}`);
  return id;
}

async function countOne(client: Client, sql: string, values: unknown[]): Promise<number> {
  const result = await client.query<{ count: number }>(sql, values);
  return Number(result.rows[0]?.count ?? 0);
}

async function readBalance(client: Client, userId: string): Promise<number> {
  const result = await client.query<{ balance: number }>(
    `
      SELECT balance
      FROM user_balances
      WHERE user_id = $1
      LIMIT 1
    `,
    [userId]
  );
  return Number(result.rows[0]?.balance ?? 0);
}

async function runChecks(client: Client, userId: string): Promise<Check[]> {
  const demoBadgeCodes = CONNECT_DEMO_BADGES.map((badge) => badge.code);
  const awardedBadgeCodes = [...CONNECT_DEMO_AWARDED_BADGE_CODES];

  const [
    balance,
    transactionCount,
    badgeCatalogCount,
    userBadgeCount,
    referralCodeCount,
    referralCount,
    referralEarningsCount,
    rewardedReferralCount,
    rewardMissingCount,
    pendingReferralCount,
  ] = await Promise.all([
    readBalance(client, userId),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM points_transactions
        WHERE user_id = $1
          AND external_id LIKE $2
      `,
      [userId, `connect-demo:${userId}:%`]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM badges
        WHERE code = ANY($1::text[])
          AND is_active = true
      `,
      [demoBadgeCodes]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM user_badges
        WHERE user_id = $1
          AND badge_id = ANY($2::text[])
      `,
      [userId, awardedBadgeCodes]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_links
        WHERE user_id = $1
      `,
      [userId]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_relations
        WHERE referrer_id = $1
      `,
      [userId]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_relations rr
        LEFT JOIN points_transactions pt
          ON pt.user_id = rr.referrer_id
          AND pt.reason = 'referral_bonus_referrer'
          AND pt.external_id = ('referral:first_login:' || rr.referrer_id || ':' || rr.referee_id)
        WHERE rr.referrer_id = $1
          AND (
            rr.first_login_at IS NULL
            OR pt.id IS NOT NULL
            OR (rr.first_login_at IS NOT NULL AND pt.id IS NULL)
          )
      `,
      [userId]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_relations rr
        JOIN points_transactions pt
          ON pt.user_id = rr.referrer_id
          AND pt.reason = 'referral_bonus_referrer'
          AND pt.external_id = ('referral:first_login:' || rr.referrer_id || ':' || rr.referee_id)
        WHERE rr.referrer_id = $1
      `,
      [userId]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_relations rr
        LEFT JOIN points_transactions pt
          ON pt.user_id = rr.referrer_id
          AND pt.reason = 'referral_bonus_referrer'
          AND pt.external_id = ('referral:first_login:' || rr.referrer_id || ':' || rr.referee_id)
        WHERE rr.referrer_id = $1
          AND rr.first_login_at IS NOT NULL
          AND pt.id IS NULL
      `,
      [userId]
    ),
    countOne(
      client,
      `
        SELECT COUNT(*)::int AS count
        FROM referral_relations
        WHERE referrer_id = $1
          AND first_login_at IS NULL
      `,
      [userId]
    ),
  ]);

  return [
    { name: 'balance', value: balance, expected: '> 0', ok: balance > 0 },
    { name: 'seed_transactions', value: transactionCount, expected: '>= 8', ok: transactionCount >= 8 },
    { name: 'badge_catalog', value: badgeCatalogCount, expected: '>= 8', ok: badgeCatalogCount >= 8 },
    { name: 'user_badges', value: userBadgeCount, expected: '>= 3', ok: userBadgeCount >= 3 },
    { name: 'referral_code', value: referralCodeCount, expected: '>= 1', ok: referralCodeCount >= 1 },
    { name: 'referrals', value: referralCount, expected: '>= 3', ok: referralCount >= 3 },
    { name: 'referral_earnings_items', value: referralEarningsCount, expected: '>= 3', ok: referralEarningsCount >= 3 },
    { name: 'rewarded_referrals', value: rewardedReferralCount, expected: '>= 1', ok: rewardedReferralCount >= 1 },
    { name: 'reward_missing_referrals', value: rewardMissingCount, expected: '>= 1', ok: rewardMissingCount >= 1 },
    { name: 'pending_referrals', value: pendingReferralCount, expected: '>= 1', ok: pendingReferralCount >= 1 },
  ];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireExplicitTarget(args);

  const client = new Client({ connectionString: getDatabaseUrl(), ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    const userId = await resolveUserId(client, args);
    const checks = await runChecks(client, userId);
    console.log(`[connect-demo-verify] target_user_id=${userId}`);

    for (const check of checks) {
      console.log(
        `[connect-demo-verify] ${check.ok ? 'ok' : 'fail'} ${check.name}=${check.value} expected=${check.expected}`
      );
    }

    const failed = checks.filter((check) => !check.ok);
    if (failed.length > 0) {
      throw new Error(`Connect demo verification failed: ${failed.map((check) => check.name).join(', ')}`);
    }

    console.log('[connect-demo-verify] db_level_verification=passed');
    console.log('[connect-demo-verify] api_verification=skipped requires authenticated gateway token for target user');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[connect-demo-verify] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

