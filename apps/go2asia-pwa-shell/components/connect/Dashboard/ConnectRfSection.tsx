'use client';

import { ShieldCheck, Sparkles } from 'lucide-react';
import { RfEconomicMeaningCard } from './RfEconomicMeaningCard';
import { RfVoucherProjectionPanel } from './RfVoucherProjectionPanel';
import { VoucherSummaryCard } from './VoucherSummaryCard';

export function ConnectRfSection() {
  return (
    <section className="mb-6 space-y-4">
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Russian Friendly в Connect</h2>
            <p className="mt-1 text-sm text-slate-700">
              Connect показывает производную read-only проекцию RF-активности как часть профиля и прогресса.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-sky-950 lg:max-w-xl">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p>RF остаётся owner domain: Connect только читает факты по ваучерам, использованию и PRO-отметкам.</p>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p>В этом блоке нет финансовых показателей: только narrative summary, активность и milestones.</p>
            </div>
          </div>
        </div>
      </div>

      <VoucherSummaryCard />
      <RfEconomicMeaningCard />
      <RfVoucherProjectionPanel />
    </section>
  );
}
