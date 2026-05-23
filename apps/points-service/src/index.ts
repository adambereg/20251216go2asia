/**
 * Points Service (Milestone 3) — Cloudflare Worker.
 *
 * Contract: docs/openapi/points.yaml
 * Key decisions:
 * - Downstream does NOT validate user JWT in M3.
 * - User-context is accepted only when request is authenticated as gateway-origin via X-Gateway-Auth (service JWT).
 * - Internal service-to-service auth uses Authorization: Bearer <service JWT>.
 * - Idempotency SSOT: externalId. If existing externalId has different payload => 409 Conflict + integration error log.
 */

import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { decideExternalIdIdempotency } from './idempotency';
import {
  evaluateProducerGate,
  getProducerAllowlistVersion,
  type ProducerFlagEnv,
} from './producerAllowlist';
import {
  createSpendabilityShadowDedupeKey,
  evaluateSpendabilityShadow,
  exportSpendabilityShadowObservation,
  getSpendabilityShadowDiagnosticsSnapshot,
  recordSpendabilityShadowObservation,
  toSpendabilityShadowObservation,
} from './spendabilityShadow';
import { createProjectionMetadata } from './projectionMetadata';

export interface Env extends ProducerFlagEnv {
  ENVIRONMENT?: string;
  VERSION?: string;

  // DB
  DATABASE_URL?: string;

  // Shared secret for service JWT (gateway-origin + internal)
  SERVICE_JWT_SECRET?: string;

  // Limits (M3): simple configurable per-user cap
  POINTS_VELOCITY_CAP?: string; // integer points
  POINTS_VELOCITY_WINDOW_SECONDS?: string; // integer seconds

  POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE?: string;
  POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS?: string;
  POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT?: string;
}

type GatewayPrincipal = {
  userId: string;
  roles: string[];
};

type JsonPrimitive = string | number | boolean | null;

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type JwtVerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

type Db = ReturnType<typeof createDb>;

type DbExecResult<T> = { rows: T[] };

type BadgeCatalogRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string;
  icon_key: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

type UserBadgeAwardRow = {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  source_service: string | null;
  source_type: string | null;
  source_id: string | null;
  metadata: unknown;
  created_at: Date;
  earned_at: Date;
};

type UserBadgeWithCatalogRow = UserBadgeAwardRow & {
  badge_code: string | null;
  badge_title: string | null;
  badge_description: string | null;
  badge_category: string | null;
  badge_icon_key: string | null;
};

type PointsTransactionRow = {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  source_service: string | null;
  source_event_id: string | null;
  external_id: string;
  metadata: unknown;
  created_at: Date | string;
};

type WalletBucketTransaction = {
  amount: number;
  reason: string;
};

export type WalletBuckets = {
  availablePoints: number;
  lockedPoints: number;
  networkPoints: number;
};

type SupportLookupEntity = 'user_balances' | 'points_transactions';
type SupportLookupScope = 'SUPPORT_SAFE';
type SupportLookupVisibility = 'INTERNAL_REFERENCE';
type SupportLookupStatus = 'LOOKUP_AVAILABLE' | 'LOOKUP_LIMITED' | 'LOOKUP_UNAVAILABLE';

type ParsedSupportLookupKey = {
  ownerNamespace: 'points';
  ownerEntity: SupportLookupEntity;
  lookupId: string;
};

type SupportLookupOwnerFactReference = {
  ownerService: 'points-service';
  ownerEntity: SupportLookupEntity;
  ownerLookupId: string;
  referenceType: 'OWNER_FACT_REFERENCE';
  ownerTimestamp?: string;
};

type SupportLookupResponseBody = {
  supportLookupKey: string;
  lookupScope: SupportLookupScope;
  lookupVisibility: SupportLookupVisibility;
  lookupStatus: SupportLookupStatus;
  ownerFactReference?: SupportLookupOwnerFactReference;
  lookupNote: string;
};

type ReferralDashboardSummaryRow = {
  total_referrals: number;
  activated_referrals: number;
  pending_referrals: number;
  total_earned_points: number;
};

const SERVICE_NAME = 'points-service';
const BADGE_LIST_DEFAULT_LIMIT = 20;
const BADGE_LIST_MAX_LIMIT = 100;
const DASHBOARD_TRANSACTIONS_DEFAULT_LIMIT = 5;
const DASHBOARD_TRANSACTIONS_MAX_LIMIT = 20;
const DASHBOARD_BADGES_DEFAULT_LIMIT = 5;
const DASHBOARD_BADGES_MAX_LIMIT = 20;
const METADATA_MAX_BYTES = 4096;
const SUPPORT_LOOKUP_ALLOWED_SERVICES = new Set(['support-service', 'api-gateway', 'admin-service', 'points-service']);

function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

function errorResponse(error: string, message: string, requestId?: string, status = 500): Response {
  return json(
    {
      error,
      message,
      requestId,
    },
    status
  );
}

function getEnvName(env: Env): string {
  return env.ENVIRONMENT ?? 'staging';
}

function getVersion(env: Env): string {
  return env.VERSION ?? 'unknown';
}

function handleHealth(env: Env): Response {
  return json(
    {
      service: SERVICE_NAME,
      env: getEnvName(env),
      status: 'ok',
      version: getVersion(env),
    },
    200,
    {
      'Cache-Control': 'no-store',
    }
  );
}

function getCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function isFlagEnabled(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function handleReady(env: Env): Response {
  const checks = {
    databaseUrl: getCheck(env.DATABASE_URL),
    serviceJwtSecret: getCheck(env.SERVICE_JWT_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;
  return json(
    {
      service: SERVICE_NAME,
      env: getEnvName(env),
      status: status === 200 ? 'ready' : 'not_ready',
      version: getVersion(env),
      checks,
      missing,
    },
    status,
    {
      'Cache-Control': 'no-store',
    }
  );
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const b64 = normalized + pad;

  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function parseJsonObject(input: string): Record<string, unknown> | null {
  try {
    const v: unknown = JSON.parse(input);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    return v as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function verifyHs256Jwt(token: string, secret: string): Promise<JwtVerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, error: 'JWT must have 3 parts' };

  const [headerB64, payloadB64, signatureB64] = parts;

  const headerJson = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(headerB64)));
  const payloadJson = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  if (!headerJson || !payloadJson) return { ok: false, error: 'JWT header/payload is not valid JSON object' };

  if (headerJson.alg !== 'HS256') return { ok: false, error: 'Only HS256 is supported' };

  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToBytes(signatureB64);

  const ok = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!ok) return { ok: false, error: 'Invalid signature' };

  // Optional exp validation
  const exp = payloadJson.exp;
  if (typeof exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= exp) return { ok: false, error: 'Token expired' };
  }

  const nbf = payloadJson.nbf;
  if (typeof nbf === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now < nbf) return { ok: false, error: 'Token is not active yet' };
  }

  return { ok: true, payload: payloadJson };
}

