import type { Metadata } from 'next';

import GuruClient from './GuruClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Guru Asia - Интерактивный гид | Go2Asia',
  description: 'Интерактивный гид "рядом с тобой" для поиска мест и объектов в Юго-Восточной Азии',
  openGraph: {
    title: 'Guru Asia - Интерактивный гид',
    description: 'Интерактивный гид "рядом с тобой" для поиска мест и объектов',
    type: 'website',
  },
};

export default function GuruPage() {
  return <GuruClient />;
}
