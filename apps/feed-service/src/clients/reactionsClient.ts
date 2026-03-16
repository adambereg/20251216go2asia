import type { UpstreamResult } from './spaceClient';

type ReactionsClientInput = {
  baseUrl: string;
  gatewayAuth: string;
  requestId: string;
};

export type ReactionsSummaryItem = {
  targetType: string;
  targetId: string;
  counts: { like: number };
  viewer: { liked: boolean };
};

type ReactionsSummaryBatchResponse = {
  items: ReactionsSummaryItem[];
};

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

export async function fetchReactionBatchSummary(
  input: ReactionsClientInput,
  targets: Array<{ targetType: 'space_post'; targetId: string }>
): Promise<UpstreamResult<ReactionsSummaryBatchResponse>> {
  const trimmed = input.baseUrl.endsWith('/') ? input.baseUrl.slice(0, -1) : input.baseUrl;
  let response: Response;
  try {
    response = await fetch(
      new Request(`${trimmed}/v1/reactions/summary:batch`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Gateway-Auth': input.gatewayAuth,
          'X-Request-Id': input.requestId,
        },
        body: JSON.stringify({ targets }),
      })
    );
  } catch {
    return {
      ok: false,
      status: 503,
      body: null,
    };
  }

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
    data: (body ?? { items: [] }) as ReactionsSummaryBatchResponse,
  };
}
