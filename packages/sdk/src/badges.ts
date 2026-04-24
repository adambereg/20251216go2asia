/**
 * @go2asia/sdk/badges
 *
 * Badge catalog and user badge award helpers.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

export interface BadgeCatalogItem {
  code: string;
  title: string;
  description: string | null;
  category: string;
  iconKey: string | null;
  isActive: boolean;
}

export interface BadgeCatalogResponse {
  items: BadgeCatalogItem[];
}

export interface UserBadgeItem {
  badgeCode: string;
  title: string;
  description: string | null;
  category: string | null;
  iconKey: string | null;
  awardedAt: string;
  sourceType: string | null;
  sourceId: string | null;
}

export interface UserBadgesResponse {
  items: UserBadgeItem[];
}

export interface UseGetBadgeCatalogOptions {
  enabled?: boolean;
}

export interface UseGetMyBadgesOptions {
  limit?: number;
  enabled?: boolean;
}

export const useGetBadgeCatalog = (options?: UseGetBadgeCatalogOptions) => {
  return useQuery<BadgeCatalogResponse>({
    queryKey: ['points', 'badges', 'catalog'],
    queryFn: async () => customInstance<BadgeCatalogResponse>({ method: 'GET' }, '/v1/points/badges'),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useGetMyBadges = (options?: UseGetMyBadgesOptions) => {
  const limit = options?.limit ?? 20;
  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  const url = `/v1/points/badges/mine?${queryParams.toString()}`;

  return useQuery<UserBadgesResponse>({
    queryKey: ['points', 'badges', 'mine', limit],
    queryFn: async () => customInstance<UserBadgesResponse>({ method: 'GET' }, url),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
    retry: 2,
  });
};
