export type FeedCursor = {
  publishedAt: string;
  id: string;
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(code: string, message: string, requestId: string, status: number): Response {
  return json(
    {
      error: { code, message },
      requestId,
    },
    status
  );
}

export function withRequestId(response: Response, requestId: string): Response {
  response.headers.set('X-Request-ID', requestId);
  return response;
}

export function handleNotFound(path: string, requestId: string): Response {
  return errorResponse('NOT_FOUND', `No route for path: ${path}`, requestId, 404);
}

export function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

export function parseJsonObject(input: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(input);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  const text = await request.text().catch(() => '');
  if (!text) return {};
  return parseJsonObject(text);
}

export function parsePositiveInt(value: string | null, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

export function encodeFeedCursor(cursor: FeedCursor): string {
  return btoa(JSON.stringify(cursor)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeFeedCursor(value: string | null): FeedCursor | null {
  if (!value) return null;
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const decoded = atob(`${normalized}${pad}`);
    const parsed: unknown = JSON.parse(decoded);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    if (typeof record.publishedAt !== 'string' || typeof record.id !== 'string') return null;
    return { publishedAt: record.publishedAt, id: record.id };
  } catch {
    return null;
  }
}
