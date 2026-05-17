import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Приглашения | Space Asia | Go2Asia',
  description: 'Планируемая read-only сводка приглашений и участия',
};

export default function ReferralsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Приглашения
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка
        приглашений и участия. Это не финансовая или passive-income поверхность.
      </p>
    </main>
  );
}
