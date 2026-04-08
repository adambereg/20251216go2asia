'use client';

/**
 * Rielt.Market Asia - EditorPicks
 * Секция "Подборки редакции" (реальный API)
 */

import { Users, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useListListings } from '@go2asia/sdk/rielt';
import { ListingCard } from './ListingCard';
import { mergeSeedPresentationOverlay, rieltDtoToListing } from './adapters/rieltDtoToListing';
import { useRieltSeedListings } from './hooks/useRieltSeed';
import type { Listing } from './types';

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
  seedById,
}: {
  pick: (typeof EDITOR_PICKS)[number];
  seedById: Map<string, Listing>;
}) {
  const Icon = pick.icon;
  const { data, isLoading, isError, error } = useListListings(pick.apiParams);
  const listings = (data?.items ?? []).map((dto) => {
    const base = rieltDtoToListing(dto);
    return mergeSeedPresentationOverlay(base, seedById.get(base.id));
  });

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
          Не удалось загрузить подборку: {(error as { message?: string })?.message ?? 'runtime request failed'}.
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
  const [activePickId, setActivePickId] = useState<(typeof EDITOR_PICKS)[number]['id']>('families');
  const seedOverlay = useRieltSeedListings({ page: 1, page_size: 200 }, true);
  const seedById = new Map((seedOverlay.data?.items ?? []).map((item) => [item.id, item]));
  const activePick = EDITOR_PICKS.find((pick) => pick.id === activePickId) ?? EDITOR_PICKS[0];

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
        Curated подборки
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Короткие сценарии вместо длинной ленты: выберите один режим и перейдите к детальному каталогу.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {EDITOR_PICKS.map((pick) => (
          <button
            key={pick.id}
            type="button"
            onClick={() => setActivePickId(pick.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              pick.id === activePickId
                ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
            }`}
          >
            {pick.title}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <EditorPickRow pick={activePick} seedById={seedById} />
      </div>
    </section>
  );
}

