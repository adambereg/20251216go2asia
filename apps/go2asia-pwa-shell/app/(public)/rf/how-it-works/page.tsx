import type { Metadata } from 'next';
import Link from 'next/link';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import { rfHowItWorksPageContent, rfMicrocopy } from '@/lib/rfFirstSliceContent';

export const metadata: Metadata = {
  title: 'Как это работает | Russian Friendly | Go2Asia',
  description: 'Справка по публичному контуру RF Asia',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Справка и onboarding по каталогу партнёров, офферам и личным спискам." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-900">{rfHowItWorksPageContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfHowItWorksPageContent.pageSubtitle}</p>

        <div className="mt-8 space-y-6">
          {rfHowItWorksPageContent.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:border-slate-300 hover:bg-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-900">Прозрачность данных</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{rfMicrocopy.supportDataNote}</p>
          <p className="mt-2 text-xs text-slate-500">{rfMicrocopy.betaZonesNote}</p>
        </section>
      </main>
    </div>
  );
}
