import type { Metadata } from 'next';
import { GroupPageClient } from './GroupPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Публичная группа | Space Asia | Go2Asia',
  description: 'Публичная группа и её group feed в Space Asia',
};

export default function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  return <GroupPageClient groupId={params.groupId} />;
}
