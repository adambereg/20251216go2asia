import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRfOffers, fetchRfPartners } from '@go2asia/sdk/rf';
import { RFHero, RFMainNav } from '@/components/rf/Shared';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ваучеры | Russian Friendly | Go2Asia',
  description: 'Специальные предложения и ваучеры от партнёров Russian Friendly в Юго-Восточной Азии',
  openGraph: {
    title: 'Ваучеры | Russian Friendly',
    description: 'Специальные предложения от партнёров Russian Friendly',
    type: 'website',
  },
};

export default async function VouchersPage() {
  const [offersResponse, partnersResponse] = await Promise.all([fetchRfOffers(), fetchRfPartners()]);
  const offers = offersResponse?.items ?? [];
  const partnerById = new Map((partnersResponse?.items ?? []).map((partner) => [partner.id, partner]));

  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero subtitle="Public RF offers and voucher-friendly actions." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <RFMainNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">RF offers (public)</h1>
        <p className="text-sm text-slate-600 mt-2">
          This first pass surfaces live public offers from <code>/v1/rf/offers</code>. Voucher claiming remains an
          authenticated action.
        </p>

        {offersResponse === null ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 mt-6">
            RF offers are temporarily unavailable. Please retry later.
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 mt-6">
            No public offers are currently active.
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {offers.map((offer) => {
              const partner = partnerById.get(offer.partnerId);
              return (
                <li key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-900">{offer.title}</p>
                    <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2 py-1 text-xs font-medium">
                      {offer.offerType}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Partner:{' '}
                    {partner ? (
                      <Link href={`/rf/${encodeURIComponent(partner.id)}`} className="text-blue-700 hover:text-blue-800">
                        {partner.displayName}
                      </Link>
                    ) : (
                      <span className="font-mono">{offer.partnerId}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    visibility: {offer.visibility} · status: {offer.status}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
