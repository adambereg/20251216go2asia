/**
 * Content Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Event registration (POST /v1/content/events/{id}/register)
 * - Integration with Points Service (event_registration)
 */

import type { ArticleRow, CityRow, CountryRow, EventRow, PlaceRow, SqlClient } from '@go2asia/db/queries/content';
import {
  createSqlClient,
  getArticleBySlug,
  getEventByIdOrSlug,
  getPlaceByIdOrSlug,
  listArticles,
  listCities,
  listCountries,
  listEvents,
  listPlaces,
} from '@go2asia/db/queries/content';
import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  // Service URLs
  POINTS_SERVICE_URL?: string;
  // Secrets
  SERVICE_JWT_SECRET?: string;
  // Database
  DATABASE_URL?: string;
  // Media / Storage (Milestone 2.2)
  MEDIA_UPLOAD_SIGNING_SECRET?: string;
  MEDIA_PUBLIC_BASE_URL?: string; // e.g. https://pub-<id>.r2.dev/go2asia-media (optional)
  MEDIA_MAX_BYTES?: string; // default: 10MB
  MEDIA_BUCKET?: R2Bucket;
  SPACE_MEDIA_BUCKET?: R2Bucket;
}

type ListResponse<T> = { items: T[] };

// Public DTOs (minimal & stable for PWA shell)
// Keep aligned with packages/sdk/src/content.ts where possible.
export interface ContentEventDto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface ContentCountryDto {
  id: string;
  slug: string;
  name: string;
  code: string;
  flag: string | null;
  description: string | null;
  heroImage: string | null;
  citiesCount: number;
  placesCount: number;
}

export interface ContentCityDto {
  id: string;
  slug: string;
  name: string;
  countryId: string;
  countryName: string | null;
  description: string | null;
  placesCount: number;
  latitude: string | null;
  longitude: string | null;
  heroImage: string | null;
}

export interface ContentPlaceDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  heroImage: string | null;
  photos: string[];
}

