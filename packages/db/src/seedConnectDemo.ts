import { Client } from 'pg';
import {
  CONNECT_DEMO_AWARDED_BADGE_CODES,
  CONNECT_DEMO_BADGES,
  CONNECT_DEMO_BASE_TRANSACTIONS,
  type ConnectDemoTransaction,
} from './connectDemoData';

type Mode = 'dry-run' | 'apply';

type Args = {
  mode: Mode;
  userId: string | null;
  userEmail: string | null;
  referralCode: string | null;
  refereeUserIds: string[];
  refereeUserEmails: string[];
};

type ResolvedUser = {
  id: string;
  email: string | null;
};

type ReferralSeed = {
  userId: string;
  status: 'pending' | 'reward_missing' | 'rewarded';
  registeredAt: string;
  firstLoginAt: string | null;
  rewardPoints: number;
};

const REQUIRED_REFEREE_COUNT = 4;
const DB_URL_PRODUCTION_HINTS = ['prod', 'production'];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    mode: argv.includes('--apply') ? 'apply' : 'dry-run',
    userId: null,
    userEmail: null,
    referralCode: null,
    refereeUserIds: [],
    refereeUserEmails: [],
  };

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
      continue;
    }
    if (arg === '--referral-code') {
      args.referralCode = next || null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--referral-code=')) {
      args.referralCode = arg.slice('--referral-code='.length).trim() || null;
      continue;
    }
    if (arg === '--referee-user-id') {
      if (next) args.refereeUserIds.push(next);
      index += 1;
      continue;
    }
    if (arg.startsWith('--referee-user-id=')) {
      const value = arg.slice('--referee-user-id='.length).trim();
      if (value) args.refereeUserIds.push(value);
      continue;
    }
    if (arg === '--referee-user-email') {
      if (next) args.refereeUserEmails.push(next.toLowerCase());
      index += 1;
      continue;
    }
    if (arg.startsWith('--referee-user-email=')) {
      const value = arg.slice('--referee-user-email='.length).trim().toLowerCase();
      if (value) args.refereeUserEmails.push(value);
    }
  }

  const envRefereeIds = parseCsvEnv(process.env.CONNECT_DEMO_REFEREE_USER_IDS);
  const envRefereeEmails = parseCsvEnv(process.env.CONNECT_DEMO_REFEREE_USER_EMAILS).map((email) =>
    email.toLowerCase()
  );
  args.refereeUserIds.push(...envRefereeIds);
  args.refereeUserEmails.push(...envRefereeEmails);

  return args;
}

