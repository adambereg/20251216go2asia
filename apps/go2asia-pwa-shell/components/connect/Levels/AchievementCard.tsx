'use client';

import { Badge, Card } from '@go2asia/ui';
import { Award, CheckCircle2, Clock } from 'lucide-react';
import type { BadgeAchievement } from '../types';

interface AchievementCardProps {
  badge: BadgeAchievement;
}

function formatAwardedAt(awardedAt: string | null | undefined) {
  if (!awardedAt) return null;
  const date = new Date(awardedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function AchievementCard({ badge }: AchievementCardProps) {
  const awardedAt = formatAwardedAt(badge.awardedAt);

  return (
    <Card className={`p-4 ${badge.isEarned ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg flex-shrink-0 ${
            badge.isEarned ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {badge.isEarned ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Award className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{badge.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{badge.description}</p>
            </div>
            <Badge className={badge.isEarned ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
              {badge.isEarned ? 'Получен' : 'Пока не получен'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-1">Категория: {badge.category}</span>
            {awardedAt ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">
                <Clock className="w-3 h-3" />
                Получен {awardedAt}
              </span>
            ) : null}
          </div>

          {badge.emptyHint && !badge.isEarned ? (
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded mt-3">
              {badge.emptyHint}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

