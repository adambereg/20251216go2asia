/**
 * @go2asia/sdk/connectDashboard
 *
 * Connect dashboard read model helpers.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

export interface ConnectDashboardBalance {
  points: number;
  updatedAt: string | null;
}

export interface ConnectDashboardTransactionItem {
  id: string;
  amount: number;
  action:
    | 'registration'
    | 'first_login'
    | 'referral_bonus_referee'
    | 'referral_bonus_referrer'
    | 'event_registration'
    | 'space_post_created'
    | 'space_repost_created'
    | 'space_reaction_created'
    | 'quest_completed'
    | 'rielt_listing_created'
    | 'rf_partner_verified'
    | 'rf_voucher_claimed'
    | 'rf_voucher_redeemed';
  sourceService: string | null;
  sourceEventId: string | null;
  createdAt: string;
}

export interface ConnectDashboardReferrals {
  totalEarnedPoints: number;
  activatedReferrals: number;
  pendingReferrals: number;
  totalReferrals: number;
}

export interface ConnectDashboardBadgeItem {
  badgeCode: string;
  title: string;
  category: string | null;
  iconKey: string | null;
  awardedAt: string;
}

export interface ConnectDashboardBadges {
  totalBadges: number;
  recent: ConnectDashboardBadgeItem[];
}

export interface ConnectDashboardResponse {
  balance: ConnectDashboardBalance;
  recentTransactions: ConnectDashboardTransactionItem[];
  referrals: ConnectDashboardReferrals;
  badges: ConnectDashboardBadges;
}

export interface UseGetConnectDashboardOptions {
  transactionsLimit?: number;
  badgesLimit?: number;
  enabled?: boolean;
}

export const useGetConnectDashboard = (options?: UseGetConnectDashboardOptions) => {
  const queryParams = new URLSearchParams();
  if (typeof options?.transactionsLimit === 'number') {
    queryParams.set('transactionsLimit', String(options.transactionsLimit));
  }
  if (typeof options?.badgesLimit === 'number') {
    queryParams.set('badgesLimit', String(options.badgesLimit));
  }

  const queryString = queryParams.toString();
  const url = `/v1/points/connect-dashboard${queryString ? `?${queryString}` : ''}`;

  return useQuery<ConnectDashboardResponse>({
    queryKey: ['points', 'connect-dashboard', options?.transactionsLimit ?? null, options?.badgesLimit ?? null],
    queryFn: async () => customInstance<ConnectDashboardResponse>({ method: 'GET' }, url),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
    retry: 2,
  });
};
