import { createDb } from '@go2asia/db';

import {
  applyLikeCountDelta,
  deleteReactionByIdForUser,
  getActiveReactionByIdForUser,
  getActiveReactionByIdentity,
  getReactionSummary,
  insertActiveReaction,
  type ReactionRow,
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
  reactionType: 'like';
};

type BatchSummaryInput = {
  targets: Array<{
    targetType: ReactionTargetType;
    targetId: string;
  }>;
};

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
  if (body.reactionType !== 'like') return null;
  if (typeof body.targetType !== 'string' || !ALLOWED_TARGET_TYPES.includes(body.targetType as ReactionTargetType)) {
    return null;
  }
  if (typeof body.targetId !== 'string' || body.targetId.trim().length === 0) return null;
  return {
    targetType: body.targetType as ReactionTargetType,
    targetId: body.targetId.trim(),
    reactionType: 'like',
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

export async function upsertReaction(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: ReactionsEventPublisher
): Promise<Response> {
  const parsed = parseUpsertReactionInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid reaction payload', requestId, 400);
  }
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }

  const db = createDb(env.DATABASE_URL);
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
    reactionType: 'like',
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

  if (created) {
    await applyLikeCountDelta(db, {
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      delta: 1,
    });
    await publisher.publish({
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: 'reaction.created',
      occurredAt: new Date().toISOString(),
      payload: {
        actorUserId: principal.userId,
        targetType: parsed.targetType,
        targetId: parsed.targetId,
        reactionType: 'like',
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

  await applyLikeCountDelta(db, {
    targetType: existing.target_type,
    targetId: existing.target_id,
    delta: -1,
  });
  await publisher.publish({
    eventId: `evt_${crypto.randomUUID()}`,
    eventType: 'reaction.deleted',
    occurredAt: new Date().toISOString(),
    payload: {
      actorUserId: principal.userId,
      targetType: existing.target_type,
      targetId: existing.target_id,
      reactionType: 'like',
      requestId,
    },
  });

  return json({ removed: true }, 200);
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
