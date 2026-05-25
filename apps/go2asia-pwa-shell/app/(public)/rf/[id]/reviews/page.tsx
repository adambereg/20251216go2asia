import type { Metadata } from 'next';
import Link from 'next/link';
import { getRfPartnerVouchersRoute } from '@/lib/routeAliases';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Отзывы партнёра (deferred) | Russian Friendly | Go2Asia',
  description:
    'Статусный маршрут отзывов партнёра. Поверхность остаётся deferred и не является authority или proof-системой.',
};

export default async function PartnerReviewsDeferredPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Отзывы партнёра (deferred)</h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел работает как статусный маршрут. Здесь нет authority-решений или подтверждения качества.
        Для активного сценария используйте карточку партнёра и каталог офферов.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href={`/rf/${id}`} className="font-medium text-blue-700 hover:text-blue-800">
          Открыть карточку партнёра
        </Link>
        <Link href={getRfPartnerVouchersRoute(id)} className="font-medium text-blue-700 hover:text-blue-800">
          Открыть офферы партнёра
        </Link>
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в каталог RF
        </Link>
      </div>
    </main>
  );
}
