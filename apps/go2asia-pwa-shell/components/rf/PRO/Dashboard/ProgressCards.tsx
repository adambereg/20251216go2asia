'use client';

import { Card, CardContent } from '@go2asia/ui';
import { ClipboardCheck, Eye, Store, CheckSquare } from 'lucide-react';
import type { PROCurator } from '../../types';

interface ProgressCardsProps {
  curator: PROCurator;
}

export function ProgressCards({ curator }: ProgressCardsProps) {
  const cards = [
    {
      title: 'Активных партнёров',
      value: curator.stats.totalPartners.toString(),
      change: '+2',
      icon: Store,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Проверок за месяц',
      value: curator.stats.verifiedThisMonth.toString(),
      change: '+1',
      icon: CheckSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Партнёров в видимости',
      value: curator.partners.length.toString(),
      change: 'read-only',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Финансовых блоков',
      value: 'Нет',
      change: 'scope',
      icon: ClipboardCheck,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.bgColor} ${card.color} p-2 rounded-lg`}>
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                  {card.change}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

