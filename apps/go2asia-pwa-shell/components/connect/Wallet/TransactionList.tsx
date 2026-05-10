'use client';

import { useState, useMemo } from 'react';
import { Card, Chip, Button } from '@go2asia/ui';
import type { Transaction } from '../types';
import { getConnectLedgerActionLabel, getConnectLedgerSourceLabel } from '../copy';

interface TransactionListProps {
  transactions: Transaction[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

type CategoryFilter = 'all' | 'quest' | 'referrals' | 'events' | 'other';

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getActionLabel(transaction: Transaction) {
  const action = getString(transaction.metadata?.action);
  return getConnectLedgerActionLabel(action);
}

function getSourceLabel(transaction: Transaction) {
  const sourceService = getString(transaction.metadata?.sourceService);
  return getConnectLedgerSourceLabel(sourceService || null);
}

function getCategory(transaction: Transaction): Exclude<CategoryFilter, 'all'> {
  const action = getString(transaction.metadata?.action);
  const sourceService = getString(transaction.metadata?.sourceService);

  if (action === 'quest_completed' || sourceService === 'quest-service') return 'quest';
  if (action.startsWith('referral_') || sourceService === 'referral-service') return 'referrals';
  if (action === 'event_registration' || sourceService === 'pulse-service' || sourceService === 'content-service') return 'events';
  return 'other';
}

export function TransactionList({ transactions, onLoadMore, hasMore }: TransactionListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (selectedCategory !== 'all') {
      result = result.filter((tx) => getCategory(tx) === selectedCategory);
    }

    if (selectedPeriod !== 'all') {
      const now = new Date();
      result = result.filter((tx) => {
        const txDate = new Date(tx.created_at);
        const diffMs = now.getTime() - txDate.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        switch (selectedPeriod) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    return result;
  }, [transactions, selectedCategory, selectedPeriod]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'quest', label: 'Квесты' },
    { value: 'referrals', label: 'Рефералы' },
    { value: 'events', label: 'События' },
    { value: 'other', label: 'Другое' },
  ];

  return (
    <div className="space-y-4">
      {/* Фильтры */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Источник</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip
                key={category.value}
                size="sm"
                selected={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* По периоду */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Период</h4>
          <div className="flex flex-wrap gap-2">
            {(['all', 'today', 'week', 'month'] as const).map((period) => (
              <Chip
                key={period}
                size="sm"
                selected={selectedPeriod === period}
                onClick={() => setSelectedPeriod(period)}
              >
                {period === 'all'
                  ? 'Все'
                  : period === 'today'
                    ? 'Сегодня'
                    : period === 'week'
                      ? 'Неделя'
                      : 'Месяц'}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Список транзакций */}
      <div className="space-y-2">
        {filteredTransactions.length > 0 ? (
          <>
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-lg text-sm font-semibold text-emerald-700">Pt</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {getActionLabel(transaction)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {getSourceLabel(transaction)} · {formatDate(transaction.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          {transaction.amount} Points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {hasMore && onLoadMore && (
              <div className="pt-4 text-center">
                <Button variant="secondary" onClick={onLoadMore}>
                  Загрузить ещё
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-slate-500">История начислений появится здесь после первых действий.</p>
            <p className="text-sm text-slate-400 mt-1">
              Если фильтры включены, попробуйте выбрать “Все”.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

