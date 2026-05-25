import type { Metadata } from 'next';
import Link from 'next/link';
import { getQuestDraftEditRoute } from '@/lib/routeAliases';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Редактирование квеста (deferred) | Quest Asia | Go2Asia',
  description:
    'Статусный маршрут для перехода к owner-scoped PRO Console. Эта страница не выполняет runtime-редактирование и не является authority surface.',
};

export default async function QuestEditDeferredPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Редактирование квеста (deferred)</h1>
      <p className="text-muted-foreground max-w-2xl">
        Публичный edit-route используется как статусный переход. Редактирование черновика доступно в owner-scoped
        PRO Console и не подтверждает runtime authority на этой странице.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href={getQuestDraftEditRoute(id)} className="font-medium text-blue-700 hover:text-blue-800">
          Открыть Quest PRO Console
        </Link>
        <Link href={`/quest/${id}`} className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться к квесту
        </Link>
        <Link href="/quest" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в каталог Quest
        </Link>
      </div>
    </main>
  );
}
