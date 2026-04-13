import { createDb } from '@go2asia/db';

import {
  applyLikeCountDelta,
  deleteReactionByIdForUser,
  getActiveReactionByIdForUser,
  getActiveReactionByIdentity,
  listActiveReactionsByUser,
  getReactionIdempotencyRecord,
  getReactionSummary,
  insertReactionIdempotencyRecord,
  insertActiveReaction,
  type ReactionRow,
  type ReactionType,
  type ReactionTargetType,
} from '../db/queries/reactions';
import type { ReactionsEventPublisher } from '../events/publisher';
import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json } from '../middleware/http';

const ALLOWED_TARGET_TYPES: ReactionTargetType[] = [
  'space_post',
  'blog_post',
  'place',
  'event',
  'partner',
  'listing',
  'quest',
];

type Env = {
  DATABASE_URL?: string;
};

type UpsertReactionInput = {
  targetType: ReactionTargetType;
  targetId: string;
  reactionType: ReactionType;
};

type BatchSummaryInput = {
  targets: Array<{
    targetType: ReactionTargetType;
    targetId: string;
  }>;
};

type ListMyReactionsInput = {
  targetType: ReactionTargetType;
  reactionType: ReactionType;
  limit: number;
};

const ALLOWED_REACTION_TYPES: ReactionType[] = ['like', 'bookmark'];
const DEFAULT_MINE_LIMIT = 20;
const MAX_MINE_LIMIT = 50;

