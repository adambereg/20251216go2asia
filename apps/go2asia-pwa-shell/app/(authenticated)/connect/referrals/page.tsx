import type { Metadata } from 'next';
import { ReferralsPageClientWrapper } from './ReferralsPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Рефералы | Connect Asia | Go2Asia',
  description: 'Приглашайте друзей и отслеживайте начисления Points',
};

export default function ReferralsPage() {
  return <ReferralsPageClientWrapper />;
}
