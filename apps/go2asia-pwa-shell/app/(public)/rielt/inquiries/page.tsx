import type { Metadata } from 'next';
import { RieltMyInquiriesClient } from './RieltMyInquiriesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Мои запросы по объектам | Rielt.Market | Go2Asia',
  description: 'История inquiry-запросов по объявлениям Rielt. Это не booking confirmation и не receipt surface.',
};

export default function RieltMyInquiriesPage() {
  return <RieltMyInquiriesClient />;
}
