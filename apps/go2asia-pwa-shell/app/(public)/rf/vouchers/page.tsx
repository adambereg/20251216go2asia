import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import {
  getOfferBadge,
  getOfferGuardText,
  getOfferSummaryLine,
  getVisibilityBadge,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Предложения | Russian Friendly | Go2Asia',
  description: 'Публичные предложения партнёров Russian Friendly Asia',
  openGraph: {
    title: 'Предложения | Russian Friendly',
    description: 'Публичные предложения партнёров Russian Friendly Asia',
    type: 'website',
  },
};

interface VouchersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function VouchersPage({ searchParams }: VouchersPageProps) {
  const { q = '' } = await searchParams;
  const [offersResponse, partnersResponse] = await Promise.all([fetchRfOffers(), fetchRfPartners()]);
  const offers = offersResponse?.items ?? [];
  const query = q.trim().toLowerCase();
  const filteredOffers = query
    ? offers.filter((offer) => offer.title.toLowerCase().includes(query))
    : offers;
  const partnerById = new Map((partnersResponse?.items ?? []).map((partner) => [partner.id, partner]));

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Загружаем актуальные предложения…" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Публичные предложения RF</h1>
        <p className="text-sm text-slate-600 mt-2">
          Выберите подходящий оффер, проверьте условия доступа и перейдите в карточку партнёра для деталей.
        </p>
        <form method="get" className="mt-4 max-w-lg">
          <label className="mb-1 block text-xs text-slate-600" htmlFor="rf-offers-q">
            Поиск по названию
          </label>
          <div className="flex gap-2">
            <input
              id="rf-offers-q"
              name="q"
              defaultValue={q}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              placeholder="Например: скидка, семейный, wellness"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Найти
            </button>
          </div>
        </form>

        {offersResponse === null ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 mt-6">
            {rfMicrocopy.temporaryUnavailable}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 mt-6">
            {rfMicrocopy.emptyOffersCatalog}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 mt-6">{rfMicrocopy.noResults}</div>
        ) : (
          <ul className="mt-6 space-y-3">
            {filteredOffers.map((offer) => {
              const partner = partnerById.get(offer.partnerId);
              const offerBadge = getOfferBadge(offer);
              const visibilityBadge = getVisibilityBadge(offer.visibility);
              return (
                <li key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <p className="text-base font-semibold text-slate-900">{offer.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${offerBadge.tone}`}>
                        {offerBadge.label}
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${visibilityBadge.tone}`}>
                        {visibilityBadge.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Партнёр:{' '}
                    {partner ? (
                      <Link href={`/rf/${encodeURIComponent(partner.id)}`} className="text-blue-700 hover:text-blue-800">
                        {partner.displayName}
                      </Link>
                    ) : (
                      <span className="font-mono">{offer.partnerId}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{getOfferSummaryLine(offer)}</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    {getOfferGuardText(offer)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Статус и доступ</h2>
          <p className="mt-2 text-sm text-slate-600">
            {rfMicrocopy.claimTemporary} {rfMicrocopy.replayInfo}
          </p>
        </section>
      </main>
    </div>
  );
}