export interface ContentArticleDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  coverImage: string | null;
  publishedAt: string | null;
  status: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function parseIntOrDefault(raw: unknown, fallback: number): number {
  const n = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
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

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

type MediaScope = 'content' | 'space' | 'rf' | 'rielt' | 'quest' | 'avatar';
const MEDIA_SCOPES: ReadonlySet<MediaScope> = new Set(['content', 'space', 'rf', 'rielt', 'quest', 'avatar']);

type UploadTokenPayload = {
  v: 1;
  key: string;
  userId: string;
  scope: MediaScope;
  contentType: string;
  maxBytes: number;
  exp: number; // unix seconds
};

async function signUploadToken(secret: string, payload: UploadTokenPayload): Promise<string> {
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSha256(secret, payloadB64);
  const sigB64 = bytesToBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

async function verifyUploadToken(secret: string, token: string): Promise<
  | { ok: true; payload: UploadTokenPayload }
  | { ok: false; error: string }
> {
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, error: 'TOKEN_FORMAT' };
  const [payloadB64, sigB64] = parts;
  let payloadJson: unknown;
  try {
    payloadJson = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  } catch {
    return { ok: false, error: 'TOKEN_PAYLOAD' };
  }
  if (!payloadJson || typeof payloadJson !== 'object' || Array.isArray(payloadJson)) {
    return { ok: false, error: 'TOKEN_PAYLOAD' };
  }

  const p = payloadJson as Partial<UploadTokenPayload>;
  if (p.v !== 1) return { ok: false, error: 'TOKEN_VERSION' };
  if (typeof p.key !== 'string' || p.key.length < 3) return { ok: false, error: 'TOKEN_KEY' };
  if (typeof p.userId !== 'string' || p.userId.length < 3) return { ok: false, error: 'TOKEN_USER' };
  if (typeof p.scope !== 'string' || !MEDIA_SCOPES.has(p.scope as MediaScope)) return { ok: false, error: 'TOKEN_SCOPE' };
  if (typeof p.contentType !== 'string' || p.contentType.length < 3) return { ok: false, error: 'TOKEN_CONTENT_TYPE' };
  if (typeof p.maxBytes !== 'number' || !Number.isFinite(p.maxBytes) || p.maxBytes < 1) return { ok: false, error: 'TOKEN_MAX_BYTES' };
  if (typeof p.exp !== 'number' || !Number.isFinite(p.exp)) return { ok: false, error: 'TOKEN_EXP' };

  const expectedSig = await hmacSha256(secret, payloadB64);
  const gotSig = base64UrlToBytes(sigB64);
  if (!timingSafeEqual(expectedSig, gotSig)) return { ok: false, error: 'TOKEN_SIG' };

  const now = Math.floor(Date.now() / 1000);
  if (p.exp < now) return { ok: false, error: 'TOKEN_EXPIRED' };

  return { ok: true, payload: p as UploadTokenPayload };
}

function pickMediaBucket(env: Env, scope: MediaScope): R2Bucket | null {
  if (scope === 'space') return env.SPACE_MEDIA_BUCKET ?? env.MEDIA_BUCKET ?? null;
  return env.MEDIA_BUCKET ?? null;
}

function getPublicUrl(env: Env, key: string): string | null {
  const base = (env.MEDIA_PUBLIC_BASE_URL ?? '').trim();
  if (!base) return null;
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmed}/${key}`;
}

function sanitizeFilename(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9._-]+/g, '_');
  return cleaned.length > 0 ? cleaned.slice(0, 120) : 'file';
}

async function handleCreateMediaUploadToken(
  request: Request,
  env: Env,
  requestId: string
): Promise<Response> {
  const userId = request.headers.get('X-User-ID');
  if (!userId) return json({ error: { code: 'Unauthorized', message: 'Missing X-User-ID header' } }, 401);
  const secret = (env.MEDIA_UPLOAD_SIGNING_SECRET ?? '').trim();
  if (!secret) return json({ error: { code: 'ServiceNotConfigured', message: 'MEDIA_UPLOAD_SIGNING_SECRET is missing' } }, 503);

  const maxBytesDefault = parseIntOrDefault(env.MEDIA_MAX_BYTES, 10 * 1024 * 1024);

  const bodyUnknown: unknown = await request.json().catch(() => null);
  const body =
    bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
      ? (bodyUnknown as Record<string, unknown>)
      : null;

  const scopeRaw = body?.scope;
  const filenameRaw = body?.filename;
  const contentTypeRaw = body?.contentType;
  const sizeBytesRaw = body?.sizeBytes;

  const scope = (typeof scopeRaw === 'string' ? scopeRaw : 'content') as MediaScope;
  if (!MEDIA_SCOPES.has(scope)) return json({ error: { code: 'BadRequest', message: 'Invalid scope' } }, 400);
  const filename = sanitizeFilename(typeof filenameRaw === 'string' ? filenameRaw : 'file');
  const contentType = typeof contentTypeRaw === 'string' ? contentTypeRaw : 'application/octet-stream';
  const sizeBytes = typeof sizeBytesRaw === 'number' && Number.isFinite(sizeBytesRaw) ? sizeBytesRaw : null;
  if (sizeBytes !== null && (sizeBytes < 1 || sizeBytes > maxBytesDefault)) {
    return json({ error: { code: 'BadRequest', message: 'Invalid sizeBytes' } }, 400);
  }

  // Only allow images for Phase 2.2 (safe baseline).
  if (!contentType.startsWith('image/')) {
    return json({ error: { code: 'BadRequest', message: 'Only image/* uploads are allowed' } }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 10 * 60; // 10 minutes

  const ext = filename.includes('.') ? filename.split('.').pop() ?? 'bin' : 'bin';
  const objectKey = `uploads/${scope}/${userId}/${now}/${crypto.randomUUID()}.${ext}`;

  const payload: UploadTokenPayload = {
    v: 1,
    key: objectKey,
    userId,
    scope,
    contentType,
    maxBytes: maxBytesDefault,
    exp,
  };
  const token = await signUploadToken(secret, payload);

  return json(
    {
      uploadUrl: `/v1/content/media/upload/${token}`,
      key: objectKey,
      publicUrl: getPublicUrl(env, objectKey),
      expiresAt: new Date(exp * 1000).toISOString(),
      requestId,
    },
    200
  );
}

async function handleMediaUpload(
  request: Request,
  env: Env,
  token: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const secret = (env.MEDIA_UPLOAD_SIGNING_SECRET ?? '').trim();
  if (!secret) return json({ error: { code: 'ServiceNotConfigured', message: 'MEDIA_UPLOAD_SIGNING_SECRET is missing' } }, 503);

  const verified = await verifyUploadToken(secret, token);
  if (!verified.ok) return json({ error: { code: 'Unauthorized', message: 'Invalid or expired upload token' } }, 401);

  const { payload } = verified;
  const bucket = pickMediaBucket(env, payload.scope);
  if (!bucket) return json({ error: { code: 'ServiceNotConfigured', message: 'MEDIA_BUCKET binding is missing' } }, 503);

  const contentType = request.headers.get('Content-Type') ?? payload.contentType;
  if (!contentType.startsWith('image/')) {
    return json({ error: { code: 'BadRequest', message: 'Only image/* uploads are allowed' } }, 400);
  }

  // Read body and enforce size.
  const buf = await request.arrayBuffer().catch(() => null);
  if (!buf) return json({ error: { code: 'BadRequest', message: 'Missing body' } }, 400);
  const bytes = new Uint8Array(buf);
  if (bytes.byteLength < 1 || bytes.byteLength > payload.maxBytes) {
    return json({ error: { code: 'BadRequest', message: 'File too large' } }, 400);
  }

  try {
    await bucket.put(payload.key, bytes, {
      httpMetadata: { contentType },
      customMetadata: {
        userId: payload.userId,
        scope: payload.scope,
      },
    });
    logger.info('Media uploaded', { key: payload.key, scope: payload.scope, userId: payload.userId });
    return json(
      {
        ok: true,
        key: payload.key,
        publicUrl: getPublicUrl(env, payload.key),
        requestId,
      },
      201
    );
  } catch (error) {
    logger.error('R2 put failed', error, { key: payload.key });
    return json({ error: { code: 'InternalError', message: 'Upload failed' }, requestId }, 500);
  }
}

function handleHealth(env: Env): Response {
  return json({
    service: 'content-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleNotFound(path: string): Response {
  return json(
    {
      error: {
        code: 'NOT_FOUND',
        message: `No route for path: ${path}`,
      },
    },
    404
  );
}

function safeDbInfoFromUrl(databaseUrl: string): { host: string; db: string; protocol: string } {
  const u = new URL(databaseUrl);
  // Never return username/password.
  const db = u.pathname?.replace(/^\//, '') || '';
  return { host: u.host, db, protocol: u.protocol.replace(':', '') };
}

function getSqlClient(env: Env, logger: ReturnType<typeof createLogger>): SqlClient | null {
  if (!env.DATABASE_URL) {
    logger.warn('Database not configured');
    return null;
  }
  return createSqlClient(env.DATABASE_URL);
}

function toContentEvent(row: EventRow): ContentEventDto {
  const start = row.start_at ?? row.start_date;
  const end = row.end_at ?? row.end_date;
  const locationParts = [row.city_name, row.country_name].filter(Boolean).join(', ');
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    startDate: start,
    endDate: end,
    location: row.location ?? (locationParts.length > 0 ? locationParts : null),
    latitude: row.lat,
    longitude: row.lng,
    imageUrl: row.image_url,
    isActive: row.status === 'active',
  };
}

function toContentCountry(row: CountryRow): ContentCountryDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    code: row.code,
    flag: row.flag_emoji,
    description: row.description_short,
    heroImage: row.hero_url,
    citiesCount: row.cities_count,
    placesCount: row.places_count,
  };
}

function toContentCity(row: CityRow): ContentCityDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    countryId: row.country_id,
    countryName: row.country_name,
    description: row.description_short,
    placesCount: row.places_count,
    latitude: row.lat,
    longitude: row.lng,
    heroImage: row.hero_url,
  };
}

function toContentPlace(row: PlaceRow): ContentPlaceDto {
  let photos: string[] = [];
  if (row.images) {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) photos = parsed.filter((x) => typeof x === 'string');
    } catch {
      // ignore
    }
  }
  if (photos.length === 0 && row.hero_url) photos = [row.hero_url];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.type,
    description: row.description_short,
    country: row.country_name,
    city: row.city_name,
    address: row.address,
    latitude: row.lat,
    longitude: row.lng,
    heroImage: row.hero_url,
    photos,
  };
}

function toContentArticle(row: ArticleRow): ContentArticleDto {
  let tags: string[] | null = null;
  if (row.tags) {
    try {
      const parsed = JSON.parse(row.tags);
      if (Array.isArray(parsed)) tags = parsed.filter((x) => typeof x === 'string');
    } catch {
      tags = null;
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags,
    coverImage: row.cover_url,
    publishedAt: row.published_at,
    status: row.status,
  };
}

async function handleListEvents(
  env: Env,
  url: URL,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '50') || 50));
  try {
    const rows = await listEvents(sqlClient, limit);
    return json({ items: rows.map(toContentEvent) } satisfies ListResponse<ContentEventDto>, 200);
  } catch (error) {
    logger.error('List events error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch events' } }, 500);
  }
}

async function handleDebugDb(env: Env, logger: ReturnType<typeof createLogger>): Promise<Response> {
  if (!env.DATABASE_URL) {
    return json({ ok: false, error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  }

  const sqlClient = createSqlClient(env.DATABASE_URL);
  const info = safeDbInfoFromUrl(env.DATABASE_URL);

  try {
    const cu = await sqlClient`SELECT current_user`;
    const currentUser =
      String((cu as unknown as Array<{ current_user?: unknown }> | undefined)?.[0]?.current_user ?? '');

    const counts = await sqlClient`
      SELECT
        (SELECT COUNT(*)::int FROM countries) AS countries,
        (SELECT COUNT(*)::int FROM cities) AS cities,
        (SELECT COUNT(*)::int FROM places) AS places,
        (SELECT COUNT(*)::int FROM events) AS events,
        (SELECT COUNT(*)::int FROM articles) AS articles,
        (SELECT COUNT(*)::int FROM media_files) AS media_files
    `;

    const topEvent = await sqlClient`
      SELECT id, slug
      FROM events
      ORDER BY COALESCE(start_at, start_date) ASC
      LIMIT 1
    `;

    const topArticle = await sqlClient`
      SELECT slug
      FROM articles
      ORDER BY published_at DESC NULLS LAST
      LIMIT 1
    `;

    type CountsRow = {
      countries?: number;
      cities?: number;
      places?: number;
      events?: number;
      articles?: number;
      media_files?: number;
    };
    type TopEventRow = { id: string; slug: string };
    type TopArticleRow = { slug: string };

    return json(
      {
        ok: true,
        db: {
          host: info.host,
          name: info.db,
          protocol: info.protocol,
          current_user: currentUser,
        },
        counts: (counts as unknown as CountsRow[] | undefined)?.[0] ?? {},
        examples: {
          top_event: (topEvent as unknown as TopEventRow[] | undefined)?.[0] ?? null,
          top_article: (topArticle as unknown as TopArticleRow[] | undefined)?.[0] ?? null,
        },
      },
      200
    );
  } catch (error) {
    logger.error('Debug DB error', error);
    return json({ ok: false, error: { code: 'InternalError', message: 'Failed to query database' } }, 500);
  }
}

async function handleGetEventById(
  env: Env,
  eventId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) {
    return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  }

  try {
    const row = await getEventByIdOrSlug(sqlClient, eventId);
    if (!row) return json({ error: { code: 'NotFound', message: 'Event not found' } }, 404);
    return json(toContentEvent(row), 200);
  } catch (error) {
    logger.error('Get event by id error', error, { eventId });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch event' } }, 500);
  }
}

async function handleListCountries(env: Env, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const rows = await listCountries(sqlClient);
    return json({ items: rows.map(toContentCountry) } satisfies ListResponse<ContentCountryDto>, 200);
  } catch (error) {
    logger.error('List countries error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch countries' } }, 500);
  }
}

async function handleListCities(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const countryId = url.searchParams.get('countryId') ?? undefined;
  try {
    const rows = await listCities(sqlClient, countryId);
    return json({ items: rows.map(toContentCity) } satisfies ListResponse<ContentCityDto>, 200);
  } catch (error) {
    logger.error('List cities error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch cities' } }, 500);
  }
}

async function handleListPlaces(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const cityId = url.searchParams.get('cityId') ?? undefined;
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') ?? '100') || 100));
  try {
    const rows = await listPlaces(sqlClient, cityId, limit);
    return json({ items: rows.map(toContentPlace) } satisfies ListResponse<ContentPlaceDto>, 200);
  } catch (error) {
    logger.error('List places error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch places' } }, 500);
  }
}

async function handleGetPlaceById(env: Env, idOrSlug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const row = await getPlaceByIdOrSlug(sqlClient, idOrSlug);
    if (!row) return json({ error: { code: 'NotFound', message: 'Place not found' } }, 404);
    return json(toContentPlace(row), 200);
  } catch (error) {
    logger.error('Get place error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch place' } }, 500);
  }
}

async function handleListArticles(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '50') || 50));
  try {
    const rows = await listArticles(sqlClient, limit);
    return json({ items: rows.map(toContentArticle) } satisfies ListResponse<ContentArticleDto>, 200);
  } catch (error) {
    logger.error('List articles error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch articles' } }, 500);
  }
}

async function handleGetArticleBySlug(env: Env, slug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const row = await getArticleBySlug(sqlClient, slug);
    if (!row) return json({ error: { code: 'NotFound', message: 'Article not found' } }, 404);
    return json(toContentArticle(row), 200);
  } catch (error) {
    logger.error('Get article error', error, { slug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch article' } }, 500);
  }
}

// JWT utilities (for service-to-service auth)

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

async function signHs256Jwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(header)));
  const payloadB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(payload)));
  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);

  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  const sigB64 = bytesToBase64Url(sig);
  return `${headerB64}.${payloadB64}.${sigB64}`;
}

async function createServiceJwt(env: Env, targetService: string, requestId: string): Promise<string | null> {
  if (!env.SERVICE_JWT_SECRET) return null;
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      iss: 'go2asia-service-auth',
      aud: targetService,
      sub: 'content-service',
      iat: now,
      exp: now + 300, // 5 minutes
      rid: requestId,
    },
    env.SERVICE_JWT_SECRET
  );
}

async function callPointsService(
  env: Env,
  userId: string,
  amount: number,
  action: string,
  externalId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: boolean; error?: string }> {
  if (!env.POINTS_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    logger.warn('Points Service integration not configured', { userId, action });
    return { ok: false, error: 'Points Service not configured' };
  }

  const token = await createServiceJwt(env, 'points-service', requestId);
  if (!token) {
    logger.error('Failed to create service JWT for Points Service');
    return { ok: false, error: 'Service auth failed' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

  try {
    const response = await fetch(`${env.POINTS_SERVICE_URL}/internal/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({
        userId,
        amount,
        action,
        externalId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('Points Service call failed', {
        userId,
        action,
        status: response.status,
        body: text,
      });
      return { ok: false, error: `Points Service returned ${response.status}` };
    }

    logger.info('Points Service call succeeded', { userId, action, amount });
    return { ok: true };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('Points Service call timed out', { userId, action });
      return { ok: false, error: 'Timeout' };
    }
    logger.error('Points Service call error', error, { userId, action });
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function handleEventRegistration(
  request: Request,
  env: Env,
  eventId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  // Extract user ID from gateway header
  const userId = request.headers.get('X-User-ID');
  if (!userId) {
    return json({ error: { code: 'Unauthorized', message: 'Missing X-User-ID header' } }, 401);
  }

  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) {
    // Graceful degradation: points only
    const pointsResult = await callPointsService(
      env,
      userId,
      20,
      'event_registration',
      `content:event_registration:${eventId}:${userId}:${Date.now()}`,
      requestId,
      logger
    );
    if (!pointsResult.ok) {
      logger.warn('Event registration points failed', { userId, eventId, error: pointsResult.error });
    }
    return json(
      { ok: true, eventId, userId, note: 'Points awarded, registration not persisted (DB not configured)' },
      201
    );
  }

  try {
    const registrationId = crypto.randomUUID();
    const inserted = await sqlClient`
      INSERT INTO event_registrations (id, user_id, event_id, registered_at)
      VALUES (${registrationId}, ${userId}, ${eventId}, NOW())
      ON CONFLICT (user_id, event_id) DO NOTHING
      RETURNING id
    `;

    const insertedId = (inserted as unknown as Array<{ id?: unknown }> | undefined)?.[0]?.id;
    const insertedIdStr = typeof insertedId === 'string' ? insertedId : undefined;
    if (!insertedIdStr) {
      return json({ error: { code: 'Conflict', message: 'Already registered' } }, 409);
    }

    logger.info('Event registration created', { userId, eventId, registrationId: insertedIdStr });

    const pointsResult = await callPointsService(
      env,
      userId,
      20,
      'event_registration',
      `content:event_registration:${registrationId}`,
      requestId,
      logger
    );
    if (!pointsResult.ok) {
      logger.warn('Event registration points failed (non-blocking)', { userId, eventId, error: pointsResult.error });
    }

    return json({ ok: true, registrationId, eventId, userId }, 201);
  } catch (error) {
    logger.error('Event registration error', error, { userId, eventId });
    return json({ error: { code: 'InternalError', message: 'Registration failed' } }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'content-service');

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health' || path === '/version') {
      const res = handleHealth(env);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Debug: DB connectivity and counts (no secrets)
    if (path === '/v1/content/_debug/db' && request.method === 'GET') {
      const res = await handleDebugDb(env, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Media / Storage (Milestone 2.2)
    if (path === '/v1/content/media/upload-token' && request.method === 'POST') {
      const res = await handleCreateMediaUploadToken(request, env, requestId);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const mediaUploadMatch = path.match(/^\/v1\/content\/media\/upload\/(.+)$/);
    if (mediaUploadMatch && request.method === 'PUT') {
      const token = mediaUploadMatch[1];
      const res = await handleMediaUpload(request, env, token, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Public: list events
    if (path === '/v1/content/events' && request.method === 'GET') {
      const res = await handleListEvents(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Public: fetch event details
    const eventGetMatch = path.match(/^\/v1\/content\/events\/([^/]+)$/);
    if (eventGetMatch && request.method === 'GET') {
      const eventId = eventGetMatch[1];
      const res = await handleGetEventById(env, eventId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Public: Atlas countries/cities/places
    if (path === '/v1/content/countries' && request.method === 'GET') {
      const res = await handleListCountries(env, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    if (path === '/v1/content/cities' && request.method === 'GET') {
      const res = await handleListCities(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    if (path === '/v1/content/places' && request.method === 'GET') {
      const res = await handleListPlaces(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const placeGetMatch = path.match(/^\/v1\/content\/places\/([^/]+)$/);
    if (placeGetMatch && request.method === 'GET') {
      const placeId = placeGetMatch[1];
      const res = await handleGetPlaceById(env, placeId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Public: Blog articles
    if (path === '/v1/content/articles' && request.method === 'GET') {
      const res = await handleListArticles(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const articleGetMatch = path.match(/^\/v1\/content\/articles\/([^/]+)$/);
    if (articleGetMatch && request.method === 'GET') {
      const slug = articleGetMatch[1];
      const res = await handleGetArticleBySlug(env, slug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Event registration endpoint
    const eventRegMatch = path.match(/^\/v1\/content\/events\/([^/]+)\/register$/);
    if (eventRegMatch && request.method === 'POST') {
      const eventId = eventRegMatch[1];
      const res = await handleEventRegistration(request, env, eventId, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    logger.warn('Unhandled route', { method: request.method, path });
    const res = handleNotFound(path);
    res.headers.set('X-Request-ID', requestId);
    return res;
  },
};




