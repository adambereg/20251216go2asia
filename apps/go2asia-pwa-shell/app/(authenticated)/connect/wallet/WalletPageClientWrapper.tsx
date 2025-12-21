'use client';

import { getDataSource } from '@/mocks/dto';
import { WalletView } from '@/components/connect/Wallet/WalletView';
import { WalletMockView } from '@/components/connect/Wallet/WalletMockView';

export function WalletPageClientWrapper() {
  const dataSource = getDataSource();
  const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!isClerkConfigured || dataSource === 'mock') {
    return <WalletMockView />;
  }

  return <WalletView />;
}


