/**
 * API Gateway for Go2Asia MVP
 *
 * Cloudflare Worker that routes requests to backend microservices.
 * Handles JWT validation, requestId propagation, and basic routing.
 */

import { verifyToken } from '@clerk/backend';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

export interface Env {
  // Service URLs (internal)
  AUTH_SERVICE_URL?: string;
  CONTENT_SERVICE_URL?: string;
  MEDIA_SERVICE_URL?: string;
  POINTS_SERVICE_URL?: string;
  REFERRAL_SERVICE_URL?: string;
  // Phase 2 services (not all exist yet; keep optional and only route when configured)
  SPACE_SERVICE_URL?: string;
  REACTIONS_SERVICE_URL?: string;
  FEED_SERVICE_URL?: string;
  QUEST_SERVICE_URL?: string;
  RIELT_SERVICE_URL?: string;
  GURU_SERVICE_URL?: string;
  RF_SERVICE_URL?: string;
  
  // Secrets (Cloudflare Secrets)
  CLERK_SECRET_KEY?: string;
  SERVICE_JWT_SECRET?: string;

  // Runtime vars (Cloudflare Vars)
  ENVIRONMENT?: string;
  VERSION?: string;

  /**
   * Security: debug routes must be explicitly enabled.
   * - Default: disabled (including in production).
   * - Enable by setting DEBUG_ROUTES_ENABLED="true".
   */
  DEBUG_ROUTES_ENABLED?: string;
}

type GatewayUserContext = {
  userId: string;
  platformRole?: CanonicalPlatformRole;
  roles: string[];
};

type CanonicalPlatformRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';

export type RouteGroup =
  | 'platform'
  | 'auth'
  | 'identity'
  | 'content-read'
  | 'content-engagement'
  | 'media'
  | 'points'
  | 'referral'
  | 'space'
  | 'reactions'
  | 'feed'
  | 'quest'
  | 'rielt'
  | 'guru'
  | 'rf'
  | 'debug'
  | 'internal'
  | 'unknown';

export type RouteClassification = {
  routeKey: string;
  routeGroup: RouteGroup;
};

export type RequestContext = {
  requestId: string;
  actorType: 'anonymous' | 'user' | 'internal';
  actorId: string | null;
  roles: string[];
  authLevel: 'anonymous' | 'user' | 'internal';
  clientIpHash: string | null;
  userAgentHash: string | null;
  routeKey: string;
  routeGroup: RouteGroup;
};

export type EnforcementKeys = {
  quotaKey: string;
  abuseKey: string;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
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

async function sha256Base64Url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', utf8ToBytes(input));
  return bytesToBase64Url(new Uint8Array(digest).slice(0, 12));
}

function normalizeRoutePath(path: string): string {
  if (path.startsWith('/v1/api/content/')) {
    return path.replace('/v1/api/content/', '/v1/content/');
  }
  return path;
}

