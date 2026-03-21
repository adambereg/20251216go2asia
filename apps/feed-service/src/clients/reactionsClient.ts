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

function toReactionSummaryItem(raw: unknown): ReactionsSummaryItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.targetType !== 'string' || value.targetType.trim().length === 0) return null;
  if (typeof value.targetId !== 'string' || value.targetId.trim().length === 0) return null;

  const countsRaw = value.counts;
  const viewerRaw = value.viewer;
  const counts =
    countsRaw && typeof countsRaw === 'object' && !Array.isArray(countsRaw)
      ? (countsRaw as Record<string, unknown>)
      : null;
  const viewer =
    viewerRaw && typeof viewerRaw === 'object' && !Array.isArray(viewerRaw)
      ? (viewerRaw as Record<string, unknown>)
      : null;
  const like = typeof counts?.like === 'number' && Number.isFinite(counts.like) ? Math.max(0, counts.like) : 0;
  const liked = typeof viewer?.liked === 'boolean' ? viewer.liked : false;

  return {
    targetType: value.targetType,
    targetId: value.targetId,
    counts: { like },
    viewer: { liked },
  };
}

function parseSummaryBatchResponse(body: Record<string, unknown> | null): ReactionsSummaryBatchResponse | null {
  if (!body || !Array.isArray(body.items)) return null;
  const parsedItems: ReactionsSummaryItem[] = [];
  for (const rawItem of body.items) {
    const item = toReactionSummaryItem(rawItem);
    if (!item) return null;
    parsedItems.push(item);
  }
  return { items: parsedItems };
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

  const parsed = parseSummaryBatchResponse(body);
  if (!parsed) {
    return {
      ok: false,
      status: 502,
      body,
    };
  }

  return {
    ok: true,
    data: parsed,
  };
}
