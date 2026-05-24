import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfRieltListingOffers } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import { ListingVoucherOffersClient } from './ListingVoucherOffersClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ваучеры для объекта | Russian Friendly | Go2Asia',
  description: 'RF-офферы и ваучеры, относящиеся к конкретному объекту Rielt',
};

interface ListingVoucherPageProps {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{ partner?: string; return_url?: string }>;
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
      Посмотреть офферы партнёра
    </Link>
  );
}

function getSafeReturnHref(returnUrl: string | undefined, listingId: string) {
  if (returnUrl?.startsWith('/rielt/listings/')) return returnUrl;
  return `/rielt/listings/${encodeURIComponent(listingId)}`;
}

export default async function RfRieltListingVouchersPage({ params, searchParams }: ListingVoucherPageProps) {
  const { listingId } = await params;
  const { partner: queryPartnerId, return_url: returnUrl } = await searchParams;
  const context = await fetchRfRieltListingOffers(listingId);
  const fallbackPartnerId = getFallbackPartnerId(context?.listing.rfPartnerId ?? context?.partner?.id, queryPartnerId);
  const returnHref = getSafeReturnHref(returnUrl, listingId);
  const partnerHref = fallbackPartnerId ? `/rf/vouchers?partner=${encodeURIComponent(fallbackPartnerId)}` : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Офферы, привязанные к выбранному объекту Rielt. Получение RF-ваучера происходит в RF Asia." />
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
              : 'Не удалось загрузить контекст объекта. Можно перейти к офферам партнёра, если он известен.'}
          </p>
          {context?.partner ? (
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium text-slate-800">RF-партнёр: </span>
              {context.partner.displayName}
            </p>
          ) : null}
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm text-emerald-950">
            Эти офферы привязаны к выбранному объекту. Полученный ваучер будет сохранён в RF Asia и появится в разделе
            «Мои ваучеры» с привязкой к объекту. Rielt не подтверждает бронирование, не фиксирует финальную цену и не
            является inventory authority.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={returnHref}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Вернуться к объекту
            </Link>
            <Link
              href="/rielt/inquiries"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              Мои inquiry-запросы
            </Link>
            <PartnerFallback partnerId={fallbackPartnerId} />
          </div>
        </section>

        {!context ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            RF-контекст объекта временно недоступен. Попробуйте открыть страницу позже или перейти к офферам партнёра.
          </section>
        ) : context.offers.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">Для этого объекта пока нет активных RF-предложений</h2>
            <p className="mt-2">
              Можно посмотреть общий каталог офферов партнёра. Он не означает, что все офферы применимы к этому объекту.
            </p>
            <div className="mt-4">
              <PartnerFallback partnerId={fallbackPartnerId} />
            </div>
          </section>
        ) : (
          <ListingVoucherOffersClient
            offers={context.offers}
            listingId={context.listing.id}
            listingTitle={context.listing.title}
            returnHref={returnHref}
            partnerHref={partnerHref}
          />
        )}
      </main>
    </div>
  );
}
