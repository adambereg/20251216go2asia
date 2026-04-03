import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import {
  getOfferBadge,
  getPartnerHighlights,
  getPartnerPresentation,
  getPartnerTrust,
  getPartnerLocation,
  getOfferSummaryLine,
  rfFeaturedCategories,
  rfLandingContent,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Russian Friendly - Партнёрская программа | Go2Asia',
  description: 'Каталог проверенных Russian Friendly мест и сервисов в Юго-Восточной Азии',
  openGraph: {
    title: 'Russian Friendly - Партнёрская программа',
    description: 'Каталог проверенных Russian Friendly мест и сервисов в ЮВА',
    type: 'website',
  },
};

export default async function RFPage() {
  const [partnersResponse, offersResponse] = await Promise.all([fetchRfPartners(), fetchRfOffers()]);
  const partners = partnersResponse?.items ?? [];
  const offers = offersResponse?.items ?? [];
  const publicActiveOffers = offers.filter((offer) => offer.visibility === 'public' && offer.status === 'active');
  const offersByPartner = new Map<string, number>();

  for (const offer of publicActiveOffers) {
    offersByPartner.set(offer.partnerId, (offersByPartner.get(offer.partnerId) ?? 0) + 1);
  }

  const featuredPartners = [...partners]
    .sort((a, b) => {
      const aScore = (a.atlasPlaceId || a.hostAtlasPlaceId ? 2 : 0) + (offersByPartner.get(a.id) ?? 0);
      const bScore = (b.atlasPlaceId || b.hostAtlasPlaceId ? 2 : 0) + (offersByPartner.get(b.id) ?? 0);
      return bScore - aScore;
    })
    .slice(0, 6);
  const bestOffers = publicActiveOffers.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle={rfLandingContent.subheadline} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">{rfLandingContent.headline}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfLandingContent.subheadline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/rf/vouchers"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {rfLandingContent.ctaPrimary}
            </Link>
            <Link
              href="#partners"
              className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {rfLandingContent.ctaSecondary}
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {rfMicrocopy.supportDataNote}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Популярные категории</h2>
          <p className="mt-1 text-sm text-slate-600">
            Начните с самых востребованных форматов — кофе, рестораны, family places, wellness и coworking.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rfFeaturedCategories.map((category) => (
              <span key={category.key} className={`rounded-full px-3 py-1 text-xs font-medium ${category.color}`}>
                {category.label}
              </span>
            ))}
          </div>
        </section>

        {partnersResponse === null ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            {rfMicrocopy.temporaryUnavailable}
          </div>
        ) : partners.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            {rfMicrocopy.emptyPartnersCatalog}
          </div>
        ) : (
          <section id="partners" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Рекомендованные партнёры</h2>
              <p className="mt-1 text-sm text-slate-600">
                {rfLandingContent.featuredPartnersLead}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredPartners.map((partner, index) => {
                const offerCount = offersByPartner.get(partner.id) ?? 0;
                const trust = getPartnerTrust(partner);
                const highlights = getPartnerHighlights(partner, offerCount);
                const profile = getPartnerPresentation(partner);
                const isFeatured = index < 3;
                return (
                  <article
                    key={partner.id}
                    className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${profile.cardTone} p-5 shadow-sm`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{partner.displayName}</h3>
                        <p className="mt-1 text-xs text-slate-500">{getPartnerLocation(partner)}</p>
                        <p className="mt-2 text-sm text-slate-700">{profile.tagline}</p>
                      </div>
                      {isFeatured ? (
                        <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
                          Рекомендуем
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${trust.tone}`}>{trust.label}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        Публичных офферов: {offerCount}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-1 text-sm text-slate-600">
                      {highlights.map((line) => (
                        <li key={line}>• {line}</li>
                      ))}
                    </ul>

                    <p className="mt-3 text-sm text-slate-600">{profile.story}</p>
                    <p className="mt-2 text-xs text-slate-500">{trust.note}</p>
                    <Link
                      href={`/rf/${encodeURIComponent(partner.id)}`}
                      className="mt-4 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800"
                    >
                      Открыть карточку
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Лучшие предложения</h2>
            <p className="mt-1 text-sm text-slate-600">{rfLandingContent.bestOffersLead}</p>
          </div>
          {offersResponse === null ? (
            <p className="text-sm text-amber-700">{rfMicrocopy.temporaryUnavailable}</p>
          ) : bestOffers.length === 0 ? (
            <p className="text-sm text-slate-600">{rfMicrocopy.emptyOffersCatalog}</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {bestOffers.map((offer) => {
                const badge = getOfferBadge(offer);
                return (
                  <article key={offer.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">{offer.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.tone}`}>{badge.label}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{getOfferSummaryLine(offer)}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Как это работает</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {rfLandingContent.howItWorks.map((step) => (
              <article key={step.title} className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Прозрачность модуля</h2>
          <p className="mt-2 text-sm text-slate-600">
            Публичная витрина уже работает на живом RF-контуре. Расширенные сценарии кабинетов отмечены как beta и
            развиваются отдельно.
          </p>
          <p className="mt-2 text-xs text-slate-500">{rfMicrocopy.betaZonesNote}</p>
        </section>
      </main>
    </div>
  );
}
