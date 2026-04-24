/**
 * Content Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Event registration (POST /v1/content/events/{id}/register)
 * - Integration with Points Service (event_registration)
 */

import type { BlogPostListRow, BlogPostSort, ListBlogPostsParams } from '@go2asia/db/queries/blog';
import { getBlogPostBySlug as getBlogPostBySlugSql, listBlogPosts as listBlogPostsSql } from '@go2asia/db/queries/blog';
import type {
  ArticleRow,
  CityRow,
  CityDistrictRow,
  ContentBlockRow,
  CountryRow,
  EventRow,
  PlaceRow,
  PlaceContainerRow,
  SqlClient,
} from '@go2asia/db/queries/content';
import {
  createSqlClient,
  getArticleBySlug,
  getCityDistrictIdByIdOrSlug,
  getEventByIdOrSlug,
  getCityByIdOrSlug,
  getCityIdByIdOrSlug,
  getCountryIdByIdOrSlug,
  getPlaceByIdOrSlug,
  getPlaceIdByIdOrSlug,
  listContentBlocks,
  listArticles,
  listCityDistricts,
  listCities,
  listCountries,
  listEvents,
  listPlaceContainers,
  listPlaces,
} from '@go2asia/db/queries/content';
import type { GuideBlockRow, GuideFeedRow, GuideRow, GuideSectionRow } from '@go2asia/db/queries/guides';
import {
  countGuides,
  getGuideBySlug,
  listArticlesForGuideFeed,
  listEventsForGuideFeed,
  listGuideBlocks,
  listGuideFeeds,
  listGuideSections,
  listGuides,
  listPlacesForGuideFeed,
} from '@go2asia/db/queries/guides';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  // Optional: protect debug endpoints on staging/dev
  DEBUG_ENDPOINTS_TOKEN?: string;
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

type GatewayPrincipal = {
  userId: string;
  roles: string[];
};

type ListResponse<T> = { items: T[]; total?: number; limit?: number; offset?: number };

function isDebugAllowed(request: Request, env: Env): boolean {
  const envName = (env.ENVIRONMENT ?? '').toLowerCase();
  // Never expose debug endpoints in production.
  if (envName === 'production') return false;

  const token = typeof env.DEBUG_ENDPOINTS_TOKEN === 'string' ? env.DEBUG_ENDPOINTS_TOKEN.trim() : '';
  if (!token) return true; // staging/dev open unless token configured

  const provided = request.headers.get('x-go2asia-debug-token')?.trim() ?? '';
  return provided.length > 0 && provided === token;
}

// Public DTOs (minimal & stable for PWA shell)
// Keep aligned with packages/sdk/src/content.ts where possible.
export interface ContentEventDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bodyMarkdown: string;
  category: string | null;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  countryId: string | null;
  cityId: string | null;
  countrySlug: string | null;
  citySlug: string | null;
  countryName: string | null;
  cityName: string | null;
  geoScope: string | null;
  primaryType: string | null;
  secondaryType: string | null;
  year: number | null;
  heroMediaKey: string | null; // R2 object key (relative path)
  galleryMediaKeys: string[]; // R2 object keys (never JSON string)
  isActive: boolean;
  isFree: boolean;
  priceAmount: string | null;
  priceCurrency: string | null;
  isVerified: boolean;
  officialUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
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

export type ContentGalleryItemDto = {
  key: string;
  url: string;
  isCover: boolean;
};

export type ContentCountryGalleryDto = {
  countryId: string;
  prefix: string;
  items: ContentGalleryItemDto[];
};

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

export interface ContentCityDistrictDto {
  id: string;
  countryId: string;
  cityId: string;
  slug: string;
  name: string;
  nameLocal: string | null;
  descriptionShort: string | null;
  bodyMarkdown: string | null;
  sortOrder: number;
  isPublished: boolean;
  latitude: string | null;
  longitude: string | null;
}

export interface ContentPlaceContainerDto {
  id: string;
  countryId: string;
  cityId: string;
  districtId: string;
  districtSlug: string | null;
  districtName: string | null;
  slug: string;
  name: string;
  containerType: string;
  descriptionShort: string | null;
  latitude: string | null;
  longitude: string | null;
  isPublished: boolean;
}

export interface ContentPlaceDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  kind: string;
  category: string | null;
  tags: string[] | null;
  website: string | null;
  phone: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  priceLevel: string | null;
  countryId: string | null;
  cityId: string | null;
  districtId: string | null;
  districtSlug: string | null;
  districtName: string | null;
  containerId: string | null;
  containerSlug: string | null;
  containerName: string | null;
  containerType: string | null;
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

// ---------------------------------------------------------------------
// Blog Asia DTOs (public)
// ---------------------------------------------------------------------

export interface ContentBlogAuthorDto {
  slug: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ContentBlogPostCardDto {
  id: string;
  slug: string;
  lang: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  postType: string | null;
  category: string | null;
  countrySlug: string | null;
  citySlug: string | null;
  tags: string[];
  heroUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTimeMinutes: number | null;
  isPromoted: boolean;
  isFeatured: boolean;
  isEditorPick: boolean;
  author: ContentBlogAuthorDto | null;
}

export interface ContentBlogPostDetailDto extends ContentBlogPostCardDto {
  contentMarkdown: string;
}

export type CursorListResponse<T> = { items: T[]; nextCursor: string | null };

export interface ContentTabDto {
  tabKey: string;
  lang: string;
  title: string | null;
  bodyMarkdown: string;
  updatedAt: string | null;
}

// ---------------------------------------------------------------------
// Guide Engine v1 DTOs (public)
// ---------------------------------------------------------------------

export type GuideTabKey =
  | 'overview'
  | 'compare'
  | 'locations'
  | 'route'
  | 'map'
  | 'practice'
  | 'events'
  | 'places'
  | 'audience'
  | 'faq'
  | 'experience';

export type GuideFeedSource = 'pulse' | 'atlas_places' | 'blog';

export interface ContentGuideCardDto {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroUrl: string | null;
  guideType: string;
  status: string;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface ContentGuideBlockDto {
  id: string;
  blockType: string;
  orderIndex: number;
  payload: Record<string, unknown>;
  isEmpty: boolean;
}

export interface ContentGuideFeedDto {
  id: string;
  source: GuideFeedSource;
  filter: Record<string, unknown>;
  limitCount: number;
  sort: string;
  orderIndex: number;
}

export interface ContentGuideSectionDto {
  id: string;
  tabKey: GuideTabKey;
  title: string | null;
  orderIndex: number;
  blocks: ContentGuideBlockDto[];
  feeds: ContentGuideFeedDto[];
  feedsResolved: ContentGuideFeedResolvedItemDto[];
}

export type ContentGuideFeedResolvedKind = 'event' | 'place' | 'article';

export interface ContentGuideFeedResolvedItemDto {
  kind: ContentGuideFeedResolvedKind;
  id: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  href: string;
  meta: Record<string, unknown> | null;
}

export interface ContentGuideDetailDto {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroUrl: string | null;
  guideType: string;
  status: string;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sections: ContentGuideSectionDto[];
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

function parseJsonObject(input: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(input);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

type BlogPostsCursorV1 = {
  v: 1;
  sort: BlogPostSort;
  publishedAt: string;
  id: string;
  popularityScore?: string;
  featuredRank?: number;
};

function encodeBlogCursor(cursor: BlogPostsCursorV1): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(cursor)));
}

function decodeBlogCursor(raw: string | null): BlogPostsCursorV1 | null {
  const v = (raw ?? '').trim();
  if (!v) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(v))) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const json = parsed as Record<string, unknown>;
    if (json.v !== 1) return null;
    if (json.sort !== 'newest' && json.sort !== 'popular' && json.sort !== 'featured') return null;
    if (typeof json.publishedAt !== 'string' || json.publishedAt.length < 10) return null;
    if (typeof json.id !== 'string' || json.id.length < 3) return null;
    if (json.popularityScore !== undefined && typeof json.popularityScore !== 'string') return null;
    if (json.featuredRank !== undefined && typeof json.featuredRank !== 'number') return null;
    return json as BlogPostsCursorV1;
  } catch {
    return null;
  }
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

function getMediaBaseUrl(env: Env): string {
  const base = (env.MEDIA_PUBLIC_BASE_URL ?? 'https://media.go2asia.space').trim();
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function getPublicUrl(env: Env, key: string): string | null {
  const base = getMediaBaseUrl(env);
  if (!base) return null;
  return `${base}/${key}`;
}

type AtlasMediaKind = 'country' | 'city' | 'place';

type CachedMedia = { urls: string[]; keys: string[]; expMs: number };
const atlasMediaCache = new Map<string, CachedMedia>();

function isImageKey(key: string): boolean {
  return /\.(jpe?g|png|webp)$/i.test(key);
}

function filenameFromKey(key: string): string {
  const parts = key.split('/');
  return parts[parts.length - 1] ?? key;
}

function isCoverFilename(filename: string): boolean {
  return /^01_/i.test(filename.trim());
}

function sortCountryGalleryKeys(aKey: string, bKey: string): number {
  const aName = filenameFromKey(aKey);
  const bName = filenameFromKey(bKey);
  const aCover = isCoverFilename(aName);
  const bCover = isCoverFilename(bName);
  if (aCover !== bCover) return aCover ? -1 : 1;
  return aName.localeCompare(bName, 'en');
}

async function listR2UrlsByPrefix(env: Env, prefix: string, limit: number): Promise<{ keys: string[]; urls: string[] }> {
  const bucket = env.MEDIA_BUCKET;
  const base = getMediaBaseUrl(env);
  if (!bucket || !base) return { keys: [], urls: [] };

  const res = await bucket.list({ prefix, limit });
  const keys = (res.objects ?? [])
    .map((o) => o.key)
    .filter((k) => typeof k === 'string' && k.length > 0)
    .filter((k) => isImageKey(k))
    .sort();
  const urls = keys.map((k) => getPublicUrl(env, k)).filter((u): u is string => typeof u === 'string' && u.length > 0);
  return { keys, urls };
}

async function resolveAtlasMedia(env: Env, kind: AtlasMediaKind, opts: { code?: string; slug: string; max: number }): Promise<{
  keys: string[];
  urls: string[];
}> {
  const base = getMediaBaseUrl(env);
  if (!base) return { keys: [], urls: [] };

  const cacheKey = `${kind}:${opts.code ?? ''}:${opts.slug}:${opts.max}`;
  const now = Date.now();
  const cached = atlasMediaCache.get(cacheKey);
  if (cached && cached.expMs > now) return { keys: cached.keys, urls: cached.urls };

  const slug = opts.slug.trim();
  const code = (opts.code ?? '').trim().toLowerCase();

  // Heuristics aligned with existing bucket structure:
  // - country/: observed prefix looks like country/country-vn/
  // - city/: unknown; try both city/<slug>/ and city/city-<slug>/
  // - place/: unknown; try both place/<slug>/ and place/place-<slug>/
  const prefixes: string[] =
    kind === 'country'
      ? [
          code ? `country/country-${code}/` : '',
          slug ? `country/${slug}/` : '',
          slug ? `country/country-${slug}/` : '',
        ].filter(Boolean)
      : kind === 'city'
        ? [slug ? `city/${slug}/` : '', slug ? `city/city-${slug}/` : ''].filter(Boolean)
        : [slug ? `place/${slug}/` : '', slug ? `place/place-${slug}/` : ''].filter(Boolean);

  for (const prefix of prefixes) {
    const found = await listR2UrlsByPrefix(env, prefix, opts.max);
    if (found.urls.length > 0) {
      atlasMediaCache.set(cacheKey, { keys: found.keys, urls: found.urls, expMs: now + 10 * 60 * 1000 });
      return found;
    }
  }

  atlasMediaCache.set(cacheKey, { keys: [], urls: [], expMs: now + 5 * 60 * 1000 });
  return { keys: [], urls: [] };
}

function pickCountryHeroUrl(keys: string[], urls: string[]): string | null {
  const keyToUrl = new Map<string, string>();
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const u = urls[i];
    if (typeof k === 'string' && k.length > 0 && typeof u === 'string' && u.length > 0) keyToUrl.set(k, u);
  }
  const imageKeys = keys.filter((k) => isImageKey(k));
  if (imageKeys.length === 0) return null;
  const sorted = [...imageKeys].sort(sortCountryGalleryKeys);
  const coverKey = sorted.find((k) => isCoverFilename(filenameFromKey(k))) ?? sorted[0]!;
  return keyToUrl.get(coverKey) ?? null;
}

