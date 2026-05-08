'use client';

import { Card, CardContent } from '@go2asia/ui';

export function RewardsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">PRO visibility boundary</h1>
        <p className="text-slate-600">
          В текущем RF этапе этот раздел не показывает финансовые данные. Используйте PRO workspace для read-only
          видимости партнёров, офферов и подтверждённых PRO-отметок.
        </p>
      </div>

      <Card className="border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Не финансовый кабинет</h3>
          <p className="mt-2 text-sm text-slate-600">
            Здесь намеренно нет балансов, начислений, выплат или истории операций. Такой функционал находится за пределами
            текущего этапа видимости ordinary RF-ваучеров.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

