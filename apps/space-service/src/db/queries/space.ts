import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

import type { FeedCursor } from '../../middleware/http';

type DbExecutor = Pick<Db, 'execute'>;

export type SpacePostRow = {
  id: string;
  author_id: string;
  author_display_name: string | null;
  author_avatar_url: string | null;
  author_role_label: string | null;
  group_id: string | null;
  post_type: 'post' | 'repost' | 'system';
  visibility: 'public' | 'followers' | 'group' | 'private';
  text: string | null;
  repost_target_type: string | null;
  repost_target_id: string | null;
  status: 'active' | 'flagged' | 'hidden' | 'deleted';
  created_at: string | Date;
  updated_at: string | Date;
  published_at: string | Date;
};

export type SpaceGroupRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  owner_id: string;
  visibility: 'public' | 'private' | 'invite_only';
  status: 'active' | 'hidden' | 'archived';
  members_count: number;
  created_at: string | Date;
  updated_at: string | Date;
};

export type SpaceMembershipRow = {
  group_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'owner';
  status: 'active' | 'pending' | 'removed' | 'blocked';
  joined_at: string | Date;
};

export type SpaceMediaRow = {
  media_id: string;
  sort_order: number;
};

export type SpaceProfileRow = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role_label: string | null;
  country_id: string | null;
  city_id: string | null;
  bio_short: string | null;
  updated_at: string | Date;
};

export type SpaceActivityFilter = 'all' | 'incoming' | 'my_actions';

export type SpaceActivityRow = {
  id: string;
  type: string;
  action_type: string;
  direction: 'incoming' | 'outgoing';
  category: 'social';
  actor_user_id: string;
  actor_display_name: string | null;
  actor_avatar_url: string | null;
  actor_role_label: string | null;
  title: string;
  description: string | null;
  related_post_id: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  occurred_at: string | Date;
};

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

type ActivityProjectionInput = {
  id: string;
  recipientUserId: string;
  occurredAt: string | Date;
  actionType: string;
  direction: 'incoming' | 'outgoing';
  category: 'social';
  actorUserId: string;
  title: string;
  description: string | null;
  relatedPostId: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  sourceStream: 'space' | 'reactions';
  sourceRecordKey: string;
  sourceEventId: string | null;
};

function applyCursorCondition(cursor: FeedCursor | null) {
  if (!cursor) {
    return sql``;
  }
  return sql`AND (sp.published_at < ${cursor.publishedAt} OR (sp.published_at = ${cursor.publishedAt} AND sp.id < ${cursor.id}))`;
}

export async function ensureProfileProjection(
  db: DbExecutor,
  userId: string,
  roleLabel: string | null = null
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_profile_projection (user_id, display_name, role_label, updated_at)
    VALUES (${userId}, ${userId}, ${roleLabel}, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      role_label = COALESCE(EXCLUDED.role_label, space_profile_projection.role_label),
      updated_at = now()
  `);
}

export async function getProfileByUserId(db: DbExecutor, userId: string): Promise<SpaceProfileRow | null> {
  const result = await db.execute(sql`
    SELECT user_id, display_name, avatar_url, role_label, country_id, city_id, bio_short, updated_at
    FROM space_profile_projection
    WHERE user_id = ${userId}
    LIMIT 1
  `);
  return rowsOf<SpaceProfileRow>(result)[0] ?? null;
}

export async function insertSpacePost(
  db: DbExecutor,
  input: {
    id: string;
    authorId: string;
    groupId: string | null;
    postType: 'post' | 'repost' | 'system';
    visibility: 'public' | 'followers' | 'group' | 'private';
    text: string | null;
    repostTargetType: string | null;
    repostTargetId: string | null;
  }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_post (
      id,
      author_id,
      group_id,
      post_type,
      visibility,
      text,
      repost_target_type,
      repost_target_id,
      status,
      created_at,
      updated_at,
      published_at,
      deleted_at
    )
    VALUES (
      ${input.id},
      ${input.authorId},
      ${input.groupId},
      ${input.postType},
      ${input.visibility},
      ${input.text},
      ${input.repostTargetType},
      ${input.repostTargetId},
      'active',
      now(),
      now(),
      now(),
      null
    )
  `);
}

export async function getPostById(db: DbExecutor, postId: string): Promise<SpacePostRow | null> {
  const result = await db.execute(sql`
    SELECT
      sp.id,
      sp.author_id,
      spp.display_name AS author_display_name,
      spp.avatar_url AS author_avatar_url,
      spp.role_label AS author_role_label,
      sp.group_id,
      sp.post_type,
      sp.visibility,
      sp.text,
      sp.repost_target_type,
      sp.repost_target_id,
      sp.status,
      sp.created_at,
      sp.updated_at,
      sp.published_at
    FROM space_post sp
    LEFT JOIN space_profile_projection spp ON spp.user_id = sp.author_id
    WHERE sp.id = ${postId}
    LIMIT 1
  `);
  return rowsOf<SpacePostRow>(result)[0] ?? null;
}

