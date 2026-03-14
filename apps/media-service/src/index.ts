import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

type JwtVerifyResult = { ok: true; payload: Record<string, unknown> } | { ok: false; error: string };

type GatewayPrincipal = {
  userId: string;
  roles: string[];
};

type MediaScope = 'content' | 'space' | 'rf' | 'rielt' | 'quest' | 'avatar';

const MEDIA_SCOPES = new Set<MediaScope>(['content', 'space', 'rf', 'rielt', 'quest', 'avatar']);

type UploadTokenPayload = {
  v: 1;
  key: string;
  userId: string;
  scope: MediaScope;
  contentType: string;
  maxBytes: number;
  exp: number;
};

type MediaLookupResponse = {
  media_id: string;
  publicUrl: string | null;
  variants: Array<{
    kind: string;
    publicUrl: string | null;
    mimeType: string;
    width: number | null;
    height: number | null;
  }>;
  mimeType: string;
  width: number | null;
  height: number | null;
};

type AttachMediaUsageResponse = {
  ok: true;
  media_id: string;
  status: 'attached';
  usage: {
    ownerType: string;
    ownerId: string;
    usageType: string;
    slot: string | null;
  };
  requestId: string;
};

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;

  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;

  MEDIA_UPLOAD_SIGNING_SECRET?: string;
  MEDIA_PUBLIC_BASE_URL?: string;
  MEDIA_MAX_BYTES?: string;

  MEDIA_BUCKET?: R2Bucket;
  SPACE_MEDIA_BUCKET?: R2Bucket;
  MEDIA_BUCKET_NAME?: string;
  SPACE_MEDIA_BUCKET_NAME?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(code: string, message: string, requestId: string, status: number): Response {
  return json({ error: { code, message }, requestId }, status);
}

function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function getCheck(value: unknown): 'ok' | 'missing' {
  if (typeof value === 'string') return value.trim().length > 0 ? 'ok' : 'missing';
  return value ? 'ok' : 'missing';
}

function handleHealth(env: Env): Response {
  return json({
    service: 'media-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  const checks = {
    databaseUrl: getSecretCheck(env.DATABASE_URL),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
    mediaUploadSigningSecret: getSecretCheck(env.MEDIA_UPLOAD_SIGNING_SECRET),
    mediaBucket: getCheck(env.MEDIA_BUCKET ?? env.SPACE_MEDIA_BUCKET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: 'media-service',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    },
    status
  );
}

function handleNotFound(path: string, requestId: string): Response {
  return errorResponse('NOT_FOUND', `No route for path: ${path}`, requestId, 404);
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
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

async function hmacSha256(secret: string, payload: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, utf8ToBytes(payload));
  return new Uint8Array(signature);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
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

async function verifyHs256Jwt(token: string, secret: string): Promise<JwtVerifyResult> {
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

  const signature = base64UrlToBytes(signatureB64);
  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);

  const ok = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!ok) return { ok: false, error: 'Invalid signature' };

  const now = Math.floor(Date.now() / 1000);

  const exp = payload.exp;
  if (typeof exp === 'number' && now >= exp) return { ok: false, error: 'Token expired' };

  const nbf = payload.nbf;
  if (typeof nbf === 'number' && now < nbf) return { ok: false, error: 'Token is not active yet' };

  return { ok: true, payload };
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
      res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503),
    };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) {
    return {
      ok: false,
      res: errorResponse('UNAUTHORIZED', 'Missing X-Gateway-Auth header', requestId, 401),
    };
  }

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return {
      ok: false,
      res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token', requestId, 401),
    };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'api-gateway',
    aud: 'internal',
  });
  if (!claims.ok) {
    logger.warn('Gateway-origin token claims rejected', { reason: claims.error });
    return {
      ok: false,
      res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token claims', requestId, 401),
    };
  }

  const userId = getStringClaim(verified.payload, 'sub');
  if (!userId) {
    logger.warn('Gateway-origin token missing subject claim');
    return {
      ok: false,
      res: errorResponse('UNAUTHORIZED', 'Missing user subject in X-Gateway-Auth', requestId, 401),
    };
  }

  return {
    ok: true,
    principal: {
      userId,
      roles: getStringArrayClaim(verified.payload, 'roles'),
    },
  };
}

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sanitizeFilename(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9._-]+/g, '_');
  return cleaned.length > 0 ? cleaned.slice(0, 120) : 'file';
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

