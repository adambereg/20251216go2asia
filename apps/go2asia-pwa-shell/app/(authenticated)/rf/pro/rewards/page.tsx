import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Границы операций PRO (soon) | PRO Dashboard | Russian Friendly',
  description: 'Статусный маршрут границ операций PRO без экономического runtime-контура в текущем этапе',
};

export default function PRORewardsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Границы операций PRO (soon)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. В текущем этапе PRO остаётся operational visibility слоем:
        связи, attributed vouchers и continuity-переходы без финансовых полномочий.
      </p>
    </main>
  );
}
