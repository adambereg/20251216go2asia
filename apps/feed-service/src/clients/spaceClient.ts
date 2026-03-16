export type UpstreamResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; body: Record<string, unknown> | null };

type SpaceClientInput = {
  baseUrl: string;
  gatewayAuth: string;
  requestId: string;
};

function buildUrl(baseUrl: string, path: string, query: Record<string, string | number | null | undefined>): string {
  const trimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = new URL(`${trimmed}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function readJsonObjectOrNull(response: Response): Promise<Record<string, unknown> | null> {
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) return null;
  try {
    const parsed: unknown = await response.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function getFromSpace<T>(
  input: SpaceClientInput,
  path: string,
  query: Record<string, string | number | null | undefined>
): Promise<UpstreamResult<T>> {
  const url = buildUrl(input.baseUrl, path, query);
  const response = await fetch(
    new Request(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Gateway-Auth': input.gatewayAuth,
        'X-Request-Id': input.requestId,
      },
    })
  );

  const body = await readJsonObjectOrNull(response);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      body,
    };
  }

  return {
    ok: true,
    data: (body ?? {}) as T,
  };
}

export async function fetchHomeFeed<T>(
  input: SpaceClientInput,
  limit: number,
  cursor: string | null
): Promise<UpstreamResult<T>> {
  return getFromSpace<T>(input, '/v1/space/feed/home', { limit, cursor });
}

export async function fetchGroupFeed<T>(
  input: SpaceClientInput,
  groupId: string,
  limit: number,
  cursor: string | null
): Promise<UpstreamResult<T>> {
  return getFromSpace<T>(input, `/v1/space/feed/group/${encodeURIComponent(groupId)}`, { limit, cursor });
}

export async function fetchProfileFeed<T>(
  input: SpaceClientInput,
  userId: string,
  limit: number,
  cursor: string | null
): Promise<UpstreamResult<T>> {
  return getFromSpace<T>(input, `/v1/space/feed/profile/${encodeURIComponent(userId)}`, { limit, cursor });
}

export async function fetchActivityFeed<T>(
  input: SpaceClientInput,
  limit: number,
  cursor: string | null
): Promise<UpstreamResult<T>> {
  return getFromSpace<T>(input, '/v1/space/feed/activity', { limit, cursor });
}
