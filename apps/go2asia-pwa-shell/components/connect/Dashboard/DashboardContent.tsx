"use client";

import { Card, Button } from "@go2asia/ui";
import { ArrowRight, Award, CheckCircle2, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import type { ConnectDashboardResponse } from "@go2asia/sdk/connectDashboard";
import { ConnectActivitySummaryCards } from "./BalanceCards";
import { ActivityFeed } from "./ActivityFeed";
import { ConnectRfSection } from "./ConnectRfSection";
import { CONNECT_OWNER_FACT_POINTER_TEXT, CONNECT_POINTS_EARNED_LABEL } from "../copy";

interface DashboardContentProps {
  dashboard: ConnectDashboardResponse;
}

const nextSteps = [
  {
    title: "Завершите первое задание в Quest Asia",
    description: "Points и бейджи могут отобразиться после обработки backend-событий.",
    href: "/quest",
    cta: "Открыть Quest",
  },
  {
    title: "Пригласите друга",
    description: "Поделитесь реферальной ссылкой и отслеживайте read-only статус приглашения.",
    href: "/connect/referrals",
    cta: "Открыть приглашения",
  },
  {
    title: "Посмотрите badge projection",
    description: "Узнайте, какие off-chain бейджи отображаются как read-only projection.",
    href: "/connect/levels",
    cta: "Открыть бейджи",
  },
  {
    title: "Откройте профиль",
    description: "Профиль помогает управлять аккаунтом и возвращаться в экосистемные маршруты Connect.",
    href: "/profile",
    cta: "Открыть профиль",
  },
  {
    title: "Продолжить social journey",
    description: "Space показывает social visibility и активность как отдельный слой без claim-semantics.",
    href: "/space",
    cta: "Открыть Space",
  },
];

function formatBadgeDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function DashboardContent({ dashboard }: DashboardContentProps) {
  const hasReferrals = dashboard.referrals.totalReferrals > 0;
  const hasBadges = dashboard.badges.totalBadges > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Привет!</h1>
        <p className="text-slate-600 mt-1">
          Read-only dashboard projection; не receipt, не proof и не accounting statement.
        </p>
        <p className="text-xs text-slate-500 mt-2">{CONNECT_OWNER_FACT_POINTER_TEXT}</p>
      </div>

      {/* Points */}
      <div className="mb-6">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Points projection</h2>
        </div>
        <ConnectActivitySummaryCards
          balance={dashboard.balance}
          projectionMetadata={dashboard.projectionMetadata}
        />
      </div>

      <ConnectRfSection />

      {/* Referral and badges summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Приглашения: read-only projection
                </h3>
                <p className="text-sm text-slate-600">
                  {hasReferrals
                    ? "Reference-only сводка приглашений по текущему аккаунту; не commission statement."
                    : "Пригласите друга, чтобы начать read-only историю приглашений."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Приглашено всего</p>
              <p className="text-xl font-bold text-slate-900">
                {dashboard.referrals.totalReferrals}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Активировались</p>
              <p className="text-xl font-bold text-slate-900">
                {dashboard.referrals.activatedReferrals}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Ожидают активации</p>
              <p className="text-xl font-bold text-slate-900">
                {dashboard.referrals.pendingReferrals}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{CONNECT_POINTS_EARNED_LABEL}</p>
              <p className="text-xl font-bold text-slate-900">
                {dashboard.referrals.totalEarnedPoints}
              </p>
            </div>
          </div>

          <Link href="/connect/referrals">
            <Button variant="secondary" size="sm" className="w-full">
              Все приглашения
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
                <h3 className="text-lg font-semibold text-slate-900">
                  Бейджи: read-only projection
                </h3>
                <p className="text-sm text-slate-600">
                  Последние badge projections; без claim о владении активами.
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{dashboard.badges.totalBadges}</div>
          </div>

          {hasBadges ? (
            <div className="space-y-3 mb-5">
              {dashboard.badges.recent.map((badge) => (
                <div
                  key={`${badge.badgeCode}-${badge.awardedAt}`}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                    <p className="text-xs text-slate-500">
                      {badge.category ? `${badge.category} · ` : ""}
                      {formatBadgeDate(badge.awardedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 mb-5">
              Бейджи могут появиться здесь после обработки событий. Этот блок не является
              badge_award_fact.
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
            <p className="text-sm text-amber-900/80">
              Три простых шага на основе доступных разделов.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {nextSteps.map((step) => (
            <Card key={step.title} className="p-4 bg-white/80">
              <p className="font-semibold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-600 mt-1">{step.description}</p>
              <Link href={step.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900">
                {step.cta}
                <ArrowRight size={14} />
              </Link>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent transactions */}
      <ActivityFeed transactions={dashboard.recentTransactions} maxItems={5} />
    </div>
  );
}
