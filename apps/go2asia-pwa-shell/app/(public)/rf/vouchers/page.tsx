import type { Metadata } from 'next';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RfOffersCatalog } from '@/components/rf/Offers/RfOffersCatalog';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Предложения | Russian Friendly | Go2Asia',
  description: 'Каталог публичных предложений партнёров Russian Friendly Asia',
  openGraph: {
    title: 'Предложения | Russian Friendly',
    description: 'Каталог выгод, скидок и бонусов',
    type: 'website',
  },
};

interface VouchersPageProps {
  searchParams: Promise<{ q?: string; partner?: string }>;
}

export default async function VouchersPage({ searchParams }: VouchersPageProps) {
  const { q = '', partner = '' } = await searchParams;
  const [offersResponse, partnersResponse] = await Promise.all([fetchRfOffers(), fetchRfPartners()]);
  const offers = offersResponse?.items ?? [];
  const partners = partnersResponse?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Полноценный каталог выгод с привязкой к местам и фильтрами." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <RfOffersCatalog
          partners={partners}
          offers={offers}
          partnersUnavailable={partnersResponse === null}
          offersUnavailable={offersResponse === null}
          initialQuery={q}
          initialPartnerId={partner || undefined}
        />
      </main>
    </div>
  );
}
