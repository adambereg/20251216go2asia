'use client';

import { Card, Button } from '@go2asia/ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ConnectDashboardTransactionItem } from '@go2asia/sdk/connectDashboard';
import { getConnectLedgerActionLabel, getConnectLedgerSourceLabel } from '../copy';

interface ActivityFeedProps {
  transactions: ConnectDashboardTransactionItem[];
  maxItems?: number;
}

function getActionLabel(action: string) {
  return getConnectLedgerActionLabel(action);
}

function getSourceLabel(sourceService: string | null) {
  return getConnectLedgerSourceLabel(sourceService);
}

export function ActivityFeed({ transactions, maxItems = 10 }: ActivityFeedProps) {
  const displayedTransactions = transactions.slice(0, maxItems);

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

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Activity summary с Points</h2>
          <p className="text-sm text-slate-600">
            Reference-only projection последних строк; не receipt и не полный audit trail.
          </p>
        </div>
        <Link href="/connect/wallet">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto">
            Показать все
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">Pt</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{getActionLabel(transaction.action)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {getSourceLabel(transaction.sourceService)} · {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-sm font-semibold ${
                        transaction.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount >= 0 ? '+' : '-'}
                      {Math.abs(transaction.amount)} Points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Activity summary появится после первых backend-событий Go2Asia.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

