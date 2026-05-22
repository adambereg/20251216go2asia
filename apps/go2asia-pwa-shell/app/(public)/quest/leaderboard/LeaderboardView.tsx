'use client';

/**
 * Quest Asia - Leaderboard View
 * Deferred leaderboard surface.
 * Stage 12 keeps leaderboard/XP/social score out of Path A MVP.
 */

import { Card } from '@go2asia/ui';
import { Trophy } from 'lucide-react';

export function LeaderboardView() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Рейтинг Quest Asia планируется
          </h1>
          <p className="text-slate-600">
            Этот раздел отключён для текущего Path A MVP. Stage 12 не показывает leaderboard, XP или social score,
            чтобы не создавать ложную экономическую или соревновательную механику.
          </p>
        </div>

        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Deferred surface</p>
              <p className="text-sm text-slate-600 mt-1">
                Будущий рейтинг может быть рассмотрен только отдельным docs-first stage. Текущие Quest Points остаются
                preview/confirmation copy, а не публичным leaderboard или reward receipt.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
