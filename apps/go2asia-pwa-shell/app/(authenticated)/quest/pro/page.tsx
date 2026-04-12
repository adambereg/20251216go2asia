import type { Metadata } from 'next';
import { QuestProWorkspace } from '@/components/quest/PRO';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quest PRO Console | My quests | Go2Asia',
  description: 'Read-first management surface для owner-scoped Quest management в PRO Console.',
};

export default function QuestPROPage() {
  return <QuestProWorkspace />;
}