function pickMediaBucket(env: Env, scope: MediaScope): R2Bucket | null {
  if (scope === 'space') return env.SPACE_MEDIA_BUCKET ?? env.MEDIA_BUCKET ?? null;
  return env.MEDIA_BUCKET ?? null;
}

function pickBucketName(env: Env, scope: MediaScope): string {
  if (scope === 'space') return (env.SPACE_MEDIA_BUCKET_NAME ?? env.MEDIA_BUCKET_NAME ?? 'go2asiaspace').trim();
  return (env.MEDIA_BUCKET_NAME ?? 'go2asia-media').trim();
}

async function signUploadToken(secret: string, payload: UploadTokenPayload): Promise<string> {
  const payloadB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(payload)));
  const sig = await hmacSha256(secret, payloadB64);
  const sigB64 = bytesToBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

async function verifyUploadToken(
  secret: string,
  token: string
): Promise<{ ok: true; payload: UploadTokenPayload } | { ok: false; error: string }> {
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

function requireDatabaseUrl(env: Env, requestId: string): { ok: true; url: string } | { ok: false; res: Response } {
  const dbUrl = env.DATABASE_URL?.trim();
  if (!dbUrl) {
    return {
      ok: false,
      res: errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503),
    };
  }
  return { ok: true, url: dbUrl };
}

