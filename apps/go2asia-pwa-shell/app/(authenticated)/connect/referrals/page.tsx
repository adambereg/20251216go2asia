import type { Metadata } from 'next';
import { ReferralsPageClientWrapper } from './ReferralsPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Реферальная программа | Connect Asia | Go2Asia',
  description: 'Приглашайте друзей и партнёров, получайте награды',
};

export default function ReferralsPage() {
  return <ReferralsPageClientWrapper />;
}
