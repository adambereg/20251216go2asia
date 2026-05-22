import type { Metadata } from 'next';
import { WalletPageClientWrapper } from './WalletPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Points Projection | Connect Asia | Go2Asia',
  description: 'Read-only projection внутренних Points и backend-активности; не receipt и не financial wallet',
};

export default function WalletPage() {
  return <WalletPageClientWrapper />;
}