function normalizeReaction(row: ReactionRow) {
  return {
    id: row.id,
    actorUserId: row.user_id,
    targetType: row.target_type,
    targetId: row.target_id,
    reactionType: row.reaction_type,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function parseUpsertReactionInput(body: Record<string, unknown> | null): UpsertReactionInput | null {
  if (!body) return null;
  if (typeof body.reactionType !== 'string' || !ALLOWED_REACTION_TYPES.includes(body.reactionType as ReactionType)) {
    return null;
  }
  if (typeof body.targetType !== 'string' || !ALLOWED_TARGET_TYPES.includes(body.targetType as ReactionTargetType)) {
    return null;
  }
  if (typeof body.targetId !== 'string' || body.targetId.trim().length === 0) return null;
  const reactionType = body.reactionType as ReactionType;
  const targetType = body.targetType as ReactionTargetType;
  if (reactionType === 'bookmark' && targetType !== 'space_post') {
    return null;
  }
  return {
    targetType,
    targetId: body.targetId.trim(),
    reactionType,
  };
}

function parseListMyReactionsInput(searchParams: URLSearchParams): ListMyReactionsInput | null {
  const targetTypeRaw = searchParams.get('targetType');
  const reactionTypeRaw = searchParams.get('reactionType');
  if (!targetTypeRaw || !reactionTypeRaw) return null;
  if (!ALLOWED_TARGET_TYPES.includes(targetTypeRaw as ReactionTargetType)) return null;
  if (!ALLOWED_REACTION_TYPES.includes(reactionTypeRaw as ReactionType)) return null;
  const targetType = targetTypeRaw as ReactionTargetType;
  const reactionType = reactionTypeRaw as ReactionType;
  if (targetType !== 'space_post' || reactionType !== 'bookmark') {
    return null;
  }
  const limitRaw = searchParams.get('limit');
  let limit = DEFAULT_MINE_LIMIT;
  if (limitRaw !== null) {
    const parsed = Number.parseInt(limitRaw, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > MAX_MINE_LIMIT) return null;
    limit = parsed;
  }
  return {
    targetType,
    reactionType,
    limit,
  };
}

function parseBatchSummaryInput(body: Record<string, unknown> | null): BatchSummaryInput | null {
  if (!body || !Array.isArray(body.targets)) return null;
  if (body.targets.length < 1 || body.targets.length > 100) return null;
  const targets: BatchSummaryInput['targets'] = [];
  for (const rawTarget of body.targets) {
    if (!rawTarget || typeof rawTarget !== 'object' || Array.isArray(rawTarget)) return null;
    const target = rawTarget as Record<string, unknown>;
    if (
      typeof target.targetType !== 'string' ||
      !ALLOWED_TARGET_TYPES.includes(target.targetType as ReactionTargetType)
    ) {
      return null;
    }
    if (typeof target.targetId !== 'string' || target.targetId.trim().length === 0) return null;
    targets.push({
      targetType: target.targetType as ReactionTargetType,
      targetId: target.targetId.trim(),
    });
  }
  return { targets };
}

function parseIdempotencyKey(raw: string | null): { ok: true; value: string | null } | { ok: false } {
  if (raw === null) return { ok: true, value: null };
  const normalized = raw.trim();
  if (normalized.length === 0) return { ok: false };
  if (normalized.length < 8 || normalized.length > 128) return { ok: false };
  return { ok: true, value: normalized };
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function buildUpsertPayloadHash(input: UpsertReactionInput): Promise<string> {
  return sha256Hex(`${input.targetType}:${input.targetId}:${input.reactionType}`);
}

export async function upsertReaction(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: ReactionsEventPublisher,
  rawIdempotencyKey: string | null
): Promise<Response> {
  const parsed = parseUpsertReactionInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid reaction payload', requestId, 400);
  }
  const parsedIdempotencyKey = parseIdempotencyKey(rawIdempotencyKey);
  if (!parsedIdempotencyKey.ok) {
    return errorResponse('VALIDATION_ERROR', 'Invalid Idempotency-Key header', requestId, 400);
  }
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);
  const payloadHash = await buildUpsertPayloadHash(parsed);
  const idempotencyKey = parsedIdempotencyKey.value;
  if (idempotencyKey) {
    const record = await getReactionIdempotencyRecord(db, {
      userId: principal.userId,
      idempotencyKey,
    });
    if (record) {
      if (record.payload_hash !== payloadHash) {
        return errorResponse('CONFLICT', 'Idempotency-Key was already used for a different payload', requestId, 409);
      }
      const replayReaction = await getActiveReactionByIdForUser(db, record.reaction_id, principal.userId);
      if (!replayReaction) {
        return errorResponse('CONFLICT', 'Idempotency replay is not available for this reaction state', requestId, 409);
      }
      return json(
        {
          reaction: normalizeReaction(replayReaction),
          applied: false,
        },
        200
      );
    }
  }

  const existing = await getActiveReactionByIdentity(db, {
    userId: principal.userId,
    targetType: parsed.targetType,
    targetId: parsed.targetId,
    reactionType: parsed.reactionType,
  });
  if (existing) {
    return json(
      {
        reaction: normalizeReaction(existing),
        applied: false,
      },
      200
    );
  }

  const created = await insertActiveReaction(db, {
    id: `react_${crypto.randomUUID()}`,
    userId: principal.userId,
    targetType: parsed.targetType,
    targetId: parsed.targetId,
    reactionType: parsed.reactionType,
  });

  const reaction = created
    ? created
    : await getActiveReactionByIdentity(db, {
        userId: principal.userId,
        targetType: parsed.targetType,
        targetId: parsed.targetId,
        reactionType: parsed.reactionType,
      });

  if (!reaction) {
    return errorResponse('INTERNAL_ERROR', 'Failed to persist reaction', requestId, 500);
  }

  if (idempotencyKey) {
    const inserted = await insertReactionIdempotencyRecord(db, {
      userId: principal.userId,
      idempotencyKey,
      payloadHash,
      reactionId: reaction.id,
    });
    if (!inserted) {
      const record = await getReactionIdempotencyRecord(db, {
        userId: principal.userId,
        idempotencyKey,
      });
      if (!record || record.payload_hash !== payloadHash || record.reaction_id !== reaction.id) {
        return errorResponse('CONFLICT', 'Idempotency-Key was already used for a different payload', requestId, 409);
      }
    }
  }

  if (created) {
    if (parsed.reactionType === 'like') {
      await applyLikeCountDelta(db, {
        targetType: parsed.targetType,
        targetId: parsed.targetId,
        delta: 1,
      });
    }
    await publisher.publish({
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: 'reaction.created',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      producer: {
        service: 'reactions-service',
      },
      trace: {
        requestId,
      },
      actor: {
        userId: principal.userId,
      },
      subject: {
        targetType: parsed.targetType,
        targetId: parsed.targetId,
      },
      payload: {
        actorUserId: principal.userId,
        targetType: parsed.targetType,
        targetId: parsed.targetId,
        reactionType: parsed.reactionType,
        requestId,
      },
    });
  }

  return json(
    {
      reaction: normalizeReaction(reaction),
      applied: !!created,
    },
    200
  );
}

export async function removeReactionById(
  env: Env,
  reactionId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: ReactionsEventPublisher
): Promise<Response> {
  if (!reactionId || reactionId.trim().length === 0) {
    return errorResponse('VALIDATION_ERROR', 'reactionId is required', requestId, 400);
  }
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);
  const existing = await getActiveReactionByIdForUser(db, reactionId, principal.userId);
  if (!existing) {
    return errorResponse('NOT_FOUND', 'Active reaction not found', requestId, 404);
  }

  const removed = await deleteReactionByIdForUser(db, reactionId, principal.userId);
  if (!removed) {
    return errorResponse('NOT_FOUND', 'Active reaction not found', requestId, 404);
  }

  if (existing.reaction_type === 'like') {
    await applyLikeCountDelta(db, {
      targetType: existing.target_type,
      targetId: existing.target_id,
      delta: -1,
    });
  }
  await publisher.publish({
    eventId: `evt_${crypto.randomUUID()}`,
    eventType: 'reaction.deleted',
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    producer: {
      service: 'reactions-service',
    },
    trace: {
      requestId,
    },
    actor: {
      userId: principal.userId,
    },
    subject: {
      targetType: existing.target_type,
      targetId: existing.target_id,
    },
    payload: {
      actorUserId: principal.userId,
      targetType: existing.target_type,
      targetId: existing.target_id,
      reactionType: existing.reaction_type,
      requestId,
    },
  });

  return json({ removed: true }, 200);
}

