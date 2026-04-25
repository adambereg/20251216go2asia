'use client';

import { useMemo, useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { InviteModal } from './InviteModal';
import {
  useGetReferralCode,
  useGetReferralEarnings,
  useGetReferralStats,
  useGetReferralTree,
  type ReferralEarningsItem,
  type ReferralTreeNode,
} from '@go2asia/sdk/referrals';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card, SkeletonCard } from '@go2asia/ui';
import type { Referral, ReferralsData, ReferralStats as ReferralStatsType } from '../types';
import { ReferralsContent } from './ReferralsContent';

interface ReferralsViewProps {
  initialData?: ReferralsData;
}

function shortUserLabel(userId: string) {
  const tail = userId.slice(-4).toUpperCase();
  return `Пользователь …${tail}`;
}

function buildReferralLink(code: string) {
  if (!code) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://go2asia.space';
  return `${origin}/sign-up?ref=${encodeURIComponent(code)}`;
}

function getStatusHelperText(item: ReferralEarningsItem) {
  if (item.status === 'reward_missing') return 'Активация есть, начисление проверяется.';
  if (item.status === 'pending') return 'Пользователь приглашён, но ещё не стал активным.';
  if (item.status === 'activated') return 'Пользователь стал активным, начисление может ещё обрабатываться.';
  return 'Points за приглашение уже начислены.';
}

function mapEarningItem(item: ReferralEarningsItem, registeredAt?: string): Referral {
  return {
    id: item.refereeUserId,
    type: 'user',
    name: shortUserLabel(item.refereeUserId),
    status: item.status,
    earned_rewards: { points: item.earnedPoints, g2a: 0 },
    invited_at: registeredAt ?? item.activatedAt ?? item.pointsAppliedAt ?? '',
    activated_at: item.activatedAt,
    points_applied_at: item.pointsAppliedAt,
    status_helper_text: getStatusHelperText(item),
  };
}

function mapTreeNode(node: ReferralTreeNode): Referral {
  return {
    id: node.userId,
    type: 'user',
    name: shortUserLabel(node.userId),
    status: node.isActive ? 'activated' : 'pending',
    earned_rewards: { points: 0, g2a: 0 },
    invited_at: node.registeredAt,
    activated_at: node.firstLoginAt ?? null,
    status_helper_text: node.isActive
      ? 'Пользователь стал активным, начисление может ещё обрабатываться.'
      : 'Пользователь приглашён, но ещё не стал активным.',
  };
}

export function ReferralsView({ initialData }: ReferralsViewProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const {
    data: referralCodeData,
    isLoading: codeLoading,
    isError: codeError,
    refetch: refetchCode,
  } = useGetReferralCode();
  const {
    data: referralStatsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetReferralStats();
  const {
    data: referralTreeData,
    isLoading: treeLoading,
    isError: treeError,
    refetch: refetchTree,
  } = useGetReferralTree({ depth: 2 });
  const {
    data: referralEarningsData,
    isLoading: earningsLoading,
    isError: earningsError,
    refetch: refetchEarnings,
  } = useGetReferralEarnings({ limit: 50 });

  const handleRetry = () => {
    refetchCode();
    refetchStats();
    refetchTree();
    refetchEarnings();
  };

  const data = useMemo(() => {
    if (initialData) return initialData;

    const earningsSummary = referralEarningsData?.summary;
    const stats: ReferralStatsType = {
      total_users: earningsSummary?.totalReferrals ?? referralStatsData?.directReferralsCount ?? 0,
      total_partners: 0,
      earned_points: earningsSummary?.totalEarnedPoints ?? 0,
      earned_g2a: 0,
      activated_referrals: earningsSummary?.activatedReferrals,
      pending_referrals: earningsSummary?.pendingReferrals,
    };

    const registeredById = new Map<string, string>();
    for (const node of referralTreeData?.referrals ?? []) {
      registeredById.set(node.userId, node.registeredAt);
      for (const child of node.subReferrals ?? []) {
        registeredById.set(child.userId, child.registeredAt);
      }
    }

    const referralsById = new Map<string, Referral>();

    for (const node of referralTreeData?.referrals ?? []) {
      referralsById.set(node.userId, mapTreeNode(node));
    }

    for (const item of referralEarningsData?.items ?? []) {
      referralsById.set(item.refereeUserId, mapEarningItem(item, registeredById.get(item.refereeUserId)));
    }

    const referrals = Array.from(referralsById.values()).sort((a, b) => {
      const left = a.invited_at ? new Date(a.invited_at).getTime() : 0;
      const right = b.invited_at ? new Date(b.invited_at).getTime() : 0;
      return right - left;
    });

    const code = referralCodeData?.code || referralStatsData?.code || '';

    return {
      stats,
      referrals,
      referral_code: code,
      referral_link: buildReferralLink(code),
    };
  }, [referralCodeData?.code, referralStatsData, referralTreeData, referralEarningsData, initialData]);

  const isLoading = codeLoading || statsLoading || treeLoading || earningsLoading;
  const hasError = codeError || statsError || treeError || earningsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Приглашайте друзей и отслеживайте начисления Points." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-slate-600 mb-4">Загружаем данные Connect…</p>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Приглашайте друзей и отслеживайте начисления Points." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Не удалось загрузить данные Connect. Попробуйте ещё раз.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-2 mt-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Приглашайте друзей и отслеживайте начисления Points." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <ReferralsContent
          data={data}
          onInvite={() => {
            setInviteModalOpen(true);
          }}
        />
      </div>

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        referralLink={data.referral_link}
      />
    </>
  );
}

