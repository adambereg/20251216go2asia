import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartner } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

interface PartnerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const { id } = await params;
  const partner = await fetchRfPartner(id);

  if (!partner) {
    return {
      title: 'Партнёр не найден | Russian Friendly',
    };
  }

  return {
    title: `${partner.displayName} | Russian Friendly | Go2Asia`,
    description: `Live RF partner profile for ${partner.displayName}.`,
    openGraph: {
      title: partner.displayName,
      description: `Live RF partner profile for ${partner.displayName}.`,
      type: 'website',
    },
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { id } = await params;
  const [partner, offersResponse] = await Promise.all([fetchRfPartner(id), fetchRfOffers()]);

  if (!partner) {
    notFound();
  }

  const offers = (offersResponse?.items ?? []).filter((offer) => offer.partnerId === partner.id);
  const hasAtlasPlace = Boolean(partner.atlasPlaceId);
  const hasHostPlace = Boolean(partner.hostAtlasPlaceId);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Live partner profile from RF runtime." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link href="/rf" className="text-sm text-blue-700 hover:text-blue-800">
            ← Back to RF catalog
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{partner.displayName}</h1>
            <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-xs font-medium">
              {partner.status}
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Partner ID</p>
              <p className="font-mono text-xs text-slate-800 mt-1">{partner.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Slug</p>
              <p className="font-mono text-xs text-slate-800 mt-1">{partner.slug}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Country / City</p>
              <p className="text-sm text-slate-900 mt-1">
                <span className="font-mono">{partner.countryId}</span> /{' '}
                <span className="font-mono">{partner.cityId}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Atlas linking status</p>
              <p className="text-sm mt-1 text-slate-900">
                {hasAtlasPlace || hasHostPlace ? 'Linked' : 'Pending (nullable by design)'}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Place references</h2>
            <p className="text-xs text-slate-600">atlasPlaceId: {partner.atlasPlaceId ?? 'not linked yet'}</p>
            <p className="text-xs text-slate-600 mt-1">
              hostAtlasPlaceId: {partner.hostAtlasPlaceId ?? 'not linked yet'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Public offers</h2>
          <p className="text-sm text-slate-600 mt-1">
            Offers are loaded from <code>/v1/rf/offers</code> and filtered by current partner id.
          </p>
          {offers.length === 0 ? (
            <p className="text-sm text-slate-600 mt-4">No public active offers at the moment.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {offers.map((offer) => (
                <li key={offer.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-900">{offer.title}</p>
                    <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2 py-1 text-xs font-medium">
                      {offer.offerType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    visibility: {offer.visibility} · status: {offer.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

