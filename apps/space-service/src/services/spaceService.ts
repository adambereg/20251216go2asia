import { createDb } from '@go2asia/db';

import {
  countMediaByPostId,
  createOwnerMembership,
  ensureProfileProjection,
  getGroupById,
  getMembership,
  hasPostMediaRelation,
  getPostById,
  getProfileByUserId,
  insertSpaceGroup,
  insertSpacePost,
  listActivityFeedRows,
  listGroupFeedPosts,
  listHomeFeedPosts,
  listMediaByPostId,
  listProfileFeedPosts,
  markActivityProjectionRemovedForGroupJoin,
  markActivityProjectionRemovedForPost,
  markMembershipRemoved,
  softDeletePost,
  type SpaceActivityFilter,
  upsertMembership,
  upsertActivityProjectionRow,
  upsertPostMedia,
  deletePostMedia,
  findActiveRepostByAuthorAndTarget,
  updateRepostTextByAuthor,
  type SpaceActivityRow,
  type SpaceGroupRow,
  type SpaceMembershipRow,
  type SpacePostRow,
  type SpaceProfileRow,
} from '../db/queries/space';
import {
  assertActivityFeedSurfaceProjection,
  type LegacySurfaceId,
  spacePostRowInput,
} from '../domain/perSurfaceLegacyMatrix';
import {
  applyAuthorialExpressionReadGuards,
  assertAuthorialExpressionWrite,
  classifyAuthorialExpressionWriteIntent,
  classifyAuthorialTextRole,
  parseAuthorialExpressionIntentFromBody,
} from '../domain/authorialExpression';
import { classifyRepostTextRole, classifyRepostWriteIntent } from '../domain/retentionIntent';
import type { SpaceDomainEventType } from '../events/contracts';
import type { SpaceEventPublisher } from '../events/publisher';
import type { GatewayPrincipal } from '../middleware/auth';
import { decodeFeedCursor, encodeFeedCursor, errorResponse } from '../middleware/http';

type ServiceEnv = {
  DATABASE_URL?: string;
  SPACE_MAX_MEDIA_ATTACHMENTS?: string;
  SPACE_MAX_TEXT_LENGTH?: string;
};

function toDisplayRoleLabel(platformRole: GatewayPrincipal['platformRole']): string {
  switch (platformRole) {
    case 'vip_spacer':
      return 'VIP Spacer';
    case 'pro':
      return 'PRO';
    case 'admin':
      return 'Admin';
    case 'spacer':
    default:
      return 'Spacer';
  }
}

const REPOST_TARGET_TYPES = new Set(['space_post', 'blog_post', 'place', 'event', 'partner', 'listing', 'quest']);
const REPOST_DEDUPE_TARGET_TYPES = new Set(['space_post', 'blog_post', 'place', 'event']);

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isConstraintViolation(error: unknown, constraintName: string): boolean {
  if (!error || typeof error !== 'object') return false;
  const dbError = error as { code?: string; constraint?: string; message?: string };
  return dbError.code === '23505' || dbError.constraint === constraintName || dbError.message?.includes(constraintName) === true;
}

function getDb(env: ServiceEnv, requestId: string) {
  if (!env.DATABASE_URL) {
    return {
      ok: false as const,
      res: errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is not configured', requestId, 503),
    };
  }
  return {
    ok: true as const,
    db: createDb(env.DATABASE_URL),
  };
}

function normalizeOptionalString(value: unknown, maxLength = 10_000): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

function parseCreatePostText(
  value: unknown,
  maxLength: number
): { ok: true; text: string | null } | { ok: false; message: string } {
  if (value === undefined || value === null) return { ok: true, text: null };
  if (typeof value !== 'string') {
    return { ok: false, message: 'text must be a string when provided' };
  }
  const normalized = value.trim();
  if (!normalized) return { ok: true, text: null };
  if (normalized.length > maxLength) {
    return { ok: false, message: `text length must be <= ${maxLength}` };
  }
  return { ok: true, text: normalized };
}

function normalizeVisibility(value: unknown): 'public' | 'followers' | 'group' | 'private' | null {
  return value === 'public' || value === 'followers' || value === 'group' || value === 'private' ? value : null;
}

