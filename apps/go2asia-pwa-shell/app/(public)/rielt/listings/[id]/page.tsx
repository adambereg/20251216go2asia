/**
 * Rielt.Market Asia - Listing Detail Page
 * Детальная страница объявления о жилье (реальный API)
 */

import { notFound } from 'next/navigation';
import { fetchListing } from '@go2asia/sdk/rielt';
import { ListingDetailClient } from './ListingDetailClient';
import { rieltDtoToListing } from '@/components/rielt/adapters/rieltDtoToListing';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchListing(id);

  if (!res?.listing) {
    notFound();
  }

  const listing = rieltDtoToListing(res.listing);
  return <ListingDetailClient listing={listing} />;
}

