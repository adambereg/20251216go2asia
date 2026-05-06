import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Экономика PRO (позже) | PRO Dashboard | Russian Friendly',
  description: 'Placeholder-раздел будущей экономики PRO без live-операций в текущем RF baseline',
};

export default function PRORewardsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Экономика PRO (позже)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Экономика PRO появится в следующих этапах; текущий RF baseline
        показывает только связи и read-only видимость без live-операций.
      </p>
    </main>
  );
}