function parseCsvEnv(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEnvironment(): string {
  return (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev').toLowerCase();
}

function getDatabaseUrl(mode: Mode): string | null {
  if (mode === 'dry-run') return null;

  const env = getEnvironment();
  if (env === 'production' || process.env.NODE_ENV?.toLowerCase() === 'production') {
    throw new Error('Refusing to seed Connect demo data in production environment');
  }

  const confirm = (process.env.CONNECT_DEMO_SEED_CONFIRM ?? '').toLowerCase();
  if (!['dev', 'local', 'staging'].includes(confirm)) {
    throw new Error('Set CONNECT_DEMO_SEED_CONFIRM=dev|local|staging before running with --apply');
  }

  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');

  const lowerUrl = url.toLowerCase();
  if (DB_URL_PRODUCTION_HINTS.some((hint) => lowerUrl.includes(hint))) {
    throw new Error('Refusing to seed Connect demo data: database URL looks production-like');
  }

  return url;
}

function requireExplicitTarget(args: Args): void {
  if (!args.userId && !args.userEmail) {
    throw new Error('Connect demo seed requires --user-id or --user-email');
  }
}

async function resolveUser(client: Client, args: Pick<Args, 'userId' | 'userEmail'>): Promise<ResolvedUser> {
  if (args.userId) {
    const result = await client.query<{ id: string; email: string | null }>(
      `
        SELECT id, email
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [args.userId]
    );
    const row = result.rows[0];
    if (!row) throw new Error(`Target user not found by id: ${args.userId}`);
    return { id: row.id, email: row.email };
  }

  const result = await client.query<{ id: string; email: string | null }>(
    `
      SELECT id, email
      FROM users
      WHERE lower(email) = $1
      LIMIT 1
    `,
    [args.userEmail]
  );
  const row = result.rows[0];
  if (!row) throw new Error(`Target user not found by email: ${args.userEmail}`);
  return { id: row.id, email: row.email };
}

async function resolveReferees(client: Client, args: Args): Promise<ResolvedUser[]> {
  const users = new Map<string, ResolvedUser>();

  for (const userId of args.refereeUserIds) {
    const user = await resolveUser(client, { userId, userEmail: null });
    users.set(user.id, user);
  }

  for (const userEmail of args.refereeUserEmails) {
    const user = await resolveUser(client, { userId: null, userEmail });
    users.set(user.id, user);
  }

  const resolved = Array.from(users.values());
  if (resolved.length < REQUIRED_REFEREE_COUNT) {
    throw new Error(
      `Connect demo seed requires at least ${REQUIRED_REFEREE_COUNT} existing referee users; resolved ${resolved.length}`
    );
  }

  return resolved.slice(0, 5);
}

function buildReferralCode(userId: string, requested: string | null): string {
  if (requested) return requested;
  const suffix = userId.replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase();
  return `CA${suffix || 'DEMO'}`;
}

function buildReferralSeeds(referees: ResolvedUser[]): ReferralSeed[] {
  const statuses: ReferralSeed['status'][] = ['rewarded', 'rewarded', 'reward_missing', 'pending', 'pending'];
  const registeredDates = [
    '2026-04-17T08:10:00.000Z',
    '2026-04-18T10:30:00.000Z',
    '2026-04-20T07:45:00.000Z',
    '2026-04-22T12:00:00.000Z',
    '2026-04-23T09:15:00.000Z',
  ];
  const activatedDates = [
    '2026-04-17T09:20:00.000Z',
    '2026-04-18T11:10:00.000Z',
    '2026-04-20T08:20:00.000Z',
    null,
    null,
  ];
  const rewardPoints = [40, 35, 0, 0, 0];

  return referees.map((referee, index) => ({
    userId: referee.id,
    status: statuses[index] ?? 'pending',
    registeredAt: registeredDates[index] ?? '2026-04-23T09:15:00.000Z',
    firstLoginAt: activatedDates[index] ?? null,
    rewardPoints: rewardPoints[index] ?? 0,
  }));
}

function buildTransactions(userId: string, referrals: ReferralSeed[]): ConnectDemoTransaction[] {
  const rewardedReferralTransactions = referrals
    .filter((referral) => referral.status === 'rewarded')
    .map<ConnectDemoTransaction>((referral, index) => ({
      key: `referral-${index + 1}`,
      amount: referral.rewardPoints,
      action: 'referral_bonus_referrer',
      sourceService: 'referral-service',
      sourceEventId: `connect-demo-referral-${index + 1}`,
      createdAt: referral.firstLoginAt ?? '2026-04-18T11:10:00.000Z',
      metadata: { label: 'Referral activation', refereeUserId: referral.userId, demo: true },
    }));

  return [...CONNECT_DEMO_BASE_TRANSACTIONS, ...rewardedReferralTransactions].map((transaction) => {
    if (transaction.action !== 'referral_bonus_referrer') return transaction;
    const refereeUserId = String(transaction.metadata.refereeUserId ?? '');
    return {
      ...transaction,
      key: `referral-first-login-${refereeUserId}`,
      sourceEventId: `referral:first_login:${userId}:${refereeUserId}`,
    };
  });
}

async function assertReferralCodeAvailable(client: Client, userId: string, referralCode: string): Promise<void> {
  const result = await client.query<{ user_id: string }>(
    `
      SELECT user_id
      FROM referral_links
      WHERE referral_code = $1
      LIMIT 1
    `,
    [referralCode]
  );
  const owner = result.rows[0]?.user_id;
  if (owner && owner !== userId) {
    throw new Error(`Referral code ${referralCode} already belongs to another user`);
  }
}

async function assertRefereesAvailable(client: Client, userId: string, referrals: ReferralSeed[]): Promise<void> {
  const result = await client.query<{ referee_id: string; referrer_id: string }>(
    `
      SELECT referee_id, referrer_id
      FROM referral_relations
      WHERE referee_id = ANY($1::text[])
    `,
    [referrals.map((referral) => referral.userId)]
  );

  const conflicts = result.rows.filter((row) => row.referrer_id !== userId);
  if (conflicts.length > 0) {
    throw new Error(
      `Referee users already belong to another referrer: ${conflicts.map((row) => row.referee_id).join(', ')}`
    );
  }
}

async function upsertBadges(client: Client): Promise<void> {
  for (const badge of CONNECT_DEMO_BADGES) {
    await client.query(
      `
        INSERT INTO badges (id, code, title, description, category, icon_key, is_active, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, true, now())
        ON CONFLICT (code) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          icon_key = EXCLUDED.icon_key,
          is_active = true,
          updated_at = now()
      `,
      [badge.code, badge.code, badge.title, badge.description, badge.category, badge.iconKey]
    );
  }
}

async function upsertReferralCode(client: Client, userId: string, referralCode: string): Promise<void> {
  await client.query(
    `
      INSERT INTO referral_links (id, user_id, referral_code, created_at)
      VALUES ($1, $2, $3, $4::timestamp)
      ON CONFLICT (user_id) DO UPDATE SET
        referral_code = EXCLUDED.referral_code
    `,
    [`connect_demo_referral_link_${userId}`, userId, referralCode, '2026-04-16T02:30:00.000Z']
  );
}

async function upsertReferralRelations(client: Client, userId: string, referrals: ReferralSeed[]): Promise<void> {
  for (const referral of referrals) {
    await client.query(
      `
        INSERT INTO referral_relations (id, referrer_id, referee_id, registered_at, first_login_at)
        VALUES ($1, $2, $3, $4::timestamp, $5::timestamp)
        ON CONFLICT (referee_id) DO UPDATE SET
          referrer_id = EXCLUDED.referrer_id,
          registered_at = EXCLUDED.registered_at,
          first_login_at = EXCLUDED.first_login_at
      `,
      [
        `connect_demo_referral_${userId}_${referral.userId}`,
        userId,
        referral.userId,
        referral.registeredAt,
        referral.firstLoginAt,
      ]
    );
  }
}

async function upsertTransactions(
  client: Client,
  userId: string,
  transactions: ConnectDemoTransaction[]
): Promise<void> {
  for (const transaction of transactions) {
    const externalId =
      transaction.action === 'referral_bonus_referrer'
        ? transaction.sourceEventId
        : `connect-demo:${userId}:${transaction.key}`;
    const transactionId = `connect_demo_tx_${safeId(userId)}_${safeId(transaction.key)}`;

    await client.query(
      `
        INSERT INTO points_transactions (
          id,
          user_id,
          amount,
          reason,
          source_service,
          source_event_id,
          external_id,
          metadata,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::timestamp)
        ON CONFLICT (external_id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          amount = EXCLUDED.amount,
          reason = EXCLUDED.reason,
          source_service = EXCLUDED.source_service,
          source_event_id = EXCLUDED.source_event_id,
          metadata = EXCLUDED.metadata,
          created_at = EXCLUDED.created_at
      `,
      [
        transactionId,
        userId,
        transaction.amount,
        transaction.action,
        transaction.sourceService,
        transaction.sourceEventId,
        externalId,
        JSON.stringify(transaction.metadata),
        transaction.createdAt,
      ]
    );
  }
}

async function upsertUserBadges(client: Client, userId: string): Promise<void> {
  const awardedAtByCode = new Map<string, string>([
    ['welcome_explorer', '2026-04-16T05:00:00.000Z'],
    ['profile_starter', '2026-04-17T07:00:00.000Z'],
    ['first_referral', '2026-04-18T12:00:00.000Z'],
    ['content_starter', '2026-04-20T06:00:00.000Z'],
    ['quest_curious', '2026-04-19T09:00:00.000Z'],
  ]);

  for (const badgeCode of CONNECT_DEMO_AWARDED_BADGE_CODES) {
    const badge = CONNECT_DEMO_BADGES.find((item) => item.code === badgeCode);
    if (!badge) throw new Error(`Missing badge definition for ${badgeCode}`);

    await client.query(
      `
        INSERT INTO user_badges (
          id,
          user_id,
          badge_id,
          badge_name,
          source_service,
          source_type,
          source_id,
          metadata,
          created_at,
          earned_at
        )
        VALUES ($1, $2, $3, $4, 'points-service', 'connect_demo', $5, $6::jsonb, $7::timestamp, $7::timestamp)
        ON CONFLICT (user_id, badge_id) DO UPDATE SET
          badge_name = EXCLUDED.badge_name,
          source_service = EXCLUDED.source_service,
          source_type = EXCLUDED.source_type,
          source_id = EXCLUDED.source_id,
          metadata = EXCLUDED.metadata,
          created_at = EXCLUDED.created_at,
          earned_at = EXCLUDED.earned_at
      `,
      [
        `connect_demo_badge_${safeId(userId)}_${badgeCode}`,
        userId,
        badge.code,
        badge.title,
        `connect-demo:${badge.code}`,
        JSON.stringify({ demo: true, badgeCode: badge.code }),
        awardedAtByCode.get(badgeCode) ?? '2026-04-20T06:00:00.000Z',
      ]
    );
  }
}

async function refreshBalance(client: Client, userId: string): Promise<number> {
  const result = await client.query<{ balance: number }>(
    `
      SELECT COALESCE(SUM(amount), 0)::int AS balance
      FROM points_transactions
      WHERE user_id = $1
    `,
    [userId]
  );
  const balance = Number(result.rows[0]?.balance ?? 0);

  await client.query(
    `
      INSERT INTO user_balances (user_id, balance, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (user_id) DO UPDATE SET
        balance = EXCLUDED.balance,
        updated_at = now()
    `,
    [userId, balance]
  );

  return balance;
}

function safeId(input: string): string {
  return input.replace(/[^a-z0-9_]+/gi, '_').slice(0, 80);
}

function logPlan(userId: string, referralCode: string | null, refereesCount: number): void {
  console.log('[connect-demo-seed] mode=dry-run');
  console.log(`[connect-demo-seed] target_user_id=${userId}`);
  console.log(`[connect-demo-seed] referral_code=${referralCode ?? '(auto)'}`);
  console.log(`[connect-demo-seed] required_referees=${REQUIRED_REFEREE_COUNT}`);
  console.log(`[connect-demo-seed] provided_referees=${refereesCount}`);
  console.log(`[connect-demo-seed] badge_catalog=${CONNECT_DEMO_BADGES.length}`);
  console.log(`[connect-demo-seed] awarded_badges=${CONNECT_DEMO_AWARDED_BADGE_CODES.length}`);
  console.log(`[connect-demo-seed] base_transactions=${CONNECT_DEMO_BASE_TRANSACTIONS.length}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireExplicitTarget(args);

  if (args.mode === 'dry-run') {
    logPlan(args.userId ?? args.userEmail!, args.referralCode, args.refereeUserIds.length + args.refereeUserEmails.length);
    console.log('[connect-demo-seed] dry-run only; no DB writes');
    return;
  }

  const databaseUrl = getDatabaseUrl(args.mode);
  const client = new Client({ connectionString: databaseUrl!, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    const targetUser = await resolveUser(client, args);
    const referees = await resolveReferees(client, args);
    const referralCode = buildReferralCode(targetUser.id, args.referralCode);
    const referrals = buildReferralSeeds(referees);
    const transactions = buildTransactions(targetUser.id, referrals);

    await assertReferralCodeAvailable(client, targetUser.id, referralCode);
    await assertRefereesAvailable(client, targetUser.id, referrals);

    await client.query('BEGIN');
    try {
      await upsertBadges(client);
      await upsertReferralCode(client, targetUser.id, referralCode);
      await upsertReferralRelations(client, targetUser.id, referrals);
      await upsertTransactions(client, targetUser.id, transactions);
      await upsertUserBadges(client, targetUser.id);
      const balance = await refreshBalance(client, targetUser.id);
      await client.query('COMMIT');

      console.log('[connect-demo-seed] applied=true');
      console.log(`[connect-demo-seed] target_user_id=${targetUser.id}`);
      console.log(`[connect-demo-seed] target_user_email=${targetUser.email ?? '(none)'}`);
      console.log(`[connect-demo-seed] referral_code=${referralCode}`);
      console.log(`[connect-demo-seed] badge_catalog_upserted=${CONNECT_DEMO_BADGES.length}`);
      console.log(`[connect-demo-seed] user_badges_upserted=${CONNECT_DEMO_AWARDED_BADGE_CODES.length}`);
      console.log(`[connect-demo-seed] referrals_upserted=${referrals.length}`);
      console.log(`[connect-demo-seed] transactions_upserted=${transactions.length}`);
      console.log(`[connect-demo-seed] balance=${balance}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[connect-demo-seed] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

