import Link from 'next/link';
import { notFound } from 'next/navigation';
import { QuestRunnerClient } from './QuestRunnerClient';
import type { Metadata } from 'next';
import { quest } from '@go2asia/sdk';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const questResult = await quest.fetchQuestResult(id);
  const questData = questResult.data;

  if (!questData) {
    return {
      title: questResult.error?.status === 404 ? 'Прохождение недоступно | Quest Asia' : 'Quest Asia временно недоступен',
    };
  }

  return {
    title: `Прохождение: ${questData.title} - Quest Asia | Go2Asia`,
    description: `Проходите квест "${questData.title}"`,
  };
}

export default async function QuestRunnerPage({ params }: PageProps) {
  const { id } = await params;
  const questResult = await quest.fetchQuestResult(id);
  const questData = questResult.data;

  if (!questData) {
    if (questResult.error?.status === 404) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Прохождение маршрута временно недоступно</h1>
          <p className="text-slate-600">
            {questResult.error?.message || 'Не удалось подготовить экран прохождения.'}
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

  return <QuestRunnerClient quest={questData} />;
}

