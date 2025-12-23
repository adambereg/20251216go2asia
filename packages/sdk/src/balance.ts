/**
 * @go2asia/sdk/balance
 * 
 * Balance API hooks and functions.
 * This file provides React Query hooks for balance operations.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

/**
 * UserBalance type from Points Service API
 */
export interface UserBalance {
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface UseGetBalanceOptions {
  enabled?: boolean;
}

/**
 * Get current user points balance
 * 
 * @returns React Query hook for balance data
 */
export const useGetBalance = (options?: UseGetBalanceOptions) => {
  return useQuery<UserBalance>({
    queryKey: ['points', 'balance'],
    queryFn: async () => {
      return customInstance<UserBalance>(
        { method: 'GET' },
        '/v1/points/balance'
      );
    },
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};
