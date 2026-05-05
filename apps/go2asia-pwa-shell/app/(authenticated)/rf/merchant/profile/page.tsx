import type { Metadata } from 'next';
import { MerchantFeaturePlaceholder } from '@/components/rf/Merchant/MerchantFeaturePlaceholder';

export const metadata: Metadata = {
  title: 'Профиль | Кабинет партнёра | Russian Friendly',
  description: 'Редактирование профиля партнёра будет доступно в следующих версиях',
};

export default function MerchantProfilePage() {
  return <MerchantFeaturePlaceholder title="Профиль партнёра" />;
}