export async function findActiveRepostByAuthorAndTarget(
  db: DbExecutor,
  authorId: string,
  repostTargetType: string,
  repostTargetId: string
): Promise<SpacePostRow | null> {
  const result = await db.execute(sql`
    SELECT
      sp.id,
      sp.author_id,
      spp.display_name AS author_display_name,
      spp.avatar_url AS author_avatar_url,
      spp.role_label AS author_role_label,
      sp.group_id,
      sp.post_type,
      sp.visibility,
      sp.text,
      sp.repost_target_type,
      sp.repost_target_id,
      sp.status,
      sp.created_at,
      sp.updated_at,
      sp.published_at
    FROM space_post sp
    LEFT JOIN space_profile_projection spp ON spp.user_id = sp.author_id
    WHERE sp.author_id = ${authorId}
      AND sp.post_type = 'repost'
      AND sp.status = 'active'
      AND sp.deleted_at IS NULL
      AND sp.repost_target_type = ${repostTargetType}
      AND sp.repost_target_id = ${repostTargetId}
    ORDER BY sp.published_at DESC, sp.id DESC
    LIMIT 1
  `);
  return rowsOf<SpacePostRow>(result)[0] ?? null;
}

export async function softDeletePost(db: DbExecutor, postId: string, authorId: string): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE space_post
    SET status = 'deleted',
        deleted_at = now(),
        updated_at = now()
    WHERE id = ${postId}
      AND author_id = ${authorId}
      AND deleted_at IS NULL
    RETURNING id
  `);
  return rowsOf<{ id: string }>(result).length > 0;
}

export async function updateRepostTextByAuthor(
  db: DbExecutor,
  postId: string,
  authorId: string,
  text: string | null
): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE space_post
    SET text = ${text},
        updated_at = now()
    WHERE id = ${postId}
      AND author_id = ${authorId}
      AND post_type = 'repost'
      AND status = 'active'
      AND deleted_at IS NULL
    RETURNING id
  `);
  return rowsOf<{ id: string }>(result).length > 0;
}

export async function listMediaByPostId(db: DbExecutor, postId: string): Promise<SpaceMediaRow[]> {
  const result = await db.execute(sql`
    SELECT media_id, sort_order
    FROM space_post_media
    WHERE post_id = ${postId}
    ORDER BY sort_order ASC, media_id ASC
  `);
  return rowsOf<SpaceMediaRow>(result);
}

export async function hasPostMediaRelation(db: DbExecutor, postId: string, mediaId: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT 1 AS present
    FROM space_post_media
    WHERE post_id = ${postId} AND media_id = ${mediaId}
    LIMIT 1
  `);
  return rowsOf<{ present: number }>(result).length > 0;
}

export async function upsertPostMedia(
  db: DbExecutor,
  input: { postId: string; mediaId: string; sortOrder: number }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_post_media (post_id, media_id, sort_order, attached_at)
    VALUES (${input.postId}, ${input.mediaId}, ${input.sortOrder}, now())
    ON CONFLICT (post_id, media_id)
    DO UPDATE SET sort_order = EXCLUDED.sort_order, attached_at = now()
  `);
}

export async function deletePostMedia(db: DbExecutor, postId: string, mediaId: string): Promise<boolean> {
  const result = await db.execute(sql`
    DELETE FROM space_post_media
    WHERE post_id = ${postId} AND media_id = ${mediaId}
    RETURNING post_id
  `);
  return rowsOf<{ post_id: string }>(result).length > 0;
}

export async function countMediaByPostId(db: DbExecutor, postId: string): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS count
    FROM space_post_media
    WHERE post_id = ${postId}
  `);
  return rowsOf<{ count: number }>(result)[0]?.count ?? 0;
}

export async function insertSpaceGroup(
  db: DbExecutor,
  input: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    ownerId: string;
    visibility: 'public' | 'private' | 'invite_only';
  }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_group (
      id,
      slug,
      title,
      description,
      owner_id,
      visibility,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.slug},
      ${input.title},
      ${input.description},
      ${input.ownerId},
      ${input.visibility},
      'active',
      now(),
      now()
    )
  `);
}

