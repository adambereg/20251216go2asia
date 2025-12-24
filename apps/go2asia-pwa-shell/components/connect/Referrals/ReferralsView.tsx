'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConnectHero, ConnectNav, DemoModeBanner } from '../Shared';
import { InviteModal } from './InviteModal';
import { useGetReferralCode, useGetReferralStats, useGetReferralTree } from '@go2asia/sdk/referrals';
import type { ReferralsData, ReferralStats as ReferralStatsType, Referral } from '../types';
import { mockReferralsData } from '../mockData';
import { ReferralsContent } from './ReferralsContent';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ReferralsViewProps {
  initialData?: ReferralsData;
}

/**
 * Error object structure from API
 */
interface ApiError {
  error?: {
    code?: string;
    message?: string;
  };
  status?: number;
  requestId?: string;
}

function isFallbackError(error: unknown): boolean {
  // No error => no fallback
  if (!error) return false;

  const apiError = error as ApiError;
  const status = apiError.status || 0;

  // Auth errors are handled separately (redirect/UX), not "demo mode"
  if (status === 401 || status === 403) return false;

  // Network / timeout / CORS (treated as status=0 by SDK)
  if (status === 0) return true;

  // Only fallback for "API unavailable / not found / server errors"
  return status === 404 || status >= 500;
}

function handleApiError(error: unknown, router: ReturnType<typeof useRouter>) {
  const apiError = error as ApiError;
  const status = apiError.status || 0;

  if (status === 0 || !status) {
    toast.error('Проверьте подключение к интернету');
    return;
  }

  if (status === 401) {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
    return;
  }

  if (status === 403) {
    toast.error('У вас нет доступа к этому ресурсу');
    return;
  }

  if (status >= 500) {
    toast.error('Произошла ошибка сервера. Попробуйте позже');
    return;
  }

  toast.error(apiError.error?.message || 'Произошла ошибка');
}

function shortUserLabel(userId: string) {
  const tail = userId.length > 8 ? userId.slice(-8) : userId;
  return `Пользователь • ${tail}`;
}

export function ReferralsView({ initialData }: ReferralsViewProps) {
  const router = useRouter();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteKind, setInviteKind] = useState<'user' | 'business'>('user');

  const {
    data: referralCodeData,
    isLoading: codeLoading,
    error: codeError,
    refetch: refetchCode,
  } = useGetReferralCode();
  const {
    data: referralStatsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetReferralStats();
  
  // Загружаем дерево рефералов из API
  const {
    data: referralTreeData,
    isLoading: treeLoading,
    error: treeError,
    refetch: refetchTree,
  } = useGetReferralTree({ depth: 2 });

  useEffect(() => {
    if (codeError) handleApiError(codeError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeError]);

  useEffect(() => {
    if (statsError) handleApiError(statsError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsError]);

  useEffect(() => {
    if (treeError) handleApiError(treeError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeError]);

  const isFallback = isFallbackError(codeError) || isFallbackError(statsError) || isFallbackError(treeError);
  const handleRetry = () => {
    refetchCode();
    refetchStats();
    refetchTree();
  };

  // Преобразуем данные из API в формат компонента
  const data = useMemo(() => {
    if (initialData) return initialData;

    if (isFallback) return mockReferralsData;

    const stats: ReferralStatsType = {
      total_users: referralStatsData?.directReferralsCount ?? 0,
      total_partners: 0,
      earned_points: 0,
      earned_g2a: 0,
    };

    const referrals: Referral[] = [];

    const direct = referralTreeData?.referrals ?? [];
    for (const d of direct) {
      referrals.push({
        id: d.userId,
        type: 'user',
        name: shortUserLabel(d.userId),
        avatar: undefined,
        status: d.isActive ? 'active' : 'registered',
        earned_rewards: { points: 0, g2a: 0 },
        invited_at: d.registeredAt,
      });

      const children = d.subReferrals ?? [];
      for (const sr of children) {
        referrals.push({
          id: sr.userId,
          parent_referral_id: d.userId,
          type: 'user',
          name: shortUserLabel(sr.userId),
          avatar: undefined,
          status: sr.isActive ? 'active' : 'registered',
          earned_rewards: { points: 0, g2a: 0 },
          invited_at: sr.registeredAt,
        });
      }
    }

    const code = referralCodeData?.code || referralStatsData?.code || '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://go2asia.space';
    const referralLink = code ? `${origin}/sign-up?ref=${encodeURIComponent(code)}` : mockReferralsData.referral_link;

    return {
      stats,
      referrals,
      referral_link: referralLink,
      referral_qr: mockReferralsData.referral_qr,
    };
  }, [referralCodeData?.code, referralStatsData, referralTreeData, initialData, isFallback]);

  const isLoading = codeLoading || statsLoading || treeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Загрузка данных рефералов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <ConnectHero
          subtitle="Центр экономики и геймификации Go2Asia"
          badgeText={isFallback ? 'DEMO MODE' : undefined}
        />

        {/* Навигация */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0">
          {isFallback && <DemoModeBanner onRetry={handleRetry} />}
        </div>

        <ReferralsContent
          data={data}
          onInvite={(kind) => {
            setInviteKind(kind);
            setInviteModalOpen(true);
          }}
        />
      </div>

      {/* Модал приглашения */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        referralLink={data.referral_link}
        referralQR={data.referral_qr}
        kind={inviteKind}
      />
    </>
  );
}

