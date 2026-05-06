import type { Metadata } from 'next';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RfSpatialDiscovery } from '@/components/rf/Map/RfSpatialDiscovery';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Карта | Russian Friendly | Go2Asia',
  description: 'Географический обзор партнёров и офферов Russian Friendly Asia',
};

interface MapPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function RfMapPage({ searchParams }: MapPageProps) {
  const { city } = await searchParams;
  const [partnersResponse, offersResponse] = await Promise.all([fetchRfPartners(), fetchRfOffers()]);
  const partners = partnersResponse?.items ?? [];
  const offers = offersResponse?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Ориентир по городам и зонам; связь с каталогом партнёров и офферов." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {partnersResponse === null || offersResponse === null ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Данные временно недоступны. Попробуйте позже.
          </div>
        ) : (
          <RfSpatialDiscovery partners={partners} offers={offers} initialCityId={city} />
        )}
      </main>
    </div>
  );
}
