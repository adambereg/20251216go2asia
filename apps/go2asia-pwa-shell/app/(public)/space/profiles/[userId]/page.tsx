import type { Metadata } from 'next';
import { ProfilePageClient } from './ProfilePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Публичный профиль | Space Asia | Go2Asia',
  description: 'Публичный профиль и authored posts baseline в Space Asia',
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <ProfilePageClient userId={userId} />;
}
