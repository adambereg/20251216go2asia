'use client';

/**
 * Rielt.Market Asia - NewListings
 * Секция "Новое на этой неделе" (реальный API)
 */

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useListListings } from '@go2asia/sdk/rielt';
import { ListingCard } from './ListingCard';
import { rieltDtoToListing } from './adapters/rieltDtoToListing';
import { useRieltSeedListings } from './hooks/useRieltSeed';

export function NewListings() {
  const { data, isLoading } = useListListings({
    sort: 'newest',
    page_size: 6,
  });
  const seed = useRieltSeedListings({
    sort: 'newest',
    page_size: 6,
  });
  const seedListings = seed.data?.items ?? [];
  const apiListings = (data?.items ?? []).map((dto) => rieltDtoToListing(dto));
  const newListings = seedListings.length > 0 ? seedListings : apiListings;
  const loading = isLoading && seed.isLoading;

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Новое на этой неделе
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (newListings.length === 0) {
    return (
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Новое на этой неделе
        </h2>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Публичная витрина пока не получила новые объявления.
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
        Новое на этой неделе
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div className="mt-4">
        <Link
          href="/rielt/search?sortBy=newest"
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 inline-flex"
        >
          Показать все
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

