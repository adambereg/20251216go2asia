import { Client } from 'pg';

type Mode = 'dry-run' | 'apply' | 'verify';

type Args = {
  mode: Mode;
  email: string;
  amount: number;
};

type BalanceAudit = {
  userId: string;
  email: string;
  role: string;
  runtimeVip: boolean;
  materializedBalance: number;
  ledgerTotal: number;
  availablePoints: number;
  lockedPoints: number;
  networkPoints: number;
};

const DEFAULT_TARGET_EMAIL = 'kirill.denisov.seed@example.com';
const AUDIT_EMAILS = ['kirill.denisov.seed@example.com', 'svetlana.orlova.seed@example.com'];
const DEFAULT_AMOUNT = 1000;
const TOPUP_REASON = 'staging_vip_paid_voucher_validation_topup';
const TOPUP_EXTERNAL_ID_PREFIX = 'staging:vip-paid-voucher-validation';
const DB_URL_PRODUCTION_HINTS = ['prod', 'production'];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    mode: argv.includes('--apply') ? 'apply' : argv.includes('--verify-only') ? 'verify' : 'dry-run',
    email: DEFAULT_TARGET_EMAIL,
    amount: DEFAULT_AMOUNT,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;
    const next = argv[index + 1]?.trim() ?? '';

    if (arg === '--email') {
      if (next) args.email = next.toLowerCase();
      index += 1;
      continue;
    }
    if (arg.startsWith('--email=')) {
      args.email = arg.slice('--email='.length).trim().toLowerCase() || args.email;
      continue;
    }
    if (arg === '--amount') {
      if (next) args.amount = Number(next);
      index += 1;
      continue;
    }
    if (arg.startsWith('--amount=')) {
      args.amount = Number(arg.slice('--amount='.length));
    }
  }

  if (!Number.isInteger(args.amount) || args.amount < 1 || args.amount > 10000) {
    throw new Error('Top-up amount must be an integer between 1 and 10000');
  }
  return args;
}

function safeId(input: string): string {
  return input.replace(/[^a-z0-9_]+/gi, '_').slice(0, 80);
}

function normalizeRole(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function isRuntimeVipRole(role: string): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'vip' || normalized === 'vip_spacer' || normalized === 'vip-spacer';
}

function buildTopupExternalId(email: string, amount: number): string {
  const localPart = email.split('@')[0]?.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'user';
  return `${TOPUP_EXTERNAL_ID_PREFIX}:${localPart}:topup:${amount}:v1`;
}

function getEnvironment(): string {
  return (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev').trim().toLowerCase();
}

function assertStaging(mode: Mode): void {
  const env = getEnvironment();
  if (env !== 'staging') {
    throw new Error('Refusing VIP validation top-up: ENVIRONMENT must be exactly staging');
  }
  if (process.env.NODE_ENV?.trim().toLowerCase() === 'production') {
    throw new Error('Refusing VIP validation top-up: NODE_ENV=production');
  }
  if (mode !== 'dry-run') {
    const confirm = (process.env.RF_POINTS_TOPUP_CONFIRM ?? '').trim().toLowerCase();
    if (confirm !== 'staging') {
      throw new Error('Set RF_POINTS_TOPUP_CONFIRM=staging before running --apply or --verify-only');
    }
  }
}

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL');
  const lowerUrl = url.toLowerCase();
  if (DB_URL_PRODUCTION_HINTS.some((hint) => lowerUrl.includes(hint))) {
    throw new Error('Refusing VIP validation top-up: database URL looks production-like');
  }
  return url;
}

function printDatabaseTarget(url: string): void {
  try {
    const parsed = new URL(url);
    console.log(`[vip-topup] db_host=${parsed.hostname}`);
    console.log(`[vip-topup] db_name=${parsed.pathname.replace(/^\//, '') || '(unknown)'}`);
  } catch {
    console.log('[vip-topup] db_target=(invalid URL format; value not printed)');
  }
}

async function auditBalances(client: Client, emails: string[]): Promise<BalanceAudit[]> {
  const result = await client.query<{
    user_id: string;
    email: string;
    role: string;
    materialized_balance: number;
    ledger_total: number;
    available_points: number;
    locked_points: number;
    network_points: number;
  }>(
    `
      SELECT
        u.id AS user_id,
        u.email,
        u.role,
        COALESCE(ub.balance, 0)::int AS materialized_balance,
        COALESCE(SUM(pt.amount), 0)::int AS ledger_total,
        COALESCE(SUM(
          CASE
            WHEN pt.reason = 'referral_locked' THEN 0
            WHEN pt.reason IN ('network_accrual_level_1', 'network_accrual_level_2') THEN 0
            ELSE pt.amount
          END
        ), 0)::int AS available_points,
        COALESCE(SUM(
          CASE
            WHEN pt.reason = 'referral_locked' THEN pt.amount
            WHEN pt.reason = 'referral_unlock' THEN -pt.amount
            ELSE 0
          END
        ), 0)::int AS locked_points,
        COALESCE(SUM(
          CASE
            WHEN pt.reason IN ('network_accrual_level_1', 'network_accrual_level_2') THEN pt.amount
            ELSE 0
          END
        ), 0)::int AS network_points
      FROM users u
      LEFT JOIN user_balances ub ON ub.user_id = u.id
      LEFT JOIN points_transactions pt ON pt.user_id = u.id
      WHERE lower(u.email) = ANY($1::text[])
      GROUP BY u.id, u.email, u.role, ub.balance
      ORDER BY u.email ASC
    `,
    [emails.map((email) => email.toLowerCase())]
  );

  const rows = result.rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    role: row.role,
    runtimeVip: isRuntimeVipRole(row.role),
    materializedBalance: Number(row.materialized_balance),
    ledgerTotal: Number(row.ledger_total),
    availablePoints: Number(row.available_points),
    lockedPoints: Number(row.locked_points),
    networkPoints: Number(row.network_points),
  }));

  const found = new Set(rows.map((row) => row.email.toLowerCase()));
  const missing = emails.filter((email) => !found.has(email.toLowerCase()));
  if (missing.length > 0) {
    throw new Error(`Missing seed users: ${missing.join(', ')}`);
  }

  return rows;
}

