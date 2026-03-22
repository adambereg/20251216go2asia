import type { Metadata } from 'next';
import { RieltHomeClient } from './RieltHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rielt.Market Asia - Недвижимость в ЮВА | Go2Asia',
  description: 'Поиск недвижимости для аренды и покупки в Юго-Восточной Азии',
  openGraph: {
    title: 'Rielt.Market Asia - Недвижимость в ЮВА',
    description: 'Поиск недвижимости для аренды и покупки в ЮВА',
    type: 'website',
  },
};

export default function RieltPage() {
  return <RieltHomeClient />;
}
