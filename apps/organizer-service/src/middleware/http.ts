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