function normalizePostType(value: unknown): 'post' | 'repost' | 'system' | null {
  return value === 'post' || value === 'repost' || value === 'system' ? value : null;
}

function normalizeGroupVisibility(value: unknown): 'public' | 'private' | 'invite_only' | null {
  return value === 'public' || value === 'private' || value === 'invite_only' ? value : null;
}

function normalizeGroupSlug(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (!/^[a-z0-9-]+$/.test(normalized)) return null;
  return normalized.slice(0, 160);
}

function canCreateGroup(principal: GatewayPrincipal): boolean {
  return principal.platformRole === 'admin' || principal.platformRole === 'pro';
}

async function canViewGroup(
  group: SpaceGroupRow,
  viewer: GatewayPrincipal | null,
  getMembershipForViewer: () => Promise<SpaceMembershipRow | null>
): Promise<boolean> {
  if (group.status !== 'active') return false;
  if (group.visibility === 'public') return true;
  if (!viewer) return false;
  if (group.owner_id === viewer.userId) return true;
  const membership = await getMembershipForViewer();
  return membership?.status === 'active';
}

async function canViewPost(
  post: SpacePostRow,
  viewer: GatewayPrincipal | null,
  getMembershipForGroup: () => Promise<SpaceMembershipRow | null>
): Promise<boolean> {
  if (post.status !== 'active') return false;
  if (post.visibility === 'public') return true;
  if (!viewer) return false;
  if (post.author_id === viewer.userId) return true;
  if (post.visibility === 'private' || post.visibility === 'followers') return false;
  if (post.visibility === 'group') {
    const membership = await getMembershipForGroup();
    return membership?.status === 'active';
  }
  return false;
}

async function mapPostResponse(
  db: ReturnType<typeof createDb>,
  post: SpacePostRow,
  surface: LegacySurfaceId
) {
  applyAuthorialExpressionReadGuards(surface, spacePostRowInput(post, surface));
  const mediaRows = await listMediaByPostId(db, post.id);
  return {
    id: post.id,
    author: {
      userId: post.author_id,
      displayName: post.author_display_name ?? post.author_id,
      avatarUrl: post.author_avatar_url,
      roleLabel: post.author_role_label,
    },
    groupId: post.group_id,
    postType: post.post_type,
    visibility: post.visibility,
    text: post.text,
    status: post.status,
    repost:
      post.repost_target_type && post.repost_target_id
        ? {
            targetType: post.repost_target_type,
            targetId: post.repost_target_id,
            resolvedPreview: null,
          }
        : null,
    media: mediaRows.map((row) => ({
      mediaId: row.media_id,
      sortOrder: row.sort_order,
    })),
    createdAt: toIso(post.created_at),
    updatedAt: toIso(post.updated_at),
    publishedAt: toIso(post.published_at),
  };
}

async function emit(
  publisher: SpaceEventPublisher,
  eventType: SpaceDomainEventType,
  payload: Record<string, unknown>,
  meta?: {
    requestId?: string;
    actorUserId?: string;
    subject?: {
      targetType: string;
      targetId: string;
    };
  }
): Promise<void> {
  await publisher.publish({
    eventId: `evt_${crypto.randomUUID()}`,
    eventType,
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    producer: {
      service: 'space-service',
    },
    ...(meta?.requestId
      ? {
          trace: {
            requestId: meta.requestId,
          },
        }
      : {}),
    ...(meta?.actorUserId
      ? {
          actor: {
            userId: meta.actorUserId,
          },
        }
      : {}),
    ...(meta?.subject
      ? {
          subject: meta.subject,
        }
      : {}),
    payload,
  });
}

function makeActivityId(actionType: string, parts: string[]): string {
  return `activity:${actionType}:${parts.join(':')}`;
}

async function materializeOutgoingPostActivity(db: ReturnType<typeof createDb>, post: SpacePostRow): Promise<void> {
  const actionType = post.post_type === 'repost' ? 'space.repost_created' : 'space.post_created';
  await upsertActivityProjectionRow(db, {
    id: makeActivityId(actionType, [post.id]),
    recipientUserId: post.author_id,
    occurredAt: post.published_at,
    actionType,
    direction: 'outgoing',
    category: 'social',
    actorUserId: post.author_id,
    title: post.post_type === 'repost' ? 'You reposted an item' : 'You created a post',
    description: post.text,
    relatedPostId: post.id,
    relatedEntityType: post.repost_target_type,
    relatedEntityId: post.repost_target_id,
    sourceStream: 'space',
    sourceRecordKey: `post:${post.id}`,
    sourceEventId: post.id,
  });
}

