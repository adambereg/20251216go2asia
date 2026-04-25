'use client';

import { Coins } from 'lucide-react';
import { Card, Button } from '@go2asia/ui';
import type { ConnectDashboardBalance } from '@go2asia/sdk/connectDashboard';

interface BalanceCardsProps {
  balance: ConnectDashboardBalance;
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function BalanceCards({ balance }: BalanceCardsProps) {
  const updatedAt = formatUpdatedAt(balance.updatedAt);
  const hasPoints = balance.points > 0;

  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Coins className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-600">Ваши Points</h3>
              <p className="text-3xl font-bold text-slate-900">{balance.points.toLocaleString('ru-RU')} Points</p>
              <p className="text-sm text-slate-500 mt-2">
                {hasPoints
                  ? 'Points отражают вашу активность в Go2Asia.'
                  : 'У вас пока нет Points. Они появятся после первых действий в Go2Asia.'}
              </p>
              {updatedAt && (
                <p className="text-xs text-slate-500 mt-2">Обновлено {updatedAt}</p>
              )}
            </div>
          </div>

          <Button variant="secondary" size="sm" className="md:w-auto w-full" onClick={() => (window.location.href = '/connect/wallet')}>
            Смотреть историю
          </Button>
        </div>
      </Card>
    </div>
  );
}

