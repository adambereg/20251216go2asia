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

/**
 * Get current user's referral code
 * 
 * @returns React Query hook for referral code data
 */
export const useGetReferralCode = () => {
  return useQuery<ReferralCodeResponse>({
    queryKey: ['referral', 'code'],
    queryFn: async () => {
      return customInstance<ReferralCodeResponse>(
        { method: 'GET' },
        '/v1/referral/code'
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (referral code doesn't change often)
    retry: 2,
  });
};

/**
 * Get current user's referral stats
 * 
 * @returns React Query hook for referral stats data
 */
export const useGetReferralStats = () => {
  return useQuery<ReferralStatsResponse>({
    queryKey: ['referral', 'stats'],
    queryFn: async () => {
      return customInstance<ReferralStatsResponse>(
        { method: 'GET' },
        '/v1/referral/stats'
      );
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
};

/**
 * Get referral tree (placeholder for future use)
 * 
 * @param _params - Query parameters (placeholder)
 * @returns React Query hook (placeholder)
 */
export const useGetReferralTree = (_params?: any) => {
  // Placeholder - will be implemented when API is available
  return {
    data: undefined,
    isLoading: false,
    error: null,
  };
};
