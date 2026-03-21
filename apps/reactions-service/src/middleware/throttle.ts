import type { GatewayPrincipal } from './auth';
import { errorResponse } from './http';

type WriteThrottleEnv = {
  REACTIONS_WRITE_LIMIT?: string;
  REACTIONS_WRITE_WINDOW_SECONDS?: string;
};

const DEFAULT_WRITE_LIMIT = 30;
const DEFAULT_WRITE_WINDOW_SECONDS = 10;
const MAX_WRITE_LIMIT = 500;
const MAX_WRITE_WINDOW_SECONDS = 300;

const writesByUser = new Map<string, number[]>();

function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  max: number
): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function isProtectedWriteRoute(method: string, path: string): boolean {
  if (method === 'POST' && path === '/v1/reactions') return true;
  if (method === 'DELETE' && /^\/v1\/reactions\/[^/]+$/.test(path)) return true;
  return false;
}

function buildThrottleKey(principal: GatewayPrincipal, method: string): string {
  return `${principal.userId}:${method.toUpperCase()}`;
}

export function enforceReactionsWriteThrottle(
  env: WriteThrottleEnv,
  principal: GatewayPrincipal | null,
  method: string,
  path: string,
  requestId: string
): Response | null {
  if (!principal) return null;
  if (!isProtectedWriteRoute(method, path)) return null;

  const limit = parsePositiveInt(env.REACTIONS_WRITE_LIMIT, DEFAULT_WRITE_LIMIT, MAX_WRITE_LIMIT);
  const windowSeconds = parsePositiveInt(
    env.REACTIONS_WRITE_WINDOW_SECONDS,
    DEFAULT_WRITE_WINDOW_SECONDS,
    MAX_WRITE_WINDOW_SECONDS
  );
  const windowMs = windowSeconds * 1000;
  const now = Date.now();
  const since = now - windowMs;
  const key = buildThrottleKey(principal, method);

  const previous = writesByUser.get(key) ?? [];
  const recent = previous.filter((ts) => ts > since);
  if (recent.length >= limit) {
    return errorResponse(
      'RATE_LIMITED',
      'Too many reaction write requests. Please retry later.',
      requestId,
      429
    );
  }

  recent.push(now);
  writesByUser.set(key, recent);
  return null;
}
