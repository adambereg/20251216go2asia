/**
 * @go2asia/sdk/referrals
 * 
 * Referrals API hooks and functions.
 * This file provides React Query hooks for referrals operations.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

/**
 * ReferralCodeResponse type from Referral Service API
 */
export interface ReferralCodeResponse {
  userId: string;
  code: string;
}

/**
 * ReferralStatsResponse type from Referral Service API
 */
export interface ReferralStatsResponse {
  userId: string;
  code: string;
  directReferralsCount: number;
}

export interface ReferralTreeNode {
  userId: string;
  registeredAt: string;
  firstLoginAt?: string | null;
  isActive: boolean;
  subReferralsCount: number;
  subReferrals?: ReferralTreeNode[];
}

export interface ReferralTreeResponse {
  userId: string;
  depth: number;
  referrals: ReferralTreeNode[];
}

export interface UseGetReferralCodeOptions {
  enabled?: boolean;
}

export interface UseGetReferralStatsOptions {
  enabled?: boolean;
}

export interface GetReferralTreeParams {
  depth?: 1 | 2;
  enabled?: boolean;
}

/**
 * Get current user's referral code
 * 
 * @returns React Query hook for referral code data
 */
export const useGetReferralCode = (options?: UseGetReferralCodeOptions) => {
  return useQuery<ReferralCodeResponse>({
    queryKey: ['referral', 'code'],
    queryFn: async () => {
      return customInstance<ReferralCodeResponse>(
        { method: 'GET' },
        '/v1/referral/code'
      );
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes (referral code doesn't change often)
    retry: 2,
  });
};

/**
 * Get current user's referral stats
 * 
 * @returns React Query hook for referral stats data
 */
export const useGetReferralStats = (options?: UseGetReferralStatsOptions) => {
  return useQuery<ReferralStatsResponse>({
    queryKey: ['referral', 'stats'],
    queryFn: async () => {
      return customInstance<ReferralStatsResponse>(
        { method: 'GET' },
        '/v1/referral/stats'
      );
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
};

/**
 * Get referral tree (depth 1..2)
 * 
 * @param params - Query parameters (depth)
 * @returns React Query hook for referral tree
 */
export const useGetReferralTree = (params?: GetReferralTreeParams) => {
  const depth = params?.depth ?? 2;
  const url = `/v1/referral/tree?depth=${depth}`;

  return useQuery<ReferralTreeResponse>({
    queryKey: ['referral', 'tree', depth],
    queryFn: async () => {
      return customInstance<ReferralTreeResponse>({ method: 'GET' }, url);
    },
    enabled: params?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
};