async function materializeIncomingRepostActivity(
  db: ReturnType<typeof createDb>,
  repostPost: SpacePostRow,
  targetPost: SpacePostRow | null
): Promise<void> {
  if (
    repostPost.post_type !== 'repost' ||
    repostPost.repost_target_type !== 'space_post' ||
    !targetPost ||
    targetPost.status !== 'active' ||
    targetPost.author_id === repostPost.author_id
  ) {
    return;
  }

  await upsertActivityProjectionRow(db, {
    id: makeActivityId('space.post_reposted_by_other', [repostPost.id, targetPost.author_id]),
    recipientUserId: targetPost.author_id,
    occurredAt: repostPost.published_at,
    actionType: 'space.post_reposted_by_other',
    direction: 'incoming',
    category: 'social',
    actorUserId: repostPost.author_id,
    title: 'Someone reposted your post',
    description: targetPost.text,
    relatedPostId: targetPost.id,
    relatedEntityType: 'space_post',
    relatedEntityId: repostPost.id,
    sourceStream: 'space',
    sourceRecordKey: `repost:${repostPost.id}`,
    sourceEventId: repostPost.id,
  });
}

async function materializeGroupJoinedActivity(
  db: ReturnType<typeof createDb>,
  membership: SpaceMembershipRow,
  group: SpaceGroupRow
): Promise<void> {
  if (membership.status !== 'active') return;

  await upsertActivityProjectionRow(db, {
    id: makeActivityId('space.group_joined', [membership.group_id, membership.user_id]),
    recipientUserId: membership.user_id,
    occurredAt: membership.joined_at,
    actionType: 'space.group_joined',
    direction: 'outgoing',
    category: 'social',
    actorUserId: membership.user_id,
    title: `You joined ${group.title}`,
    description: group.description,
    relatedPostId: null,
    relatedEntityType: 'space_group',
    relatedEntityId: membership.group_id,
    sourceStream: 'space',
    sourceRecordKey: `group_join:${membership.group_id}:${membership.user_id}`,
    sourceEventId: `${membership.group_id}:${membership.user_id}`,
  });
}