function getStringClaim(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function getStringArrayClaim(payload: Record<string, unknown>, key: string): string[] {
  const value = payload[key];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
}

function validateServiceJwtClaims(
  payload: Record<string, unknown>,
  expected: {
    iss?: string;
    aud?: string;
    sub?: string;
  }
): { ok: true } | { ok: false; error: string } {
  if (expected.iss) {
    const iss = getStringClaim(payload, 'iss');
    if (iss !== expected.iss) return { ok: false, error: 'Invalid issuer' };
  }

  if (expected.aud) {
    const aud = getStringClaim(payload, 'aud');
    if (aud !== expected.aud) return { ok: false, error: 'Invalid audience' };
  }

  if (expected.sub) {
    const sub = getStringClaim(payload, 'sub');
    if (sub !== expected.sub) return { ok: false, error: 'Invalid subject' };
  }

  return { ok: true };
}

async function requireGatewayOrigin(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true; principal: GatewayPrincipal } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return { ok: false, res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503) };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing X-Gateway-Auth header', requestId, 401) };

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token', requestId, 401) };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'api-gateway',
    aud: 'internal',
  });
  if (!claims.ok) {
    logger.warn('Gateway-origin token claims rejected', { reason: claims.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token claims', requestId, 401) };
  }

  const userId = getStringClaim(verified.payload, 'sub');
  if (!userId) {
    logger.warn('Gateway-origin token missing subject claim');
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing user subject in X-Gateway-Auth', requestId, 401) };
  }

  return {
    ok: true,
    principal: {
      userId,
      roles: [...getStringArrayClaim(verified.payload, 'roles'), ...getStringArrayClaim(verified.payload, 'role')],
    },
  };
}

async function requireServiceAuth(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true; principal: { service: string } } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return { ok: false, res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503) };
  }

  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing Authorization: Bearer token', requestId, 401) };

  const verified = await verifyHs256Jwt(match[1], secret);
  if (!verified.ok) {
    logger.warn('Invalid service token', { reason: verified.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid service token', requestId, 401) };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'go2asia-service-auth',
    aud: SERVICE_NAME,
  });
  if (!claims.ok) {
    logger.warn('Service token claims rejected', { reason: claims.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid service token claims', requestId, 401) };
  }

  const service = getStringClaim(verified.payload, 'sub');
  if (!service) {
    logger.warn('Service token missing subject claim');
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing service subject in token', requestId, 401) };
  }

  return { ok: true, principal: { service } };
}

function requireDatabase(env: Env): string {
  if (!env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
  return env.DATABASE_URL;
}

function parseIntOrDefault(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

function parseLimit(value: string | null, defaultValue: number, maxValue: number): number {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, maxValue);
}

function parseOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function parseJsonMetadata(value: unknown): Record<string, JsonValue> | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, JsonValue>;
}

function metadataIsWithinBounds(value: Record<string, JsonValue> | null | undefined): boolean {
  if (value === undefined || value === null) return true;
  return new TextEncoder().encode(JSON.stringify(value)).length <= METADATA_MAX_BYTES;
}

function parseCursor(cursor: string): { createdAt: Date; id: string } | null {
  try {
    const raw = new TextDecoder().decode(base64UrlToBytes(cursor));
    const parsed = parseJsonObject(raw);
    if (!parsed) return null;
    const createdAtRaw = parsed.createdAt;
    const idRaw = parsed.id;
    if (typeof createdAtRaw !== 'string' || typeof idRaw !== 'string') return null;
    const createdAt = new Date(createdAtRaw);
    if (Number.isNaN(createdAt.getTime())) return null;
    return { createdAt, id: idRaw };
  } catch {
    return null;
  }
}

function makeCursor(input: { createdAt: Date; id: string }): string {
  const payload = JSON.stringify({ createdAt: input.createdAt.toISOString(), id: input.id });
  return bytesToBase64Url(utf8ToBytes(payload));
}

function actionIsOneTimePerUser(action: string): boolean {
  return action === 'registration' || action === 'first_login';
}

function isNetworkAccrualAction(action: string): boolean {
  return action === 'network_accrual_level_1' || action === 'network_accrual_level_2';
}

function hasRole(principal: GatewayPrincipal, role: string): boolean {
  return principal.roles.some((item) => item.trim().toLowerCase() === role);
}

export function computeWalletBuckets(transactions: WalletBucketTransaction[]): WalletBuckets {
  return transactions.reduce<WalletBuckets>(
    (acc, transaction) => {
      const amount = Number(transaction.amount ?? 0);
      if (!Number.isFinite(amount) || amount === 0) return acc;

      if (transaction.reason === 'referral_locked') {
        acc.lockedPoints += amount;
      } else if (transaction.reason === 'referral_unlock') {
        acc.lockedPoints -= amount;
        acc.availablePoints += amount;
      } else if (isNetworkAccrualAction(transaction.reason)) {
        acc.networkPoints += amount;
      } else {
        acc.availablePoints += amount;
      }

      return acc;
    },
    { availablePoints: 0, lockedPoints: 0, networkPoints: 0 }
  );
}

function getRows<T>(result: unknown): T[] {
  const rows = (result as Partial<DbExecResult<T>>).rows;
  return Array.isArray(rows) ? rows : [];
}

async function getUserBalance(db: Db, userId: string): Promise<{ balance: number; updatedAt: Date }> {
  const result = await db.execute(
    sql`SELECT balance, updated_at FROM user_balances WHERE user_id = ${userId} LIMIT 1`
  );

  const row = getRows<{ balance: number; updated_at: Date }>(result)[0];
  if (!row) return { balance: 0, updatedAt: new Date() };

  return {
    balance: Number(row.balance ?? 0),
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at),
  };
}

async function getDashboardBalance(db: Db, userId: string): Promise<{ points: number; updatedAt: string | null }> {
  const result = await db.execute(
    sql`SELECT balance, updated_at FROM user_balances WHERE user_id = ${userId} LIMIT 1`
  );

  const row = getRows<{ balance: number; updated_at: Date | string }>(result)[0];
  if (!row) {
    return {
      points: 0,
      updatedAt: null,
    };
  }

  return {
    points: Number(row.balance ?? 0),
    updatedAt: asIso(row.updated_at),
  };
}

async function listWalletBucketTransactions(db: Db, userId: string): Promise<WalletBucketTransaction[]> {
  const result = await db.execute(sql`
    SELECT amount, reason
    FROM points_transactions
    WHERE user_id = ${userId}
    ORDER BY created_at ASC, id ASC
  `);

  return getRows<WalletBucketTransaction>(result);
}

function asIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return (value instanceof Date ? value : new Date(value)).toISOString();
}

