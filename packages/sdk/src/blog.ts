/**
 * @go2asia/sdk/blog
 * 
 * Blog API hooks and functions.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { ContentArticleDto, ListResponse } from './content';

export type BlogPostSort = 'newest' | 'popular' | 'featured';

export interface ContentBlogAuthorDto {
  slug: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ContentBlogPostCardDto {
  id: string;
  slug: string;
  lang: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  postType: string | null;
  category: string | null;
  countrySlug: string | null;
  citySlug: string | null;
  tags: string[];
  heroUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTimeMinutes: number | null;
  isPromoted: boolean;
  isFeatured: boolean;
  isEditorPick: boolean;
  author: ContentBlogAuthorDto | null;
}

export interface ContentBlogPostDetailDto extends ContentBlogPostCardDto {
  contentMarkdown: string;
}

export type CursorListResponse<T> = { items: T[]; nextCursor: string | null };

export async function listBlogPosts(params?: {
  limit?: number;
  cursor?: string;
  sort?: BlogPostSort;
  q?: string;
  tag?: string;
  author?: string;
  country?: string;
  city?: string;
  excludeSlug?: string;
}): Promise<CursorListResponse<ContentBlogPostCardDto>> {
  const sp = new URLSearchParams();
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.cursor) sp.set('cursor', params.cursor);
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.q) sp.set('q', params.q);
  if (params?.tag) sp.set('tag', params.tag);
  if (params?.author) sp.set('author', params.author);
  if (params?.country) sp.set('country', params.country);
  if (params?.city) sp.set('city', params.city);
  if (params?.excludeSlug) sp.set('exclude_slug', params.excludeSlug);
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<CursorListResponse<ContentBlogPostCardDto>>({ method: 'GET' }, `/v1/content/blog/posts${qs}`);
}

export async function getBlogPostBySlug(slug: string): Promise<ContentBlogPostDetailDto> {
  return customInstance<ContentBlogPostDetailDto>({ method: 'GET' }, `/v1/content/blog/posts/${encodeURIComponent(slug)}`);
}

export const useListBlogPosts = (params?: {
  limit?: number;
  cursor?: string;
  sort?: BlogPostSort;
  q?: string;
  tag?: string;
  author?: string;
  country?: string;
  city?: string;
  excludeSlug?: string;
  enabled?: boolean;
}) => {
  const enabled = typeof params?.enabled === 'boolean' ? params.enabled : true;
  return useQuery<CursorListResponse<ContentBlogPostCardDto>, Error>({
    queryKey: ['content', 'blog', 'posts', params ?? {}],
    enabled,
    queryFn: async () => listBlogPosts(params),
    staleTime: 60_000,
  });
};

export const useGetBlogPostBySlug = (slug: string, params?: { enabled?: boolean }) => {
  const enabled = typeof params?.enabled === 'boolean' ? params.enabled : true;
  return useQuery<ContentBlogPostDetailDto, Error>({
    queryKey: ['content', 'blog', 'post', { slug }],
    enabled: enabled && Boolean(slug),
    queryFn: async () => getBlogPostBySlug(slug),
    staleTime: 60_000,
  });
};

// ---------------------------------------------------------------------
// Legacy (MVP): content/articles endpoints
// Keep for backward compatibility; Blog UI should use /content/blog/*.
// ---------------------------------------------------------------------

export const useGetArticles = (_params?: { limit?: number; enabled?: boolean }) => {
  const limit = typeof _params?.limit === 'number' ? _params.limit : 20;
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return useQuery<ListResponse<ContentArticleDto>, Error>({
    queryKey: ['content', 'articles', { limit }],
    enabled,
    queryFn: async () => customInstance<ListResponse<ContentArticleDto>>({ method: 'GET' }, `/v1/content/articles${qs}`),
    staleTime: 60_000,
  });
};

export const useGetArticleBySlug = (slug: string) => {
  return useQuery<ContentArticleDto, Error>({
    queryKey: ['content', 'article', { slug }],
    enabled: Boolean(slug),
    queryFn: async () => customInstance<ContentArticleDto>({ method: 'GET' }, `/v1/content/articles/${slug}`),
    staleTime: 60_000,
  });
};



