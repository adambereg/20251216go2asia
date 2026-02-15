/**
 * Guide Engine v1 schemas (Atlas Asia)
 *
 * Canonical registries:
 * - tab_key: 11 universal containers
 * - block_type: JSONB payload shapes per block
 * - feed: dynamic sources for events/places/experience
 */

import { z } from 'zod';

export const AtlasGuideTypeSchema = z.enum([
  'strategic',
  'comparative',
  'route',
  'niche',
  'event',
  'housing',
  'visa',
  'work_infra',
  'climate',
]);

export const AtlasGuideStatusSchema = z.enum(['draft', 'published', 'verified', 'archived']);

export const AtlasGuideTabKeySchema = z.enum([
  'overview',
  'compare',
  'locations',
  'route',
  'map',
  'practice',
  'events',
  'places',
  'audience',
  'faq',
  'experience',
]);

export const AtlasGuideBlockTypeSchema = z.enum([
  // Base
  'rich_text',
  'callout',
  'bullets',
  'key_facts',
  'media',
  'divider',
  // Structure
  'checklist',
  'steps',
  'timeline',
  'day_plan',
  'table',
  'scorecard',
  // Geo / refs
  'map_config',
  'poi_refs',
  'city_refs',
  // FAQ / linking
  'faq',
  'related_guides',
  // Integrations
  'feed_embed',
]);

export const AtlasGuideFeedSourceSchema = z.enum(['pulse', 'atlas_places', 'blog']);
export const AtlasGuideFeedSortSchema = z.enum(['relevance', 'newest', 'popular', 'date_asc', 'date_desc']);

// ---------------------------------------------------------------------
// Public API DTOs (minimal, stable)
// ---------------------------------------------------------------------

export const GuideCardDtoSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  heroUrl: z.string().url().nullable().optional(),
  guideType: AtlasGuideTypeSchema,
  status: AtlasGuideStatusSchema,
  tags: z.array(z.string()).default([]),
  countryIds: z.array(z.string()).default([]),
  cityIds: z.array(z.string()).default([]),
  publishedAt: z.string().nullable().optional(), // ISO
  updatedAt: z.string().nullable().optional(), // ISO
});

export const GuideBlockDtoSchema = z.object({
  id: z.string().min(1),
  blockType: AtlasGuideBlockTypeSchema,
  orderIndex: z.number().int(),
  payload: z.record(z.unknown()),
  // Server truth. Useful for debugging; do not rely on it in UI.
  isEmpty: z.boolean(),
});

/**
 * Admin input for blocks.
 *
 * isEmpty is NOT accepted from client — computed on backend.
 */
export const GuideBlockInputSchema = z.object({
  blockType: AtlasGuideBlockTypeSchema,
  orderIndex: z.number().int().optional(),
  payload: z.record(z.unknown()),
  // ignored if provided; keep optional to avoid breaking clients
  isEmpty: z.boolean().optional(),
});

export const GuideFeedDtoSchema = z.object({
  id: z.string().min(1),
  source: AtlasGuideFeedSourceSchema,
  filter: z.record(z.unknown()),
  limitCount: z.number().int().positive().max(100),
  sort: AtlasGuideFeedSortSchema,
  orderIndex: z.number().int(),
});

export const GuideSectionDtoSchema = z.object({
  id: z.string().min(1),
  tabKey: AtlasGuideTabKeySchema,
  title: z.string().nullable().optional(),
  orderIndex: z.number().int(),
  blocks: z.array(GuideBlockDtoSchema),
  feeds: z.array(GuideFeedDtoSchema).optional(),
});

export const GuideDetailDtoSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  heroUrl: z.string().url().nullable().optional(),
  guideType: AtlasGuideTypeSchema,
  status: AtlasGuideStatusSchema,
  tags: z.array(z.string()).default([]),
  countryIds: z.array(z.string()).default([]),
  cityIds: z.array(z.string()).default([]),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  sections: z.array(GuideSectionDtoSchema),
});

export type AtlasGuideType = z.infer<typeof AtlasGuideTypeSchema>;
export type AtlasGuideStatus = z.infer<typeof AtlasGuideStatusSchema>;
export type AtlasGuideTabKey = z.infer<typeof AtlasGuideTabKeySchema>;
export type AtlasGuideBlockType = z.infer<typeof AtlasGuideBlockTypeSchema>;
export type AtlasGuideFeedSource = z.infer<typeof AtlasGuideFeedSourceSchema>;
export type AtlasGuideFeedSort = z.infer<typeof AtlasGuideFeedSortSchema>;
export type GuideCardDto = z.infer<typeof GuideCardDtoSchema>;
export type GuideDetailDto = z.infer<typeof GuideDetailDtoSchema>;
export type GuideBlockInput = z.infer<typeof GuideBlockInputSchema>;