function createSupportLookupKey(ownerEntity: SupportLookupEntity, lookupId: string): string {
  return `points:${ownerEntity}:${bytesToBase64Url(utf8ToBytes(lookupId))}`;
}

function parseSupportLookupKey(value: unknown): ParsedSupportLookupKey | null {
  if (typeof value !== 'string') return null;
  const [ownerNamespace, ownerEntity, encodedLookupId, ...extra] = value.split(':');
  if (extra.length > 0 || ownerNamespace !== 'points') return null;
  if (ownerEntity !== 'user_balances' && ownerEntity !== 'points_transactions') return null;
  if (!encodedLookupId) return null;

  try {
    const lookupId = new TextDecoder().decode(base64UrlToBytes(encodedLookupId));
    if (!lookupId.trim()) return null;
    return {
      ownerNamespace,
      ownerEntity,
      lookupId,
    };
  } catch {
    return null;
  }
}

async function lookupSupportOwnerFact(
  db: Db,
  parsed: ParsedSupportLookupKey,
  supportLookupKey: string
): Promise<SupportLookupResponseBody> {
  if (parsed.ownerEntity === 'user_balances') {
    const result = await db.execute(sql`
      SELECT user_id, updated_at
      FROM user_balances
      WHERE user_id = ${parsed.lookupId}
      LIMIT 1
    `);
    const row = getRows<{ user_id: string; updated_at: Date | string }>(result)[0];

    if (!row) {
      return {
        supportLookupKey,
        lookupScope: 'SUPPORT_SAFE',
        lookupVisibility: 'INTERNAL_REFERENCE',
        lookupStatus: 'LOOKUP_UNAVAILABLE',
        lookupNote: 'No owner fact was found for this bounded lookup key. This is not proof of absence.',
      };
    }

    return {
      supportLookupKey,
      lookupScope: 'SUPPORT_SAFE',
      lookupVisibility: 'INTERNAL_REFERENCE',
      lookupStatus: 'LOOKUP_AVAILABLE',
      ownerFactReference: {
        ownerService: 'points-service',
        ownerEntity: 'user_balances',
        ownerLookupId: row.user_id,
        referenceType: 'OWNER_FACT_REFERENCE',
        ...(asIso(row.updated_at) ? { ownerTimestamp: asIso(row.updated_at)! } : {}),
      },
      lookupNote: 'Lookup resolved a bounded owner fact reference. The owner row remains authoritative.',
    };
  }

  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM points_transactions
    WHERE user_id = ${parsed.lookupId}
  `);
  const total = Number(getRows<{ total: number }>(result)[0]?.total ?? 0);

  if (total <= 0) {
    return {
      supportLookupKey,
      lookupScope: 'SUPPORT_SAFE',
      lookupVisibility: 'INTERNAL_REFERENCE',
      lookupStatus: 'LOOKUP_UNAVAILABLE',
      lookupNote: 'No owner fact family entries were found for this bounded lookup key. This is not proof of absence.',
    };
  }

  return {
    supportLookupKey,
    lookupScope: 'SUPPORT_SAFE',
    lookupVisibility: 'INTERNAL_REFERENCE',
    lookupStatus: 'LOOKUP_LIMITED',
    ownerFactReference: {
      ownerService: 'points-service',
      ownerEntity: 'points_transactions',
      ownerLookupId: parsed.lookupId,
      referenceType: 'OWNER_FACT_REFERENCE',
    },
    lookupNote: 'Lookup found an owner fact family reference. Resolve individual rows in the owner service before support decisions.',
  };
}

function normalizeBadgeCatalogItem(row: BadgeCatalogRow) {
  return {
    code: row.code,
    title: row.title,
    description: row.description,
    category: row.category,
    iconKey: row.icon_key,
    isActive: row.is_active,
  };
}

function normalizeUserBadgeItem(row: UserBadgeWithCatalogRow) {
  return {
    badgeCode: row.badge_code ?? row.badge_id,
    title: row.badge_title ?? row.badge_name,
    description: row.badge_description,
    category: row.badge_category,
    iconKey: row.badge_icon_key,
    awardedAt: asIso(row.earned_at)!,
    sourceType: row.source_type,
    sourceId: row.source_id,
  };
}

function normalizeDashboardTransactionItem(row: PointsTransactionRow) {
  return {
    id: row.id,
    amount: Number(row.amount),
    action: row.reason,
    sourceService: row.source_service,
    sourceEventId: row.source_event_id,
    createdAt: asIso(row.created_at)!,
  };
}

function normalizeDashboardBadgeItem(row: UserBadgeWithCatalogRow) {
  return {
    badgeCode: row.badge_code ?? row.badge_id,
    title: row.badge_title ?? row.badge_name,
    category: row.badge_category,
    iconKey: row.badge_icon_key,
    awardedAt: asIso(row.earned_at)!,
  };
}

const pointsSummaryMetadata = (userId: string) =>
  createProjectionMetadata({
    projectionKind: 'POINTS_SUMMARY',
    referenceScope: 'READ_ONLY',
    ownerFactReference: {
      ownerService: 'points-service',
      ownerEntity: 'user_balances',
      referenceType: 'OWNER_FACT_REFERENCE',
    },
    supportLookupKey: createSupportLookupKey('user_balances', userId),
  });

const walletSummaryMetadata = (userId: string) =>
  createProjectionMetadata({
    projectionKind: 'POINTS_SUMMARY',
    referenceScope: 'READ_ONLY',
    ownerFactReference: {
      ownerService: 'points-service',
      ownerEntity: 'points_transactions',
      referenceType: 'OWNER_FACT_REFERENCE',
    },
    supportLookupKey: createSupportLookupKey('points_transactions', userId),
  });

const activityProjectionMetadata = (userId: string) =>
  createProjectionMetadata({
    projectionKind: 'ACTIVITY_PROJECTION',
    referenceScope: 'REFERENCE_ONLY',
    ownerFactReference: {
      ownerService: 'points-service',
      ownerEntity: 'points_transactions',
      referenceType: 'OWNER_FACT_REFERENCE',
    },
    supportLookupKey: createSupportLookupKey('points_transactions', userId),
  });

async function listActiveBadges(db: Db): Promise<BadgeCatalogRow[]> {
  const result = await db.execute(sql`
    SELECT id, code, title, description, category, icon_key, is_active, created_at, updated_at
    FROM badges
    WHERE is_active = true
    ORDER BY category ASC, title ASC, code ASC
  `);
  return getRows<BadgeCatalogRow>(result);
}

async function getBadgeByCode(db: Db, code: string): Promise<BadgeCatalogRow | null> {
  const result = await db.execute(sql`
    SELECT id, code, title, description, category, icon_key, is_active, created_at, updated_at
    FROM badges
    WHERE code = ${code}
    LIMIT 1
  `);
  return getRows<BadgeCatalogRow>(result)[0] ?? null;
}

async function getUserBadgeByUserAndBadge(db: Db, userId: string, badgeId: string): Promise<UserBadgeAwardRow | null> {
  const result = await db.execute(sql`
    SELECT id, user_id, badge_id, badge_name, source_service, source_type, source_id, metadata, created_at, earned_at
    FROM user_badges
    WHERE user_id = ${userId} AND badge_id = ${badgeId}
    LIMIT 1
  `);
  return getRows<UserBadgeAwardRow>(result)[0] ?? null;
}

async function listUserBadges(db: Db, userId: string, limit: number): Promise<UserBadgeWithCatalogRow[]> {
  const result = await db.execute(sql`
    SELECT
      ub.id,
      ub.user_id,
      ub.badge_id,
      ub.badge_name,
      ub.source_service,
      ub.source_type,
      ub.source_id,
      ub.metadata,
      ub.created_at,
      ub.earned_at,
      b.code AS badge_code,
      b.title AS badge_title,
      b.description AS badge_description,
      b.category AS badge_category,
      b.icon_key AS badge_icon_key
    FROM user_badges ub
    LEFT JOIN badges b ON b.id = ub.badge_id
    WHERE ub.user_id = ${userId}
    ORDER BY ub.earned_at DESC, ub.id DESC
    LIMIT ${limit}
  `);
  return getRows<UserBadgeWithCatalogRow>(result);
}

async function countUserBadges(db: Db, userId: string): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM user_badges
    WHERE user_id = ${userId}
  `);
  return Number(getRows<{ total: number }>(result)[0]?.total ?? 0);
}