async function applyTopup(client: Client, audit: BalanceAudit, amount: number): Promise<'inserted' | 'reused'> {
  const externalId = buildTopupExternalId(audit.email, amount);
  const existing = await client.query<{
    id: string;
    user_id: string;
    amount: number;
    reason: string;
    source_service: string | null;
    source_event_id: string | null;
  }>(
    `
      SELECT id, user_id, amount, reason, source_service, source_event_id
      FROM points_transactions
      WHERE external_id = $1
      LIMIT 1
    `,
    [externalId]
  );

  const existingRow = existing.rows[0];
  if (existingRow) {
    const matches =
      existingRow.user_id === audit.userId &&
      Number(existingRow.amount) === amount &&
      existingRow.reason === TOPUP_REASON &&
      existingRow.source_service === 'staging-fixture' &&
      existingRow.source_event_id === externalId;
    if (!matches) {
      throw new Error('Top-up externalId already exists with a different payload');
    }
    await refreshBalance(client, audit.userId);
    return 'reused';
  }

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
      VALUES ($1, $2, $3, $4, 'staging-fixture', $5, $5, $6::jsonb, now())
    `,
    [
      `staging_vip_topup_${safeId(audit.userId)}_${amount}_v1`,
      audit.userId,
      amount,
      TOPUP_REASON,
      externalId,
      JSON.stringify({
        fixture: 'vip_paid_voucher_validation',
        version: 1,
        environment: 'staging',
        purpose: 'single_user_paid_rf_claim_validation',
      }),
    ]
  );
  await refreshBalance(client, audit.userId);
  return 'inserted';
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

async function verifyTopup(client: Client, email: string, amount: number): Promise<void> {
  const externalId = buildTopupExternalId(email, amount);
  const result = await client.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM points_transactions
      WHERE external_id = $1
        AND reason = $2
        AND amount = $3
    `,
    [externalId, TOPUP_REASON, amount]
  );
  if (Number(result.rows[0]?.total ?? 0) !== 1) {
    throw new Error('Expected exactly one matching VIP validation top-up transaction');
  }
}

function printAudit(rows: BalanceAudit[]): void {
  for (const row of rows) {
    console.log(
      `[vip-topup] user=${row.email} role=${row.role} runtime_vip=${row.runtimeVip} available=${row.availablePoints} locked=${row.lockedPoints} network=${row.networkPoints} total=${row.ledgerTotal} materialized=${row.materializedBalance}`
    );
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  assertStaging(args.mode);
  const databaseUrl = getDatabaseUrl();
  printDatabaseTarget(databaseUrl);

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const emails = Array.from(new Set([...AUDIT_EMAILS, args.email.toLowerCase()]));
    const before = await auditBalances(client, emails);
    printAudit(before);

    const target = before.find((row) => row.email.toLowerCase() === args.email.toLowerCase());
    if (!target) throw new Error(`Target user not found: ${args.email}`);
    if (!target.runtimeVip) throw new Error(`Target user is not VIP-compatible in current RF runtime: ${args.email}`);

    const externalId = buildTopupExternalId(target.email, args.amount);
    console.log(`[vip-topup] mode=${args.mode}`);
    console.log(`[vip-topup] target=${target.email}`);
    console.log(`[vip-topup] amount=${args.amount}`);
    console.log(`[vip-topup] reason=${TOPUP_REASON}`);
    console.log(`[vip-topup] external_id=${externalId}`);

    if (args.mode === 'dry-run') {
      console.log(`[vip-topup] projected_available_after=${target.availablePoints + args.amount}`);
      console.log('[vip-topup] dry-run only; no DB writes');
      return;
    }

    if (args.mode === 'apply') {
      await client.query('BEGIN');
      try {
        const result = await applyTopup(client, target, args.amount);
        await client.query('COMMIT');
        console.log(`[vip-topup] apply_result=${result}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    await verifyTopup(client, target.email, args.amount);
    const after = await auditBalances(client, emails);
    printAudit(after);
    const afterTarget = after.find((row) => row.email.toLowerCase() === target.email.toLowerCase());
    console.log(`[vip-topup] verify_result=ok available_after=${afterTarget?.availablePoints ?? '(unknown)'}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[vip-topup] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

