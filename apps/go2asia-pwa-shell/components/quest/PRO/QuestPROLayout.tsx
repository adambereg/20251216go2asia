'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { Button } from '@go2asia/ui';
import { QuestPRONav } from './QuestPRONav';

interface QuestPROLayoutProps {
  children: React.ReactNode;
}

export function QuestPROLayout({ children }: QuestPROLayoutProps) {
  const pathname = usePathname();
  const isDetail = pathname?.startsWith('/quest/pro/') ?? false;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-violet-950 bg-violet-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Compass className="h-4 w-4 shrink-0 text-violet-200" aria-hidden />
          <p className="text-sm font-semibold tracking-tight">Quest PRO Console · Quest slice</p>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
            beta
          </span>
          <span className="text-xs text-violet-200">
            Read-first management surface поверх уже закрытого Quest backend seam set.
          </span>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/quest">
            <Button variant="secondary" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Вернуться в Quest Asia
            </Button>
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">UI-1</p>
            <p className="text-xs text-slate-500">My quests + detail + stats, без mutation-heavy flows</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm">
                <h2 className="mb-1 text-sm font-semibold text-violet-950">Разделы Quest PRO</h2>
                <p className="mb-4 text-[11px] leading-snug text-slate-500">
                  Первый bounded slice: management shell, owner-scoped list и detail без полного authoring workspace.
                </p>
                <QuestPRONav />
              </div>
            </div>
          </aside>

          <div className="lg:hidden">
            <div className="mb-6 rounded-2xl border border-violet-200 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-violet-950">Разделы Quest PRO</div>
              <QuestPRONav variant="horizontal" />
            </div>
          </div>

          <main className="min-w-0">
            <p className="mb-6 rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs text-slate-600">
              Quest PRO Console начинается как read-first management surface. Draft editing, review actions и lifecycle
              mutations останутся следующими UI slices.
            </p>
            {isDetail ? (
              <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Этот detail-экран уже показывает точки входа в будущие mutation flows, но сами flows в UI-1 намеренно не
                активированы.
              </p>
            ) : (
              <p className="mb-6 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                Сначала — owner-scoped Quest management view. Whole-console shell, rich builder и analytics intentionally
                deferred.
              </p>
            )}
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Management-first
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Owner-scoped data only
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                No builder in UI-1
              </span>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
