import type { Metadata } from 'next';
import { ReferralsPageClientWrapper } from './ReferralsPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Referral Projection | Connect Asia | Go2Asia',
  description: 'Read-only projection приглашений и связанных Points; не commission statement или receipt',
};

export default function ReferralsPage() {
  return <ReferralsPageClientWrapper />;
}
