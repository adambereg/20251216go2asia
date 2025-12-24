'use client';

import { ConnectHero, ConnectNav, DemoModeBanner } from '../Shared';
import { DashboardContent } from './DashboardContent';
import { useGetBalance } from '@go2asia/sdk/balance';
import { useGetReferralCode, useGetReferralStats } from '@go2asia/sdk/referrals';
import { useGetTransactions } from '@go2asia/sdk/transactions';
import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo } from 'react';
import { SkeletonCard } from '@go2asia/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@go2asia/ui';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { DashboardData } from '../types';
import { mockDashboardData, mockMissions, mockNextActions } from '../mockData';
import { ReferralCodeCard } from './ReferralCodeCard';

interface DashboardViewProps {
  initialData?: DashboardData;
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

/**
 * Handle API errors and show appropriate messages
 */
function handleApiError(error: unknown, router: ReturnType<typeof useRouter>) {
  const apiError = error as ApiError;
  const status = apiError.status || 0;
  const message = apiError.error?.message || 'Произошла ошибка';

  // Network error
  if (status === 0 || !status) {
    toast.error('Проверьте подключение к интернету');
    return;
  }

  // 401 Unauthorized - redirect to sign-in
  if (status === 401) {
    const currentPath = window.location.pathname;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
    return;
  }

  // 403 Forbidden
  if (status === 403) {
    toast.error('У вас нет доступа к этому ресурсу');
    return;
  }

  // 5xx Server Error
  if (status >= 500) {
    toast.error('Произошла ошибка сервера. Попробуйте позже');
    return;
  }

  // Other errors
  toast.error(message);
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();

  // Загружаем баланс Points
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useGetBalance();

  // Загружаем referral code
  const {
    data: referralCodeData,
    isLoading: referralCodeLoading,
    error: referralCodeError,
    refetch: refetchReferralCode,
  } = useGetReferralCode();

  // Загружаем статистику рефералов
  const {
    data: referralStatsData,
    isLoading: referralStatsLoading,
    error: referralStatsError,
    refetch: refetchReferralStats,
  } = useGetReferralStats();

  // Загружаем последние транзакции
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactions({ limit: 10 });

  // Обработка ошибок (через useEffect, чтобы не спамить toast'ами на ререндере)
  useEffect(() => {
    if (balanceError) handleApiError(balanceError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceError]);

  useEffect(() => {
    if (referralCodeError) handleApiError(referralCodeError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralCodeError]);

  useEffect(() => {
    if (referralStatsError) handleApiError(referralStatsError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralStatsError]);

  useEffect(() => {
    if (transactionsError) handleApiError(transactionsError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionsError]);

  // Преобразуем данные из API в формат компонента
  const data = useMemo(() => {
    if (initialData) return initialData;

    // Балансы
    const balances = balanceData
      ? {
          points: balanceData.balance || 0,
          g2a: 0, // G2A tokens пока не поддерживаются в M4
          nft_count: 0, // NFT badges пока не поддерживаются в M4
          nft_legendary_count: 0,
        }
      : {
          points: 0,
          g2a: 0,
          nft_count: 0,
          nft_legendary_count: 0,
        };

    // Транзакции
    const recentTransactions =
      transactionsData?.items && transactionsData.items.length > 0
        ? transactionsData.items.map((tx) => {
            const metadata = tx.metadata as Record<string, unknown> | null;
            const txModule = (metadata?.module as string) || 'space';

            return {
              id: tx.id,
              type: tx.amount >= 0 ? ('credit' as const) : ('debit' as const),
              amount: Math.abs(tx.amount),
              currency: 'points' as const,
              module: txModule as 'space' | 'atlas' | 'pulse' | 'rf' | 'quest' | 'guru',
              description: getActionDescription(tx.action),
              created_at: tx.createdAt,
              tags: [],
              metadata: metadata || {},
            };
          })
        : [];

    return {
      balances,
      recent_transactions: recentTransactions,
      // Для M4 пока используем стабильные мок-данные для level/season/next_actions,
      // чтобы UI соответствовал референсу без изменения API.
      level: mockDashboardData.level,
      season: mockDashboardData.season,
      next_actions: mockDashboardData.next_actions,
    };
  }, [balanceData, transactionsData, initialData]);

  // Функция для получения описания действия
  function getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
      registration: 'Регистрация в системе',
      first_login: 'Первый вход',
      referral_bonus_referee: 'Бонус за регистрацию по реферальной ссылке',
      referral_bonus_referrer: 'Бонус за приглашение друга',
      event_registration: 'Регистрация на событие',
    };
    return descriptions[action] || `Действие: ${action}`;
  }

  // Состояние загрузки
  const isLoading =
    balanceLoading ||
    referralCodeLoading ||
    referralStatsLoading ||
    transactionsLoading ||
    !userLoaded;

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  // Получаем информацию о пользователе из Clerk
  const userName = user?.fullName || user?.firstName || user?.id || 'Пользователь';

  const handleViewHistory = () => {
    router.push('/connect/wallet');
  };

  const handleTopUp = () => {
    // Mock действие - будет реализовано позже
    toast('Функция пополнения будет доступна в следующей версии');
  };

  const handleWithdraw = () => {
    // Mock действие - будет реализовано позже
    toast('Функция вывода будет доступна в следующей версии');
  };

  const handleViewNFT = () => {
    router.push('/connect/wallet?tab=nft');
  };

  const handleRetry = () => {
    refetchBalance();
    refetchReferralCode();
    refetchReferralStats();
    refetchTransactions();
  };

  const isFallback =
    isFallbackError(balanceError) ||
    isFallbackError(referralCodeError) ||
    isFallbackError(referralStatsError) ||
    isFallbackError(transactionsError);

  const effectiveData = isFallback ? mockDashboardData : data;

  const referralCode = referralCodeData?.code || referralStatsData?.code;
  const directReferralsCount = referralStatsData?.directReferralsCount;

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText={isFallback ? 'DEMO MODE' : undefined} />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isFallback && <DemoModeBanner onRetry={handleRetry} />}

        <ReferralCodeCard
          referralCode={referralCode}
          directReferralsCount={directReferralsCount}
          isLoading={referralCodeLoading || referralStatsLoading}
        />

        {/* Ошибки (если есть) */}
        {(balanceError || referralCodeError || transactionsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Ошибка загрузки данных
                </p>
                <p className="text-xs text-red-700 mb-3">
                  Некоторые данные не удалось загрузить. Попробуйте обновить страницу.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Попробовать снова
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DashboardContent
        greetingName={userName}
        data={effectiveData}
        todayActions={mockNextActions}
        missionsOfDay={mockMissions}
        transactions={effectiveData.recent_transactions}
        onViewHistory={handleViewHistory}
        onTopUp={handleTopUp}
        onWithdraw={handleWithdraw}
        onViewNFT={handleViewNFT}
      />
    </div>
  );
}
