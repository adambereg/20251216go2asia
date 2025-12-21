'use client';

import { useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { Chip, Card, Button } from '@go2asia/ui';
import { SourcesList } from './SourcesList';
import { ReferralContribution } from './ReferralContribution';
import { SeasonPulse } from './SeasonPulse';
import type { AnalyticsData } from '../types';
import { mockAnalyticsData, mockBalances } from '../mockData';
import { BarChart, ArrowRight, Users, Sparkles } from 'lucide-react';
import { getDataSource } from '@/mocks/dto';

interface AnalyticsViewProps {
  initialData?: AnalyticsData;
}

export function AnalyticsView({ initialData = mockAnalyticsData }: AnalyticsViewProps) {
  const dataSource = getDataSource();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | 'season'>('30d');

  const chartData =
    selectedPeriod === '7d'
      ? initialData.points_chart.data.slice(-7)
      : selectedPeriod === '30d'
        ? initialData.points_chart.data.slice(-30)
        : initialData.points_chart.data;

  const totalEarned = Object.values(initialData.sources).reduce((sum, s) => sum + s.points, 0);
  // Пока нет отдельного API/контрактов для "потрачено" и "средняя транзакция" → держим компактный mock.
  const totalSpent = 200;
  const avgTx = 187;

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined} />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Статистика</h1>
          <p className="text-slate-600 mt-1">Аналитика активности и рекомендации для роста</p>
        </div>

        {/* Summary / Rating */}
        <Card className="p-6 mb-6 bg-sky-50 border border-sky-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <BarChart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-sky-900">Твой рейтинг в экосистеме</h2>
                <p className="text-sm text-sky-900/80">
                  Оцениваем доход, активность и социальную сеть
                </p>
              </div>
            </div>
            <Chip size="sm" selected>
              в топ‑10% активных
            </Chip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Card className="p-4">
              <p className="text-xs text-slate-600">Доходы</p>
              <p className="text-lg font-bold text-slate-900 mt-1">ниже среднего</p>
              <p className="text-xs text-slate-500 mt-1">Средний: 12 500</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-600">Активность</p>
              <p className="text-lg font-bold text-slate-900 mt-1">выше среднего</p>
              <p className="text-xs text-slate-500 mt-1">Средний: 15 транзакций</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-600">Реферальная сеть</p>
              <p className="text-lg font-bold text-slate-900 mt-1">на уровне среднего</p>
              <p className="text-xs text-slate-500 mt-1">Средний: 3 реферала</p>
            </Card>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 mb-6 bg-amber-50 border border-amber-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900">Что делать дальше</h2>
                <p className="text-sm text-amber-900/80">Персональный план роста на ближайшую неделю</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="p-4">
              <p className="font-semibold text-slate-900">Увеличь доходы</p>
              <p className="text-sm text-slate-600 mt-1">Выполни больше миссий, особенно сезонные и ежедневные</p>
              <Button variant="primary" className="mt-3" onClick={() => (window.location.href = '/connect/missions')}>
                Открыть миссии <ArrowRight size={16} className="ml-1" />
              </Button>
            </Card>
            <Card className="p-4">
              <p className="font-semibold text-slate-900">Прокачай сеть</p>
              <p className="text-sm text-slate-600 mt-1">Пригласи друзей — рефералы ускоряют рост и дают бонусы</p>
              <Button variant="primary" className="mt-3" onClick={() => (window.location.href = '/connect/referrals')}>
                К рефералам <ArrowRight size={16} className="ml-1" />
              </Button>
            </Card>
          </div>
        </Card>

        {/* Фильтр периода */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['7d', '30d', 'season'] as const).map((period) => (
              <Chip
                key={period}
                size="sm"
                selected={selectedPeriod === period}
                onClick={() => setSelectedPeriod(period)}
              >
                {period === '7d'
                  ? '7 дней'
                  : period === '30d'
                    ? '30 дней'
                    : 'Сезон'}
              </Chip>
            ))}
          </div>
        </div>

        {/* Баланс и доходы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Баланс и доходы</h3>
            <p className="text-sm text-slate-600 mb-4">Текущий баланс и динамика начислений</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                  <span>Текущий баланс Points</span>
                  <span className="font-semibold text-emerald-700">{mockBalances.points.toLocaleString('ru-RU')}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                  <span>Текущий баланс G2A</span>
                  <span className="font-semibold text-sky-700">{mockBalances.g2a.toLocaleString('ru-RU')}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Всего заработано</p>
                  <p className="text-lg font-bold text-slate-900">{totalEarned.toLocaleString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Всего потрачено</p>
                  <p className="text-lg font-bold text-rose-600">-{totalSpent.toLocaleString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Средняя транзакция</p>
                  <p className="text-lg font-bold text-slate-900">{avgTx.toLocaleString('ru-RU')} Points</p>
                </div>
              </div>
            </div>
          </Card>

          <SourcesList sources={initialData.sources} />
        </div>

        {/* Три карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReferralContribution
            points={initialData.referral_contribution.points}
            g2a={initialData.referral_contribution.g2a}
            percentage={initialData.referral_contribution.percentage_of_total}
          />
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Активность</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">Уровень {mockBalances.nft_count + 2}</p>
                <p className="text-xs text-slate-500 mt-1">Опыт (XP): {initialData.points_chart.data.slice(-1)[0]?.points ?? 0}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Users size={18} />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-600">За последний месяц</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
            <p className="text-xs text-slate-500 mt-1">Транзакций</p>
          </Card>
        </div>

        {/* Пульс сезона */}
        {initialData.season_pulse && (
          <div>
            <SeasonPulse
              position={initialData.season_pulse.position}
              pointsInSeason={initialData.season_pulse.points_in_season}
              trend={initialData.season_pulse.trend}
              forecastToGoal={initialData.season_pulse.forecast_to_goal}
            />
          </div>
        )}
      </div>
    </div>
  );
}