function pickCityHeroUrl(keys: string[], urls: string[]): string | null {
  const keyToUrl = new Map<string, string>();
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const u = urls[i];
    if (typeof k === 'string' && k.length > 0 && typeof u === 'string' && u.length > 0) keyToUrl.set(k, u);
  }

  // Prefer explicit hero.jpg override
  const heroKey = keys.find((k) => /\/hero\.jpg$/i.test(k)) ?? null;
  if (heroKey) return keyToUrl.get(heroKey) ?? null;

  // Default cover: 01.(jpg|jpeg|png|webp)
  const coverKey =
    keys.find((k) => /\/01\.(jpe?g|png|webp)$/i.test(k)) ??
    keys.find((k) => isImageKey(k)) ??
    null;

  return coverKey ? keyToUrl.get(coverKey) ?? null : null;
}

function sanitizeFilename(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9._-]+/g, '_');
  return cleaned.length > 0 ? cleaned.slice(0, 120) : 'file';
}

async function handleCreateMediaUploadToken(
  request: Request,
  env: Env,
  requestId: string,
  userId: string
): Promise<Response> {
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

function getCheck(value: unknown): 'ok' | 'missing' {
  if (typeof value === 'string') return value.trim().length > 0 ? 'ok' : 'missing';
  return value ? 'ok' : 'missing';
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
      service: 'content-service',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
      optional: {
        mediaUploadSigningSecret: getCheck(env.MEDIA_UPLOAD_SIGNING_SECRET),
        mediaBucket: getCheck(env.MEDIA_BUCKET ?? env.SPACE_MEDIA_BUCKET),
      },
    },
    status
  );
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
  const heroMediaKey = pickString(row.hero_media_key);
  const galleryFromDb = pickStringArray(row.gallery_media_keys);
  const prefixRaw = pickString(row.media_prefix);
  const prefix = prefixRaw ? (prefixRaw.endsWith('/') ? prefixRaw : `${prefixRaw}/`) : null;
  const fallbackGallery = prefix ? ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map((f) => `${prefix}${f}`) : [];
  const galleryMediaKeys = galleryFromDb.length > 0 ? galleryFromDb : fallbackGallery;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description ?? null,
    bodyMarkdown: row.description ?? '',
    category: row.category,
    startDate: start,
    endDate: end,
    location: row.location ?? (locationParts.length > 0 ? locationParts : null),
    latitude: row.lat,
    longitude: row.lng,
    countryId: row.country_id ?? null,
    cityId: row.city_id ?? null,
    countrySlug: row.country_slug ?? null,
    citySlug: row.city_slug ?? null,
    countryName: row.country_name ?? null,
    cityName: row.city_name ?? null,
    geoScope: row.geo_scope ?? null,
    primaryType: row.primary_type ?? null,
    secondaryType: row.secondary_type ?? null,
    year: row.year ?? null,
    heroMediaKey,
    galleryMediaKeys,
    isActive: Boolean(row.is_active),
    isFree: Boolean(row.is_free),
    priceAmount: row.price_amount ?? null,
    priceCurrency: row.price_currency ?? null,
    isVerified: Boolean(row.is_verified),
    officialUrl: row.official_url ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
  };
}

function toGuideCard(row: GuideRow): ContentGuideCardDto {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    heroUrl: row.hero_url,
    guideType: row.guide_type,
    status: row.status,
    tags: Array.isArray(row.tags) ? row.tags : [],
    countryIds: Array.isArray(row.country_ids) ? row.country_ids : [],
    cityIds: Array.isArray(row.city_ids) ? row.city_ids : [],
    publishedAt: row.published_at ?? null,
    updatedAt: row.updated_at,
  };
}

function resolveGuideHeroUrl(env: Env, row: Pick<GuideRow, 'hero_url' | 'hero_r2_key'>): string | null {
  // Prefer SSOT for guide media: R2 key from guide frontmatter/import.
  const r2Key = typeof row.hero_r2_key === 'string' && row.hero_r2_key.trim().length > 0 ? row.hero_r2_key.trim() : null;
  const fromR2 = r2Key ? getPublicUrl(env, r2Key) : null;
  if (fromR2) return fromR2;

  const url = typeof row.hero_url === 'string' && row.hero_url.trim().length > 0 ? row.hero_url.trim() : null;
  if (!url) return null;
  // Do not surface stock placeholders as "real" media.
  return isPlaceholderHeroUrl(url) ? null : url;
}

function toGuideBlock(row: GuideBlockRow): ContentGuideBlockDto {
  const payload =
    row.payload && typeof row.payload === 'object' && !Array.isArray(row.payload)
      ? (row.payload as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    blockType: row.block_type,
    orderIndex: row.order_index,
    payload,
    isEmpty: Boolean(row.is_empty),
  };
}

function toGuideFeed(row: GuideFeedRow): ContentGuideFeedDto {
  const filter =
    row.filter && typeof row.filter === 'object' && !Array.isArray(row.filter)
      ? (row.filter as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    source: row.source as GuideFeedSource,
    filter,
    limitCount: row.limit_count,
    sort: row.sort,
    orderIndex: row.order_index,
  };
}

function toGuideSection(
  row: GuideSectionRow,
  blocksBySectionId: Map<string, ContentGuideBlockDto[]>,
  feedsByTabKey: Map<string, ContentGuideFeedDto[]>,
  feedsResolvedByTabKey: Map<string, ContentGuideFeedResolvedItemDto[]>
): ContentGuideSectionDto {
  const tabKey = row.tab_key as GuideTabKey;
  return {
    id: row.id,
    tabKey,
    title: row.title,
    orderIndex: row.order_index,
    blocks: blocksBySectionId.get(row.id) ?? [],
    feeds: feedsByTabKey.get(tabKey) ?? [],
    feedsResolved: feedsResolvedByTabKey.get(tabKey) ?? [],
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

function toContentCityDistrict(row: CityDistrictRow): ContentCityDistrictDto {
  return {
    id: row.id,
    countryId: row.country_id,
    cityId: row.city_id,
    slug: row.slug,
    name: row.name,
    nameLocal: row.name_local,
    descriptionShort: row.description_short,
    bodyMarkdown: row.body_markdown,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    latitude: row.lat,
    longitude: row.lng,
  };
}

function toContentPlaceContainer(row: PlaceContainerRow): ContentPlaceContainerDto {
  return {
    id: row.id,
    countryId: row.country_id,
    cityId: row.city_id,
    districtId: row.district_id,
    districtSlug: row.district_slug,
    districtName: row.district_name,
    slug: row.slug,
    name: row.name,
    containerType: row.container_type,
    descriptionShort: row.description_short,
    latitude: row.lat,
    longitude: row.lng,
    isPublished: row.is_published,
  };
}

function toContentPlace(row: PlaceRow): ContentPlaceDto {
  let photos: string[] = [];
  let tags: string[] | null = null;
  if (row.images) {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) photos = parsed.filter((x) => typeof x === 'string');
    } catch {
      // ignore
    }
  }
  if (row.tags) {
    try {
      const parsed = JSON.parse(row.tags);
      if (Array.isArray(parsed)) tags = parsed.filter((x) => typeof x === 'string');
    } catch {
      tags = null;
    }
  }
  if (photos.length === 0 && row.hero_url) photos = [row.hero_url];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.type,
    kind: row.place_kind,
    category: row.category,
    tags,
    website: row.website,
    phone: row.phone,
    instagram: row.instagram,
    googleMapsUrl: row.google_maps_url,
    priceLevel: row.price_level,
    countryId: row.country_id,
    cityId: row.city_id,
    districtId: row.district_id,
    districtSlug: row.district_slug,
    districtName: row.district_name,
    containerId: row.container_id,
    containerSlug: row.container_slug,
    containerName: row.container_name,
    containerType: row.container_type,
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

/** Detect placeholder hero URLs (stock photos used as defaults, not real editorial overrides). */
function isPlaceholderHeroUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  // Pexels stock photos are placeholders, not real editorial overrides
  return /pexels\.com/i.test(url) || /unsplash\.com\/photos/i.test(url);
}

