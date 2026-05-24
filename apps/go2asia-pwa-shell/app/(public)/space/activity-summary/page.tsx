import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGACY_ROUTE_NOTICES } from '@/lib/routeAliases';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Activity summary (deferred) | Space Asia | Go2Asia',
  description: 'Deferred read-only Space activity summary; не неизменяемый журнал и не источник полномочий',
};

export default function SpaceActivitySummaryPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Activity summary (deferred)</h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка активности Space Asia. Это projection
        surface, не неизменяемый журнал и не источник полномочий.
      </p>
      <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        {LEGACY_ROUTE_NOTICES.spaceBalance}
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/space/activity" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть Space activity
        </Link>
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в Space
        </Link>
      </div>
    </main>
  );
}
