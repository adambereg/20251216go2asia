import type { Metadata } from 'next';
import { MerchantWorkspace } from '@/components/rf/Merchant/MerchantWorkspace';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кабинет владельца | Russian Friendly | Go2Asia',
  description: 'Рабочее пространство владельца партнёрского бизнеса RF: обзор, профиль, офферы, готовность',
};

export default function MerchantDashboardPage() {
  return <MerchantWorkspace />;
}
