import type { Metadata } from 'next';
import { RieltHomeClient } from './RieltHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rielt.Market Asia - Curated housing discovery | Go2Asia',
  description: 'Trusted curated entrypoint для поиска жилья в Юго-Восточной Азии',
  openGraph: {
    title: 'Rielt.Market Asia - Curated housing discovery',
    description: 'Trusted curated entrypoint для поиска жилья в ЮВА',
    type: 'website',
  },
};

export default function RieltPage() {
  return <RieltHomeClient />;
}
