/**
 * @go2asia/sdk/guides
 *
 * Guide Engine v1 (public read API)
 * - GET /v1/guides
 * - GET /v1/guides/:slug
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

export interface ListResponse<T> {
  items: T[];
}

export type GuideTabKey =
  | 'overview'
  | 'compare'
  | 'locations'
  | 'route'
  | 'map'
  | 'practice'
  | 'events'
  | 'places'
  | 'audience'
  | 'faq'
  | 'experience';

export type GuideFeedSource = 'pulse' | 'atlas_places' | 'blog';

export interface GuideCardDto {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroUrl: string | null;
  guideType: string;
  status: string;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface GuideBlockDto {
  id: string;
  blockType: string;
  orderIndex: number;
  payload: Record<string, unknown>;
  isEmpty: boolean;
}

export interface GuideFeedDto {
  id: string;
  source: GuideFeedSource;
  filter: Record<string, unknown>;
  limitCount: number;
  sort: string;
  orderIndex: number;
}

export interface GuideSectionDto {
  id: string;
  tabKey: GuideTabKey;
  title: string | null;
  orderIndex: number;
  blocks: GuideBlockDto[];
  feeds: GuideFeedDto[];
  feedsResolved: GuideFeedResolvedItemDto[];
}

export type GuideFeedResolvedKind = 'event' | 'place' | 'article';

export interface GuideFeedResolvedItemDto {
  kind: GuideFeedResolvedKind;
  id: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  href: string;
  meta: Record<string, unknown> | null;
}

export interface GuideDetailDto {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroUrl: string | null;
  guideType: string;
  status: string;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sections: GuideSectionDto[];
}

export const useGetGuides = (_params?: {
  limit?: number;
  countryId?: string;
  cityId?: string;
  guideType?: string;
  tag?: string;
  status?: string;
  enabled?: boolean;
}) => {
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  const limit = typeof _params?.limit === 'number' ? _params.limit : 20;

  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  if (_params?.countryId) sp.set('country_id', _params.countryId);
  if (_params?.cityId) sp.set('city_id', _params.cityId);
  if (_params?.guideType) sp.set('guide_type', _params.guideType);
  if (_params?.tag) sp.set('tag', _params.tag);
  if (_params?.status) sp.set('status', _params.status);
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  const queryObj = {
    limit,
    countryId: _params?.countryId ?? null,
    cityId: _params?.cityId ?? null,
    guideType: _params?.guideType ?? null,
    tag: _params?.tag ?? null,
    status: _params?.status ?? null,
  };

  return useQuery<ListResponse<GuideCardDto>, Error>({
    queryKey: ['guides', 'list', queryObj],
    enabled,
    queryFn: async () => {
      // NOTE: API gateway reliably exposes /v1/content/* routes.
      // We keep /v1/guides in backend for future, but use the gateway-friendly path here.
      const endpoint = `/v1/content/guides`;
      return await customInstance<ListResponse<GuideCardDto>>({ method: 'GET' }, `${endpoint}${qs}`);
    },
    staleTime: 60_000,
  });
};

export const useGetGuideBySlug = (slug: string, params?: { includeEmpty?: boolean; enabled?: boolean }) => {
  const enabled = typeof params?.enabled === 'boolean' ? params.enabled : true;
  const sp = new URLSearchParams();
  if (params?.includeEmpty) sp.set('include_empty', 'true');
  const qs = sp.toString() ? `?${sp.toString()}` : '';

  return useQuery<GuideDetailDto, Error>({
    queryKey: ['guides', 'detail', { slug, include_empty: params?.includeEmpty ?? false }],
    enabled: enabled && Boolean(slug),
    queryFn: async () => {
      const endpoint = `/v1/content/guides/${encodeURIComponent(slug)}`;
      return await customInstance<GuideDetailDto>({ method: 'GET' }, `${endpoint}${qs}`);
    },
    staleTime: 60_000,
  });
};

