/**
 * Rielt.Market Asia - Listing Detail Page
 * Детальная страница объявления о жилье (реальный API)
 */

import { notFound } from 'next/navigation';
import { fetchListingStrict } from '@go2asia/sdk/rielt';
import { ListingDetailClient } from './ListingDetailClient';
import { mergeSeedPresentationOverlay, rieltDtoToListing } from '@/components/rielt/adapters/rieltDtoToListing';
import { getSeedListingByIdOrSlug } from '@/lib/rieltSeedRepo';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const res = await fetchListingStrict(id);
    const runtimeListing = rieltDtoToListing(res.listing);
    const seedOverlay = getSeedListingByIdOrSlug(res.listing.id) ?? getSeedListingByIdOrSlug(res.listing.slug);
    const listing = mergeSeedPresentationOverlay(runtimeListing, seedOverlay);
    return <ListingDetailClient listing={listing} />;
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (status === 404) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-semibold text-amber-900 mb-2">Деталь объявления временно недоступна</h1>
          <p className="text-amber-800">
            Не удалось загрузить данные по этому объявлению. Попробуйте открыть страницу позже.
          </p>
        </div>
      </div>
    );
  }
}

