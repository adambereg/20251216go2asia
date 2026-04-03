import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartner } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import {
  getOfferBadge,
  getOfferSummaryLine,
  getPartnerLocation,
  getPartnerPresentation,
  getPartnerTrust,
  getVisibilityBadge,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';

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
    description: `Карточка партнёра ${partner.displayName} в каталоге Russian Friendly Asia.`,
    openGraph: {
      title: partner.displayName,
      description: `Карточка партнёра ${partner.displayName} в каталоге Russian Friendly Asia.`,
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
  const profile = getPartnerPresentation(partner);
  const hasLocationLink = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Открываем карточку партнёра…" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link href="/rf" className="text-sm text-blue-700 hover:text-blue-800">
            ← {rfMicrocopy.backToCatalog}
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-slate-200">{rfMicrocopy.missingMedia}</p>
            <h1 className="mt-2 text-2xl font-semibold">{partner.displayName}</h1>
            <p className="mt-2 text-sm text-slate-200">{profile.tagline}</p>
            <p className="mt-2 text-xs text-slate-300">{getPartnerLocation(partner)}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${trust.tone}`}>{trust.label}</span>
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {profile.categoryLabel}
            </span>
            {hasLocationLink ? (
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                Есть привязка к месту
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-slate-600">{profile.story}</p>
          <p className="mt-2 text-xs text-slate-500">{trust.note}</p>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Контакты и детали</h2>
            <p className="text-sm text-slate-600">
              Контакты и расширенные атрибуты зависят от карточки партнёра. Базовая витрина уже live, дополнительные поля
              уточняются по мере обновлений.
            </p>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-slate-600">
                Показать технические идентификаторы
              </summary>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <p>partnerId: {partner.id}</p>
                <p>slug: {partner.slug}</p>
                <p>atlasPlaceId: {partner.atlasPlaceId ?? 'not linked yet'}</p>
                <p>hostAtlasPlaceId: {partner.hostAtlasPlaceId ?? 'not linked yet'}</p>
              </div>
            </details>
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
                  <p className="text-xs text-slate-600 mt-2">{getOfferSummaryLine(offer)}</p>
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

