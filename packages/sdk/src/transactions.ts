/**
 * @go2asia/sdk/transactions
 * 
 * Transactions API hooks and functions.
 * This file provides React Query hooks for transactions operations.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

/**
 * PointsTransaction type from Points Service API
 */
export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  action: 'registration' | 'first_login' | 'referral_bonus_referee' | 'referral_bonus_referrer' | 'event_registration';
  externalId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * TransactionsPage type from Points Service API
 */
export interface TransactionsPage {
  items: PointsTransaction[];
  nextCursor?: string | null;
}

/**
 * Get transactions query parameters
 */
export interface GetTransactionsParams {
  limit?: number;
  cursor?: string;
}

/**
 * List current user points transactions
 * 
 * @param params - Query parameters (limit, cursor)
 * @returns React Query hook for transactions data
 */
export const useGetTransactions = (params?: GetTransactionsParams) => {
  const { limit = 20, cursor } = params || {};
  
  const queryParams = new URLSearchParams();
  if (limit) queryParams.set('limit', limit.toString());
  if (cursor) queryParams.set('cursor', cursor);
  
  const queryString = queryParams.toString();
  const url = `/v1/points/transactions${queryString ? `?${queryString}` : ''}`;
  
  return useQuery<TransactionsPage>({
    queryKey: ['points', 'transactions', limit, cursor],
    queryFn: async () => {
      return customInstance<TransactionsPage>(
        { method: 'GET' },
        url
      );
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
};
