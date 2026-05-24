'use client';

/**
 * Quest Asia - Legacy Completion Notice
 * Изолированная legacy-страница. Не читает localStorage и не показывает reward-shaped UI.
 */

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';

interface RewardsViewProps {
  questId: string;
}

export function RewardsView({ questId }: RewardsViewProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-full bg-amber-100 p-3 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Отложенный локальный route</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Статус завершения не является receipt</h1>
              <p className="mt-2 text-slate-600">
                Этот route сохраняет переход после Quest flow, но больше не ищет mock-каталог и не показывает локальные
                Points, бейджи, награды или progression summary.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Локальное завершение не является proof/receipt. Этот экран не подтверждает completion authority,
            начисление Points, выдачу off-chain бейджа, achievement unlock, XP, leaderboard position или backend
            reward grant. Награды и бейджи появляются только после owner-backed backend-подтверждения.
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Где проверять статус</p>
              <p className="mt-1">
                Откройте runtime-страницу Quest для состояния маршрута. Историю внутренних Points смотрите в Connect,
                а off-chain бейджи — в Connect / Levels после backend-подтверждения.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/quest/${questId}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Открыть runtime Quest
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connect/activity"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-500"
            >
              Connect / Activity
            </Link>
            <Link
              href="/connect/levels"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-500"
            >
              Connect / Levels
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Quest_outbox остаётся delivery_intent_only. Points_row и badge_award_fact являются отдельными
              owner-backed фактами, а не результатом этого local-only экрана.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

