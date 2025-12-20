'use client';

import { getDataSource } from '@/mocks/dto';
import { ReferralsView } from '@/components/connect/Referrals';
import { ReferralsMockView } from '@/components/connect/Referrals/ReferralsMockView';

export function ReferralsPageClientWrapper() {
  const dataSource = getDataSource();
  const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!isClerkConfigured || dataSource === 'mock') {
    return <ReferralsMockView />;
  }

  return <ReferralsView />;
}

