import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartner } from '@go2asia/sdk/rf';
import { AddToMyVouchersButton } from '@/components/rf/Shared/AddToMyVouchersButton';
import { FavoriteOfferButton } from '@/components/rf/Shared/FavoriteOfferButton';
import { FavoritePlaceButton } from '@/components/rf/Shared/FavoritePlaceButton';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import {
  getOfferBadge,
  getOfferSummaryLine,
  getPartnerLocation,
  getPartnerPresentation,
  getPartnerTrust,
  getRfCityLabel,
  getVisibilityBadge,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';
import { getItemLabelForOffer } from '@/lib/rfMerchantItems';

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
        <RFHero compact subtitle="Карточка места в каталоге Russian Friendly." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <RFMainNav />
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Партнёр не найден или временно недоступен</h1>
            <p className="mt-2 text-sm text-slate-600">{rfMicrocopy.temporaryUnavailable}</p>
            <div className="mt-4 flex gap-2">
              <Link href="/rf" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                {rfMicrocopy.backToHub}
              </Link>
              <Link href="/rf/vouchers" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Открыть офферы
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const offers = (offersResponse?.items ?? []).filter((offer) => offer.partnerId === partner.id);
  const itemLinkedOffers = [...new Map(offers.filter((offer) => offer.itemId).map((offer) => [offer.itemId, offer])).values()];
  const trust = getPartnerTrust(partner);
  const profile = getPartnerPresentation(partner);
  const hasLocationLink = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Карточка места в каталоге Russian Friendly." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link href="/rf" className="text-sm text-blue-700 hover:text-blue-800">
            ← {rfMicrocopy.backToCatalog}
          </Link>
          <FavoritePlaceButton partnerId={partner.id} label={partner.displayName} />
          <Link
            href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Офферы в каталоге
          </Link>
          <Link
            href={`/rf/map?city=${encodeURIComponent(partner.cityId)}`}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            На карте · {getRfCityLabel(partner.cityId)}
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

        {itemLinkedOffers.length > 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Товары и услуги</h2>
            <p className="mt-1 text-sm text-slate-600">
              Позиции каталога, к которым привязаны текущие офферы партнёра.
            </p>
            <ul className="mt-4 space-y-2">
              {itemLinkedOffers.map((offer) => (
                <li key={offer.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Товар или услуга: </span>
                  {getItemLabelForOffer(offer)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Офферы партнёра</h2>
              <p className="text-sm text-slate-600 mt-1">
                Офферы из RF runtime для этого партнёра. Полученные ваучеры фиксируются в RF runtime после claim, а
                локальные сохранения остаются планировочной заметкой браузера.
              </p>
            </div>
            <Link
              href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Открыть в каталоге офферов →
            </Link>
          </div>
          {offersResponse === null ? (
            <p className="mt-4 text-sm text-amber-700">{rfMicrocopy.temporaryUnavailable}</p>
          ) : offers.length === 0 ? (
            <p className="text-sm text-slate-600 mt-4">{rfMicrocopy.emptyPartnerOffers}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {offers.map((offer) => {
                const itemLabel = getItemLabelForOffer(offer);
                return (
                  <li key={offer.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm font-medium text-slate-900">{offer.title}</p>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getOfferBadge(offer).tone}`}>
                        {getOfferBadge(offer).label}
                      </span>
                    </div>
                    {itemLabel ? (
                      <p className="mt-2 text-xs text-slate-600">
                        <span className="font-medium text-slate-700">Товар или услуга: </span>
                        {itemLabel}
                      </p>
                    ) : null}
                    <p className="text-xs text-slate-600 mt-2">{getOfferSummaryLine(offer)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Получение ваучера выполняется в owner-backed RF offer catalog и не является финансовым подтверждением.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getVisibilityBadge(offer.visibility).tone}`}
                      >
                        {getVisibilityBadge(offer.visibility).label}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <FavoriteOfferButton offerId={offer.id} />
                      <AddToMyVouchersButton
                        offerId={offer.id}
                        partnerId={partner.id}
                        title={offer.title}
                        partnerDisplayName={partner.displayName}
                      />
                      <Link
                        href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
                        className="inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Получить ваучер в каталоге
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

