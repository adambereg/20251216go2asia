import type { Metadata } from 'next';
import { ConnectPageClientWrapper } from './ConnectPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | Connect Asia | Go2Asia',
  description: 'Центр экономики и геймификации Go2Asia',
};

export default function ConnectPage() {
  return <ConnectPageClientWrapper />;
}
