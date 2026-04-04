import type { Metadata } from 'next';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RfFavoritesView } from '@/components/rf/Favorites/RfFavoritesView';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import { rfFavoritesPageContent } from '@/lib/rfFirstSliceContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Избранное | Russian Friendly | Go2Asia',
  description: 'Сохранённые места и предложения RF Asia',
};

export default async function RfFavoritesPage() {
  const [partnersResponse, offersResponse] = await Promise.all([fetchRfPartners(), fetchRfOffers()]);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Сохранённые места и офферы (локально в браузере)." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-900">{rfFavoritesPageContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfFavoritesPageContent.pageSubtitle}</p>
        {partnersResponse === null || offersResponse === null ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Не удалось загрузить каталог для сопоставления избранного.
          </div>
        ) : (
          <div className="mt-8">
            <RfFavoritesView partners={partnersResponse.items} offers={offersResponse.items} />
          </div>
        )}
      </main>
    </div>
  );
}
