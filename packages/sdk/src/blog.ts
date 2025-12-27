/**
 * @go2asia/sdk/blog
 * 
 * Blog API hooks and functions.
 * This file re-exports blog-related functionality from the generated SDK.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { ContentArticleDto, ListResponse } from './content';

export const useGetArticles = (_params?: { limit?: number; cursor?: string; enabled?: boolean }) => {
  const limit = typeof _params?.limit === 'number' ? _params.limit : 20;
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  if (_params?.cursor) sp.set('cursor', _params.cursor);
  const qs = sp.toString() ? `?${sp.toString()}` : '';

  return useQuery<ListResponse<ContentArticleDto>, Error>({
    queryKey: ['content', 'articles', { limit, cursor: _params?.cursor ?? null }],
    enabled,
    queryFn: async () => {
      const endpoint = `/v1/content/articles`;
      try {
        const data = await customInstance<ListResponse<ContentArticleDto>>({ method: 'GET' }, `${endpoint}${qs}`);
        if (!data?.items || data.items.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(`FALLBACK_TO_MOCKS: reason=EMPTY endpoint=${endpoint}`);
        }
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=${endpoint}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 60_000,
  });
};

export const useGetArticleBySlug = (slug: string) => {
  return useQuery<ContentArticleDto, Error>({
    queryKey: ['content', 'article', { slug }],
    enabled: Boolean(slug),
    queryFn: async () => {
      const endpoint = `/v1/content/articles/${slug}`;
      try {
        return await customInstance<ContentArticleDto>({ method: 'GET' }, endpoint);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=/v1/content/articles/{slug}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 60_000,
  });
};