export async function listMyReactions(
  env: Env,
  request: Request,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }
  const parsed = parseListMyReactionsInput(new URL(request.url).searchParams);
  if (!parsed) {
    return errorResponse(
      'VALIDATION_ERROR',
      'Expected targetType=space_post and reactionType=bookmark (optional limit=1..50)',
      requestId,
      400
    );
  }

  const db = createDb(env.DATABASE_URL);
  const items = await listActiveReactionsByUser(db, {
    userId: principal.userId,
    targetType: parsed.targetType,
    reactionType: parsed.reactionType,
    limit: parsed.limit,
  });

  return json(
    {
      items: items.map((item) => ({ reaction: normalizeReaction(item) })),
      nextCursor: null,
    },
    200
  );
}

export async function getReactionSummarySingle(
  env: Env,
  targetType: string,
  targetId: string,
  principal: GatewayPrincipal | null,
  requestId: string
): Promise<Response> {
  if (!ALLOWED_TARGET_TYPES.includes(targetType as ReactionTargetType) || !targetId.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Invalid reaction target', requestId, 400);
  }
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);
  const item = await getReactionSummary(db, {
    targetType: targetType as ReactionTargetType,
    targetId: targetId.trim(),
    viewerUserId: principal?.userId ?? null,
  });

  return json(
    {
      item: {
        targetType: item.target_type,
        targetId: item.target_id,
        counts: { like: item.like_count },
        viewer: { liked: item.viewer_liked },
      },
    },
    200
  );
}

export async function getReactionSummaryBatch(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal | null,
  requestId: string
): Promise<Response> {
  const parsed = parseBatchSummaryInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid batch summary payload', requestId, 400);
  }
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);
  const uniqueTargets = new Map<string, { targetType: ReactionTargetType; targetId: string }>();
  for (const target of parsed.targets) {
    uniqueTargets.set(`${target.targetType}:${target.targetId}`, target);
  }

  const items = [];
  for (const target of uniqueTargets.values()) {
    const summary = await getReactionSummary(db, {
      targetType: target.targetType,
      targetId: target.targetId,
      viewerUserId: principal?.userId ?? null,
    });
    items.push({
      targetType: summary.target_type,
      targetId: summary.target_id,
      counts: { like: summary.like_count },
      viewer: { liked: summary.viewer_liked },
    });
  }

  return json({ items }, 200);
}
