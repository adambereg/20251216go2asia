import type { Metadata } from 'next';
import { ProfilePageClient } from './ProfilePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Публичный профиль | Space Asia | Go2Asia',
  description: 'Публичный профиль и authored posts baseline в Space Asia',
};

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return <ProfilePageClient userId={params.userId} />;
}
