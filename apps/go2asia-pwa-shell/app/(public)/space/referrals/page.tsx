import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Приглашения | Space Asia | Go2Asia',
  description: 'Планируемая read-only сводка приглашений и участия',
};

export default function ReferralsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Приглашения (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Позже здесь может появиться read-only сводка
        приглашений и участия. Это не финансовая или passive-income поверхность.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/connect/referrals" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть Connect referrals
        </Link>
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в Space
        </Link>
      </div>
    </main>
  );
}
