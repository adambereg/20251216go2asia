import type { Metadata } from 'next';
import { QuestProDetailPage } from '@/components/quest/PRO';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quest PRO Console | Quest detail | Go2Asia',
  description: 'Read-first Quest management detail для owner-scoped PRO Console Quest slice.',
};

export default function QuestPRODetailRoute({
  params,
}: {
  params: { id: string };
}) {
  return <QuestProDetailPage questId={params.id} />;
}
