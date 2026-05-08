'use client';

import { Card, CardContent } from '@go2asia/ui';

export function RewardsSummary() {
  return (
    <Card className="border-purple-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900">PRO visibility boundary</h3>
        <p className="mt-2 text-sm text-slate-600">
          Текущий RF PRO контур показывает только read-only связь с партнёрами, офферы и подтверждённые PRO-отметки.
          Финансовые блоки не входят в этот этап.
        </p>
      </CardContent>
    </Card>
  );
}

