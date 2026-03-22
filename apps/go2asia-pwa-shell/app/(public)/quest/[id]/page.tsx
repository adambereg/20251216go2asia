import type { Metadata } from 'next';
import { QuestDetailClient } from './QuestDetailClient';
import { quest } from '@go2asia/sdk';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const questData = await quest.fetchQuest(id);

  if (!questData) {
    return {
      title: 'Квест не найден | Quest Asia',
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
  const questData = await quest.fetchQuest(id);

  if (!questData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Квест не найден</h1>
          <p className="text-slate-600">Квест с ID "{id}" не существует.</p>
        </div>
      </div>
    );
  }

  return <QuestDetailClient quest={questData} />;
}

