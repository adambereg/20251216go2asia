import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RfPlacesCatalog } from '@/components/rf/Catalog/RfPlacesCatalog';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import {
  buildPublicActiveOffersByPartner,
  getOfferBadge,
  getOfferSummaryLine,
  rfLandingContent,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';
import { getItemLabelForOffer } from '@/lib/rfMerchantItems';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Каталог партнёров Russian Friendly | Go2Asia',
  description: 'Каталог заведений и сервисов партнёров Russian Friendly в Юго-Восточной Азии',
  openGraph: {
    title: 'Каталог партнёров Russian Friendly',
    description: 'Подбор партнёров с бонусами и офферами',
    type: 'website',
  },
};

export default async function RFPage() {
  const [partnersResponse, offersResponse] = await Promise.all([fetchRfPartners(), fetchRfOffers()]);
  const partners = partnersResponse?.items ?? [];
  const offers = offersResponse?.items ?? [];
  const publicActiveByPartner = buildPublicActiveOffersByPartner(offers);
  const publicActiveOffers = offers.filter((offer) => offer.visibility === 'public' && offer.status === 'active');

  const bestOffers = [...publicActiveOffers]
    .sort((a, b) => {
      const pa = publicActiveByPartner.get(a.partnerId)?.length ?? 0;
      const pb = publicActiveByPartner.get(b.partnerId)?.length ?? 0;
      return pb - pa;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero
        compact
        subtitle="Заведения и сервисы партнёров в ЮВА — ищите по городу, категории и доступным офферам."
      />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <RfPlacesCatalog
          partners={partners}
          offers={offers}
          partnersUnavailable={partnersResponse === null}
          offersUnavailable={offersResponse === null}
        />

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Лучшие офферы</h2>
              <p className="mt-1 text-sm text-slate-600">{rfLandingContent.bestOffersLead}</p>
            </div>
            <Link href="/rf/vouchers" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              Все офферы →
            </Link>
          </div>
          {offersResponse === null ? (
            <p className="text-sm text-amber-700">{rfMicrocopy.temporaryUnavailable}</p>
          ) : bestOffers.length === 0 ? (
            <p className="text-sm text-slate-600">{rfMicrocopy.emptyOffersCatalog}</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {bestOffers.map((offer) => {
                const badge = getOfferBadge(offer);
                const itemLabel = getItemLabelForOffer(offer);
                return (
                  <li key={offer.id}>
                    <article className="h-full rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-900">{offer.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge.tone}`}>
                          {badge.label}
                        </span>
                      </div>
                      {itemLabel ? (
                        <p className="mt-2 text-xs text-slate-600">
                          <span className="font-medium text-slate-700">Товар или услуга: </span>
                          {itemLabel}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-slate-600">{getOfferSummaryLine(offer)}</p>
                      <Link
                        href={`/rf/vouchers?partner=${encodeURIComponent(offer.partnerId)}`}
                        className="mt-2 inline-block text-xs font-medium text-blue-700 hover:text-blue-800"
                      >
                        Смотреть в каталоге офферов →
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <Link href="/rf/map" className="font-medium text-blue-700 hover:text-blue-800">
            Карта
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
            Все офферы
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/favorites" className="font-medium text-blue-700 hover:text-blue-800">
            Избранное
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/my-vouchers" className="font-medium text-blue-700 hover:text-blue-800">
            Мои ваучеры
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/how-it-works" className="font-medium text-blue-700 hover:text-blue-800">
            Как это работает
          </Link>
        </nav>

        <p className="mt-8 text-center text-[11px] text-slate-400">{rfMicrocopy.supportDataNote}</p>
      </main>
    </div>
  );
}
