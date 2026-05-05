import type { Metadata } from 'next';
import { MerchantFeaturePlaceholder } from '@/components/rf/Merchant/MerchantFeaturePlaceholder';

export const metadata: Metadata = {
  title: 'Отзывы | Кабинет партнёра | Russian Friendly',
  description: 'Отзывы партнёра будут доступны в следующих версиях',
};

export default function MerchantReviewsPage() {
  return <MerchantFeaturePlaceholder title="Отзывы" />;
}

