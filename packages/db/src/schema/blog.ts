/**
 * Blog schema (Blog Asia) — SSOT for editorial posts.
 *
 * NOTE:
 * - Separate from legacy `articles` table (MVP).
 * - Uses shared `media_files` table for hero/avatars.
 */

import { pgEnum, pgTable, text, timestamp, boolean, integer, numeric, unique, index } from 'drizzle-orm/pg-core';
import { mediaFiles } from './content';

export const blogPostStatusEnum = pgEnum('blog_post_status', ['draft', 'in_review', 'scheduled', 'published', 'archived']);

export const blogAuthors = pgTable(
  'blog_authors',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    displayName: text('display_name').notNull(),
    bio: text('bio'),
    userId: text('user_id'),
    avatarMediaId: text('avatar_media_id').references(() => mediaFiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlug: unique('blog_authors_slug_unique').on(table.slug),
    idxUserId: index('idx_blog_authors_user_id').on(table.userId),
  })
);

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    lang: text('lang').notNull().default('ru'),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    excerpt: text('excerpt'),
    contentMarkdown: text('content_markdown').notNull(),
    postType: text('post_type'),
    category: text('category'),
    countrySlug: text('country_slug'),
    citySlug: text('city_slug'),
    status: blogPostStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    authorId: text('author_id').references(() => blogAuthors.id, { onDelete: 'set null' }),
    heroMediaId: text('hero_media_id').references(() => mediaFiles.id, { onDelete: 'set null' }),
    readingTimeMinutes: integer('reading_time_minutes'),
    isPromoted: boolean('is_promoted').notNull().default(false),
    isFeatured: boolean('is_featured').notNull().default(false),
    isEditorPick: boolean('is_editor_pick').notNull().default(false),
    featuredRank: integer('featured_rank').notNull().default(0),
    viewsTotal: integer('views_total').notNull().default(0),
    popularityScore: numeric('popularity_score', { precision: 12, scale: 4 }).notNull().default('0'),
  },
  (table) => ({
    uniqueSlug: unique('blog_posts_slug_unique').on(table.slug),
  })
);

export const blogTags = pgTable(
  'blog_tags',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlug: unique('blog_tags_slug_unique').on(table.slug),
  })
);

export const blogPostTags = pgTable(
  'blog_post_tags',
  {
    postId: text('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
    tagId: text('tag_id').notNull().references(() => blogTags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: unique('blog_post_tags_pk').on(table.postId, table.tagId),
    idxTagIdPostId: index('idx_blog_post_tags_tag_id_post_id').on(table.tagId, table.postId),
  })
);

