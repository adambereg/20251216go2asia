import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfRieltListingOffers } from '@go2asia/sdk/rf';
import type { RfRieltListingOfferDto } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ваучеры для объекта | Russian Friendly | Go2Asia',
  description: 'RF-предложения и ваучеры, относящиеся к конкретному объекту Rielt',
};

interface ListingVoucherPageProps {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{ partner?: string }>;
}

function getOfferTypeLabel(type: RfRieltListingOfferDto['type']) {
  return type === 'premium' ? 'Premium voucher' : 'Базовый ваучер';
}

function getFallbackPartnerId(contextPartnerId: string | null | undefined, queryPartnerId: string | undefined) {
  return contextPartnerId || queryPartnerId || null;
}

function PartnerFallback({ partnerId }: { partnerId: string | null }) {
  if (!partnerId) return null;

  return (
    <Link
      href={`/rf/vouchers?partner=${encodeURIComponent(partnerId)}`}
      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
    >
      Посмотреть предложения партнёра
    </Link>
  );
}

function OfferCard({ offer }: { offer: RfRieltListingOfferDto }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">{offer.title}</h2>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            {getOfferTypeLabel(offer.type)}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-800">{offer.benefit}</p>
        {offer.description ? <p className="text-sm text-slate-600">{offer.description}</p> : null}
        {offer.applicabilityNote ? (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{offer.applicabilityNote}</p>
        ) : null}
        <p className="text-xs text-slate-500">
          Получение ваучера будет выполнено в RF. Claim/redeem для этого read-only этапа ещё не подключён.
        </p>
      </div>
      <button
        type="button"
        disabled
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white opacity-60"
      >
        Получить ваучер
      </button>
    </article>
  );
}

export default async function RfRieltListingVouchersPage({ params, searchParams }: ListingVoucherPageProps) {
  const { listingId } = await params;
  const { partner: queryPartnerId } = await searchParams;
  const context = await fetchRfRieltListingOffers(listingId);
  const fallbackPartnerId = getFallbackPartnerId(context?.listing.rfPartnerId ?? context?.partner?.id, queryPartnerId);

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="RF-контекст для объекта Rielt: только релевантные предложения, без claim/redeem на этом этапе." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-12 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Rielt to RF</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Ваучеры для этого объекта</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {context?.listing.title
              ? `Объект: ${context.listing.title}`
              : 'Не удалось загрузить контекст объекта. Можно перейти к предложениям партнёра, если он известен.'}
          </p>
          {context?.partner ? (
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium text-slate-800">RF-партнёр: </span>
              {context.partner.displayName}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/rielt/listings/${encodeURIComponent(listingId)}`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Вернуться к объекту
            </Link>
            <PartnerFallback partnerId={fallbackPartnerId} />
          </div>
        </section>

        {!context ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            RF-контекст объекта временно недоступен. Claim/redeem не выполнялся.
          </section>
        ) : context.offers.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">Для этого объекта пока нет активных RF-ваучеров</h2>
            <p className="mt-2">
              Mapping listing to offers пустой или скрыт. Можно посмотреть общий partner-level каталог как fallback.
            </p>
            <div className="mt-4">
              <PartnerFallback partnerId={fallbackPartnerId} />
            </div>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {context.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
