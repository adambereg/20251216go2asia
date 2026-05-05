import type { Metadata } from 'next';
import { MerchantFeaturePlaceholder } from '@/components/rf/Merchant/MerchantFeaturePlaceholder';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Статистика | Кабинет партнёра | Russian Friendly',
  description: 'Статистика просмотров, ваучеров и отзывов',
};

export default function MerchantStatsPage() {
  return <MerchantFeaturePlaceholder title="Статистика партнёра" />;
}