async function listDashboardTransactions(db: Db, userId: string, limit: number): Promise<PointsTransactionRow[]> {
  const result = await db.execute(sql`
    SELECT id, user_id, amount, reason, source_service, source_event_id, external_id, metadata, created_at
    FROM points_transactions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC, id DESC
    LIMIT ${limit}
  `);
  return getRows<PointsTransactionRow>(result);
}

async function getDashboardReferralSummary(db: Db, userId: string): Promise<ReferralDashboardSummaryRow> {
  const result = await db.execute(sql`
    SELECT
      COUNT(*)::int AS total_referrals,
      COUNT(*) FILTER (WHERE rr.first_login_at IS NOT NULL)::int AS activated_referrals,
      COUNT(*) FILTER (WHERE rr.first_login_at IS NULL)::int AS pending_referrals,
      COALESCE(SUM(pt.amount), 0)::int AS total_earned_points
    FROM referral_relations rr
    LEFT JOIN points_transactions pt
      ON pt.user_id = rr.referrer_id
      AND pt.reason = 'referral_bonus_referrer'
      AND pt.external_id = ('referral:first_login:' || rr.referrer_id || ':' || rr.referee_id)
    WHERE rr.referrer_id = ${userId}
  `);
  return (
    getRows<ReferralDashboardSummaryRow>(result)[0] ?? {
      total_referrals: 0,
      activated_referrals: 0,
      pending_referrals: 0,
      total_earned_points: 0,
    }
  );
}

function decideBadgeAwardIdempotency(
  existing: UserBadgeAwardRow,
  incoming: {
    sourceService: string;
    sourceType: string;
    sourceId: string;
  }
): 'duplicate' | 'conflict' {
  const legacyAward =
    !existing.source_service &&
    !existing.source_type &&
    !existing.source_id;
  if (legacyAward) return 'duplicate';

  if (
    existing.source_service === incoming.sourceService &&
    existing.source_type === incoming.sourceType &&
    existing.source_id === incoming.sourceId
  ) {
    return 'duplicate';
  }

  return 'conflict';
}

async function getTransactionByExternalId(db: Db, externalId: string): Promise<null | {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  source_service: string | null;
  source_event_id: string | null;
  external_id: string;
  metadata: unknown;
}> {
  const result = await db.execute(
    sql`
      SELECT id, user_id, amount, reason, source_service, source_event_id, external_id, metadata
      FROM points_transactions
      WHERE external_id = ${externalId}
      LIMIT 1
    `
  );
  return getRows<{
    id: string;
    user_id: string;
    amount: number;
    reason: string;
    source_service: string | null;
    source_event_id: string | null;
    external_id: string;
    metadata: unknown;
  }>(result)[0] ?? null;
}

