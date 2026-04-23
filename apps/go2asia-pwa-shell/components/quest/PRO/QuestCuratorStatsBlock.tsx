'use client';

import { Activity, CheckCircle2, Clock3 } from 'lucide-react';
import { generated } from '@go2asia/sdk';

type QuestCuratorStatsBlockProps = {
  stats: generated.QuestOperationalStatsResponse | null;
  statsError?: string | null;
};

function formatCount(value?: number | null): string {
  if (value == null) return '—';
  return value.toLocaleString('ru-RU');
}

export function QuestCuratorStatsBlock({ stats, statsError }: QuestCuratorStatsBlockProps) {
  const items = [
    {
      key: 'started',
      title: 'Старты',
      value: formatCount(stats?.startedCount),
      helper: 'Сколько запусков квеста уже вышли из состояния not_started по данным API.',
      className: 'border-slate-200 bg-slate-50 text-slate-900',
      icon: <Activity className="h-4 w-4 text-slate-500" />,
    },
    {
      key: 'completed',
      title: 'Завершения',
      value: formatCount(stats?.completedCount),
      helper: 'Сколько прохождений уже дошли до completed в текущем квесте.',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    },
    {
      key: 'pending',
      title: 'На проверке',
      value: formatCount(stats?.pendingReviewCount),
      helper: 'Сколько submission сейчас ждут ручной проверки в очереди ниже.',
      className:
        (stats?.pendingReviewCount ?? 0) > 0
          ? 'border-amber-200 bg-amber-50 text-amber-950'
          : 'border-slate-200 bg-slate-50 text-slate-900',
      icon: <Clock3 className={`h-4 w-4 ${(stats?.pendingReviewCount ?? 0) > 0 ? 'text-amber-600' : 'text-slate-500'}`} />,
    },
  ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-slate-900">Curator stats</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Компактный operational snapshot по конкретному квесту: старты, завершения и текущая ручная review-нагрузка.
      </p>

      {statsError ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {statsError}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.key} className={`rounded-xl border p-4 ${item.className}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide opacity-70">{item.title}</p>
              {item.icon}
            </div>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm opacity-80">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Значение <span className="font-medium text-slate-900">«На проверке»</span> отражает всю ручную review-нагрузку по квесту. В блоке
        `Review queue` ниже total зависит от выбранных фильтров.
      </div>
    </article>
  );
}
