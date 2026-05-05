import type { Metadata } from 'next';
import { MerchantFeaturePlaceholder } from '@/components/rf/Merchant/MerchantFeaturePlaceholder';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Настройки | Кабинет партнёра | Russian Friendly',
  description: 'Настройки кабинета партнёра',
};

export default function MerchantSettingsPage() {
  return <MerchantFeaturePlaceholder title="Настройки" />;
}

