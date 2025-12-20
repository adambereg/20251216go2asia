'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@go2asia/ui';
import { ConnectHero, ConnectNav } from '../Shared';
import { BalanceCards } from './BalanceCards';
import { ProgressPanel } from './ProgressPanel';
import { NextActions } from './NextActions';
import { ActivityFeed } from './ActivityFeed';
import { ReferralCodeCard } from './ReferralCodeCard';
import { mockDashboardData, mockReferralsData } from '../mockData';
import type { DashboardData } from '../types';

interface DashboardMockViewProps {
  initialData?: DashboardData;
}

export function DashboardMockView({ initialData }: DashboardMockViewProps) {
  const data = useMemo(() => initialData ?? mockDashboardData, [initialData]);

  // В mock-режиме не используем Clerk-хуки, чтобы экран открывался без ClerkProvider.
  const userName = 'Пользователь';
  const userEmail = '';
  const userId = 'mock-user';

  const handleTopUp = () => toast.info('Функция пополнения будет доступна в следующей версии');
  const handleWithdraw = () => toast.info('Функция вывода будет доступна в следующей версии');
  const handleViewHistory = () => toast.info('Откройте вкладку Wallet → Points');
  const handleViewNFT = () => toast.info('Откройте вкладку Wallet → NFT');

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText="MOCK DATA" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Профиль пользователя</h2>
          <div className="space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium">Имя:</span> {userName}
            </p>
            {userEmail && (
              <p>
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            )}
            <p>
              <span className="font-medium">ID:</span> {userId}
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 mb-1">MOCK DATA</p>
              <p className="text-xs text-amber-900/80">
                Экран использует локальные мок-данные (без запросов к API).
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-3 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </Button>
            </div>
          </div>
        </div>

        <BalanceCards
          balances={data.balances}
          onViewHistory={handleViewHistory}
          onTopUp={handleTopUp}
          onWithdraw={handleWithdraw}
          onViewNFT={handleViewNFT}
        />

        <ReferralCodeCard referralCode={mockReferralsData.referral_link.split('/').pop() || 'ABC123'} />

        <ProgressPanel level={data.level} season={data.season} />

        {data.next_actions && data.next_actions.length > 0 && <NextActions actions={data.next_actions} />}

        <ActivityFeed transactions={data.recent_transactions} />
      </div>
    </div>
  );
}

