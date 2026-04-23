import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

type DbExecutor = Pick<Db, 'execute'>;

type SpacePostActivityTargetRow = {
  id: string;
  author_id: string;
  text: string | null;
  status: 'active' | 'flagged' | 'hidden' | 'deleted';
};

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

function makeActivityId(parts: string[]): string {
  return `activity:space.post_liked_by_other:${parts.join(':')}`;
}

export async function getSpacePostActivityTarget(
  db: DbExecutor,
  postId: string
): Promise<SpacePostActivityTargetRow | null> {
  const result = await db.execute(sql`
    SELECT id, author_id, text, status
    FROM space_post
    WHERE id = ${postId}
      AND deleted_at IS NULL
    LIMIT 1
  `);
  return rowsOf<SpacePostActivityTargetRow>(result)[0] ?? null;
}

export async function upsertIncomingLikeActivityProjection(
  db: DbExecutor,
  input: {
    actorUserId: string;
    recipientUserId: string;
    relatedPostId: string;
    description: string | null;
    occurredAt: string;
    sourceEventId: string;
  }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_activity_projection (
      id,
      recipient_user_id,
      occurred_at,
      action_type,
      direction,
      category,
      actor_user_id,
      title,
      description,
      related_post_id,
      related_entity_type,
      related_entity_id,
      source_stream,
      source_record_key,
      source_event_id,
      removed_at
    )
    VALUES (
      ${makeActivityId([input.actorUserId, input.relatedPostId, input.recipientUserId])},
      ${input.recipientUserId},
      ${input.occurredAt},
      'space.post_liked_by_other',
      'incoming',
      'social',
      ${input.actorUserId},
      'Someone liked your post',
      ${input.description},
      ${input.relatedPostId},
      'space_post',
      ${input.relatedPostId},
      'reactions',
      ${`reaction:like:${input.actorUserId}:space_post:${input.relatedPostId}`},
      ${input.sourceEventId},
      null
    )
    ON CONFLICT (recipient_user_id, action_type, source_record_key)
    DO UPDATE SET
      id = EXCLUDED.id,
      occurred_at = EXCLUDED.occurred_at,
      actor_user_id = EXCLUDED.actor_user_id,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      related_post_id = EXCLUDED.related_post_id,
      related_entity_type = EXCLUDED.related_entity_type,
      related_entity_id = EXCLUDED.related_entity_id,
      source_stream = EXCLUDED.source_stream,
      source_event_id = EXCLUDED.source_event_id,
      removed_at = null
  `);
}

export async function retractIncomingLikeActivityProjection(
  db: DbExecutor,
  input: {
    actorUserId: string;
    recipientUserId: string;
    relatedPostId: string;
  }
): Promise<void> {
  await db.execute(sql`
    UPDATE space_activity_projection
    SET removed_at = now()
    WHERE removed_at IS NULL
      AND recipient_user_id = ${input.recipientUserId}
      AND action_type = 'space.post_liked_by_other'
      AND source_record_key = ${`reaction:like:${input.actorUserId}:space_post:${input.relatedPostId}`}
  `);
}
