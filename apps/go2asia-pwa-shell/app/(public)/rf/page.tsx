import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

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
  const offersByPartner = new Map<string, number>();

  for (const offer of offers) {
    offersByPartner.set(offer.partnerId, (offersByPartner.get(offer.partnerId) ?? 0) + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Live Russian Friendly partner catalog powered by RF runtime." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Russian Friendly partners</h1>
          <p className="text-sm text-slate-600 mt-2">
            This page is live-wired to <code>/v1/rf/partners</code> and <code>/v1/rf/offers</code>. Atlas
            place links are shown when present.
          </p>
        </div>

        {partnersResponse === null ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            RF partner catalog is temporarily unavailable. Please retry in a moment.
          </div>
        ) : partners.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            No active partners are currently available.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => {
              const offerCount = offersByPartner.get(partner.id) ?? 0;
              const hasAtlasLink = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);
              return (
                <article key={partner.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">{partner.displayName}</h2>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Country: <span className="font-mono">{partner.countryId}</span>
                    <br />
                    City: <span className="font-mono">{partner.cityId}</span>
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p>atlasPlaceId: {partner.atlasPlaceId ?? 'not linked yet'}</p>
                    <p>hostAtlasPlaceId: {partner.hostAtlasPlaceId ?? 'not linked yet'}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Public offers: {offerCount}</span>
                    <span className={hasAtlasLink ? 'text-emerald-700' : 'text-amber-700'}>
                      {hasAtlasLink ? 'Atlas linked' : 'Atlas link pending'}
                    </span>
                  </div>
                  <Link
                    href={`/rf/${encodeURIComponent(partner.id)}`}
                    className="mt-4 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800"
                  >
                    Open partner details
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
