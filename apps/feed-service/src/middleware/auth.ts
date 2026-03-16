import { createLogger } from '@go2asia/logger';

import { errorResponse, parseJsonObject } from './http';

type JwtVerifyResult = { ok: true; payload: Record<string, unknown> } | { ok: false; error: string };

export type GatewayPrincipal = {
  userId: string;
  roles: string[];
};

export interface AuthEnv {
  SERVICE_JWT_SECRET?: string;
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const bin = atob(`${normalized}${pad}`);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
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

export async function requireGatewayOrigin(
  request: Request,
  env: AuthEnv,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true; principal: GatewayPrincipal } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return { ok: false, res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503) };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) {
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing X-Gateway-Auth header', requestId, 401) };
  }

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
      roles: getStringArrayClaim(verified.payload, 'roles'),
    },
  };
}