async function toContentCountryWithMedia(env: Env, row: CountryRow): Promise<ContentCountryDto> {
  // If DB has a real (non-placeholder) hero — use it (editorial override takes priority).
  if (row.hero_url && !isPlaceholderHeroUrl(row.hero_url)) return toContentCountry(row);
  // R2 fallback for countries: prefer cover starting with "01_" in country/country-<country_id>/.
  const resolved = await resolveAtlasMedia(env, 'country', { code: row.id, slug: row.slug, max: 50 });
  const r2Hero = pickCountryHeroUrl(resolved.keys, resolved.urls);
  // If R2 has a cover — use it; otherwise do NOT fall back to placeholder stock URLs (Pexels/Unsplash).
  // Better to return null and let UI show an empty placeholder.
  const dbHero = row.hero_url && !isPlaceholderHeroUrl(row.hero_url) ? row.hero_url : null;
  return { ...toContentCountry(row), heroImage: r2Hero ?? dbHero ?? null };
}

async function toContentCityWithMedia(env: Env, row: CityRow): Promise<ContentCityDto> {
  // Cities: SSOT for hero image is R2 under city/<seo-slug>/hero.jpg or city/<seo-slug>/01.jpg.
  // Do NOT fall back to media_files.public_url (often contains Pexels demo URLs).
  const resolved = await resolveAtlasMedia(env, 'city', { slug: row.slug, max: 50 });
  const hero = pickCityHeroUrl(resolved.keys, resolved.urls);
  return { ...toContentCity(row), heroImage: hero ?? null };
}

function pickPlaceHeroAndPhotos(keys: string[], urls: string[]): { heroImage: string | null; photos: string[] } {
  // R2 structure (current contract):
  // place/{place_id}/hero.jpg OR place/{place_id}/01.jpg ... 05.jpg
  const keyToUrl = new Map<string, string>();
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const u = urls[i];
    if (typeof k === 'string' && k.length > 0 && typeof u === 'string' && u.length > 0) {
      keyToUrl.set(k, u);
    }
  }

  // Prefer hero.jpg if present
  const heroKey = keys.find((k) => /\/hero\.jpg$/i.test(k)) ?? null;
  const heroImage = heroKey ? keyToUrl.get(heroKey) ?? null : null;

  // Photos: 01..05 in order (only those that exist)
  const photos: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const num = String(i).padStart(2, '0');
    const k = keys.find((x) => new RegExp(`/${num}\\.jpg$`, 'i').test(x));
    if (k) {
      const u = keyToUrl.get(k);
      if (u) photos.push(u);
    }
  }

  // If none found by 01..05, fall back to all jpg urls (sorted by key)
  if (photos.length === 0) {
    for (const k of keys) {
      if (/\.jpg$/i.test(k)) {
        const u = keyToUrl.get(k);
        if (u) photos.push(u);
      }
    }
  }

  // If no explicit hero.jpg, hero falls back to 01.jpg (or first photo)
  const heroFallback = photos[0] ?? null;
  return { heroImage: heroImage ?? heroFallback, photos };
}

async function toContentPlaceWithMedia(env: Env, row: PlaceRow): Promise<ContentPlaceDto> {
  const base = toContentPlace(row);
  // If DB has explicit gallery urls (images json), trust DB (no R2 listing).
  // If DB only has hero_url (and no images), we still want R2 gallery photos.
  if (row.images) return base;

  // R2 fallback for places (works for all countries: PH, KH, VN, TH, LA, MY, ID, SG, ...):
  // prefix: place/{place_id}/ where place_id == places.id
  // Example: place/hue-imperial-city-hue/01.jpg (VN), place/rep-angkor-wat/01.jpg (KH), place/bkk-grand-palace/01.jpg (TH), place/vte-pha-that-luang/01.jpg (LA), place/kll-petronas-twin-towers/01.jpg (MY), place/bali-tanah-lot-temple/01.jpg (ID), place/sgp-marina-bay-sands-skypark/01.jpg (SG)
  const resolved = await resolveAtlasMedia(env, 'place', { slug: row.id, max: 50 });
  const picked = pickPlaceHeroAndPhotos(resolved.keys, resolved.urls);

  // heroImage: DB wins if present; else R2 (hero.jpg > 01.jpg)
  const heroImage = base.heroImage ?? picked.heroImage ?? null;
  // photos: if DB didn't provide images, use R2 (01..05)
  const photos = picked.photos.length > 0 ? picked.photos : base.photos;

  return { ...base, heroImage, photos };
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

function resolveBlogMediaUrl(env: Env, key: string | null, publicUrl: string | null): string | null {
  const k = typeof key === 'string' && key.trim().length > 0 ? key.trim() : null;
  const fromKey = k ? getPublicUrl(env, k) : null;
  if (fromKey) return fromKey;
  const url = typeof publicUrl === 'string' && publicUrl.trim().length > 0 ? publicUrl.trim() : null;
  if (!url) return null;
  return isPlaceholderHeroUrl(url) ? null : url;
}

function toContentBlogPostCard(env: Env, row: BlogPostListRow): ContentBlogPostCardDto {
  const heroUrl = resolveBlogMediaUrl(env, row.hero_media_key, row.hero_public_url);
  const tags = pickStringArray(row.tags_json);
  const authorSlug = typeof row.author_slug === 'string' && row.author_slug.trim().length > 0 ? row.author_slug.trim() : null;
  const authorName =
    typeof row.author_display_name === 'string' && row.author_display_name.trim().length > 0
      ? row.author_display_name.trim()
      : null;
  const authorAvatarUrl = resolveBlogMediaUrl(env, row.author_avatar_media_key, row.author_avatar_public_url);
  const author: ContentBlogAuthorDto | null =
    authorSlug && authorName
      ? { slug: authorSlug, displayName: authorName, avatarUrl: authorAvatarUrl }
      : null;

  return {
    id: row.id,
    slug: row.slug,
    lang: row.lang,
    title: row.title,
    subtitle: row.subtitle ?? null,
    excerpt: row.excerpt ?? null,
    postType: row.post_type ?? null,
    category: row.category ?? null,
    countrySlug: row.country_slug ?? null,
    citySlug: row.city_slug ?? null,
    tags,
    heroUrl,
    publishedAt: row.published_at ?? null,
    updatedAt: row.updated_at ?? null,
    readingTimeMinutes: row.reading_time_minutes ?? null,
    isPromoted: Boolean(row.is_promoted),
    isFeatured: Boolean(row.is_featured),
    isEditorPick: Boolean(row.is_editor_pick),
    author,
  };
}

function toContentTab(row: ContentBlockRow): ContentTabDto {
  return {
    tabKey: row.tab_key,
    lang: row.lang,
    title: row.title,
    bodyMarkdown: row.body_markdown,
    updatedAt: row.updated_at ?? null,
  };
}

async function handleListEvents(
  env: Env,
  url: URL,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  try {
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '50') || 50));
    const offsetRaw = url.searchParams.get('offset');
    const pageRaw = url.searchParams.get('page');
    const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : null;
    const offset =
      offsetRaw !== null
        ? Math.max(0, Number(offsetRaw) || 0)
        : page !== null
          ? (page - 1) * limit
          : 0;

    // Filters (accept both *_id and non-suffixed aliases for MVP compatibility)
    const country = (url.searchParams.get('country') ?? url.searchParams.get('country_id')) ?? undefined;
    const city = (url.searchParams.get('city') ?? url.searchParams.get('city_id')) ?? undefined;
    const category = url.searchParams.get('category') ?? undefined;
    const date_from = url.searchParams.get('date_from') ?? undefined;
    const date_to = url.searchParams.get('date_to') ?? undefined;
    const priceParam = url.searchParams.get('price') ?? 'any';
    const price: 'free' | 'paid' | 'any' =
      priceParam === 'free' || priceParam === 'paid' ? priceParam : 'any';
    const verifiedParam = url.searchParams.get('verified') ?? 'any';
    const verified: 'true' | 'false' | 'any' =
      verifiedParam === 'true' || verifiedParam === 'false' ? verifiedParam : 'any';
    const q = url.searchParams.get('q') ?? url.searchParams.get('search') ?? undefined;

    const { items, total } = await listEvents(sqlClient, {
      limit,
      offset,
      country,
      city,
      category,
      date_from,
      date_to,
      price,
      verified,
      q,
    });

    return json({ items: items.map(toContentEvent), total, limit, offset } satisfies ListResponse<ContentEventDto>, 200);
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

function handleDebugVersion(env: Env): Response {
  return json(
    {
      ok: true,
      environment: env.ENVIRONMENT ?? null,
      version: env.VERSION ?? null,
      now: new Date().toISOString(),
    },
    200
  );
}

async function handleDebugEntity(env: Env, idOrSlug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) {
    return json({ ok: false, error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  }

  try {
    const row = await getEventByIdOrSlug(sqlClient, idOrSlug);
    if (!row) return json({ ok: false, error: { code: 'NotFound', message: 'Entity not found' } }, 404);

    return json(
      {
        ok: true,
        kind: 'event',
        idOrSlug,
        raw: {
          id: row.id,
          slug: row.slug,
          country_slug: row.country_slug,
          city_slug: row.city_slug,
          year: row.year,
          media_prefix: row.media_prefix ?? null,
          hero_media_key: row.hero_media_key,
          gallery_media_keys: row.gallery_media_keys,
          gallery_media_keys_normalized: pickStringArray(row.gallery_media_keys),
          source_md_path: row.source_md_path,
        },
      },
      200
    );
  } catch (error) {
    logger.error('Debug entity error', error, { idOrSlug });
    return json({ ok: false, error: { code: 'InternalError', message: 'Debug entity failed' } }, 500);
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
    const items = await Promise.all(rows.map((r) => toContentCountryWithMedia(env, r)));
    return json({ items } satisfies ListResponse<ContentCountryDto>, 200);
  } catch (error) {
    logger.error('List countries error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch countries' } }, 500);
  }
}

async function handleListCities(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  // Query params (server-side filtering/sort)
  const countryId = url.searchParams.get('countryId') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;
  const type = url.searchParams.get('type') ?? undefined;
  const size = url.searchParams.get('size') ?? undefined;
  const price = url.searchParams.get('price') ?? undefined;
  const nightlife = url.searchParams.get('nightlife') ?? undefined;
  const sortRaw = (url.searchParams.get('sort') ?? '').trim();
  const sort =
    sortRaw === 'name_asc' || sortRaw === 'name_desc' || sortRaw === 'size_desc' ? sortRaw : 'size_desc';

  const seaRaw = (url.searchParams.get('sea') ?? '').trim().toLowerCase();
  const sea = seaRaw === 'true' ? true : seaRaw === 'false' ? false : undefined;

  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') ?? '200') || 200));
  try {
    const rows = await listCities(sqlClient, {
      countryId,
      q,
      type,
      size,
      sea,
      price,
      nightlife,
      sort,
      limit,
    });
    const items = await Promise.all(rows.map((r) => toContentCityWithMedia(env, r)));
    return json({ items } satisfies ListResponse<ContentCityDto>, 200);
  } catch (error) {
    logger.error('List cities error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch cities' } }, 500);
  }
}

