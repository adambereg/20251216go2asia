'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@go2asia/ui';
import { ConnectHero, ConnectNav } from '../Shared';
import { mockDashboardData, mockMissions, mockNextActions } from '../mockData';
import type { DashboardData } from '../types';
import { DashboardContent } from './DashboardContent';

interface DashboardMockViewProps {
  initialData?: DashboardData;
}

export function DashboardMockView({ initialData }: DashboardMockViewProps) {
  const data = useMemo(() => initialData ?? mockDashboardData, [initialData]);

  // В mock-режиме не используем Clerk-хуки, чтобы экран открывался без ClerkProvider.
  const userName = 'Алекс';

  const handleTopUp = () => toast('Функция пополнения будет доступна в следующей версии');
  const handleWithdraw = () => toast('Функция вывода будет доступна в следующей версии');
  const handleViewHistory = () => toast('Откройте вкладку Wallet → Points');
  const handleViewNFT = () => toast('Откройте вкладку Wallet → NFT');

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText="MOCK DATA" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 mb-1">MOCK DATA</p>
              <p className="text-xs text-amber-900/80">Экран использует локальные мок-данные (без запросов к API).</p>
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
      </div>

      <DashboardContent
        greetingName={userName}
        data={data}
        todayActions={mockNextActions}
        missionsOfDay={mockMissions}
        transactions={data.recent_transactions}
        onViewHistory={handleViewHistory}
        onTopUp={handleTopUp}
        onWithdraw={handleWithdraw}
        onViewNFT={handleViewNFT}
      />
    </div>
  );
}


