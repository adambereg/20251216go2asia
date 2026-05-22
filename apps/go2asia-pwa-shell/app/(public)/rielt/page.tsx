import type { Metadata } from 'next';
import { RieltHomeClient } from './RieltHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rielt.Market Asia - Inquiry-only previews | Go2Asia',
  description: 'Source-labeled listing previews для запроса по жилью; не booking или payment platform',
  openGraph: {
    title: 'Rielt.Market Asia - Inquiry-only previews',
    description: 'Source-labeled listing previews для запроса по жилью; не booking или payment platform',
    type: 'website',
  },
};

export default function RieltPage() {
  return <RieltHomeClient />;
}
