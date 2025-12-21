'use client';

import { Card, Button } from '@go2asia/ui';
import { ArrowRight, Sparkles, Flame, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import type { DashboardData, Mission, NextAction, Transaction } from '../types';
import { BalanceCards } from './BalanceCards';
import { ProgressPanel } from './ProgressPanel';
import { ActivityFeed } from './ActivityFeed';

interface DashboardContentProps {
  greetingName: string;
  data: DashboardData;
  missionsOfDay: Mission[];
  todayActions: NextAction[];
  transactions: Transaction[];
  onViewHistory: () => void;
  onTopUp: () => void;
  onWithdraw: () => void;
  onViewNFT: () => void;
  badgeText?: string;
}

export function DashboardContent({
  greetingName,
  data,
  missionsOfDay,
  todayActions,
  transactions,
  onViewHistory,
  onTopUp,
  onWithdraw,
  onViewNFT,
}: DashboardContentProps) {
  const quickActions = todayActions.slice(0, 3);
  const dayMissions = missionsOfDay.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Привет, {greetingName}!</h1>
        <p className="text-slate-600 mt-1">Твой центр мотивации и достижений</p>
      </div>

      {/* Assets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Твой прогресс сегодня</h2>
          <Link href="/connect/wallet" className="text-sm text-sky-700 hover:underline underline-offset-2">
            Кошелёк →
          </Link>
        </div>
        <BalanceCards
          balances={data.balances}
          onViewHistory={onViewHistory}
          onTopUp={onTopUp}
          onWithdraw={onWithdraw}
          onViewNFT={onViewNFT}
        />
      </div>

      {/* Level + XP */}
      <ProgressPanel level={data.level} season={data.season} />

      {/* Seasonal block */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              <p className="font-semibold">Активный сезон</p>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {data.season.name} • осталось {data.season.days_left} дней
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
              <div className="text-xs">Множитель</div>
              <div className="text-lg font-bold">{data.level.multiplier.toFixed(1)}×</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <div className="text-xs">Очков в сезоне</div>
              <div className="text-lg font-bold">{data.season.points_in_season?.toLocaleString('ru-RU') ?? '—'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* What to do today */}
      <Card className="p-6 mb-6 bg-amber-50 border border-amber-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900">Что делать сегодня</h3>
              <p className="text-sm text-amber-900/80">2–3 быстрых шага для роста</p>
            </div>
          </div>
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-1 rounded-md">
            + бонус к прогрессу
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{a.description}</p>
                </div>
                <div className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md whitespace-nowrap">
                  +{a.reward.points ?? 0} Points
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                onClick={() => (window.location.href = a.deeplink)}
              >
                Сделать сейчас <ArrowRight size={16} className="ml-1" />
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Missions of day */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">Миссии дня</h3>
          </div>
          <Link href="/connect/missions" className="text-sm text-sky-700 hover:underline underline-offset-2">
            Все миссии →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dayMissions.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{m.title}</p>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{m.description}</p>
                </div>
                <div className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md whitespace-nowrap">
                  +{m.reward.points ?? 0} Points
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="mt-3 w-full"
                onClick={() => (window.location.href = m.deeplink)}
              >
                Начать <ArrowRight size={16} className="ml-1" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <ActivityFeed transactions={transactions} maxItems={8} />
    </div>
  );
}


