'use client';

/**
 * Rielt.Market Asia - EditorPicks
 * Секция "Подборки редакции" (реальный API)
 */

import { Users, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useListListings } from '@go2asia/sdk/rielt';
import { ListingCard } from './ListingCard';
import { rieltDtoToListing } from './adapters/rieltDtoToListing';
import { useRieltSeedListings } from './hooks/useRieltSeed';

const EDITOR_PICKS = [
  {
    id: 'families',
    title: 'Для семей',
    description: 'Просторные апартаменты и дома с детскими удобствами',
    icon: Users,
    apiParams: { bedrooms_min: 2, sort: 'newest' as const, page_size: 3 },
    searchParams: { bedrooms: '2' },
  },
  {
    id: 'nomads',
    title: 'Для цифровых кочевников',
    description: 'Жильё с рабочими местами и быстрым интернетом',
    icon: Briefcase,
    apiParams: { sort: 'newest' as const, page_size: 3 },
    searchParams: { sortBy: 'newest' },
  },
  {
    id: 'long-term',
    title: 'Долгосрочная аренда',
    description: 'Выгодные предложения от 1 месяца',
    icon: Calendar,
    apiParams: { listing_type: 'rent_long', sort: 'newest' as const, page_size: 3 },
    searchParams: { rentalType: 'long-term' },
  },
] as const;

function EditorPickRow({
  pick,
}: {
  pick: (typeof EDITOR_PICKS)[number];
}) {
  const Icon = pick.icon;
  const { data, isLoading } = useListListings(pick.apiParams);
  const seed = useRieltSeedListings({
    bedrooms_min: pick.apiParams.bedrooms_min,
    listing_type: pick.apiParams.listing_type,
    sort: pick.apiParams.sort,
    page_size: pick.apiParams.page_size,
  });
  const seedListings = seed.data?.items ?? [];
  const apiListings = (data?.items ?? []).map((dto) => rieltDtoToListing(dto));
  const listings = seedListings.length > 0 ? seedListings : apiListings;
  const loading = isLoading && seed.isLoading;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{pick.title}</h3>
          <p className="text-sm text-slate-600">{pick.description}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {listings.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Для этой подборки пока нет доступных объявлений.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-4">
        <Link
          href={`/rielt/search?${new URLSearchParams(pick.searchParams as Record<string, string>).toString()}`}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 inline-flex"
        >
          Показать все
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function EditorPicks() {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
        Подборки редакции
      </h2>

      <div className="space-y-8">
        {EDITOR_PICKS.map((pick) => (
          <EditorPickRow key={pick.id} pick={pick} />
        ))}
      </div>
    </section>
  );
}

