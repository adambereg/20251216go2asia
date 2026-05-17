'use client';

import { Card, Badge, Button } from '@go2asia/ui';
import { UserPlus, TrendingUp, Award, Users } from 'lucide-react';
import { mockDashboardStats } from '../mockData';

export function ReferralsView() {
  const stats = mockDashboardStats;

  // Mock данные для рефералов
  const referralLevel = 3;
  const monthlyRecognized = 1200;

  return (
    <div className="space-y-6">
      {/* Read-only participation summary */}
      <Card className="border-2 border-slate-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Сводка участия
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Статус участия</span>
              <Badge variant="ugc" size="md">
                Участие {referralLevel}
              </Badge>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                style={{ width: '60%' }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Internal Points отображаются как read-only participation summary.
            </div>
          </div>
        </div>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-slate-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-sky-600" />
            <div className="text-sm text-slate-600">Учтено в этом месяце</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {monthlyRecognized.toLocaleString()} Points
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Read-only projection, не гарантия начисления.
          </div>
        </Card>

        <Card className="border-2 border-slate-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div className="text-sm text-slate-600">Участие приглашённых</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">8</div>
          <div className="text-xs text-slate-500 mt-1">
            Read-only сводка без leaderboard-соревнования.
          </div>
        </Card>

        <Card className="border-2 border-slate-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-orange-600" />
            <div className="text-sm text-slate-600">Приглашено друзей</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">8</div>
          <div className="text-xs text-slate-500 mt-1">
            Активных приглашённых
          </div>
        </Card>
      </div>

      {/* Реферальная ссылка */}
      <Card className="border-2 border-slate-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Пригласить друга
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            <code className="flex-1 text-sm text-slate-700">
              https://go2asia.space/ref/abc123xyz
            </code>
            <Button variant="secondary" size="sm">
              Копировать
            </Button>
          </div>
          <div className="text-sm text-slate-600">
          Points за приглашение являются внутренней participation-сводкой и требуют runtime-подтверждения условий.
          </div>
        </div>
      </Card>
    </div>
  );
}
