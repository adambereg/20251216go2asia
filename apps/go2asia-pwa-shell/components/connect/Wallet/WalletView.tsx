'use client';

import { useState, useMemo } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { Card } from '@go2asia/ui';
import { Button } from '@go2asia/ui';
import { Coins, Wallet as WalletIcon, Award, ArrowRight, Sparkles } from 'lucide-react';
import { NFTTab } from './NFTTab';
import { useGetBalance } from '@go2asia/sdk/balance';
import { useGetTransactions } from '@go2asia/sdk/transactions';
import type { WalletData, NFTWalletData } from '../types';
import { mockWalletData, mockNFTWalletData } from '../mockData';
import { TransactionList } from './TransactionList';

interface WalletViewProps {
  initialWalletData?: WalletData;
  initialNFTData?: NFTWalletData;
}

export function WalletView({
  initialWalletData,
  initialNFTData,
}: WalletViewProps) {
  const [activeTab, setActiveTab] = useState<'points' | 'g2a' | 'nft'>('points');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  // Загружаем баланс из Token Service
  const { data: balanceData, isLoading: balanceLoading } = useGetBalance();
  
  // Загружаем транзакции с курсорной пагинацией
  const { data: transactionsData, isLoading: transactionsLoading } = useGetTransactions({ 
    limit: 20,
    cursor: cursor,
  });

  // Преобразуем данные из API в формат компонента
  const walletData = useMemo(() => {
    if (initialWalletData) return initialWalletData;

    // Используем реальные данные из API, если они есть, иначе моки
    const balance = balanceData !== undefined
      ? {
          points: balanceData.points || 0,
          g2a: parseFloat(String(balanceData.g2a || '0')),
          nft_count: 0, // TODO: получить из NFT badges API
          nft_legendary_count: 0, // TODO: получить из NFT badges API
        }
      : mockWalletData.balance;

    // Объединяем все загруженные транзакции
    const transactions: typeof mockWalletData.transactions = transactionsData?.items && transactionsData.items.length > 0
      ? transactionsData.items.map((tx) => {
      const metadata = tx.metadata as Record<string, unknown> | null;
      const txModule = (metadata?.module as string) || 'space'; // По умолчанию 'space'
      
      return {
        id: tx.id,
        type: (tx.type === 'points_add' || tx.type === 'g2a_add' ? 'credit' : 'debit') as 'credit' | 'debit',
        amount: parseInt(String(tx.amount || '0')),
        currency: (tx.type?.includes('g2a') ? 'g2a' : 'points') as 'points' | 'g2a',
        module: (txModule as 'space' | 'atlas' | 'pulse' | 'rf' | 'quest' | 'guru'),
        description: tx.reason || '',
        created_at: tx.createdAt || new Date().toISOString(),
        tags: [],
        metadata: metadata || {},
      };
    })
      : mockWalletData.transactions;

    return {
      balance,
      transactions,
      pagination: {
        page: 1,
        per_page: 20,
        total: transactions.length,
        has_more: transactionsData?.hasMore || false,
      },
    };
  }, [balanceData, transactionsData, initialWalletData]);

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
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

