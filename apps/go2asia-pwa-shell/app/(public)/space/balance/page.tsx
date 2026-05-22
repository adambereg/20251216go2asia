import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Активность (deferred) | Space Asia | Go2Asia',
  description: 'Deferred read-only сводка активности Space Asia без wallet/payment semantics',
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
    </main>
  );
}
