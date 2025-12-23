'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConnectHero, ConnectNav, DemoModeBanner } from '../Shared';
import { Card } from '@go2asia/ui';
import { Button } from '@go2asia/ui';
import { Coins, Wallet as WalletIcon, Award, ArrowRight, Sparkles } from 'lucide-react';
import { NFTTab } from './NFTTab';
import { useGetBalance } from '@go2asia/sdk/balance';
import { useGetTransactions, type PointsTransaction } from '@go2asia/sdk/transactions';
import type { WalletData, NFTWalletData, ModuleType } from '../types';
import { mockWalletData, mockNFTWalletData } from '../mockData';
import { TransactionList } from './TransactionList';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface WalletViewProps {
  initialWalletData?: WalletData;
  initialNFTData?: NFTWalletData;
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
  const apiError = error as ApiError | null;
  const status = apiError?.status || 0;
  if (status === 401 || status === 403) return false;
  return status === 0 || status === 404 || status >= 500;
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

export function WalletView({
  initialWalletData,
  initialNFTData,
}: WalletViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'points' | 'g2a' | 'nft'>('points');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allTransactions, setAllTransactions] = useState<PointsTransaction[]>([]);

  // Загружаем баланс из Token Service
  const { data: balanceData, isLoading: balanceLoading, error: balanceError, refetch: refetchBalance } =
    useGetBalance();
  
  // Загружаем транзакции с курсорной пагинацией
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactions({
    limit: 20,
    cursor: cursor,
  });

  useEffect(() => {
    if (balanceError) handleApiError(balanceError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceError]);

  useEffect(() => {
    if (transactionsError) handleApiError(transactionsError, router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionsError]);

  const isFallback = isFallbackError(balanceError) || isFallbackError(transactionsError);

  const handleRetry = () => {
    refetchBalance();
    refetchTransactions();
  };

  // Кэшируем страницы транзакций в один список (для "Загрузить ещё")
  useEffect(() => {
    const items = transactionsData?.items ?? [];
    if (!items.length) return;

    setAllTransactions((prev) => {
      // Если это первая страница — заменяем
      if (!cursor) return items;
      const byId = new Map(prev.map((t) => [t.id, t]));
      for (const t of items) byId.set(t.id, t);
      return Array.from(byId.values());
    });
  }, [transactionsData?.items, cursor]);

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

  const allowedModules = new Set<ModuleType>(['space', 'atlas', 'pulse', 'rf', 'quest', 'guru']);
  function normalizeModule(raw: unknown): ModuleType {
    const v = typeof raw === 'string' ? raw : '';
    return allowedModules.has(v as ModuleType) ? (v as ModuleType) : 'space';
  }

  // Преобразуем данные из API в формат компонента
  const walletData = useMemo(() => {
    if (initialWalletData) return initialWalletData;

    const balance = balanceData
      ? {
          points: balanceData.balance || 0,
          g2a: 0,
          nft_count: 0, // TODO: получить из NFT badges API
          nft_legendary_count: 0,
        }
      : isFallback
        ? mockWalletData.balance
        : {
            points: 0,
            g2a: 0,
            nft_count: 0,
            nft_legendary_count: 0,
          };

    const sourceItems = allTransactions.length ? allTransactions : transactionsData?.items ?? [];

    const transactions: typeof mockWalletData.transactions =
      sourceItems.length > 0
        ? sourceItems.map((tx) => {
            const metadata = (tx.metadata as Record<string, unknown> | null) ?? null;
            const txModule = normalizeModule(metadata?.module);

            return {
              id: tx.id,
              type: tx.amount >= 0 ? ('credit' as const) : ('debit' as const),
              amount: Math.abs(tx.amount),
              currency: 'points' as const,
              module: txModule,
              description: getActionDescription(tx.action),
              created_at: tx.createdAt,
              tags: [],
              metadata: metadata || {},
            };
          })
        : isFallback
          ? mockWalletData.transactions
          : [];

    return {
      balance,
      transactions,
      pagination: {
        page: 1,
        per_page: 20,
        total: transactions.length,
        has_more: Boolean(transactionsData?.nextCursor),
      },
    };
  }, [balanceData, transactionsData?.nextCursor, transactionsData?.items, allTransactions, initialWalletData, isFallback]);

  const nftData = useMemo(() => {
    if (initialNFTData) return initialNFTData;
    return mockNFTWalletData; // TODO: получить из NFT badges API
  }, [initialNFTData]);

  const handleLoadMore = () => {
    if (transactionsData?.nextCursor) {
      setCursor(transactionsData.nextCursor);
    }
  };

  // Показываем состояние загрузки
  if (balanceLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Загрузка данных кошелька...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero
        subtitle="Центр экономики и геймификации Go2Asia"
        badgeText={isFallback ? 'DEMO MODE' : undefined}
      />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isFallback && <DemoModeBanner onRetry={handleRetry} />}

        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Кошелёк</h1>
          <p className="text-slate-600 mt-1">Управляй активами и смотри историю начислений</p>
        </div>

        {/* Три карточки активов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className="text-left"
          >
            <Card className={`p-5 border-2 ${activeTab === 'points' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Points</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{walletData.balance.points.toLocaleString('ru-RU')}</p>
                  <p className="text-xs text-emerald-700 mt-1">Топливо роста</p>
                </div>
                <div className="p-2 rounded-lg bg-white/70 border border-emerald-200 text-emerald-700">
                  <Coins size={18} />
                </div>
              </div>
            </Card>
          </button>

          <button type="button" onClick={() => setActiveTab('g2a')} className="text-left">
            <Card className={`p-5 border-2 ${activeTab === 'g2a' ? 'border-sky-300 bg-sky-50' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">G2A Токены</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{walletData.balance.g2a.toLocaleString('ru-RU')}</p>
                  <p className="text-xs text-sky-700 mt-1">Статус и доступ</p>
                </div>
                <div className="p-2 rounded-lg bg-white/70 border border-sky-200 text-sky-700">
                  <WalletIcon size={18} />
                </div>
              </div>
            </Card>
          </button>

          <button type="button" onClick={() => setActiveTab('nft')} className="text-left">
            <Card className={`p-5 border-2 ${activeTab === 'nft' ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">NFT Бейджи</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{walletData.balance.nft_count}</p>
                  <p className="text-xs text-orange-700 mt-1">Активные эффекты</p>
                </div>
                <div className="p-2 rounded-lg bg-white/70 border border-orange-200 text-orange-700">
                  <Award size={18} />
                </div>
              </div>
            </Card>
          </button>
        </div>

        {/* Объясняющий блок */}
        <Card className="p-6 mb-6">
          {activeTab === 'points' ? (
            <>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Points — топливо роста</h2>
              </div>
              <p className="text-sm text-slate-600">
                Внутренняя валюта за активность и вклад в экосистему. Используй Points для повышения уровня, участия в сезонах и доступа к миссиям.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Button variant="secondary" onClick={() => (window.location.href = '/connect/missions')}>
                  Как заработать больше <ArrowRight size={16} className="ml-1" />
                </Button>
                <Button variant="secondary" disabled>
                  Обменять на G2A <span className="ml-2 text-xs text-slate-500">Скоро</span>
                </Button>
              </div>
            </>
          ) : activeTab === 'g2a' ? (
            <>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-semibold">G2A — статус и доступ</h2>
              </div>
              <p className="text-sm text-slate-600">
                Токен, который открывает премиальные возможности: приоритетный доступ, партнёрские программы и статусы в экосистеме.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Button variant="secondary" disabled>
                  Где использовать <span className="ml-2 text-xs text-slate-500">Скоро</span>
                </Button>
                <Button variant="secondary" disabled>
                  Конвертировать Points <span className="ml-2 text-xs text-slate-500">Скоро</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold">NFT — достижения с эффектами</h2>
              </div>
              <p className="text-sm text-slate-600">
                Цифровые бейджи с бонусами: множители наград, XP‑ускорители и приоритетный доступ. Собирай коллекцию и усиливай эффекты.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Button variant="secondary" onClick={() => (window.location.href = '/connect/missions')}>
                  Получить новые NFT <ArrowRight size={16} className="ml-1" />
                </Button>
                <Button variant="secondary" disabled>
                  Маркетплейс NFT <span className="ml-2 text-xs text-slate-500">Скоро</span>
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* История / контент вкладки */}
        {activeTab === 'nft' ? (
          <NFTTab nfts={nftData.nfts} />
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">История транзакций</h2>
            <TransactionList
              transactions={
                walletData.transactions.filter((tx) => tx.currency === (activeTab === 'points' ? 'points' : 'g2a'))
              }
              onLoadMore={handleLoadMore}
              hasMore={walletData.pagination?.has_more}
            />
          </div>
        )}
      </div>
    </div>
  );
}

