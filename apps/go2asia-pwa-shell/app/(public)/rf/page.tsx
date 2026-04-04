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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Каталог мест Russian Friendly | Go2Asia',
  description: 'Каталог заведений и сервисов партнёров Russian Friendly в Юго-Восточной Азии',
  openGraph: {
    title: 'Каталог мест Russian Friendly',
    description: 'Подбор мест с бонусами и предложениями',
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
        subtitle="Заведения и сервисы партнёров в ЮВА — ищите по городу, категории и доступным предложениям."
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
              <h2 className="text-lg font-semibold text-slate-900">Лучшие предложения</h2>
              <p className="mt-1 text-sm text-slate-600">{rfLandingContent.bestOffersLead}</p>
            </div>
            <Link
              href="/rf/vouchers"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Все предложения →
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
                return (
                  <li key={offer.id}>
                    <article className="h-full rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-900">{offer.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge.tone}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{getOfferSummaryLine(offer)}</p>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Как это работает</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {rfLandingContent.howItWorks.map((step) => (
              <article key={step.title} className="rounded-lg border border-slate-200 bg-white p-3">
                <h3 className="text-xs font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Прозрачность модуля</h2>
          <p className="mt-1 text-xs leading-relaxed">
            Каталог и предложения работают на живом RF-контуре. Кабинеты партнёра и PRO — beta и развиваются отдельно.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{rfMicrocopy.betaZonesNote}</p>
        </section>

        <p className="mt-6 text-center text-[11px] text-slate-400">{rfMicrocopy.supportDataNote}</p>
      </main>
    </div>
  );
}
