'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight, Compass } from 'lucide-react';
import { Button, Card } from '@go2asia/ui';
import type { ConnectRfProjection } from '@/lib/connectRfProjection';

interface RfEconomicMeaningCardProps {
  projection: ConnectRfProjection;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RfEconomicMeaningCard({ projection, isLoading, isError, onRetry }: RfEconomicMeaningCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Compass className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ваш RF-прогресс</h2>
            <p className="text-sm text-slate-600">Готовим summary: как RF-активность отражается в Connect…</p>
          </div>
        </div>
        <div className="mt-5 h-24 rounded-xl bg-slate-100 animate-pulse" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <h2 className="text-lg font-semibold text-amber-900">Сводка RF-активности временно недоступна</h2>
            <p className="mt-1 text-sm text-amber-900/80">
              Не удалось собрать RF-проекцию для Connect. Сводка и детали могут загрузиться отдельно.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              Повторить загрузку
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border border-emerald-100 bg-emerald-50/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Compass className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Как RF отражается в Connect</h2>
            <p className="mt-1 text-sm font-medium text-slate-900">{projection.narrative.title}</p>
            <p className="mt-1 text-sm text-slate-600">{projection.narrative.summary}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          {[
            { label: 'Открыть мои RF-ваучеры', href: '/rf/my-vouchers' as const },
            { label: 'Найти предложения', href: '/rf/vouchers' as const },
          ].map((cta) => (
            <Link key={`${cta.href}-${cta.label}`} href={cta.href}>
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                {cta.label}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <ul className="space-y-2">
          {projection.narrative.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-xl border border-emerald-100 bg-white/70 p-3 text-xs text-slate-600">
        Этапы: {projection.milestones.filter((item) => item.reached).length} из {projection.milestones.length}
      </div>
    </Card>
  );
}