function normalizeOptionalField(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

async function persistMediaMetadata(
  db: ReturnType<typeof createDb>,
  env: Env,
  input: {
    ownerUserId: string;
    scope: MediaScope;
    key: string;
    contentType: string;
    size: number;
  }
): Promise<{ ok: true } | { ok: false; res: Response }> {
  const id = `media_${crypto.randomUUID()}`;
  const bucket = pickBucketName(env, input.scope);
  const publicUrl = getPublicUrl(env, input.key) ?? '';

  await db.execute(sql`
    INSERT INTO media_files (id, provider, bucket, key, public_url, mime_type, size, width, height, created_at)
    VALUES (${id}, 'r2', ${bucket}, ${input.key}, ${publicUrl}, ${input.contentType}, ${input.size}, null, null, now())
    ON CONFLICT (provider, bucket, key) DO UPDATE
    SET public_url = EXCLUDED.public_url,
        mime_type = EXCLUDED.mime_type,
        size = EXCLUDED.size,
        width = EXCLUDED.width,
        height = EXCLUDED.height
  `);

  const assetId = `asset_${crypto.randomUUID()}`;
  await db.execute(sql`
    INSERT INTO media_assets (
      id, owner_user_id, scope, provider, bucket, key, mime_type, size, width, height, status, created_at, updated_at
    )
    VALUES (
      ${assetId}, ${input.ownerUserId}, ${input.scope}, 'r2', ${bucket}, ${input.key}, ${input.contentType}, ${input.size}, null, null, 'uploaded', now(), now()
    )
    ON CONFLICT (provider, bucket, key) DO UPDATE
    SET owner_user_id = EXCLUDED.owner_user_id,
        scope = EXCLUDED.scope,
        status = 'uploaded',
        mime_type = EXCLUDED.mime_type,
        size = EXCLUDED.size,
        updated_at = now()
    RETURNING id
  `);

  type AssetRow = { id: string };
  const assetRowResult = await db.execute(sql`
    SELECT id
    FROM media_assets
    WHERE provider = 'r2'
      AND bucket = ${bucket}
      AND key = ${input.key}
    LIMIT 1
  `);
  const rows = (assetRowResult as unknown as { rows?: AssetRow[] }).rows ?? [];
  const persistedAssetId = rows[0]?.id;
  if (persistedAssetId) {
    const variantId = `variant_${crypto.randomUUID()}`;
    await db.execute(sql`
      INSERT INTO media_variants (
        id, asset_id, kind, status, provider, bucket, key, mime_type, size, width, height, created_at, updated_at
      )
      VALUES (
        ${variantId}, ${persistedAssetId}, 'original', 'ready', 'r2', ${bucket}, ${input.key}, ${input.contentType}, ${input.size}, null, null, now(), now()
      )
      ON CONFLICT (asset_id, kind) DO UPDATE
      SET status = EXCLUDED.status,
          mime_type = EXCLUDED.mime_type,
          size = EXCLUDED.size,
          updated_at = now()
    `);
  }

  return { ok: true };
}

async function isTokenAlreadyConsumed(
  db: ReturnType<typeof createDb>,
  env: Env,
  scope: MediaScope,
  key: string
): Promise<boolean> {
  const bucket = pickBucketName(env, scope);
  const result = await db.execute(sql`
    SELECT id
    FROM media_files
    WHERE provider = 'r2'
      AND bucket = ${bucket}
      AND key = ${key}
    LIMIT 1
  `);
  type Row = { id: string };
  const rows = (result as unknown as { rows?: Row[] }).rows ?? [];
  return rows.length > 0;
}

async function handleCreateMediaUploadToken(
  request: Request,
  env: Env,
  requestId: string,
  userId: string
): Promise<Response> {
  const secret = (env.MEDIA_UPLOAD_SIGNING_SECRET ?? '').trim();
  if (!secret) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'MEDIA_UPLOAD_SIGNING_SECRET is missing', requestId, 503);
  }

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
  if (!MEDIA_SCOPES.has(scope)) {
    return errorResponse('BAD_REQUEST', 'Invalid scope', requestId, 400);
  }

  const filename = sanitizeFilename(typeof filenameRaw === 'string' ? filenameRaw : 'file');
  const contentType = typeof contentTypeRaw === 'string' ? contentTypeRaw : 'application/octet-stream';
  if (!contentType.startsWith('image/')) {
    return errorResponse('BAD_REQUEST', 'Only image/* uploads are allowed', requestId, 400);
  }

  const maxBytesDefault = parseIntOrDefault(env.MEDIA_MAX_BYTES, 10 * 1024 * 1024);
  const sizeBytes = typeof sizeBytesRaw === 'number' && Number.isFinite(sizeBytesRaw) ? sizeBytesRaw : null;
  if (sizeBytes !== null && (sizeBytes < 1 || sizeBytes > maxBytesDefault)) {
    return errorResponse('BAD_REQUEST', 'Invalid sizeBytes', requestId, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 10 * 60;
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
      uploadUrl: `/v1/media/upload/${token}`,
      key: objectKey,
      publicUrl: getPublicUrl(env, objectKey),
      expiresAt: new Date(exp * 1000).toISOString(),
      requestId,
    },
    200
  );
}

