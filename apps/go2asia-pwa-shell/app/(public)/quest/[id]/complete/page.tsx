import { notFound } from 'next/navigation';
import { mockQuests } from '@/components/quest/mockQuests';
import { RewardsView } from './RewardsView';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quest = mockQuests.find((q) => q.id === id);

  if (!quest) {
    return {};
  }

  return {
    title: `Локальная сводка прохождения: ${quest.title} - Quest Asia | Go2Asia`,
    description: `Legacy-страница "${quest.title}" без подтверждения Points, бейджей или наград.`,
  };
}

export default async function QuestCompletePage({ params }: PageProps) {
  const { id } = await params;
  const quest = mockQuests.find((q) => q.id === id);

  if (!quest) {
    notFound();
  }

  return <RewardsView quest={quest} />;
}

