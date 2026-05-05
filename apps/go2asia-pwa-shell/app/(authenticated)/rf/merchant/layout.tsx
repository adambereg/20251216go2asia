import { MerchantLayout } from '@/components/rf/Merchant/MerchantLayout';

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MerchantLayout>{children}</MerchantLayout>;
}

