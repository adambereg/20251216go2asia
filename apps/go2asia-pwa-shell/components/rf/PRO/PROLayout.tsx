'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@go2asia/ui';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PRONav } from './PRONav';
import { rfMicrocopy } from '@/lib/rfFirstSliceContent';
import { RFHero, RFMainNav } from '../Shared';

interface PROLayoutProps {
  children: React.ReactNode;
}

export function PROLayout({ children }: PROLayoutProps) {
  const pathname = usePathname();
  const isOpsSurface = pathname?.startsWith('/rf/pro/partners') || pathname?.startsWith('/rf/pro/verifications');

  return (
    <div className="min-h-screen bg-slate-100">
      <RFHero
        compact
        subtitle="Публичный RF сверху; ниже — отдельный RF PRO workspace для сопровождения партнёрского контура."
      />

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>

      <div className="border-b border-purple-950 bg-purple-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
          <Sparkles className="h-4 w-4 shrink-0 text-purple-200" aria-hidden />
          <p className="text-sm font-semibold tracking-tight">RF · PRO workspace</p>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
            beta
          </span>
          <span className="text-xs text-purple-200">
            Сопровождение партнёров и видимости в public RF, без mutation-heavy инструментов.
          </span>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/rf">
            <Button variant="secondary" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              {rfMicrocopy.backToHub}
            </Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
                <h2 className="mb-1 text-sm font-semibold text-purple-950">Разделы PRO кабинета</h2>
                <p className="mb-4 text-[11px] leading-snug text-slate-500">
                  Сводка и фокус — на главной. Операционные маршруты помечены как deferred/soon.
                </p>
                <PRONav />
              </div>
            </div>
          </aside>

          <div className="lg:hidden">
            <div className="mb-6 rounded-2xl border border-purple-200 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-purple-950">Разделы PRO кабинета</div>
              <PRONav variant="horizontal" />
            </div>
          </div>

          <main className="min-w-0">
            <p className="mb-6 rounded-lg border border-purple-100 bg-white px-3 py-2 text-xs text-slate-600">
              Stage 5.1 показывает live связи PRO с партнёрами через rf_pro_link. Legacy/demo разделы остаются отдельно
              помеченными и не дают прав владельца партнёра.
            </p>
            {isOpsSurface ? (
              <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Этот раздел находится в карантине до подключения owner-backed runtime source и не является operational proof.
              </p>
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

