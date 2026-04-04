'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@go2asia/ui';
import { ArrowLeft, Building2 } from 'lucide-react';
import { MerchantNav } from './MerchantNav';
import { rfMicrocopy } from '@/lib/rfFirstSliceContent';
import { RFHero, RFMainNav } from '../Shared';

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export function MerchantLayout({ children }: MerchantLayoutProps) {
  const pathname = usePathname();
  const isVouchers = pathname?.startsWith('/rf/merchant/vouchers');

  return (
    <div className="min-h-screen bg-slate-100">
      <RFHero
        compact
        subtitle="Это публичная навигация RF. Ниже — отдельное рабочее пространство партнёра (не витрина)."
      />

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>

      <div className="border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
          <Building2 className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
          <p className="text-sm font-semibold tracking-tight">RF · Рабочий кабинет партнёра</p>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
            beta
          </span>
          <span className="text-xs text-slate-400">Операции и статусы, не пользовательский discovery.</span>
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
              <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
                <h2 className="mb-1 text-sm font-semibold text-slate-900">Разделы кабинета</h2>
                <p className="mb-4 text-[11px] leading-snug text-slate-500">
                  Сводка и секции на одной странице; ваучеры — отдельный экран.
                </p>
                <MerchantNav />
              </div>
            </div>
          </aside>

          <div className="lg:hidden">
            <div className="mb-6 rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-900">Разделы кабинета</div>
              <MerchantNav variant="horizontal" />
            </div>
          </div>

          <main className="min-w-0">
            {isVouchers ? null : (
              <p className="mb-6 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                Данные подгружаются с RF API под вашим аккаунтом Clerk. Редактирование с этих экранов в Phase 3 не
                сохраняется, кроме существующей формы создания партнёра.
              </p>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

