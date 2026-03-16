import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

type DbExecutor = Pick<Db, 'execute'>;

export type ReactionTargetType = 'space_post' | 'blog_post' | 'place' | 'event' | 'partner' | 'listing' | 'quest';
export type ReactionType = 'like';
export type ReactionStatus = 'active' | 'deleted';

export type ReactionRow = {
  id: string;
  user_id: string;
  target_type: ReactionTargetType;
  target_id: string;
  reaction_type: ReactionType;
  status: ReactionStatus;
  created_at: string | Date;
  updated_at: string | Date;
};

export type ReactionSummaryRow = {
  target_type: ReactionTargetType;
  target_id: string;
  like_count: number;
  viewer_liked: boolean;
};

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

export async function getActiveReactionByIdentity(
  db: DbExecutor,
  input: {
    userId: string;
    targetType: ReactionTargetType;
    targetId: string;
    reactionType: ReactionType;
  }
): Promise<ReactionRow | null> {
  const result = await db.execute(sql`
    SELECT id, user_id, target_type, target_id, reaction_type, status, created_at, updated_at
    FROM reactions
    WHERE user_id = ${input.userId}
      AND target_type = ${input.targetType}
      AND target_id = ${input.targetId}
      AND reaction_type = ${input.reactionType}
      AND status = 'active'
    LIMIT 1
  `);
  return rowsOf<ReactionRow>(result)[0] ?? null;
}

export async function insertActiveReaction(
  db: DbExecutor,
  input: {
    id: string;
    userId: string;
    targetType: ReactionTargetType;
    targetId: string;
    reactionType: ReactionType;
  }
): Promise<ReactionRow | null> {
  const result = await db.execute(sql`
    INSERT INTO reactions (
      id,
      user_id,
      target_type,
      target_id,
      reaction_type,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.userId},
      ${input.targetType},
      ${input.targetId},
      ${input.reactionType},
      'active',
      now(),
      now()
    )
    ON CONFLICT (user_id, target_type, target_id, reaction_type)
    DO NOTHING
    RETURNING id, user_id, target_type, target_id, reaction_type, status, created_at, updated_at
  `);
  return rowsOf<ReactionRow>(result)[0] ?? null;
}

export async function getActiveReactionByIdForUser(
  db: DbExecutor,
  reactionId: string,
  userId: string
): Promise<ReactionRow | null> {
  const result = await db.execute(sql`
    SELECT id, user_id, target_type, target_id, reaction_type, status, created_at, updated_at
    FROM reactions
    WHERE id = ${reactionId}
      AND user_id = ${userId}
      AND status = 'active'
    LIMIT 1
  `);
  return rowsOf<ReactionRow>(result)[0] ?? null;
}

export async function deleteReactionByIdForUser(db: DbExecutor, reactionId: string, userId: string): Promise<boolean> {
  const result = await db.execute(sql`
    DELETE FROM reactions
    WHERE id = ${reactionId}
      AND user_id = ${userId}
      AND status = 'active'
    RETURNING id
  `);
  return rowsOf<{ id: string }>(result).length > 0;
}

export async function applyLikeCountDelta(
  db: DbExecutor,
  input: { targetType: ReactionTargetType; targetId: string; delta: 1 | -1 }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO reaction_aggregates (target_type, target_id, like_count, updated_at)
    VALUES (${input.targetType}, ${input.targetId}, ${input.delta === 1 ? 1 : 0}, now())
    ON CONFLICT (target_type, target_id)
    DO UPDATE SET
      like_count = GREATEST(0, reaction_aggregates.like_count + ${input.delta}),
      updated_at = now()
  `);
}

export async function getReactionSummary(
  db: DbExecutor,
  input: {
    targetType: ReactionTargetType;
    targetId: string;
    viewerUserId: string | null;
  }
): Promise<ReactionSummaryRow> {
  const result = await db.execute(sql`
    SELECT
      ${input.targetType}::reaction_target_type AS target_type,
      ${input.targetId}::text AS target_id,
      COALESCE(ra.like_count, 0)::int AS like_count,
      CASE
        WHEN ${input.viewerUserId}::text IS NULL THEN false
        WHEN EXISTS (
          SELECT 1
          FROM reactions r
          WHERE r.user_id = ${input.viewerUserId}
            AND r.target_type = ${input.targetType}
            AND r.target_id = ${input.targetId}
            AND r.reaction_type = 'like'
            AND r.status = 'active'
        ) THEN true
        ELSE false
      END AS viewer_liked
    FROM (SELECT 1) seed
    LEFT JOIN reaction_aggregates ra
      ON ra.target_type = ${input.targetType}
      AND ra.target_id = ${input.targetId}
    LIMIT 1
  `);

  return (
    rowsOf<ReactionSummaryRow>(result)[0] ?? {
      target_type: input.targetType,
      target_id: input.targetId,
      like_count: 0,
      viewer_liked: false,
    }
  );
}
