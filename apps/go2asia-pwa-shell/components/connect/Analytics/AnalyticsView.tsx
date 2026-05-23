'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { Badge, Button, Card } from '@go2asia/ui';
import { Activity, Award, BarChart, Users } from 'lucide-react';
import Link from 'next/link';
import { CONNECT_FUTURE_BADGE_TEXT } from '../copy';
import { ROUTE_ALIASES } from '@/lib/routeAliases';

const ANALYTICS_FUTURE_TEXT = 'Аналитика активности планируется после появления backend-агрегатов.';

const ctas = [
  {
    label: 'Посмотреть активность',
    href: ROUTE_ALIASES.connectActivity,
    icon: Activity,
  },
  {
    label: 'Перейти к рефералам',
    href: '/connect/referrals',
    icon: Users,
  },
  {
    label: 'Посмотреть бейджи',
    href: '/connect/levels',
    icon: Award,
  },
];

export function AnalyticsView() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle={ANALYTICS_FUTURE_TEXT} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Статистика</h1>
          <p className="text-slate-600 mt-1">{ANALYTICS_FUTURE_TEXT}</p>
        </div>

        <Card className="p-6 mb-6 bg-sky-50 border border-sky-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <BarChart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-sky-900">Аналитика активности планируется</h2>
                <p className="text-sm text-sky-900/80 mt-2">
                  Сейчас Connect показывает только read-only projections: Points, activity rows, рефералы и бейджи.
                  Расширенная статистика появится после отдельного слоя агрегатов.
                </p>
              </div>
            </div>
            <Badge className="bg-sky-100 text-sky-800">{CONNECT_FUTURE_BADGE_TEXT}</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Статистика в разработке</h2>
          <p className="text-sm text-slate-600 mb-5">
            Мы не показываем рейтинги и графики без backend-агрегатов.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ctas.map((cta) => {
              const Icon = cta.icon;
              return (
                <Link key={cta.href} href={cta.href}>
                  <Button variant="secondary" className="w-full justify-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {cta.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

