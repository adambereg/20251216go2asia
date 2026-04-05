import type { Metadata } from 'next';
import { MerchantWorkspace } from '@/components/rf/Merchant/MerchantWorkspace';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кабинет партнёра | Russian Friendly | Go2Asia',
  description: 'Рабочее пространство владельца партнёрского места RF: обзор, профиль, предложения, готовность',
};

export default function MerchantDashboardPage() {
  return <MerchantWorkspace />;
}
