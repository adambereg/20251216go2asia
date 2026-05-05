'use client';

import { Card, Button } from '@go2asia/ui';
import { ArrowRight, Award, CheckCircle2, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import type { ConnectDashboardResponse } from '@go2asia/sdk/connectDashboard';
import { BalanceCards } from './BalanceCards';
import { ActivityFeed } from './ActivityFeed';
import { VoucherSummaryCard } from './VoucherSummaryCard';
import { RfEconomicMeaningCard } from './RfEconomicMeaningCard';
import { RfVoucherProjectionPanel } from './RfVoucherProjectionPanel';

interface DashboardContentProps {
  dashboard: ConnectDashboardResponse;
}

const nextSteps = [
  {
    title: 'Завершите первый квест',
    description: 'Получите первый бейдж и Points за участие.',
  },
  {
    title: 'Пригласите друга',
    description: 'Поделитесь реферальной ссылкой и отслеживайте статус приглашения.',
  },
  {
    title: 'Посмотрите доступные бейджи',
    description: 'Узнайте, какие достижения уже доступны.',
  },
];

function formatBadgeDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function DashboardContent({ dashboard }: DashboardContentProps) {
  const hasReferrals = dashboard.referrals.totalReferrals > 0;
  const hasBadges = dashboard.badges.totalBadges > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Привет!</h1>
        <p className="text-slate-600 mt-1">Вот ваш текущий прогресс в Go2Asia.</p>
      </div>

      {/* Points */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Ваши Points</h2>
          <Link href="/connect/wallet" className="text-sm text-sky-700 hover:underline underline-offset-2">
            Смотреть историю →
          </Link>
        </div>
        <BalanceCards balance={dashboard.balance} />
      </div>

      <VoucherSummaryCard />
      <RfEconomicMeaningCard />
      <RfVoucherProjectionPanel />

      {/* Referral and badges summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Ваши приглашения</h3>
                <p className="text-sm text-slate-600">
                  {hasReferrals ? 'Реферальная история по текущему аккаунту.' : 'Пригласите друга, чтобы начать реферальную историю.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Приглашено всего</p>
              <p className="text-xl font-bold text-slate-900">{dashboard.referrals.totalReferrals}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Активировались</p>
              <p className="text-xl font-bold text-slate-900">{dashboard.referrals.activatedReferrals}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Ожидают активации</p>
              <p className="text-xl font-bold text-slate-900">{dashboard.referrals.pendingReferrals}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Заработано Points</p>
              <p className="text-xl font-bold text-slate-900">{dashboard.referrals.totalEarnedPoints}</p>
            </div>
          </div>

          <Link href="/connect/referrals">
            <Button variant="secondary" size="sm" className="w-full">
              Перейти к рефералам
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Ваши бейджи</h3>
                <p className="text-sm text-slate-600">Последние достижения</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{dashboard.badges.totalBadges}</div>
          </div>

          {hasBadges ? (
            <div className="space-y-3 mb-5">
              {dashboard.badges.recent.map((badge) => (
                <div key={`${badge.badgeCode}-${badge.awardedAt}`} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                    <p className="text-xs text-slate-500">
                      {badge.category ? `${badge.category} · ` : ''}
                      {formatBadgeDate(badge.awardedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 mb-5">
              Завершите первый квест, чтобы получить первый бейдж.
            </p>
          )}

          <Link href="/connect/levels">
            <Button variant="secondary" size="sm" className="w-full">
              Смотреть бейджи
            </Button>
          </Link>
        </Card>
      </div>

      {/* Static next steps */}
      <Card className="p-6 mb-6 bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-700" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900">Что можно сделать дальше</h3>
            <p className="text-sm text-amber-900/80">Три простых шага на основе доступных разделов.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step) => (
            <Card key={step.title} className="p-4 bg-white/80">
              <p className="font-semibold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-600 mt-1">{step.description}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent transactions */}
      <ActivityFeed transactions={dashboard.recentTransactions} maxItems={8} />
    </div>
  );
}
