'use client';

import { useQuery } from '@tanstack/react-query';
import { Coins, LockKeyhole } from 'lucide-react';
import { Card, Button } from '@go2asia/ui';
import type { ConnectDashboardBalance } from '@go2asia/sdk/connectDashboard';
import { customInstance } from '@go2asia/sdk/mutator';

interface BalanceCardsProps {
  balance: ConnectDashboardBalance;
}

type WalletSummary = {
  availablePoints: number;
  lockedPoints: number;
  networkPoints: number;
  totalPoints: number;
  estimatedUnlockablePoints: number;
  vipStatus: { isActive: boolean };
  proStatus: { isActive: boolean };
};

function useGetWalletSummary() {
  return useQuery<WalletSummary>({
    queryKey: ['wallet', 'summary'],
    queryFn: async () => customInstance<WalletSummary>({ method: 'GET' }, '/v1/wallet/summary'),
    staleTime: 30 * 1000,
    retry: 2,
  });
}

function formatPoints(value: number | null | undefined) {
  return (value ?? 0).toLocaleString('ru-RU');
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function BalanceCards({ balance }: BalanceCardsProps) {
  const { data: walletSummary, isError: walletSummaryError } = useGetWalletSummary();
  const updatedAt = formatUpdatedAt(balance.updatedAt);
  const totalPoints = walletSummary?.totalPoints ?? balance.points;
  const availablePoints = walletSummary?.availablePoints ?? balance.points;
  const lockedPoints = walletSummary?.lockedPoints ?? 0;
  const hasPoints = totalPoints > 0;

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
              <p className="text-3xl font-bold text-slate-900">{formatPoints(totalPoints)} Points</p>
              <p className="text-sm text-slate-500 mt-2">
                {hasPoints
                  ? 'Total Points отражают доступные и заблокированные начисления в Connect Asia.'
                  : 'У вас пока нет Points. Они появятся после первых действий в Go2Asia.'}
              </p>
              {updatedAt && (
                <p className="text-xs text-slate-500 mt-2">Обновлено {updatedAt}</p>
              )}
              {walletSummaryError && (
                <p className="text-xs text-amber-700 mt-2">
                  Структура Points временно недоступна, показываем текущий баланс.
                </p>
              )}
            </div>
          </div>

          <Button variant="secondary" size="sm" className="md:w-auto w-full" onClick={() => (window.location.href = '/connect/wallet')}>
            Смотреть историю
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Available Points</p>
                <p className="text-xl font-bold text-slate-900">{formatPoints(availablePoints)}</p>
              </div>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Доступны сейчас.</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-amber-800">Locked Points</p>
                <p className="text-xl font-bold text-amber-950">{formatPoints(lockedPoints)}</p>
              </div>
              <LockKeyhole className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-xs text-amber-800 mt-2">Ожидают активации условий.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

