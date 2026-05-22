import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Бейджи (deferred) | Space Asia | Go2Asia',
  description: 'Deferred read-only поверхность off-chain бейджей; NFT/on-chain не активно',
};

export default function NFTPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Бейджи (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка
        off-chain бейджей и достижений. NFT/on-chain коллекция не является
        текущей функцией Space Asia, а эта страница не подтверждает владение
        токеном или факт выдачи бейджа.
      </p>
    </main>
  );
}