async function enforceVelocityCap(
  db: Db,
  userId: string,
  amountToAdd: number,
  cap: number,
  windowSeconds: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  const result = await db.execute(
    sql`
      SELECT coalesce(sum(amount), 0)::int AS total
      FROM points_transactions
      WHERE user_id = ${userId}
        AND created_at >= ${windowStart}
    `
  );

  const row = getRows<{ total: number }>(result)[0];
  const current = Number(row?.total ?? 0);
  if (current + amountToAdd > cap) return { ok: false, error: 'Velocity cap exceeded' };
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, SERVICE_NAME, {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });

    const url = new URL(request.url);
    const path = url.pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      response = await (async (): Promise<Response> => {
      if (path === '/health' || path === '/version') {
        const res = handleHealth(env);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (path === '/ready') {
        const res = handleReady(env);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // User-facing (gateway-origin) endpoints
      if (request.method === 'GET' && path === '/v1/points/badges') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const db = createDb(requireDatabase(env));
        const items = await listActiveBadges(db);

        const res = json(
          { items: items.map(normalizeBadgeCatalogItem) },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/points/badges/mine') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const userId = auth.principal.userId;
        const limit = parseLimit(url.searchParams.get('limit'), BADGE_LIST_DEFAULT_LIMIT, BADGE_LIST_MAX_LIMIT);
        const db = createDb(requireDatabase(env));
        const items = await listUserBadges(db, userId, limit);

        const res = json(
          {
            items: items.map(normalizeUserBadgeItem),
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/points/balance') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }
        const userId = auth.principal.userId;

        const db = createDb(requireDatabase(env));
        const { balance, updatedAt } = await getUserBalance(db, userId);

        const res = json(
          {
            userId,
            balance,
            updatedAt: updatedAt.toISOString(),
            projectionMetadata: pointsSummaryMetadata(userId),
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/wallet/summary') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const db = createDb(requireDatabase(env));
        const buckets = computeWalletBuckets(await listWalletBucketTransactions(db, auth.principal.userId));
        const totalPoints = buckets.availablePoints + buckets.lockedPoints + buckets.networkPoints;

        const res = json(
          {
            availablePoints: buckets.availablePoints,
            lockedPoints: buckets.lockedPoints,
            networkPoints: buckets.networkPoints,
            totalPoints,
            estimatedUnlockablePoints: buckets.lockedPoints,
            vipStatus: {
              isActive: hasRole(auth.principal, 'vip_spacer') || hasRole(auth.principal, 'vip'),
            },
            proStatus: {
              isActive: hasRole(auth.principal, 'pro'),
            },
            projectionMetadata: walletSummaryMetadata(auth.principal.userId),
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/points/connect-dashboard') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }
        const userId = auth.principal.userId;
        const transactionsLimit = parseLimit(
          url.searchParams.get('transactionsLimit'),
          DASHBOARD_TRANSACTIONS_DEFAULT_LIMIT,
          DASHBOARD_TRANSACTIONS_MAX_LIMIT
        );
        const badgesLimit = parseLimit(
          url.searchParams.get('badgesLimit'),
          DASHBOARD_BADGES_DEFAULT_LIMIT,
          DASHBOARD_BADGES_MAX_LIMIT
        );

        const db = createDb(requireDatabase(env));
        const [balance, transactions, totalBadges, recentBadges, referrals] = await Promise.all([
          getDashboardBalance(db, userId),
          listDashboardTransactions(db, userId, transactionsLimit),
          countUserBadges(db, userId),
          listUserBadges(db, userId, badgesLimit),
          getDashboardReferralSummary(db, userId),
        ]);

        const res = json(
          {
            balance,
            recentTransactions: transactions.map(normalizeDashboardTransactionItem),
            referrals: {
              totalEarnedPoints: Number(referrals.total_earned_points ?? 0),
              activatedReferrals: Number(referrals.activated_referrals ?? 0),
              pendingReferrals: Number(referrals.pending_referrals ?? 0),
              totalReferrals: Number(referrals.total_referrals ?? 0),
            },
            badges: {
              totalBadges,
              recent: recentBadges.map(normalizeDashboardBadgeItem),
            },
            projectionMetadata: createProjectionMetadata({
              projectionKind: 'POINTS_SUMMARY',
              referenceScope: 'READ_ONLY',
              supportLookupKey: createSupportLookupKey('user_balances', userId),
            }),
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/points/transactions') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }
        const userId = auth.principal.userId;

        const limit = Math.min(
          100,
          Math.max(1, parseIntOrDefault(url.searchParams.get('limit') ?? undefined, 20))
        );

        const cursorRaw = url.searchParams.get('cursor') ?? undefined;
        const cursorParsed = cursorRaw ? parseCursor(cursorRaw) : null;

        const db = createDb(requireDatabase(env));

        const cursorClause = cursorParsed
          ? sql`AND (created_at < ${cursorParsed.createdAt} OR (created_at = ${cursorParsed.createdAt} AND id < ${cursorParsed.id}))`
          : sql``;

        const result = await db.execute(
          sql`
            SELECT id, user_id, amount, reason, source_service, source_event_id, external_id, metadata, created_at
            FROM points_transactions
            WHERE user_id = ${userId}
            ${cursorClause}
            ORDER BY created_at DESC, id DESC
            LIMIT ${limit + 1}
          `
        );

        const rows = getRows<{
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source_service: string | null;
          source_event_id: string | null;
          external_id: string;
          metadata: unknown;
          created_at: Date;
        }>(result);

        const page = rows.slice(0, limit);
        const hasNext = rows.length > limit;
        const last = page[page.length - 1];

        const items = page.map((t) => ({
          id: t.id,
          userId: t.user_id,
          amount: Number(t.amount),
          action: t.reason,
          sourceService: t.source_service,
          sourceEventId: t.source_event_id,
          externalId: t.external_id,
          createdAt: (t.created_at instanceof Date ? t.created_at : new Date(t.created_at)).toISOString(),
          metadata: (t.metadata ?? {}) as JsonValue,
        }));

        const res = json(
          {
            items,
            nextCursor:
              hasNext && last
                ? makeCursor({
                    createdAt: last.created_at instanceof Date ? last.created_at : new Date(last.created_at),
                    id: last.id,
                  })
                : null,
            projectionMetadata: activityProjectionMetadata(userId),
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'POST' && path === '/internal/points/support-lookup') {
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        if (!SUPPORT_LOOKUP_ALLOWED_SERVICES.has(auth.principal.service)) {
          const res = errorResponse('FORBIDDEN', 'Service is not allowed to use support lookup', requestId, 403);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const supportLookupKey = body?.supportLookupKey;
        const parsed = parseSupportLookupKey(supportLookupKey);
        if (!parsed || typeof supportLookupKey !== 'string') {
          const res = errorResponse('BadRequest', 'Invalid supportLookupKey', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const lookup = await lookupSupportOwnerFact(db, parsed, supportLookupKey);

        const res = json(lookup, 200, { 'Cache-Control': 'no-store' });
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // Internal endpoint
      if (request.method === 'POST' && path === '/internal/points/badges/award') {
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const userId = body?.userId;
        const badgeCode = parseOptionalString(body?.badgeCode);
        const sourceType = parseOptionalString(body?.sourceType);
        const sourceId = parseOptionalString(body?.sourceId);
        const metadata = parseJsonMetadata(body?.metadata);

        if (typeof userId !== 'string' || userId.trim().length === 0) {
          const res = errorResponse('BadRequest', 'Missing userId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (!badgeCode) {
          const res = errorResponse('BadRequest', 'Missing badgeCode', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (!sourceType) {
          const res = errorResponse('BadRequest', 'Missing sourceType', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (!sourceId) {
          const res = errorResponse('BadRequest', 'Missing sourceId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (body?.metadata !== undefined && metadata === undefined) {
          const res = errorResponse('BadRequest', 'Invalid metadata', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const badge = await getBadgeByCode(db, badgeCode);
        if (!badge) {
          const res = errorResponse('NotFound', 'Badge not found', requestId, 404);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (!badge.is_active) {
          const res = errorResponse('Conflict', 'Badge is inactive', requestId, 409);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const callerService = auth.principal.service;
        const existing = await getUserBadgeByUserAndBadge(db, userId, badge.id);
        if (existing) {
          const decision = decideBadgeAwardIdempotency(existing, {
            sourceService: callerService,
            sourceType,
            sourceId,
          });
          if (decision === 'conflict') {
            const res = errorResponse('Conflict', 'Badge already awarded with different source', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const res = json(
            {
              badgeCode: badge.code,
              userId,
              awardId: existing.id,
              applied: false,
              awardedAt: asIso(existing.earned_at),
            },
            200,
            { 'Cache-Control': 'no-store' }
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const awardId = crypto.randomUUID();
        const applyRes = await db.execute(sql`
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
          VALUES (
            ${awardId},
            ${userId},
            ${badge.id},
            ${badge.title},
            ${callerService},
            ${sourceType},
            ${sourceId},
            ${JSON.stringify(metadata ?? {})}::jsonb,
            now(),
            now()
          )
          ON CONFLICT (user_id, badge_id) DO NOTHING
          RETURNING id, user_id, badge_id, badge_name, source_service, source_type, source_id, metadata, created_at, earned_at
        `);

        const inserted = getRows<UserBadgeAwardRow>(applyRes)[0] ?? null;
        if (!inserted) {
          const existingAfterConflict = await getUserBadgeByUserAndBadge(db, userId, badge.id);
          if (!existingAfterConflict) {
            logger.error('Badge award insert returned no rows but existing award was not found', {
              userId,
              badgeCode: badge.code,
            });
            const res = errorResponse('InternalError', 'Failed to award badge', requestId, 500);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const decision = decideBadgeAwardIdempotency(existingAfterConflict, {
            sourceService: callerService,
            sourceType,
            sourceId,
          });
          if (decision === 'conflict') {
            const res = errorResponse('Conflict', 'Badge already awarded with different source', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const res = json(
            {
              badgeCode: badge.code,
              userId,
              awardId: existingAfterConflict.id,
              applied: false,
              awardedAt: asIso(existingAfterConflict.earned_at),
            },
            200,
            { 'Cache-Control': 'no-store' }
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const res = json(
          {
            badgeCode: badge.code,
            userId,
            awardId: inserted.id,
            applied: true,
            awardedAt: asIso(inserted.earned_at),
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'POST' && path === '/internal/points/add') {
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const userId = body?.userId;
        const amount = body?.amount;
        const action = typeof body?.action === 'string' ? body.action.trim() : '';
        const externalId = body?.externalId;
        const sourceEventId = body?.sourceEventId;
        const metadata = parseJsonMetadata(body?.metadata);

        if (typeof userId !== 'string' || userId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing userId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1) {
          const res = errorResponse('BadRequest', 'Invalid amount', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (action.length === 0) {
          const res = errorResponse('BadRequest', 'Invalid action', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof externalId !== 'string' || externalId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing externalId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (sourceEventId !== undefined && (typeof sourceEventId !== 'string' || sourceEventId.trim().length === 0)) {
          const res = errorResponse('BadRequest', 'Invalid sourceEventId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (body?.metadata !== undefined && (metadata === undefined || metadata === null || !metadataIsWithinBounds(metadata))) {
          const res = errorResponse('BadRequest', 'Invalid metadata', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const callerService = auth.principal.service;
        const producerGate = evaluateProducerGate({
          action,
          operation: 'add',
          sourceService: callerService,
          env,
        });
        if (!producerGate.ok) {
          logger.warn('Points producer rejected by Stage 11.2 allowlist', {
            action,
            producerClass: producerGate.classification,
            sourceService: callerService,
            reason: producerGate.error,
            requiredFlag: producerGate.requiredFlag,
            allowlistVersion: getProducerAllowlistVersion(),
          });
          const res = errorResponse(producerGate.error, producerGate.message, requestId, producerGate.status);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const normalizedSourceEventId = typeof sourceEventId === 'string' ? sourceEventId.trim() : null;

        // Idempotency lookup
        const existing = await getTransactionByExternalId(db, externalId);
        if (existing) {
          const decision = decideExternalIdIdempotency(
            {
              transactionId: existing.id,
              userId: existing.user_id,
              amount: existing.amount,
              action: existing.reason,
              sourceService: existing.source_service,
              sourceEventId: existing.source_event_id,
              metadata: existing.metadata,
            },
            {
              userId,
              amount,
              action,
              sourceService: callerService,
              sourceEventId: normalizedSourceEventId,
              metadata,
            }
          );
          if (decision.kind === 'conflict') {
            logger.error('Idempotency conflict (integration error)', {
              externalId,
              existing: {
                userId: existing.user_id,
                amount: existing.amount,
                action: existing.reason,
                sourceService: existing.source_service,
                sourceEventId: existing.source_event_id,
                metadata: existing.metadata ?? {},
              },
              incoming: {
                userId,
                amount,
                action,
                sourceService: callerService,
                sourceEventId: normalizedSourceEventId,
                metadata: metadata ?? {},
              },
            });
            const res = errorResponse('Conflict', 'externalId already exists with different payload', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const { balance } = await getUserBalance(db, userId);
          const res = json({ transactionId: existing.id, applied: false, balance }, 200);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        // Per-user velocity cap (M3)
        const cap = parseIntOrDefault(env.POINTS_VELOCITY_CAP, 1000);
        const windowSeconds = parseIntOrDefault(env.POINTS_VELOCITY_WINDOW_SECONDS, 3600);

        const velocity = await enforceVelocityCap(db, userId, amount, cap, windowSeconds);
        if (!velocity.ok) {
          const res = errorResponse('RateLimited', velocity.error, requestId, 429);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        // Simple per-action limit (M3): one-time actions only
        if (actionIsOneTimePerUser(action)) {
          const priorRes = await db.execute(
            sql`
              SELECT id
              FROM points_transactions
              WHERE user_id = ${userId}
                AND reason = ${action}
              LIMIT 1
            `
          );

          const prior = getRows<{ id: string }>(priorRes)[0];
          if (prior) {
            const { balance } = await getUserBalance(db, userId);
            const res = json({ transactionId: prior.id, applied: false, balance }, 200);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }
        }

        const txId = crypto.randomUUID();

        // Atomic insert + balance update via SQL (avoid relying on driver-level transactions)
        const applyRes = await db.execute(sql`
          WITH ins AS (
            INSERT INTO points_transactions (
              id,
              user_id,
              amount,
              reason,
              source_service,
              source_event_id,
              external_id,
              metadata
            )
            VALUES (
              ${txId},
              ${userId},
              ${amount},
              ${action},
              ${callerService},
              ${normalizedSourceEventId},
              ${externalId},
              ${JSON.stringify(metadata ?? {})}::jsonb
            )
            ON CONFLICT (external_id) DO NOTHING
            RETURNING id, user_id, amount, reason, source_service, source_event_id, external_id, metadata
          ),
          up AS (
            INSERT INTO user_balances (user_id, balance, updated_at)
            SELECT user_id, amount, now() FROM ins
            ON CONFLICT (user_id) DO UPDATE
              SET balance = user_balances.balance + EXCLUDED.balance,
                  updated_at = now()
            RETURNING user_id, balance
          )
          SELECT
            (SELECT id FROM ins) AS transaction_id,
            (SELECT balance FROM up) AS balance;
        `);

        const row = getRows<{ transaction_id: string | null; balance: number | null }>(applyRes)[0];

        // If concurrent insert happened, ins is empty => transaction_id null
        if (!row?.transaction_id) {
          const existing2 = await getTransactionByExternalId(db, externalId);
          if (!existing2) {
            logger.error('Insert returned no rows but externalId not found (unexpected)', { externalId });
            const res = errorResponse('InternalError', 'Failed to apply points', requestId, 500);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const decision2 = decideExternalIdIdempotency(
            {
              transactionId: existing2.id,
              userId: existing2.user_id,
              amount: existing2.amount,
              action: existing2.reason,
              sourceService: existing2.source_service,
              sourceEventId: existing2.source_event_id,
              metadata: existing2.metadata,
            },
            {
              userId,
              amount,
              action,
              sourceService: callerService,
              sourceEventId: normalizedSourceEventId,
              metadata,
            }
          );
          if (decision2.kind === 'conflict') {
            logger.error('Idempotency conflict after concurrent insert (integration error)', {
              externalId,
              existing: {
                userId: existing2.user_id,
                amount: existing2.amount,
                action: existing2.reason,
                sourceService: existing2.source_service,
                sourceEventId: existing2.source_event_id,
                metadata: existing2.metadata ?? {},
              },
              incoming: {
                userId,
                amount,
                action,
                sourceService: callerService,
                sourceEventId: normalizedSourceEventId,
                metadata: metadata ?? {},
              },
            });
            const res = errorResponse('Conflict', 'externalId already exists with different payload', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const { balance } = await getUserBalance(db, userId);
          const res = json({ transactionId: existing2.id, applied: false, balance }, 200);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const res = json(
          {
            transactionId: row.transaction_id,
            applied: true,
            balance: Number(row.balance ?? 0),
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/internal/points/spendability-shadow/diagnostics') {
        if (!isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS)) {
          const res = errorResponse('SPENDABILITY_SHADOW_DIAGNOSTICS_DISABLED', 'Points spendability shadow diagnostics are disabled', requestId, 404);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }
        const res = json(getSpendabilityShadowDiagnosticsSnapshot());
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'POST' && path === '/internal/points/spend') {
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const userId = typeof body?.userId === 'string' ? body.userId.trim() : '';
        const amount = body?.amount;
        const action = typeof body?.action === 'string' ? body.action.trim() : '';
        const externalId = typeof body?.externalId === 'string' ? body.externalId.trim() : '';
        const sourceEventId = parseOptionalString(body?.sourceEventId);
        const metadata = parseJsonMetadata(body?.metadata);
        const correlationId = parseOptionalString(body?.correlationId);

        if (userId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing userId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof amount !== 'number' || !Number.isInteger(amount) || !Number.isFinite(amount) || amount < 1) {
          const res = errorResponse('BadRequest', 'Invalid amount', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (action.length === 0) {
          const res = errorResponse('BadRequest', 'Invalid action', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (externalId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing externalId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (body?.sourceEventId !== undefined && sourceEventId === undefined) {
          const res = errorResponse('BadRequest', 'Invalid sourceEventId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (body?.correlationId !== undefined && correlationId === undefined) {
          const res = errorResponse('BadRequest', 'Invalid correlationId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (body?.metadata !== undefined && (metadata === undefined || metadata === null)) {
          const res = errorResponse('BadRequest', 'Invalid metadata', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const callerService = auth.principal.service;
        const producerGate = evaluateProducerGate({
          action,
          operation: 'spend',
          sourceService: callerService,
          env,
        });
        if (!producerGate.ok) {
          logger.warn('Points spend producer rejected by Stage 11.2 allowlist', {
            action,
            producerClass: producerGate.classification,
            sourceService: callerService,
            reason: producerGate.error,
            requiredFlag: producerGate.requiredFlag,
            allowlistVersion: getProducerAllowlistVersion(),
          });
          const res = errorResponse(producerGate.error, producerGate.message, requestId, producerGate.status);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (!metadataIsWithinBounds(metadata)) {
          const res = errorResponse('BadRequest', 'Invalid metadata', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const spendAmount = amount;
        const ledgerAmount = -spendAmount;
        const normalizedSourceEventId = typeof sourceEventId === 'string' ? sourceEventId.trim() : null;
        const normalizedMetadata = {
          ...(metadata ?? {}),
          ...(correlationId ? { correlationId } : {}),
        };

        const existing = await getTransactionByExternalId(db, externalId);
        if (existing) {
          const decision = decideExternalIdIdempotency(
            {
              transactionId: existing.id,
              userId: existing.user_id,
              amount: existing.amount,
              action: existing.reason,
              sourceService: existing.source_service,
              sourceEventId: existing.source_event_id,
              metadata: existing.metadata,
            },
            {
              userId,
              amount: ledgerAmount,
              action,
              sourceService: callerService,
              sourceEventId: normalizedSourceEventId,
              metadata: normalizedMetadata,
            }
          );

          if (decision.kind === 'conflict') {
            logger.error('Spend idempotency conflict (integration error)', {
              externalId,
              existing: {
                userId: existing.user_id,
                amount: existing.amount,
                action: existing.reason,
                sourceService: existing.source_service,
                sourceEventId: existing.source_event_id,
                metadata: existing.metadata ?? {},
              },
              incoming: {
                userId,
                amount: ledgerAmount,
                action,
                sourceService: callerService,
                sourceEventId: normalizedSourceEventId,
                metadata: normalizedMetadata,
              },
            });
            const res = errorResponse(
              'REPLAY_PAYLOAD_MISMATCH',
              'externalId already exists with different payload',
              requestId,
              409
            );
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const { balance } = await getUserBalance(db, userId);
          const res = json(
            {
              transactionId: existing.id,
              applied: false,
              idempotentReplay: true,
              balanceAfter: balance,
            },
            200
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE)) {
          const shadowDedupeKey = createSpendabilityShadowDedupeKey({
            userId,
            externalId,
            action,
            amount: spendAmount,
          });
          try {
            const [{ balance: legacySpendable }, bucketRows] = await Promise.all([
              getUserBalance(db, userId),
              listWalletBucketTransactions(db, userId),
            ]);
            const targetBuckets = computeWalletBuckets(bucketRows);
            const decision = evaluateSpendabilityShadow({
              legacySpendable,
              targetAvailableSpendable: targetBuckets.availablePoints,
              amount: spendAmount,
              action,
              userId,
              externalId,
              correlationId: correlationId ?? null,
            });
            const observation = toSpendabilityShadowObservation({
              decision,
              action,
              amount: spendAmount,
              environment: getEnvName(env),
            });
            if (isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS)) {
              recordSpendabilityShadowObservation(observation, { dedupeKey: shadowDedupeKey });
            }
            if (isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT)) {
              exportSpendabilityShadowObservation({
                observation,
                dedupeKey: shadowDedupeKey,
                emit: (event) => logger.info('Points spendability durable export', { durableExport: event }),
              });
            }
          } catch {
            if (
              isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS) ||
              isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT)
            ) {
              const decision = evaluateSpendabilityShadow({
                legacySpendable: 0,
                targetAvailableSpendable: null,
                amount: spendAmount,
                action,
                userId,
                externalId,
                correlationId: correlationId ?? null,
                error: true,
              });
              const observation = toSpendabilityShadowObservation({
                decision,
                action,
                amount: spendAmount,
                environment: getEnvName(env),
              });
              if (isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS)) {
                recordSpendabilityShadowObservation(observation, { dedupeKey: shadowDedupeKey });
              }
              if (isFlagEnabled(env.POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT)) {
                exportSpendabilityShadowObservation({
                  observation,
                  dedupeKey: shadowDedupeKey,
                  emit: (event) => logger.info('Points spendability durable export', { durableExport: event }),
                });
              }
            }
          }
        }

        const txId = crypto.randomUUID();
        const applyRes = await db.execute(sql`
          WITH ins AS (
            INSERT INTO points_transactions (
              id,
              user_id,
              amount,
              reason,
              source_service,
              source_event_id,
              external_id,
              metadata
            )
            SELECT
              ${txId},
              ${userId},
              ${ledgerAmount},
              ${action},
              ${callerService},
              ${normalizedSourceEventId},
              ${externalId},
              ${JSON.stringify(normalizedMetadata)}::jsonb
            WHERE EXISTS (
              SELECT 1
              FROM user_balances ub
              WHERE ub.user_id = ${userId}
                AND ub.balance >= ${spendAmount}
              FOR UPDATE
            )
            ON CONFLICT (external_id) DO NOTHING
            RETURNING id
          ),
          up AS (
            UPDATE user_balances ub
            SET balance = ub.balance - ${spendAmount},
                updated_at = now()
            WHERE ub.user_id = ${userId}
              AND EXISTS (SELECT 1 FROM ins)
            RETURNING ub.balance
          )
          SELECT
            (SELECT id FROM ins) AS transaction_id,
            (SELECT balance FROM up) AS balance_after;
        `);

        const row = getRows<{ transaction_id: string | null; balance_after: number | null }>(applyRes)[0];
        if (!row?.transaction_id) {
          const existingAfterConflict = await getTransactionByExternalId(db, externalId);
          if (existingAfterConflict) {
            const decision = decideExternalIdIdempotency(
              {
                transactionId: existingAfterConflict.id,
                userId: existingAfterConflict.user_id,
                amount: existingAfterConflict.amount,
                action: existingAfterConflict.reason,
                sourceService: existingAfterConflict.source_service,
                sourceEventId: existingAfterConflict.source_event_id,
                metadata: existingAfterConflict.metadata,
              },
              {
                userId,
                amount: ledgerAmount,
                action,
                sourceService: callerService,
                sourceEventId: normalizedSourceEventId,
                metadata: normalizedMetadata,
              }
            );

            if (decision.kind === 'conflict') {
              const res = errorResponse(
                'REPLAY_PAYLOAD_MISMATCH',
                'externalId already exists with different payload',
                requestId,
                409
              );
              res.headers.set('X-Request-Id', requestId);
              return res;
            }

            const { balance } = await getUserBalance(db, userId);
            const res = json(
              {
                transactionId: existingAfterConflict.id,
                applied: false,
                idempotentReplay: true,
                balanceAfter: balance,
              },
              200
            );
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const res = errorResponse(
            'INSUFFICIENT_POINTS_BALANCE',
            'Insufficient available points balance for spend operation',
            requestId,
            409
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const res = json(
          {
            transactionId: row.transaction_id,
            applied: true,
            idempotentReplay: false,
            balanceAfter: Number(row.balance_after ?? 0),
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      logger.warn('Unhandled route', { method: request.method, path });
      const res = errorResponse('NotFound', `No route for path: ${path}`, requestId, 404);
      res.headers.set('X-Request-Id', requestId);
      return res;
      })();
      return response;
    } catch (err) {
      logger.error('Unhandled error', err, { method: request.method, path });
      response = errorResponse('InternalError', 'Unexpected error', requestId, 500);
      response.headers.set('X-Request-Id', requestId);
      return response;
    } finally {
      logRequestCompleted(logger, {
        method: request.method,
        path,
        status: response?.status ?? 500,
        durationMs: Date.now() - startedAt,
      });
    }
  },
};
