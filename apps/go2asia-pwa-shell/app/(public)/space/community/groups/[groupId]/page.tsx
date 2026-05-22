import type { Metadata } from 'next';
import { GroupPageClient } from './GroupPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Публичная группа | Space Asia | Go2Asia',
  description: 'Публичная группа и её group feed в Space Asia',
};

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupPageClient groupId={groupId} />;
}