export async function createOwnerMembership(db: DbExecutor, groupId: string, userId: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_group_member (group_id, user_id, role, status, joined_at, invited_by)
    VALUES (${groupId}, ${userId}, 'owner', 'active', now(), ${userId})
    ON CONFLICT (group_id, user_id)
    DO UPDATE SET role = 'owner', status = 'active', joined_at = now()
  `);
}

export async function getGroupById(db: DbExecutor, groupId: string): Promise<SpaceGroupRow | null> {
  const result = await db.execute(sql`
    SELECT
      sg.id,
      sg.slug,
      sg.title,
      sg.description,
      sg.owner_id,
      sg.visibility,
      sg.status,
      (
        SELECT COUNT(*)::int
        FROM space_group_member sgm
        WHERE sgm.group_id = sg.id AND sgm.status = 'active'
      ) AS members_count,
      sg.created_at,
      sg.updated_at
    FROM space_group sg
    WHERE sg.id = ${groupId}
    LIMIT 1
  `);
  return rowsOf<SpaceGroupRow>(result)[0] ?? null;
}

export async function getMembership(db: DbExecutor, groupId: string, userId: string): Promise<SpaceMembershipRow | null> {
  const result = await db.execute(sql`
    SELECT group_id, user_id, role, status, joined_at
    FROM space_group_member
    WHERE group_id = ${groupId} AND user_id = ${userId}
    LIMIT 1
  `);
  return rowsOf<SpaceMembershipRow>(result)[0] ?? null;
}

export async function upsertMembership(
  db: DbExecutor,
  input: {
    groupId: string;
    userId: string;
    role: 'member' | 'moderator' | 'owner';
    status: 'active' | 'pending' | 'removed' | 'blocked';
    invitedBy: string | null;
  }
): Promise<void> {
  await db.execute(sql`
    INSERT INTO space_group_member (group_id, user_id, role, status, joined_at, invited_by)
    VALUES (${input.groupId}, ${input.userId}, ${input.role}, ${input.status}, now(), ${input.invitedBy})
    ON CONFLICT (group_id, user_id)
    DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status, joined_at = now(), invited_by = EXCLUDED.invited_by
  `);
}

export async function markMembershipRemoved(db: DbExecutor, groupId: string, userId: string): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE space_group_member
    SET status = 'removed', joined_at = now()
    WHERE group_id = ${groupId} AND user_id = ${userId} AND status <> 'removed'
    RETURNING group_id
  `);
  return rowsOf<{ group_id: string }>(result).length > 0;
}

export async function upsertActivityProjectionRow(db: DbExecutor, input: ActivityProjectionInput): Promise<void> {
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
      ${input.id},
      ${input.recipientUserId},
      ${input.occurredAt},
      ${input.actionType},
      ${input.direction},
      ${input.category},
      ${input.actorUserId},
      ${input.title},
      ${input.description},
      ${input.relatedPostId},
      ${input.relatedEntityType},
      ${input.relatedEntityId},
      ${input.sourceStream},
      ${input.sourceRecordKey},
      ${input.sourceEventId},
      null
    )
    ON CONFLICT (recipient_user_id, action_type, source_record_key)
    DO UPDATE SET
      id = EXCLUDED.id,
      occurred_at = EXCLUDED.occurred_at,
      direction = EXCLUDED.direction,
      category = EXCLUDED.category,
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

export async function markActivityProjectionRemovedForPost(db: DbExecutor, postId: string): Promise<void> {
  await db.execute(sql`
    UPDATE space_activity_projection
    SET removed_at = now()
    WHERE removed_at IS NULL
      AND (
        related_post_id = ${postId}
        OR source_record_key = ${'repost:' + postId}
      )
  `);
}

export async function markActivityProjectionRemovedForGroupJoin(
  db: DbExecutor,
  groupId: string,
  userId: string
): Promise<void> {
  await db.execute(sql`
    UPDATE space_activity_projection
    SET removed_at = now()
    WHERE removed_at IS NULL
      AND recipient_user_id = ${userId}
      AND action_type = 'space.group_joined'
      AND source_record_key = ${`group_join:${groupId}:${userId}`}
  `);
}

export async function listHomeFeedPosts(
  db: DbExecutor,
  userId: string,
  limit: number,
  cursor: FeedCursor | null
): Promise<SpacePostRow[]> {
  const result = await db.execute(sql`
    SELECT
      sp.id,
      sp.author_id,
      spp.display_name AS author_display_name,
      spp.avatar_url AS author_avatar_url,
      spp.role_label AS author_role_label,
      sp.group_id,
      sp.post_type,
      sp.visibility,
      sp.text,
      sp.repost_target_type,
      sp.repost_target_id,
      sp.status,
      sp.created_at,
      sp.updated_at,
      sp.published_at
    FROM space_post sp
    LEFT JOIN space_profile_projection spp ON spp.user_id = sp.author_id
    WHERE sp.status = 'active'
      AND sp.deleted_at IS NULL
      AND (
        sp.author_id = ${userId}
        OR sp.visibility = 'public'
        OR (
          sp.visibility = 'group'
          AND sp.group_id IN (
            SELECT group_id
            FROM space_group_member
            WHERE user_id = ${userId} AND status = 'active'
          )
        )
      )
      ${applyCursorCondition(cursor)}
    ORDER BY sp.published_at DESC, sp.id DESC
    LIMIT ${limit}
  `);
  return rowsOf<SpacePostRow>(result);
}

