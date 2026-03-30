'use client';

import { useParams } from 'next/navigation';
import { useGetPlaceById, useGetPlaceTabs } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { formatNumber } from '@/modules/atlas/utils/number';
import { PlaceLandingLayoutBusiness, PlaceLandingLayoutShowplace } from '@/modules/atlas/components/PlaceLandingLayouts';
import { getPlaceHeroImage, getPlacePhotos } from '@/modules/atlas/utils/placeMedia';

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

  // Generate R2 photo URLs for place gallery
  const r2Photos = getPlacePhotos(placeData.id);
  // Merge API photos (if any) with R2 photos, prioritizing API
  const allPhotos = placeData.photos && placeData.photos.length > 0 
    ? [...placeData.photos, ...r2Photos.filter(p => !placeData.photos?.includes(p))]
    : r2Photos;

  // API maps lat/lng → latitude/longitude in DTO for backward compatibility
  // Use latitude/longitude (which come from DB lat/lng) and also expose as lat/lng for future migration
  const formattedLat = placeData.latitude ? formatNumber(placeData.latitude, 4) : null;
  const formattedLng = placeData.longitude ? formatNumber(placeData.longitude, 4) : null;

  const detailData = {
    id: placeData.id,
    slug: placeData.slug,
    name: placeData.name,
    kind: (placeData.kind as 'showplace' | 'business') ?? 'showplace',
    description: placeData.description ?? null, // Short teaser only
    heroImage: getPlaceHeroImage(placeData.id, placeData.heroImage ?? placeData.photos?.[0]),
    photos: allPhotos,
    cityName: placeData.city ?? null,
    countryName: placeData.country ?? null,
    districtName: placeData.districtName ?? null,
    containerName: placeData.containerName ?? null,
    category: placeData.category ?? null,
    tags: placeData.tags ?? [],
    address: placeData.address ?? null,
    priceLevel: placeData.priceLevel ?? null,
    instagram: placeData.instagram ?? null,
    website: placeData.website ?? null,
    phone: placeData.phone ?? null,
    googleMapsUrl: placeData.googleMapsUrl ?? null,
    lat: formattedLat, // Preferred: from DB lat (via API latitude field)
    lng: formattedLng, // Preferred: from DB lng (via API longitude field)
    latitude: formattedLat, // Legacy: kept for backward compatibility
    longitude: formattedLng, // Legacy: kept for backward compatibility
    overviewMarkdown, // ONLY source for content sections
  };

  return detailData.kind === 'business' ? (
    <PlaceLandingLayoutBusiness data={detailData} />
  ) : (
    <PlaceLandingLayoutShowplace data={detailData} />
  );
}
