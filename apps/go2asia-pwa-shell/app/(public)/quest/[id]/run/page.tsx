import { notFound } from 'next/navigation';
import { QuestRunnerClient } from './QuestRunnerClient';
import type { Metadata } from 'next';
import { quest } from '@go2asia/sdk';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const questData = await quest.fetchQuest(id);

  if (!questData) {
    return {};
  }

  return {
    title: `Прохождение: ${questData.title} - Quest Asia | Go2Asia`,
    description: `Проходите квест "${questData.title}"`,
  };
}

export default async function QuestRunnerPage({ params }: PageProps) {
  const { id } = await params;
  const questData = await quest.fetchQuest(id);

  if (!questData) {
    notFound();
  }

  return <QuestRunnerClient quest={questData} />;
}