export function classifyRoute(method: string, path: string): RouteClassification {
  const normalizedMethod = method.toUpperCase();
  const normalizedPath = normalizeRoutePath(path);

  if (normalizedPath === '/health' || normalizedPath === '/ready' || normalizedPath === '/version') {
    return { routeKey: `platform.${normalizedPath.slice(1)}.${normalizedMethod.toLowerCase()}`, routeGroup: 'platform' };
  }

  if (normalizedPath === '/v1/_debug/routes') {
    return { routeKey: `debug.routes.${normalizedMethod.toLowerCase()}`, routeGroup: 'debug' };
  }

  if (normalizedPath.startsWith('/internal/')) {
    return { routeKey: `internal.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'internal' };
  }

  if (normalizedPath.startsWith('/v1/auth/')) {
    return { routeKey: `auth.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'auth' };
  }

  if (normalizedPath === '/v1/users/ensure' && normalizedMethod === 'POST') {
    return { routeKey: 'identity.users.ensure.post', routeGroup: 'identity' };
  }
  if (normalizedPath.startsWith('/v1/users/')) {
    return { routeKey: `identity.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'identity' };
  }

  if (normalizedPath === '/v1/points/balance' && normalizedMethod === 'GET') {
    return { routeKey: 'points.balance.get', routeGroup: 'points' };
  }
  if (normalizedPath === '/v1/points/transactions' && normalizedMethod === 'GET') {
    return { routeKey: 'points.transactions.get', routeGroup: 'points' };
  }
  if (normalizedPath.startsWith('/v1/points/')) {
    return { routeKey: `points.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'points' };
  }

  if (normalizedPath === '/v1/referral/code' && normalizedMethod === 'GET') {
    return { routeKey: 'referral.code.get', routeGroup: 'referral' };
  }
  if (normalizedPath === '/v1/referral/stats' && normalizedMethod === 'GET') {
    return { routeKey: 'referral.stats.get', routeGroup: 'referral' };
  }
  if (normalizedPath === '/v1/referral/tree' && normalizedMethod === 'GET') {
    return { routeKey: 'referral.tree.get', routeGroup: 'referral' };
  }
  if (normalizedPath === '/v1/referral/claim' && normalizedMethod === 'POST') {
    return { routeKey: 'referral.claim.post', routeGroup: 'referral' };
  }
  if (normalizedPath.startsWith('/v1/referral/')) {
    return { routeKey: `referral.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'referral' };
  }

  if (normalizedPath === '/v1/media/upload-token' && normalizedMethod === 'POST') {
    return { routeKey: 'media.upload-token.post', routeGroup: 'media' };
  }
  if (/^\/v1\/media\/upload\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'PUT') {
    return { routeKey: 'media.upload.put', routeGroup: 'media' };
  }
  if (normalizedPath.startsWith('/v1/media/')) {
    return { routeKey: `media.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'media' };
  }

  if (normalizedPath === '/v1/content/events' && normalizedMethod === 'GET') {
    return { routeKey: 'content.events.list.get', routeGroup: 'content-read' };
  }
  if (/^\/v1\/content\/events\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'content.events.detail.get', routeGroup: 'content-read' };
  }
  if (/^\/v1\/content\/events\/[^/]+\/register$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'content.events.register.post', routeGroup: 'content-engagement' };
  }
  if (normalizedPath.startsWith('/v1/content/_debug/')) {
    return { routeKey: `debug.content.${normalizedMethod.toLowerCase()}`, routeGroup: 'debug' };
  }
  if (normalizedPath.startsWith('/v1/content/media/')) {
    return { routeKey: `media.legacy-content.${normalizedMethod.toLowerCase()}`, routeGroup: 'media' };
  }
  if (normalizedPath.startsWith('/v1/content/')) {
    return { routeKey: `content.read.${normalizedMethod.toLowerCase()}`, routeGroup: 'content-read' };
  }

  if (normalizedPath === '/v1/space/posts' && normalizedMethod === 'POST') {
    return { routeKey: 'space.posts.create.post', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/posts\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'space.posts.detail.get', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/posts\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'DELETE') {
    return { routeKey: 'space.posts.delete.delete', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/posts\/[^/]+\/repost$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'space.posts.repost.post', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/posts\/[^/]+\/media$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'space.posts.media.attach.post', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/posts\/[^/]+\/media\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'DELETE') {
    return { routeKey: 'space.posts.media.detach.delete', routeGroup: 'space' };
  }
  if (normalizedPath === '/v1/space/groups' && normalizedMethod === 'POST') {
    return { routeKey: 'space.groups.create.post', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/groups\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'space.groups.detail.get', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/groups\/[^/]+\/join$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'space.groups.join.post', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/groups\/[^/]+\/leave$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'space.groups.leave.post', routeGroup: 'space' };
  }
  if (normalizedPath === '/v1/space/feed/home' && normalizedMethod === 'GET') {
    return { routeKey: 'space.feed.home.get', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/feed\/profile\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'space.feed.profile.get', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/feed\/group\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'space.feed.group.get', routeGroup: 'space' };
  }
  if (normalizedPath === '/v1/space/feed/activity' && normalizedMethod === 'GET') {
    return { routeKey: 'space.feed.activity.get', routeGroup: 'space' };
  }
  if (/^\/v1\/space\/profiles\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'space.profiles.detail.get', routeGroup: 'space' };
  }
  if (normalizedPath.startsWith('/v1/space/')) {
    return { routeKey: `space.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'space' };
  }
  if (normalizedPath === '/v1/reactions' && normalizedMethod === 'POST') {
    return { routeKey: 'reactions.create.post', routeGroup: 'reactions' };
  }
  if (/^\/v1\/reactions\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'DELETE') {
    return { routeKey: 'reactions.delete.delete', routeGroup: 'reactions' };
  }
  if (/^\/v1\/reactions\/summary\/[^/]+\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'reactions.summary.get', routeGroup: 'reactions' };
  }
  if (normalizedPath === '/v1/reactions/summary:batch' && normalizedMethod === 'POST') {
    return { routeKey: 'reactions.summary-batch.post', routeGroup: 'reactions' };
  }
  if (normalizedPath.startsWith('/v1/reactions/')) {
    return { routeKey: `reactions.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'reactions' };
  }
  if (normalizedPath === '/v1/feed/home' && normalizedMethod === 'GET') {
    return { routeKey: 'feed.home.get', routeGroup: 'feed' };
  }
  if (/^\/v1\/feed\/group\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'feed.group.get', routeGroup: 'feed' };
  }
  if (/^\/v1\/feed\/profile\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'feed.profile.get', routeGroup: 'feed' };
  }
  if (normalizedPath === '/v1/feed/activity' && normalizedMethod === 'GET') {
    return { routeKey: 'feed.activity.get', routeGroup: 'feed' };
  }
  if (normalizedPath.startsWith('/v1/feed/')) {
    return { routeKey: `feed.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'feed' };
  }
  if (normalizedPath === '/v1/quests' && normalizedMethod === 'GET') {
    return { routeKey: 'quest.list.get', routeGroup: 'quest' };
  }
  if (normalizedPath === '/v1/quests' && normalizedMethod === 'POST') {
    return { routeKey: 'quest.create.post', routeGroup: 'quest' };
  }
  if (normalizedPath === '/v1/quests/mine' && normalizedMethod === 'GET') {
    return { routeKey: 'quest.mine.list.get', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/mine\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'quest.mine.detail.get', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/mine\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'PATCH') {
    return { routeKey: 'quest.mine.update.patch', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'PATCH') {
    return { routeKey: 'quest.mine.steps.update.patch', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'DELETE') {
    return { routeKey: 'quest.mine.steps.delete.delete', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'quest.detail.get', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/start$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.start.post', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/progress$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'quest.progress.get', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/steps$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.steps.create.post', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/publish$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.publish.post', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/archive$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.archive.post', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/steps\/[^/]+\/submit$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.submit.post', routeGroup: 'quest' };
  }
  if (/^\/v1\/quests\/[^/]+\/submissions$/.test(normalizedPath) && normalizedMethod === 'GET') {
    return { routeKey: 'quest.submissions.get', routeGroup: 'quest' };
  }
  if (/^\/v1\/submissions\/[^/]+\/review$/.test(normalizedPath) && normalizedMethod === 'POST') {
    return { routeKey: 'quest.review.post', routeGroup: 'quest' };
  }
  if (normalizedPath.startsWith('/v1/quests/') || normalizedPath.startsWith('/v1/submissions/')) {
    return { routeKey: `quest.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'quest' };
  }
  if (normalizedPath.startsWith('/v1/rielt/')) {
    return { routeKey: `rielt.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'rielt' };
  }
  if (normalizedPath.startsWith('/v1/guru/')) {
    return { routeKey: `guru.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'guru' };
  }
  if (normalizedPath.startsWith('/v1/rf/')) {
    return { routeKey: `rf.unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'rf' };
  }

  return { routeKey: `unknown.${normalizedMethod.toLowerCase()}`, routeGroup: 'unknown' };
}

function getClientIp(request: Request): string | null {
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp && cfConnectingIp.trim().length > 0) return cfConnectingIp.trim();

  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (!xForwardedFor) return null;
  const firstIp = xForwardedFor.split(',')[0]?.trim();
  return firstIp && firstIp.length > 0 ? firstIp : null;
}

export async function buildRequestContext(
  request: Request,
  verifiedUser: GatewayUserContext | null,
  requestId: string
): Promise<RequestContext> {
  const { routeKey, routeGroup } = classifyRoute(request.method, new URL(request.url).pathname);
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('User-Agent')?.trim() ?? '';

  const actorType: RequestContext['actorType'] =
    routeGroup === 'internal' ? 'internal' : verifiedUser ? 'user' : 'anonymous';
  const authLevel: RequestContext['authLevel'] =
    routeGroup === 'internal' ? 'internal' : verifiedUser ? 'user' : 'anonymous';

  return {
    requestId,
    actorType,
    actorId: verifiedUser?.userId ?? null,
    roles: verifiedUser?.roles ?? [],
    authLevel,
    clientIpHash: clientIp ? await sha256Base64Url(clientIp) : null,
    userAgentHash: userAgent ? await sha256Base64Url(userAgent) : null,
    routeKey,
    routeGroup,
  };
}

export function deriveEnforcementKeys(context: RequestContext): EnforcementKeys {
  const quotaActor =
    context.actorType === 'user'
      ? `user:${context.actorId ?? 'unknown'}`
      : context.actorType === 'internal'
        ? 'internal'
        : `anon:${context.clientIpHash ?? 'unknown-ip'}`;

  const abuseFingerprint =
    context.actorType === 'user'
      ? `user:${context.actorId ?? 'unknown'}:ip:${context.clientIpHash ?? 'unknown-ip'}`
      : context.actorType === 'internal'
        ? `internal:${context.routeKey}`
        : `ip:${context.clientIpHash ?? 'unknown-ip'}:ua:${context.userAgentHash ?? 'unknown-ua'}`;

  return {
    quotaKey: `${quotaActor}:route-group:${context.routeGroup}`,
    abuseKey: `${abuseFingerprint}:route-key:${context.routeKey}`,
  };
}

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function safeHostFromUrl(input?: string): string | null {
  if (!input) return null;
  try {
    return new URL(input).host;
  } catch {
    return null;
  }
}

function applyCors(res: Response, origin: string | null): Response {
  if (!origin) return res;
  // Clone to ensure headers are mutable (Cloudflare may return immutable headers).
  const out = new Response(res.body, res);
  out.headers.set('Access-Control-Allow-Origin', origin);
  out.headers.set('Vary', 'Origin');
  out.headers.set('Access-Control-Expose-Headers', 'X-Request-ID');
  return out;
}

async function maybeNormalizeGatewayResponse(path: string, response: Response): Promise<Response> {
  // Keep `/v1/media/*` as the canonical public contract even while the runtime
  // implementation still falls back to content-service.
  if (path !== '/v1/media/upload-token') return response;

  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) return response;

  const text = await response.text();
  let body = text;

  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (typeof parsed.uploadUrl === 'string' && parsed.uploadUrl.startsWith('/v1/content/media/upload/')) {
      parsed.uploadUrl = parsed.uploadUrl.replace('/v1/content/media/upload/', '/v1/media/upload/');
      body = JSON.stringify(parsed);
    }
  } catch {
    body = text;
  }

  const out = new Response(body, response);
  out.headers.set('Content-Type', 'application/json');
  return out;
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

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getStringClaim(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
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

function getObjectClaim(payload: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = payload[key];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeCanonicalPlatformRole(value: string | null): CanonicalPlatformRole | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'admin') return 'admin';
  if (normalized === 'pro') return 'pro';
  if (normalized === 'vip_spacer' || normalized === 'vip-spacer' || normalized === 'vip') return 'vip_spacer';
  if (normalized === 'spacer' || normalized === 'member' || normalized === 'user') return 'spacer';
  return null;
}

function extractCanonicalRole(payload: Record<string, unknown>, roles: string[]): CanonicalPlatformRole {
  const roleFromClaims = normalizeCanonicalPlatformRole(
    getStringClaim(payload, 'role') ??
      getStringClaim(payload, 'go2_role') ??
      getStringClaim(getObjectClaim(payload, 'public_metadata') ?? {}, 'role') ??
      getStringClaim(getObjectClaim(payload, 'publicMetadata') ?? {}, 'role')
  );
  if (roleFromClaims) return roleFromClaims;

  for (const role of roles) {
    const normalizedRole = normalizeCanonicalPlatformRole(role);
    if (normalizedRole) return normalizedRole;
  }
  return 'spacer';
}

function getJwtPayloadUnsafe(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payloadJson = new TextDecoder().decode(base64UrlToBytes(parts[1]));
    const parsed: unknown = JSON.parse(payloadJson);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getAuthorizedParties(origin: string | null, token: string): string[] | undefined {
  if (origin) {
    try {
      const parsed = new URL(origin);
      return [`${parsed.protocol}//${parsed.host}`];
    } catch {
      return undefined;
    }
  }

  // For non-browser clients (e.g. staging smoke scripts) Origin may be absent.
  // In that case, derive authorized party from session token azp when present.
  const unverifiedPayload = getJwtPayloadUnsafe(token);
  const azp = getStringClaim(unverifiedPayload ?? {}, 'azp');
  if (!azp) return undefined;
  try {
    const parsed = new URL(azp);
    return [`${parsed.protocol}//${parsed.host}`];
  } catch {
    return undefined;
  }
}

function getClerkVerificationCheck(env: Env): 'ok' | 'missing' {
  return getSecretCheck(env.CLERK_SECRET_KEY);
}

async function verifyClerkJwt(token: string, env: Env, origin: string | null): Promise<
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string }
> {
  const secretKey = env.CLERK_SECRET_KEY?.trim();
  if (!secretKey) return { ok: false, error: 'CLERK_SECRET_KEY is missing' };

  try {
    const payload = (await verifyToken(token, {
      secretKey,
      authorizedParties: getAuthorizedParties(origin, token),
    })) as Record<string, unknown>;
    return { ok: true, payload };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

function extractGatewayUserContext(payload: Record<string, unknown>): GatewayUserContext | null {
  const userId = getStringClaim(payload, 'sub');
  if (!userId) return null;
  const roles = getStringArrayClaim(payload, 'roles');
  const platformRole = extractCanonicalRole(payload, roles);
  const normalizedRoles = roles.length > 0 ? roles : [platformRole];
  return { userId, platformRole, roles: normalizedRoles };
}

async function mintInternalGatewayToken(
  env: Env,
  requestId: string,
  user: GatewayUserContext
): Promise<string | null> {
  if (!env.SERVICE_JWT_SECRET) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    iss: 'api-gateway',
    aud: 'internal',
    sub: user.userId,
    iat: now,
    exp: now + 300,
    rid: requestId,
    role: user.platformRole ?? 'spacer',
  };
  if (user.roles.length > 0) {
    payload.roles = user.roles;
  }
  return signHs256Jwt(payload, env.SERVICE_JWT_SECRET);
}

/**
 * Health check endpoint
 */
async function handleHealth(env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      service: 'api-gateway',
      env: env.ENVIRONMENT ?? 'staging',
      status: 'ok',
      version: env.VERSION ?? 'unknown',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function getUrlCheck(value?: string): 'ok' | 'missing' | 'invalid' {
  if (typeof value !== 'string' || value.trim().length === 0) return 'missing';
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? 'ok' : 'invalid';
  } catch {
    return 'invalid';
  }
}

function getReservedPhase2ServiceVar(path: string): keyof Env | null {
  if (path.startsWith('/v1/space/')) return 'SPACE_SERVICE_URL';
  if (path === '/v1/reactions' || path.startsWith('/v1/reactions/')) return 'REACTIONS_SERVICE_URL';
  if (path.startsWith('/v1/feed/')) return 'FEED_SERVICE_URL';
  if (path === '/v1/quests' || path.startsWith('/v1/quests/') || path.startsWith('/v1/submissions/')) {
    return 'QUEST_SERVICE_URL';
  }
  if (path.startsWith('/v1/rielt/')) return 'RIELT_SERVICE_URL';
  if (path.startsWith('/v1/guru/')) return 'GURU_SERVICE_URL';
  if (path.startsWith('/v1/rf/')) return 'RF_SERVICE_URL';
  return null;
}

function isProtectedSpaceRoute(method: string, path: string): boolean {
  if (method === 'POST' && path === '/v1/space/posts') return true;
  if (method === 'DELETE' && /^\/v1\/space\/posts\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/posts\/[^/]+\/repost$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/posts\/[^/]+\/media$/.test(path)) return true;
  if (method === 'DELETE' && /^\/v1\/space\/posts\/[^/]+\/media\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && path === '/v1/space/groups') return true;
  if (method === 'POST' && /^\/v1\/space\/groups\/[^/]+\/join$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/groups\/[^/]+\/leave$/.test(path)) return true;
  if (method === 'GET' && path === '/v1/space/feed/home') return true;
  if (method === 'GET' && path === '/v1/space/feed/activity') return true;
  return false;
}

function isProtectedReactionsRoute(method: string, path: string): boolean {
  if (method === 'POST' && path === '/v1/reactions') return true;
  if (method === 'DELETE' && /^\/v1\/reactions\/[^/]+$/.test(path)) return true;
  return false;
}

function isProtectedFeedRoute(method: string, path: string): boolean {
  if (method === 'GET' && path === '/v1/feed/home') return true;
  if (method === 'GET' && path === '/v1/feed/activity') return true;
  if (method === 'GET' && /^\/v1\/feed\/group\/[^/]+$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/feed\/profile\/[^/]+$/.test(path)) return true;
  return false;
}

function isProtectedQuestRoute(method: string, path: string): boolean {
  if (method === 'POST' && path === '/v1/quests') return true;
  if (method === 'GET' && path === '/v1/quests/mine') return true;
  if (method === 'GET' && /^\/v1\/quests\/mine\/[^/]+$/.test(path)) return true;
  if (method === 'PATCH' && /^\/v1\/quests\/mine\/[^/]+$/.test(path)) return true;
  if (method === 'PATCH' && /^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(path)) return true;
  if (method === 'DELETE' && /^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/start$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/quests\/[^/]+\/progress$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/steps$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/publish$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/archive$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/steps\/[^/]+\/submit$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/quests\/[^/]+\/submissions$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/submissions\/[^/]+\/review$/.test(path)) return true;
  return false;
}

function isProtectedRieltRoute(method: string, path: string): boolean {
  const isOwnerListingPath = /^\/v1\/rielt\/listings\/[^/]+$/.test(path) && path !== '/v1/rielt/listings/nearby';
  if (method === 'POST' && path === '/v1/rielt/listings') return true;
  if (method === 'GET' && path === '/v1/rielt/my/listings') return true;
  if (method === 'GET' && path === '/v1/rielt/my/inquiries') return true;
  if (method === 'POST' && /^\/v1\/rielt\/listings\/[^/]+\/inquiries$/.test(path)) return true;
  if (method === 'PATCH' && isOwnerListingPath) return true;
  if (method === 'DELETE' && isOwnerListingPath) return true;
  return false;
}

function isProtectedRfRoute(method: string, path: string): boolean {
  if (path.startsWith('/v1/rf/business/')) return true;
  if (path.startsWith('/v1/rf/pro/')) return true;
  if (path.startsWith('/v1/rf/me/')) return true;
  if (method === 'POST' && /^\/v1\/rf\/offers\/[^/]+\/claim$/.test(path)) return true;
  if (path.startsWith('/v1/rf/internal/')) return true;
  return false;
}

/**
 * Ready check endpoint
 */
async function handleReady(env: Env): Promise<Response> {
  const checks = {
    authServiceUrl: getUrlCheck(env.AUTH_SERVICE_URL),
    contentServiceUrl: getUrlCheck(env.CONTENT_SERVICE_URL),
    pointsServiceUrl: getUrlCheck(env.POINTS_SERVICE_URL),
    referralServiceUrl: getUrlCheck(env.REFERRAL_SERVICE_URL),
    clerkSecretKey: getClerkVerificationCheck(env),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;
  return new Response(
    JSON.stringify({
      service: 'api-gateway',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}

/**
 * Route request to appropriate service
 */
async function routeRequest(
  request: Request,
  env: Env,
  logger: ReturnType<typeof createLogger>,
  requestId: string
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  // Support legacy alias /v1/api/content/* by rewriting to /v1/content/*
  let downstreamPath = path.startsWith('/v1/api/content/') ? path.replace('/v1/api/content/', '/v1/content/') : path;
  const origin = request.headers.get('Origin');
  const route = classifyRoute(request.method, path);

  // Minimal CORS support for browser clients (PWA / localhost).
  // - Echo Origin (no wildcard) to support Authorization headers.
  // - Do not set Access-Control-Allow-Credentials.
  if (origin && request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        Vary: 'Origin',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
          'Authorization,Content-Type,Idempotency-Key,X-Request-Id,X-Request-ID,X-Gateway-Auth,X-User-ID',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Health checks
  if (path === '/health') {
    return handleHealth(env);
  }
  if (path === '/ready') {
    return handleReady(env);
  }

  // Debug (safe): show which service URLs are configured (host only)
  if (path === '/v1/_debug/routes' && request.method === 'GET') {
    // SECURITY: do not expose debug surfaces unless explicitly enabled.
    // This endpoint reveals routing structure and configured upstream hosts.
    const debugEnabled = (env.DEBUG_ROUTES_ENABLED ?? '').toLowerCase() === 'true';
    if (!debugEnabled) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'No route for path: /v1/_debug/routes',
          },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        env: env.ENVIRONMENT ?? 'staging',
        version: env.VERSION ?? 'unknown',
        routes: [
          { prefix: '/v1/auth/', var: 'AUTH_SERVICE_URL', host: safeHostFromUrl(env.AUTH_SERVICE_URL) },
          { prefix: '/v1/users/', var: 'AUTH_SERVICE_URL', host: safeHostFromUrl(env.AUTH_SERVICE_URL) },
          { prefix: '/v1/content/', var: 'CONTENT_SERVICE_URL', host: safeHostFromUrl(env.CONTENT_SERVICE_URL) },
          {
            prefix: '/v1/media/',
            var: 'MEDIA_SERVICE_URL (fallback CONTENT_SERVICE_URL)',
            host: safeHostFromUrl(env.MEDIA_SERVICE_URL ?? env.CONTENT_SERVICE_URL),
          },
          { prefix: '/v1/points/', var: 'POINTS_SERVICE_URL', host: safeHostFromUrl(env.POINTS_SERVICE_URL) },
          { prefix: '/v1/referral/', var: 'REFERRAL_SERVICE_URL', host: safeHostFromUrl(env.REFERRAL_SERVICE_URL) },
          // Phase 2 (planned): routes become active only when the corresponding *_SERVICE_URL var is configured
          { prefix: '/v1/space/', var: 'SPACE_SERVICE_URL', host: safeHostFromUrl(env.SPACE_SERVICE_URL) },
          { prefix: '/v1/reactions/', var: 'REACTIONS_SERVICE_URL', host: safeHostFromUrl(env.REACTIONS_SERVICE_URL) },
          { prefix: '/v1/feed/', var: 'FEED_SERVICE_URL', host: safeHostFromUrl(env.FEED_SERVICE_URL) },
          { prefix: '/v1/quests/', var: 'QUEST_SERVICE_URL', host: safeHostFromUrl(env.QUEST_SERVICE_URL) },
          { prefix: '/v1/submissions/', var: 'QUEST_SERVICE_URL', host: safeHostFromUrl(env.QUEST_SERVICE_URL) },
          { prefix: '/v1/rielt/', var: 'RIELT_SERVICE_URL', host: safeHostFromUrl(env.RIELT_SERVICE_URL) },
          { prefix: '/v1/guru/', var: 'GURU_SERVICE_URL', host: safeHostFromUrl(env.GURU_SERVICE_URL) },
          { prefix: '/v1/rf/', var: 'RF_SERVICE_URL', host: safeHostFromUrl(env.RF_SERVICE_URL) },
        ],
        rewrites: [{ from: '/v1/api/content/*', to: '/v1/content/*' }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Route to services based on path prefix
  let serviceUrl: string | undefined;
  let missingVar: string | null = null;
  let verifiedUser: GatewayUserContext | null = null;
  const reservedVar = getReservedPhase2ServiceVar(path);
  
  if (path.startsWith('/v1/auth/')) {
    serviceUrl = env.AUTH_SERVICE_URL;
    if (!serviceUrl) missingVar = 'AUTH_SERVICE_URL';
  } else if (path.startsWith('/v1/users/')) {
    // Users endpoints are served by auth-service in MVP (no separate user-service yet).
    serviceUrl = env.AUTH_SERVICE_URL;
    if (!serviceUrl) missingVar = 'AUTH_SERVICE_URL';
  } else if (path.startsWith('/v1/content/') || path.startsWith('/v1/api/content/')) {
    serviceUrl = env.CONTENT_SERVICE_URL;
    if (!serviceUrl) missingVar = 'CONTENT_SERVICE_URL';
  } else if (path.startsWith('/v1/media/')) {
    // `/v1/media/*` is a canonical public contract.
    // The content-service fallback below is transitional only until media-service exists.
    // Do not generalize this aliasing pattern to other future domains without an explicit decision.
    serviceUrl = env.MEDIA_SERVICE_URL ?? env.CONTENT_SERVICE_URL;
    if (!serviceUrl) {
      missingVar = 'CONTENT_SERVICE_URL';
    } else if (!env.MEDIA_SERVICE_URL) {
      downstreamPath = path.replace('/v1/media/', '/v1/content/media/');
    }
  } else if (path.startsWith('/v1/points/')) {
    serviceUrl = env.POINTS_SERVICE_URL;
    if (!serviceUrl) missingVar = 'POINTS_SERVICE_URL';
  } else if (path.startsWith('/v1/referral/')) {
    serviceUrl = env.REFERRAL_SERVICE_URL;
    if (!serviceUrl) missingVar = 'REFERRAL_SERVICE_URL';
  } else if (path.startsWith('/v1/space/')) {
    // Phase 2 (planned): do not fail with 502 if the service is not configured yet.
    // Keep behavior consistent with "unknown route" until SPACE_SERVICE_URL is provided.
    if (env.SPACE_SERVICE_URL) serviceUrl = env.SPACE_SERVICE_URL;
  } else if (path === '/v1/reactions' || path.startsWith('/v1/reactions/')) {
    if (env.REACTIONS_SERVICE_URL) serviceUrl = env.REACTIONS_SERVICE_URL;
  } else if (path.startsWith('/v1/feed/')) {
    if (env.FEED_SERVICE_URL) serviceUrl = env.FEED_SERVICE_URL;
  } else if (path === '/v1/quests' || path.startsWith('/v1/quests/') || path.startsWith('/v1/submissions/')) {
    if (env.QUEST_SERVICE_URL) serviceUrl = env.QUEST_SERVICE_URL;
  } else if (path.startsWith('/v1/rielt/')) {
    if (env.RIELT_SERVICE_URL) serviceUrl = env.RIELT_SERVICE_URL;
  } else if (path.startsWith('/v1/guru/')) {
    if (env.GURU_SERVICE_URL) serviceUrl = env.GURU_SERVICE_URL;
  } else if (path.startsWith('/v1/rf/')) {
    if (env.RF_SERVICE_URL) serviceUrl = env.RF_SERVICE_URL;
  }

  if (!serviceUrl) {
    if (reservedVar) {
      logger.info('Reserved phase-2 route is not enabled yet', { path, reservedVar });
      const res = new Response(
        JSON.stringify({
          error: {
            code: 'ROUTE_RESERVED_NOT_ENABLED',
            message: `${reservedVar} is not configured yet`,
          },
          requestId,
        }),
        { status: 501, headers: { 'Content-Type': 'application/json', 'X-Request-ID': requestId } }
      );
      return applyCors(res, origin);
    }

    if (missingVar) {
      logger.error('Service not configured', { path, missingVar });
      const res = new Response(
        JSON.stringify({
          error: {
            code: 'SERVICE_NOT_CONFIGURED',
            message: `${missingVar} is missing`,
          },
          requestId,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json', 'X-Request-ID': requestId } }
      );
      return applyCors(res, origin);
    }

    logger.warn('No service found for path', { path });
    const res = new Response(
      JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: `No service found for path: ${path}`,
        },
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return applyCors(res, origin);
  }

  // Prepare headers for downstream.
  // IMPORTANT: Do NOT forward the entire inbound header set.
  // Some headers (Host/Forwarded/CF-*) can cause Cloudflare to return its default HTML 404
  // even when the target Worker is healthy. Build a minimal, explicit header set instead.
  const headers = new Headers();
  const accept = request.headers.get('Accept');
  const acceptLang = request.headers.get('Accept-Language');
  const contentType = request.headers.get('Content-Type');
  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (accept) headers.set('Accept', accept);
  if (acceptLang) headers.set('Accept-Language', acceptLang);
  if (contentType) headers.set('Content-Type', contentType);
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey);
  headers.set('X-Request-Id', requestId);
  headers.set('X-Request-ID', requestId);

  // For user-facing routes that require user context, verify Clerk once at the gateway
  // and propagate only the derived internal token downstream.
  // - Points/Referral: all user-facing routes require auth
  // - Content register: POST /v1/content/events/{id}/register requires auth (content-service expects X-User-ID)
  const isContentRegister =
    request.method === 'POST' && /^\/v1\/content\/events\/[^/]+\/register$/.test(downstreamPath);
  // Media (Phase 2.2): token issuance requires auth, upload itself is authorized by a signed token.
  const isMediaUploadToken =
    request.method === 'POST' &&
    (downstreamPath === '/v1/content/media/upload-token' || downstreamPath === '/v1/media/upload-token');
  // Media attach requires gateway-to-service auth header.
  const isMediaAttach =
    request.method === 'POST' &&
    (/^\/v1\/content\/media\/[^/]+\/attach$/.test(downstreamPath) ||
      /^\/v1\/media\/[^/]+\/attach$/.test(downstreamPath));

  if (
    path.startsWith('/v1/points/') ||
    path.startsWith('/v1/referral/') ||
    path.startsWith('/v1/users/') ||
    isContentRegister ||
    isMediaUploadToken ||
    isMediaAttach ||
    isProtectedSpaceRoute(request.method, path) ||
    isProtectedReactionsRoute(request.method, path) ||
    isProtectedFeedRoute(request.method, path) ||
    isProtectedQuestRoute(request.method, path) ||
    isProtectedRieltRoute(request.method, path) ||
    isProtectedRfRoute(request.method, path)
  ) {
    const token = getBearerToken(request);
    let authMisconfigured = false;

    if (token && env.CLERK_SECRET_KEY) {
      const verified = await verifyClerkJwt(token, env, origin);
      if (!verified.ok) {
        const unverifiedPayload = getJwtPayloadUnsafe(token);
        logger.warn('Clerk verification failed', {
          reason: verified.error,
          origin: origin ?? null,
          authorizedParties: getAuthorizedParties(origin, token) ?? null,
          tokenIss: getStringClaim(unverifiedPayload ?? {}, 'iss') ?? null,
          tokenAzp: getStringClaim(unverifiedPayload ?? {}, 'azp') ?? null,
          hasSub: !!getStringClaim(unverifiedPayload ?? {}, 'sub'),
        });
        verifiedUser = null;
      } else {
        verifiedUser = extractGatewayUserContext(verified.payload);
      }
    } else if (token) {
      logger.error('CLERK_SECRET_KEY not set; refusing to trust user token');
      authMisconfigured = true;
    }

    if (!verifiedUser && token && !authMisconfigured) {
      logger.warn('Verified user token is missing usable subject claim');
    }

    if (!verifiedUser) {
      const status = authMisconfigured ? 503 : 401;
      const code = authMisconfigured ? 'SERVICE_AUTH_NOT_CONFIGURED' : 'UNAUTHORIZED';
      const message = authMisconfigured
        ? 'User auth verification is not configured'
        : 'Missing or invalid user token';
      const res = new Response(
        JSON.stringify({
          error: {
            code,
            message,
          },
          requestId,
        }),
        {
          status,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
      // IMPORTANT: also add CORS headers on auth errors,
      // otherwise browsers will surface this as a network/CORS failure (status=0).
      return applyCors(res, origin);
    }

    const gatewayToken = await mintInternalGatewayToken(env, requestId, verifiedUser);
    if (!gatewayToken) {
      logger.error('SERVICE_JWT_SECRET not set; cannot mint internal gateway token');
      const res = new Response(
        JSON.stringify({
          error: {
            code: 'SERVICE_AUTH_NOT_CONFIGURED',
            message: 'Gateway-to-service auth is not configured',
          },
          requestId,
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
      return applyCors(res, origin);
    }

    headers.set('X-Gateway-Auth', gatewayToken);
    // Temporary derived/debug header for compatibility during migration.
    headers.set('X-User-ID', verifiedUser.userId);
  }

  // Reserved for future rate-limit / abuse / AI quota hooks.
  // Intentionally internal-only: no downstream headers and no product behavior changes.
  const requestContext = await buildRequestContext(request, verifiedUser, requestId);
  const enforcementKeys = deriveEnforcementKeys(requestContext);

  // Forward request to service
  const baseUrl = serviceUrl.endsWith('/') ? serviceUrl.slice(0, -1) : serviceUrl;
  const targetUrl = `${baseUrl}${downstreamPath}${url.search}`;
  logger.info('Proxy request', {
    path,
    downstreamPath,
    targetHost: safeHostFromUrl(serviceUrl),
    routeKey: route.routeKey,
    routeGroup: route.routeGroup,
    actorType: requestContext.actorType,
    authLevel: requestContext.authLevel,
  });
  logger.debug('Derived request enforcement keys', {
    routeKey: requestContext.routeKey,
    routeGroup: requestContext.routeGroup,
    quotaKey: enforcementKeys.quotaKey,
    abuseKey: enforcementKeys.abuseKey,
  });

  // Only pass a body for methods that can have one.
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const serviceRequestInit: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
  };
  if (hasBody) {
    serviceRequestInit.duplex = 'half';
  }
  const serviceRequest = new Request(targetUrl, serviceRequestInit);

  try {
    const response = await fetch(serviceRequest);
    const normalizedResponse = await maybeNormalizeGatewayResponse(path, response);

    // Cloudflare may return a Response with immutable headers.
    // Always clone before adding/overriding headers.
    const out = new Response(normalizedResponse.body, normalizedResponse);
    // Diagnostic headers (no secrets). Helps debug proxy-chain issues.
    out.headers.set('X-Proxy-Target-Host', safeHostFromUrl(baseUrl) ?? '');
    out.headers.set('X-Proxy-Target-Path', downstreamPath);
    out.headers.set('X-Proxy-Downstream-Status', String(normalizedResponse.status));
    out.headers.set('X-Proxy-Downstream-Content-Type', normalizedResponse.headers.get('Content-Type') ?? '');
    return applyCors(out, origin);
  } catch (error) {
    logger.error('Error forwarding request to service', error, {
      serviceUrl,
      path,
    });
    const res = new Response(
      JSON.stringify({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Backend service is temporarily unavailable',
        },
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return applyCors(res, origin);
  }
}

/**
 * Main handler for Cloudflare Worker
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Extract or generate requestId
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'api-gateway', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const path = new URL(request.url).pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    logger.info('Incoming request', {
      method: request.method,
      path,
      ...classifyRoute(request.method, path),
    });

    try {
      response = await routeRequest(request, env, logger, requestId);

      // Ensure headers are mutable before setting X-Request-ID
      const out = new Response(response.body, response);
      out.headers.set('X-Request-ID', requestId);
      response = out;
      return out;
    } catch (error) {
      logger.error('Unhandled error in API Gateway', error, { method: request.method, path });
      response = new Response(
        JSON.stringify({
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An internal error occurred',
          },
          requestId,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
      return response;
    } finally {
      logRequestCompleted(logger, {
        method: request.method,
        path,
        status: response?.status ?? 500,
        durationMs: Date.now() - startedAt,
        targetHost: response?.headers.get('X-Proxy-Target-Host') ?? undefined,
        downstreamStatus: response?.headers.get('X-Proxy-Downstream-Status') ?? undefined,
      });
    }
  },
};







