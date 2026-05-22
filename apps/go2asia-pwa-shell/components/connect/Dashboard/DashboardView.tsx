'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { DashboardContent } from './DashboardContent';
import { useGetConnectDashboard } from '@go2asia/sdk/connectDashboard';
import { Button, SkeletonCard } from '@go2asia/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';
export function DashboardView() {
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useGetConnectDashboard({
    transactionsLimit: 8,
    badgesLimit: 5,
  });

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Read-only projection активности, Points и бейджей Go2Asia." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-slate-600 mb-4">Загружаем данные Connect…</p>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Read-only projection активности, Points и бейджей Go2Asia." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Не удалось загрузить данные Connect
                </p>
                <p className="text-xs text-red-700 mb-3">
                  Попробуйте ещё раз.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Read-only projection активности, Points и бейджей Go2Asia." />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <DashboardContent
        dashboard={dashboard}
      />
    </div>
  );
}