async function handleListPlaces(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const cityId = url.searchParams.get('cityId') ?? undefined;
  const countryId = url.searchParams.get('countryId') ?? undefined;
  const districtIdOrSlug = (url.searchParams.get('district') ?? url.searchParams.get('districtId') ?? '').trim();
  const kind = url.searchParams.get('kind') ?? undefined;
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') ?? '100') || 100));
  try {
    if (districtIdOrSlug && !cityId) {
      return json({ error: { code: 'BadRequest', message: 'cityId is required when district filter is set' } }, 400);
    }
    const districtId =
      districtIdOrSlug && cityId ? await getCityDistrictIdByIdOrSlug(sqlClient, cityId, districtIdOrSlug) : null;
    if (districtIdOrSlug && !districtId) {
      return json({ error: { code: 'NotFound', message: 'District not found for city' } }, 404);
    }
    const rows = await listPlaces(sqlClient, { cityId, countryId, districtId: districtId ?? undefined, kind, limit });
    const items = await Promise.all(rows.map((r) => toContentPlaceWithMedia(env, r)));
    return json({ items } satisfies ListResponse<ContentPlaceDto>, 200);
  } catch (error) {
    logger.error('List places error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch places' } }, 500);
  }
}

async function handleListCityDistricts(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const includeUnpublishedRaw = (url.searchParams.get('includeUnpublished') ?? '').trim().toLowerCase();
  const includeUnpublished = includeUnpublishedRaw === 'true' || includeUnpublishedRaw === '1';
  const limit = Math.min(300, Math.max(1, Number(url.searchParams.get('limit') ?? '100') || 100));
  try {
    const cityId = await getCityIdByIdOrSlug(sqlClient, idOrSlug);
    if (!cityId) return json({ error: { code: 'NotFound', message: 'City not found' } }, 404);
    const rows = await listCityDistricts(sqlClient, { cityId, includeUnpublished, limit });
    return json({ items: rows.map(toContentCityDistrict) } satisfies ListResponse<ContentCityDistrictDto>, 200);
  } catch (error) {
    logger.error('List city districts error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch city districts' } }, 500);
  }
}

async function handleListCityContainers(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const districtIdOrSlug = (url.searchParams.get('district') ?? url.searchParams.get('districtId') ?? '').trim();
  const includeUnpublishedRaw = (url.searchParams.get('includeUnpublished') ?? '').trim().toLowerCase();
  const includeUnpublished = includeUnpublishedRaw === 'true' || includeUnpublishedRaw === '1';
  const limit = Math.min(300, Math.max(1, Number(url.searchParams.get('limit') ?? '100') || 100));
  try {
    const cityId = await getCityIdByIdOrSlug(sqlClient, idOrSlug);
    if (!cityId) return json({ error: { code: 'NotFound', message: 'City not found' } }, 404);
    const districtId = districtIdOrSlug ? await getCityDistrictIdByIdOrSlug(sqlClient, cityId, districtIdOrSlug) : null;
    if (districtIdOrSlug && !districtId) {
      return json({ error: { code: 'NotFound', message: 'District not found for city' } }, 404);
    }
    const rows = await listPlaceContainers(sqlClient, {
      cityId,
      districtId: districtId ?? undefined,
      includeUnpublished,
      limit,
    });
    return json({ items: rows.map(toContentPlaceContainer) } satisfies ListResponse<ContentPlaceContainerDto>, 200);
  } catch (error) {
    logger.error('List city containers error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch city containers' } }, 500);
  }
}

async function handleGetCountryGallery(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '50') || 50));

  try {
    const countryId = await getCountryIdByIdOrSlug(sqlClient, idOrSlug);
    if (!countryId) return json({ error: { code: 'NotFound', message: 'Country not found' } }, 404);

    // R2 key convention: country/country-<country_id>/<filename>
    const prefix = `country/country-${countryId}/`;
    const resolved = await resolveAtlasMedia(env, 'country', { code: countryId, slug: countryId, max: limit });

    const keyToUrl = new Map<string, string>();
    for (let i = 0; i < resolved.keys.length; i++) {
      const k = resolved.keys[i];
      const u = resolved.urls[i];
      if (typeof k === 'string' && k.length > 0 && typeof u === 'string' && u.length > 0) keyToUrl.set(k, u);
    }

    const keys = resolved.keys
      .filter((k) => typeof k === 'string' && k.startsWith(prefix))
      .filter((k) => isImageKey(k))
      .sort(sortCountryGalleryKeys);

    const hasExplicitCover = keys.some((k) => isCoverFilename(filenameFromKey(k)));
    const coverKey = hasExplicitCover ? keys.find((k) => isCoverFilename(filenameFromKey(k))) ?? null : keys[0] ?? null;

    const items: ContentGalleryItemDto[] = [];
    for (const key of keys) {
      const url = keyToUrl.get(key);
      if (!url) continue;
      items.push({ key, url, isCover: coverKey ? key === coverKey : false });
    }

    return json({ countryId, prefix, items } satisfies ContentCountryGalleryDto, 200);
  } catch (error) {
    logger.error('Get country gallery error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch country gallery' } }, 500);
  }
}

async function handleGetPlaceById(env: Env, idOrSlug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const row = await getPlaceByIdOrSlug(sqlClient, idOrSlug);
    if (!row) return json({ error: { code: 'NotFound', message: 'Place not found' } }, 404);
    const dto = await toContentPlaceWithMedia(env, row);
    return json(dto, 200);
  } catch (error) {
    logger.error('Get place error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch place' } }, 500);
  }
}

async function handleGetCityById(env: Env, idOrSlug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const cityId = await getCityIdByIdOrSlug(sqlClient, idOrSlug);
    if (!cityId) return json({ error: { code: 'NotFound', message: 'City not found' } }, 404);
    const row = await getCityByIdOrSlug(sqlClient, cityId);
    if (!row) return json({ error: { code: 'NotFound', message: 'City not found' } }, 404);
    const dto = await toContentCityWithMedia(env, row);
    return json(dto, 200);
  } catch (error) {
    logger.error('Get city error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch city' } }, 500);
  }
}

async function handleListCountryTabs(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const tabKey = url.searchParams.get('tabKey') ?? undefined;
  const lang = url.searchParams.get('lang') ?? undefined;
  try {
    const countryId = await getCountryIdByIdOrSlug(sqlClient, idOrSlug);
    if (!countryId) return json({ error: { code: 'NotFound', message: 'Country not found' } }, 404);
    const rows = await listContentBlocks(sqlClient, 'country', countryId, { tabKey, lang });
    return json({ items: rows.map(toContentTab) } satisfies ListResponse<ContentTabDto>, 200);
  } catch (error) {
    logger.error('List country tabs error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch country tabs' } }, 500);
  }
}

async function handleListCityTabs(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const tabKey = url.searchParams.get('tabKey') ?? undefined;
  const lang = url.searchParams.get('lang') ?? undefined;
  try {
    const cityId = await getCityIdByIdOrSlug(sqlClient, idOrSlug);
    if (!cityId) return json({ error: { code: 'NotFound', message: 'City not found' } }, 404);
    const rows = await listContentBlocks(sqlClient, 'city', cityId, { tabKey, lang });
    return json({ items: rows.map(toContentTab) } satisfies ListResponse<ContentTabDto>, 200);
  } catch (error) {
    logger.error('List city tabs error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch city tabs' } }, 500);
  }
}

async function handleListPlaceTabs(
  env: Env,
  url: URL,
  idOrSlug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const tabKey = url.searchParams.get('tabKey') ?? undefined;
  const lang = url.searchParams.get('lang') ?? undefined;
  try {
    const placeId = await getPlaceIdByIdOrSlug(sqlClient, idOrSlug);
    if (!placeId) return json({ error: { code: 'NotFound', message: 'Place not found' } }, 404);
    const rows = await listContentBlocks(sqlClient, 'place', placeId, { tabKey, lang });
    return json({ items: rows.map(toContentTab) } satisfies ListResponse<ContentTabDto>, 200);
  } catch (error) {
    logger.error('List place tabs error', error, { idOrSlug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch place tabs' } }, 500);
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

async function handleListBlogPosts(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '24') || 24));
  const sortRaw = (url.searchParams.get('sort') ?? 'newest').trim().toLowerCase();
  const sort: BlogPostSort = sortRaw === 'popular' || sortRaw === 'featured' ? (sortRaw as BlogPostSort) : 'newest';

  const q = url.searchParams.get('q') ?? url.searchParams.get('search') ?? undefined;
  const category = url.searchParams.get('category') ?? undefined;
  const tag = url.searchParams.get('tag') ?? undefined;
  const author = url.searchParams.get('author') ?? undefined;
  const country = url.searchParams.get('country') ?? undefined;
  const city = url.searchParams.get('city') ?? undefined;
  const excludeSlug = url.searchParams.get('exclude_slug') ?? url.searchParams.get('excludeSlug') ?? undefined;

  const cursorRaw = url.searchParams.get('cursor');
  const cursor = decodeBlogCursor(cursorRaw);
  if (cursor && cursor.sort !== sort) {
    return json({ error: { code: 'BadRequest', message: 'cursor.sort does not match sort' } }, 400);
  }

  try {
    const { items: rows, hasMore } = await listBlogPostsSql(sqlClient, {
      limit,
      sort,
      q,
      category,
      tag,
      author,
      country,
      city,
      excludeSlug,
      cursor: cursor
        ? {
            sort: cursor.sort,
            publishedAt: cursor.publishedAt,
            id: cursor.id,
            popularityScore: cursor.popularityScore,
            featuredRank: cursor.featuredRank,
          }
        : null,
    } satisfies ListBlogPostsParams);

    const items = rows.map((r) => toContentBlogPostCard(env, r));

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const last = rows[rows.length - 1]!;
      if (last.published_at) {
        nextCursor = encodeBlogCursor({
          v: 1,
          sort,
          publishedAt: last.published_at,
          id: last.id,
          popularityScore: last.popularity_score ?? undefined,
          featuredRank: typeof last.featured_rank === 'number' ? last.featured_rank : undefined,
        });
      }
    }

    return json({ items, nextCursor } satisfies CursorListResponse<ContentBlogPostCardDto>, 200);
  } catch (error) {
    logger.error('List blog posts error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch blog posts' } }, 500);
  }
}

