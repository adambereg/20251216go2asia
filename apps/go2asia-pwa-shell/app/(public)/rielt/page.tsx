import type { Metadata } from 'next';
import { RieltHomeClient } from './RieltHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rielt.Market Asia - Подбор жилья | Go2Asia',
  description: 'Подбор проверенного жилья в Юго-Восточной Азии',
  openGraph: {
    title: 'Rielt.Market Asia - Подбор жилья',
    description: 'Подбор проверенного жилья в ЮВА',
    type: 'website',
  },
};

export default function RieltPage() {
  return <RieltHomeClient />;
}
