import type { Metadata } from 'next';
import { LEGACY_ROUTE_NOTICES } from '@/lib/routeAliases';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Legacy Activity Summary Alias | Space Asia | Go2Asia',
  description: 'Legacy route for deferred Space activity summary; not accounting balance, receipt or financial wallet',
};

export default function BalancePage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Активность (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка
        активности Space Asia. Финансовые операции и token-wallet функции не
        входят в текущий Space UI; эта поверхность не является proof, receipt
        или финансовым wallet.
      </p>
      <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        {LEGACY_ROUTE_NOTICES.spaceBalance}
      </p>
    </main>
  );
}
