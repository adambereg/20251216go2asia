import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartner } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import { getOfferBadge, getPartnerTrust, getVisibilityBadge, rfMicrocopy } from '@/lib/rfFirstSliceContent';

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
    return (
      <div className="min-h-screen bg-slate-50">
        <RFHero subtitle="Открываем карточку партнёра…" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <RFMainNav />
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Партнёр не найден или временно недоступен</h1>
            <p className="mt-2 text-sm text-slate-600">{rfMicrocopy.temporaryUnavailable}</p>
            <div className="mt-4 flex gap-2">
              <Link href="/rf" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Вернуться в RF-хаб
              </Link>
              <Link href="/rf/vouchers" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Открыть предложения
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const offers = (offersResponse?.items ?? []).filter((offer) => offer.partnerId === partner.id);
  const trust = getPartnerTrust(partner);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Открываем карточку партнёра…" />
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
          <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-slate-200">{rfMicrocopy.missingMedia}</p>
            <h1 className="mt-2 text-2xl font-semibold">{partner.displayName}</h1>
            <p className="mt-2 text-sm text-slate-200">
              Партнёрский профиль работает на live RF runtime. Медиа-слой подключается с fallback-поведением.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${trust.tone}`}>{trust.label}</span>
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              runtime status: {partner.status}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {partner.countryId} · {partner.cityId}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{trust.note}</p>

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
              <p className="text-sm text-slate-600">Country / City (runtime)</p>
              <p className="text-sm text-slate-900 mt-1">
                <span className="font-mono">{partner.countryId}</span> /{' '}
                <span className="font-mono">{partner.cityId}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Trust block</p>
              <p className="text-sm mt-1 text-slate-900">{trust.label}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Контакты и ссылки</h2>
            <p className="text-xs text-slate-600">
              Контакты могут различаться по партнёрам. В этом bounded live-срезе показываем базовую карточку и ссылки на
              предложения.
            </p>
            <p className="text-xs text-slate-600 mt-2">atlasPlaceId: {partner.atlasPlaceId ?? 'not linked yet'}</p>
            <p className="text-xs text-slate-600 mt-1">
              hostAtlasPlaceId: {partner.hostAtlasPlaceId ?? 'not linked yet'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Предложения партнёра</h2>
          <p className="text-sm text-slate-600 mt-1">
            Live офферы загружаются из RF runtime и фильтруются по текущему `partnerId`.
          </p>
          {offersResponse === null ? (
            <p className="mt-4 text-sm text-amber-700">{rfMicrocopy.temporaryUnavailable}</p>
          ) : offers.length === 0 ? (
            <p className="text-sm text-slate-600 mt-4">{rfMicrocopy.emptyPartnerOffers}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {offers.map((offer) => (
                <li key={offer.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-900">{offer.title}</p>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getOfferBadge(offer).tone}`}>
                      {getOfferBadge(offer).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    visibility: {offer.visibility} · status: {offer.status} · type: {offer.offerType}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getVisibilityBadge(offer.visibility).tone}`}
                    >
                      {getVisibilityBadge(offer.visibility).label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

