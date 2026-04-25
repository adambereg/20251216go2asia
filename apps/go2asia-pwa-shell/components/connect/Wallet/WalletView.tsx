'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { Button, Card, SkeletonCard } from '@go2asia/ui';
import { AlertCircle, Coins, RefreshCw, Sparkles } from 'lucide-react';
import { useGetBalance, type UserBalance } from '@go2asia/sdk/balance';
import { useGetTransactions, type PointsTransaction } from '@go2asia/sdk/transactions';
import type { ModuleType, Transaction } from '../types';
import { TransactionList } from './TransactionList';

function formatUpdatedAt(updatedAt: string | null | undefined) {
  if (!updatedAt) return null;
  return new Date(updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function normalizeModule(tx: PointsTransaction): ModuleType {
  if (tx.action === 'quest_completed' || tx.sourceService === 'quest-service') return 'quest';
  if (tx.action === 'event_registration' || tx.sourceService === 'pulse-service') return 'pulse';
  if (tx.action.startsWith('rf_') || tx.sourceService === 'rf-service') return 'rf';
  if (tx.action.startsWith('space_') || tx.sourceService === 'space-service') return 'space';
  return 'space';
}

function toWalletTransaction(tx: PointsTransaction): Transaction {
  return {
    id: tx.id,
    type: tx.amount >= 0 ? 'credit' : 'debit',
    amount: Math.abs(tx.amount),
    currency: 'points',
    module: normalizeModule(tx),
    description: 'Активность Go2Asia',
    created_at: tx.createdAt,
    metadata: {
      ...(tx.metadata ?? {}),
      action: tx.action,
      sourceService: tx.sourceService ?? null,
      sourceEventId: tx.sourceEventId ?? null,
    },
  };
}

function PointsSummary({ balance }: { balance: UserBalance | undefined }) {
  const points = balance?.balance ?? 0;
  const updatedAt = formatUpdatedAt(balance?.updatedAt);

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Coins className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-600">Points — след вашей активности</h2>
            <p className="text-4xl font-bold text-slate-900 mt-1">{points.toLocaleString('ru-RU')} Points</p>
            <p className="text-sm text-slate-600 mt-3">
              {points > 0
                ? 'Points начисляются за действия в Go2Asia: квесты, события, приглашения и другие подтверждённые активности.'
                : 'У вас пока нет Points. Они появятся после первых действий в Go2Asia.'}
            </p>
            {updatedAt && <p className="text-xs text-slate-500 mt-2">Обновлено {updatedAt}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function WalletView() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allTransactions, setAllTransactions] = useState<PointsTransaction[]>([]);

  const { data: balanceData, isLoading: balanceLoading, isError: balanceError, refetch: refetchBalance } =
    useGetBalance();
  
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactions({
    limit: 20,
    cursor: cursor,
  });

  const handleRetry = () => {
    refetchBalance();
    refetchTransactions();
  };

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

  const transactions = useMemo(() => {
    const sourceItems = allTransactions.length ? allTransactions : transactionsData?.items ?? [];
    return sourceItems.map(toWalletTransaction);
  }, [allTransactions, transactionsData?.items]);

  const handleLoadMore = () => {
    if (transactionsData?.nextCursor) {
      setCursor(transactionsData.nextCursor);
    }
  };

  const isInitialLoading = balanceLoading || (transactionsLoading && !transactions.length);
  const hasError = balanceError || transactionsError;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="История Points и начислений за вашу активность." />
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
        <ConnectHero subtitle="История Points и начислений за вашу активность." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Не удалось загрузить историю Points
                </p>
                <p className="text-xs text-red-700 mb-3">Попробуйте ещё раз.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Попробовать ещё раз
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero
        subtitle="История Points и начислений за вашу активность."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Кошелёк</h1>
          <p className="text-slate-600 mt-1">История Points и начислений за вашу активность.</p>
        </div>

        <PointsSummary balance={balanceData} />

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-2 text-slate-900">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Points — след вашей активности</h2>
          </div>
          <p className="text-sm text-slate-600">
            Points начисляются за действия в Go2Asia: квесты, события, приглашения и другие подтверждённые активности.
          </p>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">История начислений</h2>
          <TransactionList
            transactions={transactions}
            onLoadMore={handleLoadMore}
            hasMore={Boolean(transactionsData?.nextCursor)}
          />
        </div>

        <Card className="p-5 border-slate-200 bg-slate-50">
          <p className="text-sm font-semibold text-slate-900">Расширенные возможности появятся позже</p>
          <p className="text-sm text-slate-600 mt-1">
            Токеномика и on-chain функции не входят в текущий MVP Connect. Сейчас здесь отображаются только Points и история начислений.
          </p>
        </Card>
      </div>
    </div>
  );
}

