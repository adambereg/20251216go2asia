'use client';

/**
 * Quest Asia - Legacy Completion Notice
 * Изолированная legacy-страница. Не читает localStorage и не показывает reward-shaped UI.
 */

import Link from 'next/link';
import type { Quest } from '@/components/quest/types';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';

interface RewardsViewProps {
  quest: Quest;
}

export function RewardsView({ quest }: RewardsViewProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-full bg-amber-100 p-3 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Legacy local page</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Локальная страница изолирована</h1>
              <p className="mt-2 text-slate-600">
                Эта страница больше не показывает локальные Points, бейджи или future-compatible badge metadata для
                маршрута "{quest.title}".
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Это локальная legacy-страница. Она не подтверждает начисление Points, выдачу бейджа, achievement unlock,
            NFT/on-chain ownership или backend completion proof. Факты Points и бейджей подтверждаются только
            backend-данными.
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Что смотреть вместо этой страницы</p>
              <p className="mt-1">
                Статус маршрута смотрите на runtime-странице Quest. Историю Points смотрите в Connect / Wallet. Бейджи
                смотрите в Connect / Levels.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/quest/${quest.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Открыть Quest
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connect/wallet"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-500"
            >
              Connect / Wallet
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
              Квест может быть завершён в Quest, но подтверждение Points или бейджа живёт отдельно в backend-backed
              Connect surfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

