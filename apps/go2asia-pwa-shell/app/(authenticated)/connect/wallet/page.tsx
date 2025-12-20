import type { Metadata } from 'next';
import { WalletPageClientWrapper } from './WalletPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кошелёк | Connect Asia | Go2Asia',
  description: 'Управляйте балансом Points, G2A токенов и NFT бейджей',
};

export default function WalletPage() {
  return <WalletPageClientWrapper />;
}