export async function listProfileFeedPosts(
  db: DbExecutor,
  authorId: string,
  limit: number,
  cursor: FeedCursor | null
): Promise<SpacePostRow[]> {
  const result = await db.execute(sql`
    SELECT
      sp.id,
      sp.author_id,
      spp.display_name AS author_display_name,
      spp.avatar_url AS author_avatar_url,
      spp.role_label AS author_role_label,
      sp.group_id,
      sp.post_type,
      sp.visibility,
      sp.text,
      sp.repost_target_type,
      sp.repost_target_id,
      sp.status,
      sp.created_at,
      sp.updated_at,
      sp.published_at
    FROM space_post sp
    LEFT JOIN space_profile_projection spp ON spp.user_id = sp.author_id
    WHERE sp.author_id = ${authorId}
      AND sp.status = 'active'
      AND sp.deleted_at IS NULL
      ${applyCursorCondition(cursor)}
    ORDER BY sp.published_at DESC, sp.id DESC
    LIMIT ${limit}
  `);
  return rowsOf<SpacePostRow>(result);
}

export async function listGroupFeedPosts(
  db: DbExecutor,
  groupId: string,
  limit: number,
  cursor: FeedCursor | null
): Promise<SpacePostRow[]> {
  const result = await db.execute(sql`
    SELECT
      sp.id,
      sp.author_id,
      spp.display_name AS author_display_name,
      spp.avatar_url AS author_avatar_url,
      spp.role_label AS author_role_label,
      sp.group_id,
      sp.post_type,
      sp.visibility,
      sp.text,
      sp.repost_target_type,
      sp.repost_target_id,
      sp.status,
      sp.created_at,
      sp.updated_at,
      sp.published_at
    FROM space_post sp
    LEFT JOIN space_profile_projection spp ON spp.user_id = sp.author_id
    WHERE sp.group_id = ${groupId}
      AND sp.visibility = 'group'
      AND sp.status = 'active'
      AND sp.deleted_at IS NULL
      ${applyCursorCondition(cursor)}
    ORDER BY sp.published_at DESC, sp.id DESC
    LIMIT ${limit}
  `);
  return rowsOf<SpacePostRow>(result);
}

export async function listActivityFeedRows(
  db: DbExecutor,
  userId: string,
  filter: SpaceActivityFilter,
  limit: number,
  cursor: FeedCursor | null
): Promise<SpaceActivityRow[]> {
  const filterCondition =
    filter === 'incoming'
      ? sql`AND sap.direction = 'incoming'`
      : filter === 'my_actions'
        ? sql`AND sap.direction = 'outgoing'`
        : sql``;
  const cursorCondition = cursor
    ? sql`AND (
        sap.occurred_at < ${cursor.publishedAt}
        OR (sap.occurred_at = ${cursor.publishedAt} AND sap.id < ${cursor.id})
      )`
    : sql``;

  const result = await db.execute(sql`
    SELECT
      sap.id,
      CASE
        WHEN sap.action_type = 'space.post_created' THEN 'post_created'
        WHEN sap.action_type = 'space.repost_created' THEN 'repost_created'
        WHEN sap.action_type = 'space.group_joined' THEN 'group_joined'
        WHEN sap.action_type = 'space.post_liked_by_other' THEN 'post_liked_by_other'
        WHEN sap.action_type = 'space.post_reposted_by_other' THEN 'post_reposted_by_other'
        ELSE sap.action_type
      END AS type,
      sap.action_type,
      sap.direction,
      sap.category,
      sap.actor_user_id,
      spp.display_name AS actor_display_name,
      spp.avatar_url AS actor_avatar_url,
      spp.role_label AS actor_role_label,
      sap.title,
      sap.description,
      sap.related_post_id,
      sap.related_entity_type,
      sap.related_entity_id,
      sap.occurred_at
    FROM space_activity_projection sap
    LEFT JOIN space_profile_projection spp ON spp.user_id = sap.actor_user_id
    WHERE sap.recipient_user_id = ${userId}
      AND sap.removed_at IS NULL
      ${filterCondition}
      ${cursorCondition}
    ORDER BY sap.occurred_at DESC, sap.id DESC
    LIMIT ${limit}
  `);
  return rowsOf<SpaceActivityRow>(result);
}
