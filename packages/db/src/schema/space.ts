/**
 * Space Service schema (Phase 2, Step 4 social core).
 *
 * Scope:
 * - space_post: canonical publication source of truth
 * - space_group: social containers
 * - space_group_member: membership and role
 * - space_post_media: relation to media-service assets
 * - space_profile_projection: lightweight social rendering projection
 */

import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const spacePostTypeEnum = pgEnum('space_post_type', ['post', 'repost', 'system']);
export const spacePostVisibilityEnum = pgEnum('space_post_visibility', ['public', 'followers', 'group', 'private']);
export const spacePostStatusEnum = pgEnum('space_post_status', ['active', 'flagged', 'hidden', 'deleted']);
export const spaceRepostTargetTypeEnum = pgEnum('space_repost_target_type', [
  'space_post',
  'blog_post',
  'place',
  'event',
  'partner',
  'listing',
  'quest',
]);
export const spaceGroupVisibilityEnum = pgEnum('space_group_visibility', ['public', 'private', 'invite_only']);
export const spaceGroupStatusEnum = pgEnum('space_group_status', ['active', 'hidden', 'archived']);
export const spaceGroupMemberRoleEnum = pgEnum('space_group_member_role', ['member', 'moderator', 'owner']);
export const spaceGroupMemberStatusEnum = pgEnum('space_group_member_status', ['active', 'pending', 'removed', 'blocked']);

export const spaceGroups = pgTable(
  'space_group',
  {
    id: text('id').primaryKey(),
    slug: varchar('slug', { length: 160 }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    ownerId: text('owner_id').notNull(),
    visibility: spaceGroupVisibilityEnum('visibility').notNull().default('public'),
    status: spaceGroupStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlug: unique('space_group_slug_unique').on(table.slug),
    idxOwnerId: index('idx_space_group_owner_id').on(table.ownerId),
    idxStatusVisibility: index('idx_space_group_status_visibility').on(table.status, table.visibility),
  })
);

export const spacePosts = pgTable(
  'space_post',
  {
    id: text('id').primaryKey(),
    authorId: text('author_id').notNull(),
    groupId: text('group_id').references(() => spaceGroups.id),
    postType: spacePostTypeEnum('post_type').notNull(),
    visibility: spacePostVisibilityEnum('visibility').notNull(),
    text: text('text'),
    repostTargetType: spaceRepostTargetTypeEnum('repost_target_type'),
    repostTargetId: text('repost_target_id'),
    status: spacePostStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    publishedAt: timestamp('published_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    repostPairConsistency: check(
      'space_post_repost_pair_consistency_check',
      sql`(
        (${table.repostTargetType} IS NULL AND ${table.repostTargetId} IS NULL)
        OR
        (${table.repostTargetType} IS NOT NULL AND ${table.repostTargetId} IS NOT NULL)
      )`
    ),
    repostRequiresTarget: check(
      'space_post_repost_requires_target_check',
      sql`(${table.postType} <> 'repost' OR (${table.repostTargetType} IS NOT NULL AND ${table.repostTargetId} IS NOT NULL))`
    ),
    nonRepostForbidsRepostTarget: check(
      'space_post_non_repost_forbids_repost_target_check',
      sql`(${table.postType} = 'repost' OR (${table.repostTargetType} IS NULL AND ${table.repostTargetId} IS NULL))`
    ),
    groupVisibilityRequiresGroup: check(
      'space_post_group_visibility_requires_group_check',
      sql`(${table.visibility} <> 'group' OR ${table.groupId} IS NOT NULL)`
    ),
    groupIdRequiresGroupVisibility: check(
      'space_post_group_id_requires_group_visibility_check',
      sql`(${table.groupId} IS NULL OR ${table.visibility} = 'group')`
    ),
    idxAuthorPublishedAt: index('idx_space_post_author_published_at').on(table.authorId, table.publishedAt, table.id),
    idxGroupPublishedAt: index('idx_space_post_group_published_at').on(table.groupId, table.publishedAt, table.id),
    idxVisibilityPublishedAt: index('idx_space_post_visibility_published_at').on(table.visibility, table.publishedAt, table.id),
    idxStatusPublishedAt: index('idx_space_post_status_published_at').on(table.status, table.publishedAt, table.id),
    idxRepostTarget: index('idx_space_post_repost_target').on(table.repostTargetType, table.repostTargetId),
  })
);

export const spaceGroupMembers = pgTable(
  'space_group_member',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => spaceGroups.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    role: spaceGroupMemberRoleEnum('role').notNull().default('member'),
    status: spaceGroupMemberStatusEnum('status').notNull().default('active'),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    invitedBy: text('invited_by'),
  },
  (table) => ({
    pk: primaryKey({ name: 'space_group_member_pk', columns: [table.groupId, table.userId] }),
    idxUserStatus: index('idx_space_group_member_user_status').on(table.userId, table.status),
    idxGroupStatus: index('idx_space_group_member_group_status').on(table.groupId, table.status),
  })
);

export const spacePostMedia = pgTable(
  'space_post_media',
  {
    postId: text('post_id')
      .notNull()
      .references(() => spacePosts.id, { onDelete: 'cascade' }),
    mediaId: text('media_id').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    attachedAt: timestamp('attached_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ name: 'space_post_media_pk', columns: [table.postId, table.mediaId] }),
    idxPostSortOrder: index('idx_space_post_media_post_sort_order').on(table.postId, table.sortOrder),
    idxMediaId: index('idx_space_post_media_media_id').on(table.mediaId),
  })
);

export const spaceProfileProjections = pgTable(
  'space_profile_projection',
  {
    userId: text('user_id').primaryKey(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    roleLabel: varchar('role_label', { length: 64 }),
    countryId: text('country_id'),
    cityId: text('city_id'),
    bioShort: text('bio_short'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxCountryCity: index('idx_space_profile_projection_country_city').on(table.countryId, table.cityId),
  })
);
