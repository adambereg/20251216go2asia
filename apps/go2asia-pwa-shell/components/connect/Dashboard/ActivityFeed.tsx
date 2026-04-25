'use client';

import { Card, Button } from '@go2asia/ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ConnectDashboardTransactionItem } from '@go2asia/sdk/connectDashboard';

interface ActivityFeedProps {
  transactions: ConnectDashboardTransactionItem[];
  maxItems?: number;
}

const ACTION_LABELS: Record<string, string> = {
  registration: 'Регистрация',
  first_login: 'Первый вход',
  quest_completed: 'Квест завершён',
  referral_bonus_referrer: 'Бонус за приглашённого пользователя',
  referral_bonus_referee: 'Бонус за регистрацию по приглашению',
  event_registration: 'Регистрация на событие',
  space_post_created: 'Публикация в Space',
  rf_voucher_redeemed: 'RF-ваучер использован',
  rielt_listing_created: 'Объявление в Rielt',
  badge_awarded: 'Бейдж получен',
};

const SOURCE_LABELS: Record<string, string> = {
  'quest-service': 'Quest Asia',
  'referral-service': 'Referral',
  'points-service': 'Points',
  'content-service': 'Go2Asia',
  'pulse-service': 'Pulse Asia',
  'space-service': 'Space Asia',
  'rf-service': 'Russian Friendly',
  'rielt-service': 'Rielt Market',
};

function getActionLabel(action: string) {
  return ACTION_LABELS[action] ?? 'Активность Go2Asia';
}

function getSourceLabel(sourceService: string | null) {
  if (!sourceService) return 'Go2Asia';
  return SOURCE_LABELS[sourceService] ?? 'Go2Asia';
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Последние начисления</h2>
        <Link href="/connect/wallet">
          <Button variant="secondary" size="sm">
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
            <p>История начислений появится после первых действий в Go2Asia.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

