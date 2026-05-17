import type { Metadata } from 'next';
import { WalletPageClientWrapper } from './WalletPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Активность Points | Connect Asia | Go2Asia',
  description: 'Read-only история внутренних Points и подтверждённой активности',
};

export default function WalletPage() {
  return <WalletPageClientWrapper />;
}