async function handleUploadByToken(
  request: Request,
  env: Env,
  requestId: string,
  token: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const secret = (env.MEDIA_UPLOAD_SIGNING_SECRET ?? '').trim();
  if (!secret) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'MEDIA_UPLOAD_SIGNING_SECRET is missing', requestId, 503);
  }

  const verified = await verifyUploadToken(secret, token);
  if (!verified.ok) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired upload token', requestId, 401);
  }

  const payload = verified.payload;
  const bucket = pickMediaBucket(env, payload.scope);
  if (!bucket) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'MEDIA_BUCKET binding is missing', requestId, 503);
  }
  const dbUrl = requireDatabaseUrl(env, requestId);
  if (!dbUrl.ok) return dbUrl.res;
  const db = createDb(dbUrl.url);

  try {
    const consumed = await isTokenAlreadyConsumed(db, env, payload.scope, payload.key);
    if (consumed) {
      return errorResponse('UNAUTHORIZED', 'Upload token already used', requestId, 401);
    }
  } catch (error) {
    logger.error('Upload token consumption check failed', error, { key: payload.key });
    return errorResponse('INTERNAL_ERROR', 'Upload validation failed', requestId, 500);
  }

  const contentType = request.headers.get('Content-Type') ?? payload.contentType;
  if (!contentType.startsWith('image/')) {
    return errorResponse('BAD_REQUEST', 'Only image/* uploads are allowed', requestId, 400);
  }

  const body = await request.arrayBuffer().catch(() => null);
  if (!body) {
    return errorResponse('BAD_REQUEST', 'Missing body', requestId, 400);
  }

  const bytes = new Uint8Array(body);
  if (bytes.byteLength < 1 || bytes.byteLength > payload.maxBytes) {
    return errorResponse('BAD_REQUEST', 'File too large', requestId, 400);
  }

  try {
    await bucket.put(payload.key, bytes, {
      httpMetadata: { contentType },
      customMetadata: {
        userId: payload.userId,
        scope: payload.scope,
      },
    });
  } catch (error) {
    logger.error('R2 put failed', error, { key: payload.key });
    return errorResponse('INTERNAL_ERROR', 'Upload failed', requestId, 500);
  }

  try {
    const persisted = await persistMediaMetadata(db, env, {
      ownerUserId: payload.userId,
      scope: payload.scope,
      key: payload.key,
      contentType,
      size: bytes.byteLength,
    });
    if (!persisted.ok) return persisted.res;
  } catch (error) {
    logger.error('Media metadata persistence failed', error, { key: payload.key });
    return errorResponse('INTERNAL_ERROR', 'Metadata persistence failed', requestId, 500);
  }

  logger.info('Media uploaded and persisted', {
    key: payload.key,
    scope: payload.scope,
    userId: payload.userId,
  });

  return json(
    {
      ok: true,
      key: payload.key,
      publicUrl: getPublicUrl(env, payload.key),
      requestId,
    },
    201
  );
}

async function handleGetMediaById(
  env: Env,
  requestId: string,
  mediaId: string
): Promise<Response> {
  const dbUrl = requireDatabaseUrl(env, requestId);
  if (!dbUrl.ok) return dbUrl.res;
  const db = createDb(dbUrl.url);

  const assetResult = await db.execute(sql`
    SELECT id, key, mime_type, width, height
    FROM media_assets
    WHERE id = ${mediaId}
    LIMIT 1
  `);
  type AssetRow = {
    id: string;
    key: string;
    mime_type: string;
    width: number | null;
    height: number | null;
  };
  const assetRows = (assetResult as unknown as { rows?: AssetRow[] }).rows ?? [];
  const asset = assetRows[0];
  if (!asset) {
    return errorResponse('NOT_FOUND', `Media asset not found: ${mediaId}`, requestId, 404);
  }

  const variantsResult = await db.execute(sql`
    SELECT kind, key, mime_type, width, height
    FROM media_variants
    WHERE asset_id = ${mediaId}
    ORDER BY kind ASC
  `);
  type VariantRow = {
    kind: string;
    key: string;
    mime_type: string;
    width: number | null;
    height: number | null;
  };
  const variantRows = (variantsResult as unknown as { rows?: VariantRow[] }).rows ?? [];

  const response: MediaLookupResponse = {
    media_id: asset.id,
    publicUrl: getPublicUrl(env, asset.key),
    variants: variantRows.map((variant) => ({
      kind: variant.kind,
      publicUrl: getPublicUrl(env, variant.key),
      mimeType: variant.mime_type,
      width: variant.width,
      height: variant.height,
    })),
    mimeType: asset.mime_type,
    width: asset.width,
    height: asset.height,
  };

  return json(response, 200);
}