export async function createPost(
  env: ServiceEnv,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const postType = normalizePostType(body?.postType);
  const visibility = normalizeVisibility(body?.visibility);
  const authorialExpressionIntent = parseAuthorialExpressionIntentFromBody(body);
  const authorialWriteIntent =
    postType && authorialExpressionIntent
      ? classifyAuthorialExpressionWriteIntent({ postType, authorialExpressionIntent })
      : null;
  const repostWriteIntent =
    postType && visibility
      ? classifyRepostWriteIntent({ postType, visibility })
      : null;
  const maxTextLength = parseIntOrDefault(env.SPACE_MAX_TEXT_LENGTH, 5000);
  const parsedText = parseCreatePostText(body?.text, maxTextLength);
  if (!parsedText.ok) {
    return errorResponse('VALIDATION_ERROR', parsedText.message, requestId, 400);
  }
  const text = parsedText.text;
  const groupId = normalizeOptionalString(body?.groupId, 128);
  const repostTargetType = normalizeOptionalString(body?.repostTargetType, 64);
  const repostTargetId = normalizeOptionalString(body?.repostTargetId, 128);

  if (!postType || !visibility) {
    return errorResponse('VALIDATION_ERROR', 'postType and visibility are required', requestId, 400);
  }

  if (authorialExpressionIntent && postType === 'repost') {
    return errorResponse(
      'VALIDATION_ERROR',
      'authorialExpressionIntent is only allowed when postType = post',
      requestId,
      400
    );
  }

  if (postType === 'system') {
    return errorResponse('VALIDATION_ERROR', 'postType=system is not allowed on the public create route', requestId, 400);
  }

  if (visibility === 'group' && !groupId) {
    return errorResponse('VALIDATION_ERROR', 'groupId is required when visibility = group', requestId, 400);
  }

  if (visibility !== 'group' && groupId) {
    return errorResponse('VALIDATION_ERROR', 'groupId is only allowed when visibility = group', requestId, 400);
  }

  if (postType === 'repost' && (!repostTargetType || !repostTargetId)) {
    return errorResponse('REPOST_TARGET_INVALID', 'repost target is required for reposts', requestId, 400);
  }

  if (repostTargetType && !REPOST_TARGET_TYPES.has(repostTargetType)) {
    return errorResponse('REPOST_TARGET_INVALID', 'repostTargetType is invalid', requestId, 400);
  }

  if (postType !== 'repost' && (repostTargetType || repostTargetId)) {
    return errorResponse('VALIDATION_ERROR', 'repost target fields are only allowed for repost posts', requestId, 400);
  }

  if (!text && postType === 'post') {
    return errorResponse('VALIDATION_ERROR', 'text is required for a standard post in v1', requestId, 400);
  }

  const repostTextRole =
    postType && visibility
      ? classifyRepostTextRole({ postType, visibility, text })
      : null;
  const authorialTextRole =
    postType && authorialExpressionIntent
      ? classifyAuthorialTextRole({ postType, text, authorialExpressionIntent })
      : null;

  try {
    assertAuthorialExpressionWrite({
      postType,
      visibility,
      text,
      authorialExpressionIntent,
      repostTargetType,
      repostTargetId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authorial expression boundary violation';
    return errorResponse('VALIDATION_ERROR', message, requestId, 400);
  }

  if (groupId) {
    const membership = await getMembership(db, groupId, principal.userId);
    const group = await getGroupById(db, groupId);
    if (!group) {
      return errorResponse('NOT_FOUND', `Group not found: ${groupId}`, requestId, 404);
    }
    if (group.status !== 'active') {
      return errorResponse('GROUP_ACCESS_DENIED', 'Group is not active', requestId, 403);
    }
    if (group.owner_id !== principal.userId && membership?.status !== 'active') {
      return errorResponse('GROUP_ACCESS_DENIED', 'You are not an active member of this group', requestId, 403);
    }
  }

  await ensureProfileProjection(db, principal.userId, toDisplayRoleLabel(principal.platformRole));

  if (postType === 'repost' && repostTargetType && repostTargetId && REPOST_DEDUPE_TARGET_TYPES.has(repostTargetType)) {
    const dedupeScope = repostWriteIntent === 'private_repost_intent' ? 'retention' : 'propagation';
    const existingRepost = await findActiveRepostByAuthorAndTarget(
      db,
      principal.userId,
      repostTargetType,
      repostTargetId,
      dedupeScope
    );
    if (existingRepost) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'REPOST_ALREADY_EXISTS',
            message: 'Active repost for this target already exists for the current author',
          },
          requestId,
          existingPostId: existingRepost.id,
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  const postId = `spost_${crypto.randomUUID()}`;
  await insertSpacePost(db, {
    id: postId,
    authorId: principal.userId,
    groupId,
    postType,
    visibility,
    text,
    repostTargetType,
    repostTargetId,
  });

  const created = await getPostById(db, postId);
  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to load created post', requestId, 500);
  }

  if (repostWriteIntent !== 'private_repost_intent') {
    await materializeOutgoingPostActivity(db, created);
  }
  if (
    repostWriteIntent !== 'private_repost_intent' &&
    created.post_type === 'repost' &&
    created.repost_target_type === 'space_post' &&
    created.repost_target_id
  ) {
    const targetPost = await getPostById(db, created.repost_target_id);
    await materializeIncomingRepostActivity(db, created, targetPost);
  }

  await emit(publisher, postType === 'repost' ? 'space.post.reposted' : 'space.post.created', {
    postId,
    authorId: principal.userId,
    groupId,
    postType,
    visibility,
    ...(repostWriteIntent ? { repostWriteIntent } : {}),
    ...(repostTextRole ? { repostTextRole } : {}),
    ...(authorialWriteIntent ? { authorialExpressionIntent: authorialWriteIntent } : {}),
    ...(authorialTextRole ? { authorialTextRole } : {}),
    repostTargetType,
    repostTargetId,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_post',
      targetId: postId,
    },
  });

  return new Response(JSON.stringify(await mapPostResponse(db, created, 'post_detail')), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function repostPost(
  env: ServiceEnv,
  targetPostId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const target = await getPostById(db, targetPostId);
  if (!target) {
    return errorResponse('NOT_FOUND', `Post not found: ${targetPostId}`, requestId, 404);
  }

  const canView = await canViewPost(target, principal, async () => {
    if (!target.group_id) return null;
    return getMembership(db, target.group_id, principal.userId);
  });
  if (!canView) {
    return errorResponse('FORBIDDEN', 'Target post is not accessible', requestId, 403);
  }

  return createPost(
    env,
    {
      ...body,
      postType: 'repost',
      repostTargetType: 'space_post',
      repostTargetId: targetPostId,
      visibility: body?.visibility ?? 'public',
      groupId: body?.groupId ?? null,
    },
    principal,
    requestId,
    publisher
  );
}

export async function getPost(
  env: ServiceEnv,
  postId: string,
  viewer: GatewayPrincipal | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const post = await getPostById(db, postId);
  if (!post) {
    return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
  }

  const allowed = await canViewPost(post, viewer, async () => {
    if (!post.group_id || !viewer) return null;
    return getMembership(db, post.group_id, viewer.userId);
  });
  if (!allowed) {
    return errorResponse('FORBIDDEN', 'Post is not accessible', requestId, 403);
  }

  return new Response(JSON.stringify(await mapPostResponse(db, post, 'post_detail')), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deletePost(
  env: ServiceEnv,
  postId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const deleted = await softDeletePost(db, postId, principal.userId);
  if (!deleted) {
    const exists = await getPostById(db, postId);
    if (!exists) {
      return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
    }
    return errorResponse('POST_DELETE_NOT_ALLOWED', 'Only the author may delete this post in v1', requestId, 403);
  }

  await markActivityProjectionRemovedForPost(db, postId);

  await emit(publisher, 'space.post.deleted', {
    postId,
    authorId: principal.userId,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_post',
      targetId: postId,
    },
  });

  return new Response(null, { status: 204 });
}

export async function updateRepostCommentary(
  env: ServiceEnv,
  postId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const patchBody = body ?? {};
  const invalidKeys = Object.keys(patchBody).filter((key) => key !== 'text');
  if (invalidKeys.length > 0) {
    return errorResponse('VALIDATION_ERROR', 'Only text field is allowed for repost commentary update', requestId, 400);
  }

  const maxTextLength = parseIntOrDefault(env.SPACE_MAX_TEXT_LENGTH, 5000);
  const parsedText = parseCreatePostText(patchBody.text, maxTextLength);
  if (!parsedText.ok) {
    return errorResponse('VALIDATION_ERROR', parsedText.message, requestId, 400);
  }

  const existingPost = await getPostById(db, postId);
  if (!existingPost || existingPost.status !== 'active') {
    return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
  }

  if (existingPost.author_id !== principal.userId) {
    return errorResponse('POST_EDIT_NOT_ALLOWED', 'Only the author may edit repost commentary in v1', requestId, 403);
  }

  if (existingPost.post_type !== 'repost') {
    return errorResponse('VALIDATION_ERROR', 'Commentary edit is allowed only for repost posts', requestId, 400);
  }

  const updated = await updateRepostTextByAuthor(db, postId, principal.userId, parsedText.text);
  if (!updated) {
    return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
  }

  const refreshed = await getPostById(db, postId);
  if (!refreshed) {
    return errorResponse('INTERNAL_ERROR', 'Failed to load updated post', requestId, 500);
  }

  return new Response(JSON.stringify(await mapPostResponse(db, refreshed, 'post_detail')), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function attachMedia(
  env: ServiceEnv,
  postId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const post = await getPostById(db, postId);
  if (!post) {
    return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
  }
  if (post.author_id !== principal.userId) {
    return errorResponse('MEDIA_ATTACH_NOT_ALLOWED', 'Only the author may attach media', requestId, 403);
  }

  const mediaId = normalizeOptionalString(body?.mediaId, 128);
  const rawSortOrder = typeof body?.sortOrder === 'number' ? body.sortOrder : Number(body?.sortOrder ?? 0);
  const sortOrder = Number.isFinite(rawSortOrder) ? rawSortOrder : 0;
  if (!mediaId) {
    return errorResponse('VALIDATION_ERROR', 'mediaId is required', requestId, 400);
  }

  const existingRelation = await hasPostMediaRelation(db, postId, mediaId);
  const currentCount = await countMediaByPostId(db, postId);
  if (!existingRelation && currentCount >= parseIntOrDefault(env.SPACE_MAX_MEDIA_ATTACHMENTS, 8)) {
    return errorResponse('RATE_LIMITED', 'Maximum media attachments reached for this post', requestId, 429);
  }

  await upsertPostMedia(db, { postId, mediaId, sortOrder });

  await emit(publisher, 'space.post.media_attached', {
    postId,
    mediaId,
    authorId: principal.userId,
    sortOrder,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_post',
      targetId: postId,
    },
  });

  return new Response(
    JSON.stringify({
      postId,
      mediaId,
      sortOrder,
      attachedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function detachMedia(
  env: ServiceEnv,
  postId: string,
  mediaId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const post = await getPostById(db, postId);
  if (!post) {
    return errorResponse('NOT_FOUND', `Post not found: ${postId}`, requestId, 404);
  }
  if (post.author_id !== principal.userId) {
    return errorResponse('MEDIA_ATTACH_NOT_ALLOWED', 'Only the author may detach media', requestId, 403);
  }

  const deleted = await deletePostMedia(db, postId, mediaId);
  if (!deleted) {
    return errorResponse('NOT_FOUND', `Media relation not found for post: ${postId}`, requestId, 404);
  }

  await emit(publisher, 'space.post.media_detached', {
    postId,
    mediaId,
    authorId: principal.userId,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_post',
      targetId: postId,
    },
  });

  return new Response(null, { status: 204 });
}

export async function createGroup(
  env: ServiceEnv,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const slug = normalizeGroupSlug(body?.slug);
  const title = normalizeOptionalString(body?.title, 160);
  const description = normalizeOptionalString(body?.description, 2000);
  const visibility = normalizeGroupVisibility(body?.visibility);
  if (!slug || !title || !visibility) {
    return errorResponse('VALIDATION_ERROR', 'slug, title and visibility are required', requestId, 400);
  }

  if (!canCreateGroup(principal)) {
    return errorResponse(
      'VALIDATION_ERROR',
      'Group creation is restricted to admin and approved PRO roles in v1',
      requestId,
      400
    );
  }

  await ensureProfileProjection(db, principal.userId, toDisplayRoleLabel(principal.platformRole));

  const groupId = `sgroup_${crypto.randomUUID()}`;
  try {
    await insertSpaceGroup(db, {
      id: groupId,
      slug,
      title,
      description,
      ownerId: principal.userId,
      visibility,
    });
  } catch (error) {
    if (isConstraintViolation(error, 'space_group_slug_unique')) {
      return errorResponse('CONFLICT', 'Group slug already exists', requestId, 409);
    }
    throw error;
  }
  await createOwnerMembership(db, groupId, principal.userId);

  const group = await getGroupById(db, groupId);
  if (!group) {
    return errorResponse('INTERNAL_ERROR', 'Failed to load created group', requestId, 500);
  }

  await emit(publisher, 'space.group.created', {
    groupId,
    ownerId: principal.userId,
    visibility,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_group',
      targetId: groupId,
    },
  });

  return new Response(JSON.stringify(mapGroupResponse(group)), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mapGroupResponse(group: SpaceGroupRow) {
  return {
    id: group.id,
    slug: group.slug,
    title: group.title,
    description: group.description,
    ownerId: group.owner_id,
    visibility: group.visibility,
    status: group.status,
    membersCount: group.members_count,
    createdAt: toIso(group.created_at),
    updatedAt: toIso(group.updated_at),
  };
}

export async function getGroup(
  env: ServiceEnv,
  groupId: string,
  viewer: GatewayPrincipal | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const group = await getGroupById(db, groupId);
  if (!group) {
    return errorResponse('NOT_FOUND', `Group not found: ${groupId}`, requestId, 404);
  }

  const allowed = await canViewGroup(group, viewer, async () => {
    if (!viewer) return null;
    return getMembership(db, groupId, viewer.userId);
  });
  if (!allowed) {
    return errorResponse('FORBIDDEN', 'Group is not accessible', requestId, 403);
  }

  return new Response(JSON.stringify(mapGroupResponse(group)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function joinGroup(
  env: ServiceEnv,
  groupId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const group = await getGroupById(db, groupId);
  if (!group) {
    return errorResponse('NOT_FOUND', `Group not found: ${groupId}`, requestId, 404);
  }
  if (group.status !== 'active') {
    return errorResponse('GROUP_JOIN_NOT_ALLOWED', 'Group is not active', requestId, 403);
  }

  const current = await getMembership(db, groupId, principal.userId);
  if (current?.status === 'blocked') {
    return errorResponse('GROUP_JOIN_NOT_ALLOWED', 'You are blocked in this group', requestId, 403);
  }

  if (current?.status === 'active') {
    return new Response(JSON.stringify(mapMembershipResponse(current)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (group.visibility === 'private' && group.owner_id !== principal.userId) {
    return errorResponse('GROUP_JOIN_NOT_ALLOWED', 'Private groups cannot be joined directly in v1', requestId, 403);
  }

  const nextStatus = group.visibility === 'invite_only' ? 'pending' : 'active';
  const nextRole = current?.role ?? 'member';

  await upsertMembership(db, {
    groupId,
    userId: principal.userId,
    role: nextRole,
    status: nextStatus,
    invitedBy: group.owner_id,
  });

  const membership = await getMembership(db, groupId, principal.userId);
  if (!membership) {
    return errorResponse('INTERNAL_ERROR', 'Failed to load membership', requestId, 500);
  }

  await materializeGroupJoinedActivity(db, membership, group);

  await emit(publisher, 'space.group.member_joined', {
    groupId,
    userId: principal.userId,
    status: membership.status,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_group',
      targetId: groupId,
    },
  });

  return new Response(JSON.stringify(mapMembershipResponse(membership)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mapMembershipResponse(membership: SpaceMembershipRow) {
  return {
    groupId: membership.group_id,
    userId: membership.user_id,
    role: membership.role,
    status: membership.status,
    joinedAt: toIso(membership.joined_at),
  };
}

export async function leaveGroup(
  env: ServiceEnv,
  groupId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: SpaceEventPublisher
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const group = await getGroupById(db, groupId);
  if (!group) {
    return errorResponse('NOT_FOUND', `Group not found: ${groupId}`, requestId, 404);
  }
  if (group.owner_id === principal.userId) {
    return errorResponse('GROUP_JOIN_NOT_ALLOWED', 'Group owner cannot leave the group in v1', requestId, 409);
  }

  const removed = await markMembershipRemoved(db, groupId, principal.userId);
  if (!removed) {
    return errorResponse('NOT_FOUND', 'Membership not found', requestId, 404);
  }

  await markActivityProjectionRemovedForGroupJoin(db, groupId, principal.userId);

  await emit(publisher, 'space.group.member_left', {
    groupId,
    userId: principal.userId,
  }, {
    requestId,
    actorUserId: principal.userId,
    subject: {
      targetType: 'space_group',
      targetId: groupId,
    },
  });

  return new Response(null, { status: 204 });
}

export async function getProfile(
  env: ServiceEnv,
  userId: string,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const profile = await getProfileByUserId(db, userId);
  if (!profile) {
    return errorResponse('NOT_FOUND', `Profile not found: ${userId}`, requestId, 404);
  }

  return new Response(JSON.stringify(mapProfileResponse(profile)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mapProfileResponse(profile: SpaceProfileRow) {
  return {
    userId: profile.user_id,
    displayName: profile.display_name ?? profile.user_id,
    avatarUrl: profile.avatar_url,
    roleLabel: profile.role_label,
    countryId: profile.country_id,
    cityId: profile.city_id,
    bioShort: profile.bio_short,
  };
}

async function buildFeedResponse(
  db: ReturnType<typeof createDb>,
  rows: SpacePostRow[],
  limit: number,
  surface: LegacySurfaceId
): Promise<{ items: Array<{ id: string; reason: string; post: Awaited<ReturnType<typeof mapPostResponse>>; createdAt: string }>; nextCursor: string | null }> {
  const pageRows = rows.slice(0, limit);
  const items = await Promise.all(
    pageRows.map(async (row) => ({
      id: row.id,
      reason: row.post_type === 'repost' ? 'repost' : row.group_id ? 'group_post' : row.post_type === 'system' ? 'system' : 'author_post',
      post: await mapPostResponse(db, row, surface),
      createdAt: toIso(row.published_at),
    }))
  );
  const extraRow = rows[limit];
  const nextCursor = extraRow
    ? encodeFeedCursor({
        publishedAt: toIso(extraRow.published_at),
        id: extraRow.id,
      })
    : null;
  return { items, nextCursor };
}

export async function getHomeFeed(
  env: ServiceEnv,
  principal: GatewayPrincipal,
  limit: number,
  cursorValue: string | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;
  const rows = await listHomeFeedPosts(db, principal.userId, limit + 1, decodeFeedCursor(cursorValue));
  return new Response(JSON.stringify(await buildFeedResponse(db, rows, limit, 'home_feed')), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getProfileFeed(
  env: ServiceEnv,
  userId: string,
  viewer: GatewayPrincipal | null,
  limit: number,
  cursorValue: string | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const rows = await listProfileFeedPosts(db, userId, limit + 10, decodeFeedCursor(cursorValue));
  const filtered: SpacePostRow[] = [];
  for (const row of rows) {
    const allowed = await canViewPost(row, viewer, async () => {
      if (!viewer || !row.group_id) return null;
      return getMembership(db, row.group_id, viewer.userId);
    });
    if (allowed) filtered.push(row);
    if (filtered.length >= limit + 1) break;
  }

  return new Response(JSON.stringify(await buildFeedResponse(db, filtered, limit, 'profile_feed')), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getGroupFeed(
  env: ServiceEnv,
  groupId: string,
  viewer: GatewayPrincipal | null,
  limit: number,
  cursorValue: string | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;

  const group = await getGroupById(db, groupId);
  if (!group) {
    return errorResponse('NOT_FOUND', `Group not found: ${groupId}`, requestId, 404);
  }
  const allowed = await canViewGroup(group, viewer, async () => {
    if (!viewer) return null;
    return getMembership(db, groupId, viewer.userId);
  });
  if (!allowed) {
    return errorResponse('FORBIDDEN', 'Group feed is not accessible', requestId, 403);
  }

  const rows = await listGroupFeedPosts(db, groupId, limit + 1, decodeFeedCursor(cursorValue));
  return new Response(JSON.stringify(await buildFeedResponse(db, rows, limit, 'group_feed')), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getActivityFeed(
  env: ServiceEnv,
  principal: GatewayPrincipal,
  filter: SpaceActivityFilter,
  limit: number,
  cursorValue: string | null,
  requestId: string
): Promise<Response> {
  const dbState = getDb(env, requestId);
  if (!dbState.ok) return dbState.res;
  const db = dbState.db;
  const rows = await listActivityFeedRows(db, principal.userId, filter, limit + 1, decodeFeedCursor(cursorValue));
  const pageRows = rows.slice(0, limit);
  const extraRow = rows[limit];
  return new Response(
    JSON.stringify({
      items: pageRows.map((row: SpaceActivityRow) => {
        if (
          row.action_type === 'space.repost_created' ||
          row.action_type === 'space.post_reposted_by_other'
        ) {
          assertActivityFeedSurfaceProjection({
            actionType: row.action_type,
          });
        }
        return {
        id: row.id,
        type: row.type,
        actionType: row.action_type,
        direction: row.direction,
        category: row.category,
        actor: {
          userId: row.actor_user_id,
          displayName: row.actor_display_name ?? row.actor_user_id,
          avatarUrl: row.actor_avatar_url,
          roleLabel: row.actor_role_label,
        },
        title: row.title,
        description: row.description,
        relatedPostId: row.related_post_id,
        relatedEntityType: row.related_entity_type,
        relatedEntityId: row.related_entity_id,
        createdAt: toIso(row.occurred_at),
      };
      }),
      nextCursor: extraRow
        ? encodeFeedCursor({
            publishedAt: toIso(extraRow.occurred_at),
            id: extraRow.id,
          })
        : null,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
