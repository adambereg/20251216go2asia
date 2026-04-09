import type { Metadata } from 'next';
import Link from 'next/link';
import { QuestDetailClient } from './QuestDetailClient';
import { quest } from '@go2asia/sdk';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const questResult = await quest.fetchQuestResult(id);
  const questData = questResult.data;

  if (!questData) {
    return {
      title: questResult.error?.status === 404 ? 'Маршрут недоступен | Quest Asia' : 'Quest Asia временно недоступен',
    };
  }

  return {
    title: `${questData.title} | Quest Asia`,
    description: questData.description || 'Quest detail',
    openGraph: {
      title: questData.title,
      description: questData.description || 'Quest detail',
      type: 'website',
    },
  };
}

export default async function QuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const questResult = await quest.fetchQuestResult(id);
  const questData = questResult.data;

  if (!questData) {
    const isNotFound = questResult.error?.status === 404;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {isNotFound ? 'Маршрут не найден или недоступен' : 'Страница маршрута временно недоступна'}
          </h1>
          <p className="text-slate-600">
            {isNotFound
              ? `Маршрут "${id}" не опубликован или больше недоступен.`
              : questResult.error?.message || 'Не удалось загрузить описание маршрута.'}
          </p>
          <div className="mt-6">
            <Link
              href="/quest"
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <QuestDetailClient quest={questData} />;
}

