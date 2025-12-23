/**
 * @go2asia/sdk/blog
 * 
 * Blog API hooks and functions.
 * This file re-exports blog-related functionality from the generated SDK.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { ContentArticleDto, ListResponse } from './content';

export const useGetArticles = (_params?: { limit?: number }) => {
  const limit = typeof _params?.limit === 'number' ? _params.limit : 20;
  const qs = `?limit=${encodeURIComponent(String(limit))}`;

  return useQuery<ListResponse<ContentArticleDto>, Error>({
    queryKey: ['content', 'articles', { limit }],
    queryFn: async () => {
      return customInstance<ListResponse<ContentArticleDto>>({ method: 'GET' }, `/v1/content/articles${qs}`);
    },
    staleTime: 60_000,
  });
};

export const useGetArticleBySlug = (slug: string) => {
  return useQuery<ContentArticleDto, Error>({
    queryKey: ['content', 'article', { slug }],
    enabled: Boolean(slug),
    queryFn: async () => {
      return customInstance<ContentArticleDto>({ method: 'GET' }, `/v1/content/articles/${slug}`);
    },
    staleTime: 60_000,
  });
};



