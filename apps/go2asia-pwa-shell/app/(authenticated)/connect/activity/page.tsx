import type { Metadata } from 'next';
import { WalletView } from '@/components/connect/Wallet/WalletView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Activity Projection | Connect Asia | Go2Asia',
  description: 'Read-only activity and internal Points projection; not a receipt, accounting statement or financial wallet',
};

export default function ConnectActivityPage() {
  return <WalletView />;
}
