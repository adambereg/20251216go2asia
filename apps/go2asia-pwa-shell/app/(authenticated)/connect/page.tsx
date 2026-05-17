import type { Metadata } from 'next';
import { ConnectPageClientWrapper } from './ConnectPageClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Сводка активности | Connect Asia | Go2Asia',
  description: 'Read-only сводка активности, внутренних Points и участия в Go2Asia',
};

export default function ConnectPage() {
  return <ConnectPageClientWrapper />;
}