async function handleAttachMediaUsage(
  request: Request,
  env: Env,
  requestId: string,
  mediaId: string,
  principal: GatewayPrincipal
): Promise<Response> {
  const dbUrl = requireDatabaseUrl(env, requestId);
  if (!dbUrl.ok) return dbUrl.res;
  const db = createDb(dbUrl.url);

  const bodyUnknown: unknown = await request.json().catch(() => null);
  const body =
    bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
      ? (bodyUnknown as Record<string, unknown>)
      : null;

  const ownerType = normalizeOptionalField(body?.ownerType, 64);
  const ownerId = normalizeOptionalField(body?.ownerId, 128);
  const usageType = normalizeOptionalField(body?.usageType, 64);
  const slot = normalizeOptionalField(body?.slot, 64);

  if (!ownerType || !ownerId || !usageType) {
    return errorResponse('BAD_REQUEST', 'ownerType, ownerId and usageType are required', requestId, 400);
  }

  const assetResult = await db.execute(sql`
    SELECT id, owner_user_id
    FROM media_assets
    WHERE id = ${mediaId}
    LIMIT 1
  `);
  type AssetOwnerRow = { id: string; owner_user_id: string };
  const assetRows = (assetResult as unknown as { rows?: AssetOwnerRow[] }).rows ?? [];
  const asset = assetRows[0];
  if (!asset) {
    return errorResponse('NOT_FOUND', `Media asset not found: ${mediaId}`, requestId, 404);
  }

  if (asset.owner_user_id !== principal.userId) {
    return errorResponse('FORBIDDEN', 'You do not own this media asset', requestId, 403);
  }

  const usageId = `usage_${crypto.randomUUID()}`;
  await db.execute(sql`
    INSERT INTO media_usage (id, media_id, owner_type, owner_id, usage_type, slot, created_at, deleted_at)
    VALUES (${usageId}, ${mediaId}, ${ownerType}, ${ownerId}, ${usageType}, ${slot}, now(), null)
    ON CONFLICT (media_id, owner_type, owner_id, usage_type, slot) DO NOTHING
  `);

  await db.execute(sql`
    UPDATE media_assets
    SET status = 'attached',
        attached_entity_type = ${ownerType},
        attached_entity_id = ${ownerId},
        attached_slot = ${slot},
        attached_at = now(),
        updated_at = now()
    WHERE id = ${mediaId}
  `);

  const response: AttachMediaUsageResponse = {
    ok: true,
    media_id: mediaId,
    status: 'attached',
    usage: {
      ownerType,
      ownerId,
      usageType,
      slot,
    },
    requestId,
  };
  return json(response, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'media-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });

    const path = new URL(request.url).pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      if (path === '/health' || path === '/version') {
        response = handleHealth(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      if (path === '/ready') {
        response = handleReady(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      if (path === '/v1/media/upload-token' && request.method === 'POST') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-ID', requestId);
          return auth.res;
        }
        response = await handleCreateMediaUploadToken(request, env, requestId, auth.principal.userId);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      const uploadMatch = path.match(/^\/v1\/media\/upload\/(.+)$/);
      if (uploadMatch && request.method === 'PUT') {
        response = await handleUploadByToken(request, env, requestId, uploadMatch[1], logger);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      const mediaLookupMatch = path.match(/^\/v1\/media\/([^/]+)$/);
      if (mediaLookupMatch && request.method === 'GET') {
        const mediaId = mediaLookupMatch[1];
        if (mediaId === 'upload-token') {
          response = handleNotFound(path, requestId);
          response.headers.set('X-Request-ID', requestId);
          return response;
        }
        response = await handleGetMediaById(env, requestId, decodeURIComponent(mediaId));
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      const mediaAttachMatch = path.match(/^\/v1\/media\/([^/]+)\/attach$/);
      if (mediaAttachMatch && request.method === 'POST') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-ID', requestId);
          return auth.res;
        }
        response = await handleAttachMediaUsage(
          request,
          env,
          requestId,
          decodeURIComponent(mediaAttachMatch[1]),
          auth.principal
        );
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      response = handleNotFound(path, requestId);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = errorResponse('INTERNAL_ERROR', 'Unexpected error', requestId, 500);
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
