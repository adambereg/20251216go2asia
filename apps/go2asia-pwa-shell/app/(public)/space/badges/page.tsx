import type { Metadata } from 'next';
import { LEGACY_ROUTE_NOTICES } from '@/lib/routeAliases';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Badges (deferred) | Space Asia | Go2Asia',
  description: 'Deferred off-chain badge projection; NFT ownership and on-chain semantics are inactive',
};

export default function SpaceBadgesPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Бейджи (deferred)</h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка off-chain бейджей и достижений. Эта
        страница не подтверждает NFT ownership, on-chain asset или факт выдачи бейджа.
      </p>
      <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        {LEGACY_ROUTE_NOTICES.spaceNft}
      </p>
    </main>
  );
}
