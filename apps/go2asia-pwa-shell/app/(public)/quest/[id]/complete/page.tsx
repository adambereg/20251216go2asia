import type { Metadata } from 'next';
import { RewardsView } from './RewardsView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Завершение задания (deferred) ${id} | Quest Asia | Go2Asia`,
    description: 'Local-only Quest completion acknowledgement without reward, Points or badge grant authority.',
  };
}

export default async function QuestCompletePage({ params }: PageProps) {
  const { id } = await params;

  return <RewardsView questId={id} />;
}

