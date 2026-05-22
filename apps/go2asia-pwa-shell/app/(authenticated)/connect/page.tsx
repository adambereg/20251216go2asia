import type { Metadata } from 'next';
import { ConnectPageClientWrapper } from './ConnectPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projection Dashboard | Connect Asia | Go2Asia',
  description: 'Read-only dashboard projection; не receipt, не proof и не accounting statement',
};

export default function ConnectPage() {
  return <ConnectPageClientWrapper />;
}