async function handleGetBlogPostBySlug(env: Env, slug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  try {
    const row = await getBlogPostBySlugSql(sqlClient, slug);
    if (!row) return json({ error: { code: 'NotFound', message: 'Post not found' } }, 404);
    const dto: ContentBlogPostDetailDto = { ...toContentBlogPostCard(env, row), contentMarkdown: row.content_markdown };
    return json(dto, 200);
  } catch (error) {
    logger.error('Get blog post error', error, { slug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch blog post' } }, 500);
  }
}

// ---------------------------------------------------------------------
// Guide Engine v1 (public read API)
// ---------------------------------------------------------------------

async function handleListGuides(env: Env, url: URL, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') ?? '24') || 24));
  const offset = Math.max(0, Number(url.searchParams.get('offset') ?? '0') || 0);
  const countryId = url.searchParams.get('country_id') ?? undefined;
  const cityId = url.searchParams.get('city_id') ?? undefined;
  const guideType = url.searchParams.get('guide_type') ?? undefined;
  const guideTypes = url.searchParams.getAll('guide_type').filter(Boolean);
  const tag = url.searchParams.get('tag') ?? undefined;
  const tagsCsv = (url.searchParams.get('tags') ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const tags = [...new Set([...url.searchParams.getAll('tag').filter(Boolean), ...tagsCsv])];
  const status = url.searchParams.get('status') ?? undefined;
  const editorialOnlyRaw = url.searchParams.get('editorial_only');
  const editorialOnly = editorialOnlyRaw === 'true' || editorialOnlyRaw === '1';
  const sortRaw = (url.searchParams.get('sort') ?? '').trim().toLowerCase();
  const sort: 'new' | 'updated' | 'popular' | undefined =
    sortRaw === 'updated' || sortRaw === 'popular' || sortRaw === 'new' ? sortRaw : undefined;

  try {
    // Security hardening: never expose draft content in production (public API).
    if ((env.ENVIRONMENT ?? '').toLowerCase() === 'production' && (status ?? '').toLowerCase() === 'draft') {
      return json(
        { error: { code: 'BadRequest', message: 'status=draft is not available in production' } },
        400
      );
    }

    const params = {
      limit,
      offset,
      countryId,
      cityId,
      guideType,
      guideTypes: guideTypes.length > 1 ? guideTypes : undefined,
      tag,
      tags: tags.length > 0 ? tags : undefined,
      editorialOnly,
      status,
      sort,
    };

    const countParams = {
      countryId,
      cityId,
      guideType,
      guideTypes: guideTypes.length > 1 ? guideTypes : undefined,
      tag,
      tags: tags.length > 0 ? tags : undefined,
      editorialOnly,
      status,
    };

    const [total, rows] = await Promise.all([countGuides(sqlClient, countParams), listGuides(sqlClient, params)]);

    return json(
      {
        total,
        items: rows.map((r) => {
          const dto = toGuideCard(r);
          return { ...dto, heroUrl: resolveGuideHeroUrl(env, r) };
        }),
      } satisfies ListResponse<ContentGuideCardDto>,
      200
    );
  } catch (error) {
    logger.error('List guides error', error);
    return json({ error: { code: 'InternalError', message: 'Failed to fetch guides' } }, 500);
  }
}

// ---------------------------------------------------------------------
// Mini-admin (v1): write operations for Guide Engine
// Security hardening:
// - gateway-origin auth required on protected/admin routes
// - backend role check required on /v1/admin/*
// ---------------------------------------------------------------------

async function requireAdmin(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true; userId: string } | { ok: false; res: Response }> {
  const gateway = await requireGatewayOrigin(request, env, requestId, logger);
  if (!gateway.ok) return gateway;
  const userId = gateway.principal.userId;

  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) {
    return {
      ok: false,
      res: json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' }, requestId }, 503),
    };
  }

  const rows = await sqlClient`
    SELECT role
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;
  const role = (rows[0] as { role?: unknown } | undefined)?.role;
  if (role !== 'admin') {
    logger.warn('Forbidden admin route access', { userId, role: typeof role === 'string' ? role : null });
    return {
      ok: false,
      res: json({ error: { code: 'Forbidden', message: 'Admin role required' }, requestId }, 403),
    };
  }

  return { ok: true, userId };
}

async function getGuideIdBySlugSql(sqlClient: SqlClient, slug: string): Promise<string | null> {
  const rows = await sqlClient`
    SELECT id::text AS id
    FROM guides
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return (rows[0] as { id?: string } | undefined)?.id ?? null;
}

function computeIsEmpty(blockType: string, payload: Record<string, unknown>): boolean {
  if (blockType === 'divider') return true;
  if (blockType === 'rich_text') {
    const md = typeof payload.markdown === 'string' ? payload.markdown : '';
    return md.trim().length < 20;
  }
  const arrLen = (key: string) => {
    const v = payload[key];
    return Array.isArray(v) ? v.length : 0;
  };
  if (blockType === 'bullets' || blockType === 'checklist' || blockType === 'steps' || blockType === 'timeline') {
    return arrLen('items') < 1 && arrLen('steps') < 1;
  }
  if (blockType === 'faq') return arrLen('items') < 1 && arrLen('qa') < 1;
  if (blockType === 'table') return arrLen('rows') < 1;
  if (blockType === 'poi_refs') return arrLen('place_ids') < 1 && arrLen('ids') < 1;
  if (blockType === 'city_refs') return arrLen('city_ids') < 1 && arrLen('ids') < 1;
  if (blockType === 'related_guides') return arrLen('guide_ids') < 1 && arrLen('guide_slugs') < 1 && arrLen('ids') < 1;
  if (blockType === 'map_config') {
    const c = payload.center;
    const center = c && typeof c === 'object' && 'lat' in c && 'lng' in c ? (c as { lat: number; lng: number }) : null;
    return !(center && typeof center.lat === 'number' && typeof center.lng === 'number');
  }
  // default conservative: empty if payload has no keys
  return !payload || Object.keys(payload).length === 0;
}

async function handleAdminUpsertGuide(request: Request, env: Env, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const b = body ?? {};
  const slug = typeof b.slug === 'string' ? (b.slug as string).trim() : '';
  const title = typeof b.title === 'string' ? (b.title as string).trim() : '';
  const guideType = typeof b.guideType === 'string' ? (b.guideType as string).trim() : 'strategic';
  const status = typeof b.status === 'string' ? (b.status as string).trim() : 'draft';
  const tags = Array.isArray(b.tags) ? (b.tags as unknown[]).filter((x: unknown) => typeof x === 'string') : [];
  const countryIds = Array.isArray(b.countryIds) ? (b.countryIds as unknown[]).filter((x: unknown) => typeof x === 'string') : [];
  const cityIds = Array.isArray(b.cityIds) ? (b.cityIds as unknown[]).filter((x: unknown) => typeof x === 'string') : [];
  const heroR2Key = typeof b.heroR2Key === 'string' ? (b.heroR2Key as string).trim() : null;

  if (!slug || !title) return json({ error: { code: 'BadRequest', message: 'slug and title are required' } }, 400);

  const id = `guide_${slug}`;
  const rows = await sqlClient`
    INSERT INTO guides (
      id, slug, title, summary, guide_type, status,
      tags, country_ids, city_ids, hero_r2_key, updated_at
    ) VALUES (
      ${id}, ${slug}, ${title}, NULL, ${guideType}::atlas_guide_type, ${status}::atlas_guide_status,
      ${tags}::text[], ${countryIds}::text[], ${cityIds}::text[], ${heroR2Key}, now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      guide_type = EXCLUDED.guide_type,
      status = EXCLUDED.status,
      tags = EXCLUDED.tags,
      country_ids = EXCLUDED.country_ids,
      city_ids = EXCLUDED.city_ids,
      hero_r2_key = EXCLUDED.hero_r2_key,
      updated_at = now()
    RETURNING id::text AS id
  `;
  const guideId = (rows[0] as { id?: string } | undefined)?.id;
  return json({ ok: true, guideId: guideId ?? id, slug }, 200);
}

async function handleAdminDeleteGuide(env: Env, slug: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const guideId = await getGuideIdBySlugSql(sqlClient, slug);
  if (!guideId) return json({ error: { code: 'NotFound', message: 'Guide not found' } }, 404);
  await sqlClient`DELETE FROM guides WHERE id = ${guideId}`;
  return json({ ok: true }, 200);
}

async function handleAdminUpdateSection(
  request: Request,
  env: Env,
  slug: string,
  tabKey: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const guideId = await getGuideIdBySlugSql(sqlClient, slug);
  if (!guideId) return json({ error: { code: 'NotFound', message: 'Guide not found' } }, 404);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const b = body ?? {};
  const title = typeof b.title === 'string' ? (b.title as string).trim() : null;
  const orderIndex = typeof b.orderIndex === 'number' && Number.isFinite(b.orderIndex) ? Math.trunc(b.orderIndex) : null;
  const isEnabled = typeof b.isEnabled === 'boolean' ? b.isEnabled : null;

  const rows = await sqlClient`
    INSERT INTO guide_sections (guide_id, tab_key, title, order_index, is_enabled, updated_at)
    VALUES (
      ${guideId}, ${tabKey}::atlas_guide_tab_key, ${title}, COALESCE(${orderIndex}, 0), COALESCE(${isEnabled}, true), now()
    )
    ON CONFLICT (guide_id, tab_key) DO UPDATE SET
      title = COALESCE(${title}, guide_sections.title),
      order_index = COALESCE(${orderIndex}, guide_sections.order_index),
      is_enabled = COALESCE(${isEnabled}, guide_sections.is_enabled),
      updated_at = now()
    RETURNING id::text AS id
  `;
  const id = (rows[0] as { id?: string } | undefined)?.id ?? null;
  return json({ ok: true, id }, 200);
}

async function handleAdminCreateBlock(
  request: Request,
  env: Env,
  sectionId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const b = body ?? {};
  const blockType = typeof b.blockType === 'string' ? (b.blockType as string).trim() : '';
  const orderIndexRaw =
    typeof b.orderIndex === 'number' && Number.isFinite(b.orderIndex) ? Math.trunc(b.orderIndex) : null;
  const insertAfterBlockId = typeof b.insertAfterBlockId === 'string' ? (b.insertAfterBlockId as string).trim() : null;
  const payload = b.payload && typeof b.payload === 'object' && !Array.isArray(b.payload) ? (b.payload as Record<string, unknown>) : {};
  if (!blockType) return json({ error: { code: 'BadRequest', message: 'blockType is required' } }, 400);
  const id = crypto.randomUUID();

  // Mark as admin-created (do not set mdPath).
  const payloadWithSource: Record<string, unknown> = { ...payload, source: 'admin' };
  const isEmpty = computeIsEmpty(blockType, payloadWithSource);

  // Pick insertion index.
  let desiredIndex: number | null = orderIndexRaw;
  if (insertAfterBlockId) {
    const rows = await sqlClient`
      SELECT section_id::text AS section_id, order_index::int AS order_index
      FROM guide_blocks
      WHERE id = ${insertAfterBlockId}::uuid
      LIMIT 1
    `;
    const row = rows[0] as { section_id?: string; order_index?: number } | undefined;
    if (!row?.section_id) {
      return json({ error: { code: 'BadRequest', message: 'insertAfterBlockId not found' } }, 400);
    }
    if (row.section_id !== sectionId) {
      return json({ error: { code: 'BadRequest', message: 'insertAfterBlockId belongs to another section' } }, 400);
    }
    desiredIndex = (typeof row.order_index === 'number' ? row.order_index : 0) + 1;
  }
  if (desiredIndex === null) {
    const rows = await sqlClient`
      SELECT COALESCE(MAX(order_index), -1)::int AS max_order
      FROM guide_blocks
      WHERE section_id = ${sectionId}::uuid
    `;
    const maxOrder = (rows[0] as { max_order?: number } | undefined)?.max_order;
    desiredIndex = (typeof maxOrder === 'number' ? maxOrder : -1) + 1;
  }

  // Stable reindex: shift next blocks.
  // (Keep in a transaction to avoid transient duplicates.)
  await sqlClient`BEGIN`;
  try {
    await sqlClient`
      UPDATE guide_blocks
      SET order_index = order_index + 1
      WHERE section_id = ${sectionId}::uuid
        AND order_index >= ${desiredIndex}
    `;
    await sqlClient`
      INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty, created_at, updated_at)
      VALUES (${id}::uuid, ${sectionId}::uuid, ${blockType}::atlas_guide_block_type, ${desiredIndex}, ${payloadWithSource}::jsonb, ${isEmpty}, now(), now())
    `;
    await sqlClient`COMMIT`;
  } catch (e) {
    await sqlClient`ROLLBACK`;
    throw e;
  }

  return json({ ok: true, id, isEmpty, orderIndex: desiredIndex }, 201);
}

async function handleAdminUpdateBlock(
  request: Request,
  env: Env,
  blockId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  // Read-only policy for md-import blocks (v1): edit the markdown source, then re-import.
  const existingRows = await sqlClient`
    SELECT payload
    FROM guide_blocks
    WHERE id = ${blockId}::uuid
    LIMIT 1
  `;
  const row0 = existingRows[0] as { payload?: unknown } | undefined;
  const existingPayload =
    row0?.payload && typeof row0.payload === 'object' && !Array.isArray(row0.payload)
      ? (row0.payload as Record<string, unknown>)
      : null;
  const isMdImport =
    existingPayload &&
    ((existingPayload.source === 'md-import') ||
      typeof existingPayload.mdPath === 'string');
  if (isMdImport) {
    return json(
      { error: { code: 'Forbidden', message: 'This block is read-only (md-import). Edit the markdown file and re-import.' } },
      403
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const blockType = typeof body?.blockType === 'string' ? body.blockType.trim() : null;
  const orderIndex = typeof body?.orderIndex === 'number' && Number.isFinite(body.orderIndex) ? Math.trunc(body.orderIndex) : null;
  const payload = body?.payload && typeof body.payload === 'object' && !Array.isArray(body.payload) ? (body.payload as Record<string, unknown>) : null;

  // If blockType/payload provided, recompute isEmpty; otherwise keep.
  let isEmpty: boolean | null = null;
  if (blockType && payload) isEmpty = computeIsEmpty(blockType, payload);

  await sqlClient`
    UPDATE guide_blocks
    SET
      block_type = COALESCE(${blockType}::atlas_guide_block_type, block_type),
      order_index = COALESCE(${orderIndex}, order_index),
      payload = COALESCE(${payload}::jsonb, payload),
      is_empty = COALESCE(${isEmpty}, is_empty),
      updated_at = now()
    WHERE id = ${blockId}::uuid
  `;
  return json({ ok: true }, 200);
}

async function handleAdminDeleteBlock(env: Env, blockId: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);

  // Read-only policy for md-import blocks (v1)
  const existingRows = await sqlClient`
    SELECT payload
    FROM guide_blocks
    WHERE id = ${blockId}::uuid
    LIMIT 1
  `;
  const row0 = existingRows[0] as { payload?: unknown } | undefined;
  const existingPayload =
    row0?.payload && typeof row0.payload === 'object' && !Array.isArray(row0.payload)
      ? (row0.payload as Record<string, unknown>)
      : null;
  const isMdImport =
    existingPayload &&
    ((existingPayload.source === 'md-import') ||
      typeof existingPayload.mdPath === 'string');
  if (isMdImport) {
    return json(
      { error: { code: 'Forbidden', message: 'This block is read-only (md-import). Edit the markdown file and re-import.' } },
      403
    );
  }

  await sqlClient`DELETE FROM guide_blocks WHERE id = ${blockId}::uuid`;
  return json({ ok: true }, 200);
}

async function handleAdminUpsertFeed(
  request: Request,
  env: Env,
  slug: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const guideId = await getGuideIdBySlugSql(sqlClient, slug);
  if (!guideId) return json({ error: { code: 'NotFound', message: 'Guide not found' } }, 404);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const b = body ?? {};
  const tabKey = typeof b.tabKey === 'string' ? (b.tabKey as string).trim() : '';
  const source = typeof b.source === 'string' ? (b.source as string).trim() : '';
  const filter = b.filter && typeof b.filter === 'object' && !Array.isArray(b.filter) ? (b.filter as Record<string, unknown>) : {};
  const limitCount = typeof b.limitCount === 'number' && Number.isFinite(b.limitCount) ? Math.trunc(b.limitCount) : 20;
  const sort = typeof b.sort === 'string' ? (b.sort as string).trim() : 'relevance';
  const orderIndex = typeof b.orderIndex === 'number' && Number.isFinite(b.orderIndex) ? Math.trunc(b.orderIndex) : 0;
  const isEnabled = typeof b.isEnabled === 'boolean' ? b.isEnabled : true;
  if (!tabKey || !source) return json({ error: { code: 'BadRequest', message: 'tabKey and source are required' } }, 400);

  const id = crypto.randomUUID();
  await sqlClient`
    INSERT INTO guide_feeds (id, guide_id, tab_key, source, filter, limit_count, sort, order_index, is_enabled, created_at, updated_at)
    VALUES (
      ${id}::uuid, ${guideId}, ${tabKey}::atlas_guide_tab_key, ${source}::atlas_guide_feed_source,
      ${filter}::jsonb, ${limitCount}, ${sort}::atlas_guide_feed_sort, ${orderIndex}, ${isEnabled}, now(), now()
    )
    ON CONFLICT (guide_id, tab_key, source) DO UPDATE SET
      filter = EXCLUDED.filter,
      limit_count = EXCLUDED.limit_count,
      sort = EXCLUDED.sort,
      order_index = EXCLUDED.order_index,
      is_enabled = EXCLUDED.is_enabled,
      updated_at = now()
  `;
  return json({ ok: true }, 201);
}

async function handleAdminDeleteFeed(env: Env, feedId: string, logger: ReturnType<typeof createLogger>): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  await sqlClient`DELETE FROM guide_feeds WHERE id = ${feedId}::uuid`;
  return json({ ok: true }, 200);
}

async function handleGetGuideBySlug(
  env: Env,
  slug: string,
  logger: ReturnType<typeof createLogger>,
  params?: { includeEmpty?: boolean }
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) return json({ error: { code: 'ServiceUnavailable', message: 'Database not configured' } }, 503);
  const includeEmpty = Boolean(params?.includeEmpty);

  try {
    // Short cache (30–60s) for public guide detail.
    if (!includeEmpty) {
      const cached = guideDetailCache.get(slug);
      if (cached && cached.exp > nowMs()) {
        return json(cached.value, 200);
      }
    }

    const guide = await getGuideBySlug(sqlClient, slug);
    if (!guide) return json({ error: { code: 'NotFound', message: 'Guide not found' } }, 404);

    // Fetch candidate sections. We will apply the final visibility rule AFTER resolving feeds:
    // show if (has non-empty blocks) OR (feedsResolved not empty), and section is enabled.
    // For admin includeEmpty=true, we return everything.
    const sections = await listGuideSections(sqlClient, guide.id, { includeEmpty: true });
    const sectionIds = sections.map((s) => s.id);
    const tabKeys = sections.map((s) => s.tab_key);

    const [blocksRows, feedsRows] = await Promise.all([
      listGuideBlocks(sqlClient, sectionIds),
      listGuideFeeds(sqlClient, guide.id, tabKeys),
    ]);

    const blocksBySectionId = new Map<string, ContentGuideBlockDto[]>();
    for (const br of blocksRows) {
      const list = blocksBySectionId.get(br.section_id) ?? [];
      list.push(toGuideBlock(br));
      blocksBySectionId.set(br.section_id, list);
    }

    const feedsByTabKey = new Map<string, ContentGuideFeedDto[]>();
    for (const fr of feedsRows) {
      const list = feedsByTabKey.get(fr.tab_key) ?? [];
      list.push(toGuideFeed(fr));
      feedsByTabKey.set(fr.tab_key, list);
    }

    // Resolve feeds (aggregated, batched by source).
    const feedsResolvedByTabKey = await resolveFeedsForGuide({
      guideId: guide.id,
      feeds: feedsRows,
      logger,
      sqlClient,
    });

    const isSectionEnabled = (s: GuideSectionRow) => Boolean(s.is_enabled);
    const hasNonEmptyBlocks = (sectionId: string) => {
      const blocks = blocksBySectionId.get(sectionId) ?? [];
      // blocks in DB include isEmpty already; if not present for some reason, treat as empty
      return blocks.some((b) => b.isEmpty === false);
    };
    const hasResolvedFeeds = (tabKey: string) => (feedsResolvedByTabKey.get(tabKey) ?? []).length > 0;

    const visibleSections = includeEmpty
      ? sections
      : sections.filter((s) => isSectionEnabled(s) && (hasNonEmptyBlocks(s.id) || hasResolvedFeeds(s.tab_key)));

    const detail: ContentGuideDetailDto = {
      id: guide.id,
      slug: guide.slug,
      title: guide.title,
      summary: guide.summary,
      heroUrl: resolveGuideHeroUrl(env, guide),
      guideType: guide.guide_type,
      status: guide.status,
      tags: Array.isArray(guide.tags) ? guide.tags : [],
      countryIds: Array.isArray(guide.country_ids) ? guide.country_ids : [],
      cityIds: Array.isArray(guide.city_ids) ? guide.city_ids : [],
      publishedAt: guide.published_at ?? null,
      createdAt: guide.created_at,
      updatedAt: guide.updated_at,
      sections: visibleSections.map((s) => toGuideSection(s, blocksBySectionId, feedsByTabKey, feedsResolvedByTabKey)),
    };

    if (!includeEmpty) {
      guideDetailCache.set(slug, { exp: nowMs() + 45_000, value: detail });
    }

    return json(detail, 200);
  } catch (error) {
    logger.error('Get guide error', error, { slug });
    return json({ error: { code: 'InternalError', message: 'Failed to fetch guide' } }, 500);
  }
}

// ---------------------------------------------------------------------
// Feeds resolution (batched, timeout, cache)
// ---------------------------------------------------------------------

type GuideCacheEntry = { exp: number; value: ContentGuideDetailDto };
const guideDetailCache = new Map<string, GuideCacheEntry>();

function nowMs(): number {
  return Date.now();
}

async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  onTimeout: () => T,
  logger: ReturnType<typeof createLogger>,
  meta: Record<string, unknown>
): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<T>((resolve) => {
      t = setTimeout(() => resolve(onTimeout()), ms);
    });
    return await Promise.race([p, timeout]);
  } finally {
    if (t) clearTimeout(t);
    // keep logger/meta for future observability; minimal v1: do not spam logs
    void logger;
    void meta;
  }
}

