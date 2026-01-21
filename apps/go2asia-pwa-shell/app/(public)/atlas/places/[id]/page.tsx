'use client';

import { useParams } from 'next/navigation';
import { useGetPlaceById, useGetPlaceTabs } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { formatNumber } from '@/modules/atlas/utils/number';
import { PlaceLandingLayoutBusiness, PlaceLandingLayoutShowplace } from '@/modules/atlas/components/PlaceLandingLayouts';

export default function PlaceOverviewPage() {
  const params = useParams();
  const placeId = params?.id as string;

  const { data: placeData, isLoading } = useGetPlaceById(placeId || '');
  const { data: tabsData } = useGetPlaceTabs(placeId || '', { lang: 'ru', tabKey: 'overview' });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="text-center py-12 text-slate-600">
        Данные о месте не найдены.
      </div>
    );
  }

  // Extract markdown from tabs - ONLY source of content sections
  const overviewTab = tabsData?.items?.find((t) => t.tabKey === 'overview');
  const overviewMarkdown = overviewTab?.bodyMarkdown ?? null;

  const detailData = {
    id: placeData.id,
    slug: placeData.slug,
    name: placeData.name,
    kind: (placeData.kind as 'showplace' | 'business') ?? 'showplace',
    description: placeData.description ?? null, // Short teaser only
    heroImage: placeData.heroImage ?? placeData.photos?.[0] ?? null,
    photos: placeData.photos ?? [],
    cityName: placeData.city ?? null,
    countryName: placeData.country ?? null,
    category: placeData.category ?? null,
    tags: placeData.tags ?? [],
    address: placeData.address ?? null,
    priceLevel: placeData.priceLevel ?? null,
    instagram: placeData.instagram ?? null,
    website: placeData.website ?? null,
    phone: placeData.phone ?? null,
    googleMapsUrl: placeData.googleMapsUrl ?? null,
    latitude: formatNumber(placeData.latitude, 4),
    longitude: formatNumber(placeData.longitude, 4),
    overviewMarkdown, // ONLY source for content sections
  };

  return detailData.kind === 'business' ? (
    <PlaceLandingLayoutBusiness data={detailData} />
  ) : (
    <PlaceLandingLayoutShowplace data={detailData} />
  );
}
