import type { Metadata } from 'next';
import { WalletPageClientWrapper } from './WalletPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кошелёк | Connect Asia | Go2Asia',
  description: 'История Points и начислений за вашу активность',
};

export default function WalletPage() {
  return <WalletPageClientWrapper />;
}