function pickStringArray(v: unknown): string[] {
  // Neon/Workers DB drivers may return jsonb as:
  // - native array (string[])
  // - JSON string (e.g. '["a","b"]')
  // We normalize both and always return string[].
  const asArray = (() => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.trim().length > 0) {
      try {
        const parsed = JSON.parse(v) as unknown;
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return null;
  })();
  if (!asArray) return [];
  return asArray.filter((x) => typeof x === 'string' && x.trim().length > 0).map((x) => x.trim());
}

function pickString(v: unknown): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

function normalizeFeedFilter(filter: unknown): Record<string, unknown> {
  if (!filter || typeof filter !== 'object' || Array.isArray(filter)) return {};
  return filter as Record<string, unknown>;
}

function mergeIds(filter: Record<string, unknown>, keyOne: string, keyMany: string): string[] {
  const one = pickString(filter[keyOne]);
  const many = pickStringArray(filter[keyMany]);
  const out = new Set<string>();
  for (const x of many) out.add(x);
  if (one) out.add(one);
  return [...out];
}

function mergeTags(filter: Record<string, unknown>): string[] {
  return mergeIds(filter, 'tag', 'tags');
}

function dedupResolved(items: ContentGuideFeedResolvedItemDto[]): ContentGuideFeedResolvedItemDto[] {
  const seen = new Set<string>();
  const out: ContentGuideFeedResolvedItemDto[] = [];
  for (const it of items) {
    const k = `${it.kind}:${it.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

async function resolveFeedsForGuide(args: {
  guideId: string;
  feeds: GuideFeedRow[];
  sqlClient: SqlClient;
  logger: ReturnType<typeof createLogger>;
}): Promise<Map<string, ContentGuideFeedResolvedItemDto[]>> {
  const { feeds, sqlClient, logger } = args;

  // Group by tabKey + source (merge filters & limits)
  type GroupKey = `${string}:${string}`;
  const groups = new Map<GroupKey, { tabKey: string; source: string; limit: number; sort: string; filters: Record<string, unknown>[] }>();

  for (const f of feeds) {
    const key = `${f.tab_key}:${f.source}` as GroupKey;
    const g = groups.get(key) ?? { tabKey: f.tab_key, source: f.source, limit: 0, sort: f.sort, filters: [] };
    g.limit = Math.max(g.limit, f.limit_count || 0);
    // take sort from lowest order_index feed (feeds are already sorted, but keep first)
    g.sort = g.sort || f.sort;
    g.filters.push(normalizeFeedFilter(f.filter));
    groups.set(key, g);
  }

  const byTabKey = new Map<string, ContentGuideFeedResolvedItemDto[]>();
  const timeoutMs = 1500;

  // Resolve per group (1 query per tabKey+source)
  await Promise.all(
    [...groups.values()].map(async (g) => {
      const limit = Math.min(100, Math.max(1, g.limit || 20));

      // merge filters (v1: union arrays/scalars into arrays)
      const all = g.filters;
      const cityIds = [...new Set(all.flatMap((f) => mergeIds(f, 'city_id', 'city_ids')))];
      const countryIds = [...new Set(all.flatMap((f) => mergeIds(f, 'country_id', 'country_ids')))];
      const tags = [...new Set(all.flatMap((f) => mergeTags(f)))];
      const kind = pickString(all.find((f) => typeof f.kind === 'string')?.kind) ?? pickString(all.find((f) => typeof f.place_kind === 'string')?.place_kind);
      const startAfter = pickString(all.find((f) => typeof f.start_after === 'string')?.start_after) ?? pickString(all.find((f) => typeof f.startAfter === 'string')?.startAfter);

      let resolved: ContentGuideFeedResolvedItemDto[] = [];

      if (g.source === 'pulse') {
        resolved = await withTimeout(
          (async () => {
            const rows = await listEventsForGuideFeed(sqlClient, {
              cityIds: cityIds.length ? cityIds : undefined,
              countryIds: countryIds.length ? countryIds : undefined,
              startAfter: startAfter ?? undefined,
              limit,
              sort: (typeof g.sort === 'string' ? g.sort : 'date_asc') as 'date_asc' | 'date_desc',
            });
            return rows.map((r) => ({
              kind: 'event',
              id: r.id,
              slug: r.slug,
              title: r.title,
              excerpt: r.description,
              imageUrl: r.image_url,
              href: `/pulse/${r.id}`,
              meta: {
                startDate: r.start_at ?? r.start_date,
                location: [r.city_name, r.country_name].filter(Boolean).join(', ') || null,
              },
            }));
          })(),
          timeoutMs,
          () => [],
          logger,
          { source: g.source, tabKey: g.tabKey }
        );
      } else if (g.source === 'atlas_places') {
        resolved = await withTimeout(
          (async () => {
            const rows = await listPlacesForGuideFeed(sqlClient, {
              cityIds: cityIds.length ? cityIds : undefined,
              countryIds: countryIds.length ? countryIds : undefined,
              kind: kind ?? undefined,
              tags: tags.length ? tags : undefined,
              limit,
              sort: (typeof g.sort === 'string' ? g.sort : 'relevance') as 'relevance' | 'popular' | 'newest',
            });
            return rows.map((r) => ({
              kind: 'place',
              id: r.id,
              slug: r.slug,
              title: r.name,
              excerpt: r.description_short,
              imageUrl: r.hero_url,
              href: `/atlas/places/${r.slug || r.id}`,
              meta: {
                city: r.city_name,
                country: r.country_name,
                kind: r.place_kind,
              },
            }));
          })(),
          timeoutMs,
          () => [],
          logger,
          { source: g.source, tabKey: g.tabKey }
        );
      } else if (g.source === 'blog') {
        resolved = await withTimeout(
          (async () => {
            const rows = await listArticlesForGuideFeed(sqlClient, {
              tags: tags.length ? tags : undefined,
              limit,
              sort: (typeof g.sort === 'string' ? g.sort : 'newest') as 'newest' | 'popular',
            });
            return rows.map((r) => ({
              kind: 'article',
              id: r.id,
              slug: r.slug,
              title: r.title,
              excerpt: r.excerpt,
              imageUrl: r.cover_url,
              href: `/blog/${r.slug}`,
              meta: { publishedAt: r.published_at },
            }));
          })(),
          timeoutMs,
          () => [],
          logger,
          { source: g.source, tabKey: g.tabKey }
        );
      }

      if (resolved.length === 0) return;
      const existing = byTabKey.get(g.tabKey) ?? [];
      byTabKey.set(g.tabKey, dedupResolved(existing.concat(resolved)));
    })
  );

  return byTabKey;
}

// JWT utilities (for service-to-service auth)

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

async function verifyHs256Jwt(
  token: string,
  secret: string
): Promise<{ ok: true; payload: Record<string, unknown> } | { ok: false; error: string }> {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, error: 'JWT must have 3 parts' };

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(headerB64)));
  const payload = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  if (!header || !payload) return { ok: false, error: 'JWT header/payload is not valid JSON object' };
  if (header.alg !== 'HS256') return { ok: false, error: 'Only HS256 is supported' };

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

  const exp = payload.exp;
  if (typeof exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= exp) return { ok: false, error: 'Token expired' };
  }

  const nbf = payload.nbf;
  if (typeof nbf === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now < nbf) return { ok: false, error: 'Token is not active yet' };
  }

  return { ok: true, payload };
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

async function requireGatewayOrigin(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true; principal: GatewayPrincipal } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return {
      ok: false,
      res: json({ error: { code: 'SERVICE_AUTH_NOT_CONFIGURED', message: 'Service auth is not configured' }, requestId }, 503),
    };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) {
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Missing X-Gateway-Auth header' }, requestId }, 401) };
  }

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Invalid X-Gateway-Auth token' }, requestId }, 401) };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'api-gateway',
    aud: 'internal',
  });
  if (!claims.ok) {
    logger.warn('Gateway-origin token claims rejected', { reason: claims.error });
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Invalid X-Gateway-Auth token claims' }, requestId }, 401) };
  }

  const userId = getStringClaim(verified.payload, 'sub');
  if (!userId) {
    logger.warn('Gateway-origin token missing subject claim');
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Missing user subject in X-Gateway-Auth' }, requestId }, 401) };
  }

  return {
    ok: true,
    principal: {
      userId,
      roles: getStringArrayClaim(verified.payload, 'roles'),
    },
  };
}

async function callPointsService(
  env: Env,
  userId: string,
  amount: number,
  action: string,
  externalId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>,
  options?: {
    sourceEventId?: string;
    metadata?: Record<string, unknown>;
  }
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
        sourceEventId: options?.sourceEventId,
        metadata: options?.metadata,
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
  env: Env,
  eventId: string,
  userId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const sqlClient = getSqlClient(env, logger);
  if (!sqlClient) {
    // Graceful degradation: points only
    const pointsResult = await callPointsService(
      env,
      userId,
      20,
      'event_registration',
      `content:event_registration:${eventId}:${userId}`,
      requestId,
      logger,
      {
        sourceEventId: `content:event_registration:${eventId}:${userId}`,
        metadata: { eventId, mode: 'db_less_fallback' },
      }
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
      logger,
      {
        sourceEventId: registrationId,
        metadata: { eventId, registrationId },
      }
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
    const logger = createLogger(requestId, 'content-service', {
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
        res.headers.set('X-Request-ID', requestId);
        return res;
      }

      if (path === '/ready') {
        const res = handleReady(env);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }

      // Debug endpoints (guarded; never in production)
      if (path === '/v1/content/_debug/db' && request.method === 'GET') {
        if (!isDebugAllowed(request, env)) return handleNotFound(path);
        const res = await handleDebugDb(env, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }

    // Canon debug endpoints (no secrets)
    if (path === '/v1/content/_debug/version' && request.method === 'GET') {
      if (!isDebugAllowed(request, env)) return handleNotFound(path);
      const res = handleDebugVersion(env);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const debugEntityMatch = path.match(/^\/v1\/content\/_debug\/entity\/([^/]+)$/);
    if (debugEntityMatch && request.method === 'GET') {
      if (!isDebugAllowed(request, env)) return handleNotFound(path);
      const idOrSlug = debugEntityMatch[1];
      const res = await handleDebugEntity(env, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const debugEventMatch = path.match(/^\/v1\/content\/_debug\/event\/([^/]+)$/);
    if (debugEventMatch && request.method === 'GET') {
      if (!isDebugAllowed(request, env)) return handleNotFound(path);
      const idOrSlug = debugEventMatch[1];
      const res = await handleDebugEntity(env, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Media / Storage (Milestone 2.2)
    if (path === '/v1/content/media/upload-token' && request.method === 'POST') {
      const auth = await requireGatewayOrigin(request, env, requestId, logger);
      if (!auth.ok) {
        auth.res.headers.set('X-Request-ID', requestId);
        return auth.res;
      }
      const res = await handleCreateMediaUploadToken(request, env, requestId, auth.principal.userId);
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
    const cityGetMatch = path.match(/^\/v1\/content\/cities\/([^/]+)$/);
    if (cityGetMatch && request.method === 'GET') {
      const idOrSlug = cityGetMatch[1];
      const res = await handleGetCityById(env, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    if (path === '/v1/content/places' && request.method === 'GET') {
      const res = await handleListPlaces(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const countryGalleryMatch = path.match(/^\/v1\/content\/countries\/([^/]+)\/gallery$/);
    if (countryGalleryMatch && request.method === 'GET') {
      const idOrSlug = countryGalleryMatch[1];
      const res = await handleGetCountryGallery(env, url, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const countryTabsMatch = path.match(/^\/v1\/content\/countries\/([^/]+)\/tabs$/);
    if (countryTabsMatch && request.method === 'GET') {
      const idOrSlug = countryTabsMatch[1];
      const res = await handleListCountryTabs(env, url, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const cityTabsMatch = path.match(/^\/v1\/content\/cities\/([^/]+)\/tabs$/);
    if (cityTabsMatch && request.method === 'GET') {
      const idOrSlug = cityTabsMatch[1];
      const res = await handleListCityTabs(env, url, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const cityDistrictsMatch = path.match(/^\/v1\/content\/cities\/([^/]+)\/districts$/);
    if (cityDistrictsMatch && request.method === 'GET') {
      const idOrSlug = cityDistrictsMatch[1];
      const res = await handleListCityDistricts(env, url, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const cityContainersMatch = path.match(/^\/v1\/content\/cities\/([^/]+)\/containers$/);
    if (cityContainersMatch && request.method === 'GET') {
      const idOrSlug = cityContainersMatch[1];
      const res = await handleListCityContainers(env, url, idOrSlug, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const placeTabsMatch = path.match(/^\/v1\/content\/places\/([^/]+)\/tabs$/);
    if (placeTabsMatch && request.method === 'GET') {
      const idOrSlug = placeTabsMatch[1];
      const res = await handleListPlaceTabs(env, url, idOrSlug, logger);
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

    // Public: Blog Asia posts (SSOT: blog_posts)
    if (path === '/v1/content/blog/posts' && request.method === 'GET') {
      const res = await handleListBlogPosts(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const blogPostGetMatch = path.match(/^\/v1\/content\/blog\/posts\/([^/]+)$/);
    if (blogPostGetMatch && request.method === 'GET') {
      const slug = blogPostGetMatch[1];
      const res = await handleGetBlogPostBySlug(env, slug, logger);
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

    // -----------------------------------------------------------------
    // Guide Engine v1 (public)
    // -----------------------------------------------------------------
    // Gateway-friendly aliases (/v1/content/*)
    if (path === '/v1/content/guides' && request.method === 'GET') {
      const res = await handleListGuides(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const contentGuideGetMatch = path.match(/^\/v1\/content\/guides\/([^/]+)$/);
    if (contentGuideGetMatch && request.method === 'GET') {
      const slug = contentGuideGetMatch[1] ?? '';
      const includeEmptyRaw = url.searchParams.get('include_empty');
      const includeEmpty = includeEmptyRaw === 'true' || includeEmptyRaw === '1';
      if (includeEmpty) {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-ID', requestId);
          return auth.res;
        }
      }
      const res = await handleGetGuideBySlug(env, slug, logger, { includeEmpty });
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    if (path === '/v1/guides' && request.method === 'GET') {
      const res = await handleListGuides(env, url, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
    const guideGetMatch = path.match(/^\/v1\/guides\/([^/]+)$/);
    if (guideGetMatch && request.method === 'GET') {
      const slug = guideGetMatch[1] ?? '';
      const includeEmptyRaw = url.searchParams.get('include_empty');
      const includeEmpty = includeEmptyRaw === 'true' || includeEmptyRaw === '1';
      if (includeEmpty) {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-ID', requestId);
          return auth.res;
        }
      }
      const res = await handleGetGuideBySlug(env, slug, logger, { includeEmpty });
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // -----------------------------------------------------------------
    // Mini-admin v1 (write) — Guide Engine
    // -----------------------------------------------------------------
    if (path.startsWith('/v1/admin/')) {
      const admin = await requireAdmin(request, env, requestId, logger);
      if (!admin.ok) {
        admin.res.headers.set('X-Request-ID', requestId);
        return admin.res;
      }
      // keep userId for future auditing
      void admin.userId;

      if (path === '/v1/admin/guides' && (request.method === 'POST' || request.method === 'PUT')) {
        const res = await handleAdminUpsertGuide(request, env, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminGuideMatch = path.match(/^\/v1\/admin\/guides\/([^/]+)$/);
      if (adminGuideMatch && request.method === 'DELETE') {
        const slug = adminGuideMatch[1] ?? '';
        const res = await handleAdminDeleteGuide(env, slug, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminSectionMatch = path.match(/^\/v1\/admin\/guides\/([^/]+)\/sections\/([^/]+)$/);
      if (adminSectionMatch && (request.method === 'POST' || request.method === 'PUT')) {
        const slug = adminSectionMatch[1] ?? '';
        const tabKey = adminSectionMatch[2] ?? '';
        const res = await handleAdminUpdateSection(request, env, slug, tabKey, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminBlocksCreateMatch = path.match(/^\/v1\/admin\/sections\/([^/]+)\/blocks$/);
      if (adminBlocksCreateMatch && request.method === 'POST') {
        const sectionId = adminBlocksCreateMatch[1] ?? '';
        const res = await handleAdminCreateBlock(request, env, sectionId, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminBlockMatch = path.match(/^\/v1\/admin\/blocks\/([^/]+)$/);
      if (adminBlockMatch && request.method === 'PUT') {
        const blockId = adminBlockMatch[1] ?? '';
        const res = await handleAdminUpdateBlock(request, env, blockId, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      if (adminBlockMatch && request.method === 'DELETE') {
        const blockId = adminBlockMatch[1] ?? '';
        const res = await handleAdminDeleteBlock(env, blockId, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminFeedUpsertMatch = path.match(/^\/v1\/admin\/guides\/([^/]+)\/feeds$/);
      if (adminFeedUpsertMatch && (request.method === 'POST' || request.method === 'PUT')) {
        const slug = adminFeedUpsertMatch[1] ?? '';
        const res = await handleAdminUpsertFeed(request, env, slug, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
      const adminFeedMatch = path.match(/^\/v1\/admin\/feeds\/([^/]+)$/);
      if (adminFeedMatch && request.method === 'DELETE') {
        const feedId = adminFeedMatch[1] ?? '';
        const res = await handleAdminDeleteFeed(env, feedId, logger);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }
    }

    // Event registration endpoint
    const eventRegMatch = path.match(/^\/v1\/content\/events\/([^/]+)\/register$/);
    if (eventRegMatch && request.method === 'POST') {
      const auth = await requireGatewayOrigin(request, env, requestId, logger);
      if (!auth.ok) {
        auth.res.headers.set('X-Request-ID', requestId);
        return auth.res;
      }
      const eventId = eventRegMatch[1];
      const res = await handleEventRegistration(env, eventId, auth.principal.userId, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

      logger.warn('Unhandled route', { method: request.method, path });
      const res = handleNotFound(path);
      res.headers.set('X-Request-ID', requestId);
      return res;
      })();
      return response;
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Unexpected error',
          },
          requestId,
        },
        500
      );
      response.headers.set('X-Request-ID', requestId);
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




