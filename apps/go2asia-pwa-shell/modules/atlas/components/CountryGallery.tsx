'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@go2asia/ui';
import { getCountryGallery, type ContentGalleryItemDto } from '@go2asia/sdk/content';
import { AtlasTabContent } from '@/modules/atlas/components/AtlasTabContent';
import { ImageLightbox } from '@/modules/atlas/components/ImageLightbox';

type LoadState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: ContentGalleryItemDto[] };

export function CountryGallery() {
  const params = useParams();
  const idOrSlug = params?.id as string | undefined;

  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!idOrSlug) return;
    let active = true;
    setState({ status: 'loading' });

    (async () => {
      try {
        const res = await getCountryGallery(idOrSlug, { limit: 50 });
        if (!active) return;
        setState({ status: 'success', items: res.items ?? [] });
      } catch (err) {
        if (!active) return;
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Не удалось загрузить фотогалерею.' });
      }
    })();

    return () => {
      active = false;
    };
  }, [idOrSlug]);

  const urls = useMemo(() => {
    if (state.status !== 'success') return [];
    return (state.items ?? []).map((x) => x.url).filter((u) => typeof u === 'string' && u.length > 0);
  }, [state]);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // If we have images in R2 — render gallery UI (prefer it over markdown)
  if (state.status === 'success' && state.items.length > 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Фотогалерея</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.items.map((item, idx) => (
            <button
              key={item.key}
              type="button"
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              onClick={() => {
                setLightboxIndex(idx);
                setIsLightboxOpen(true);
              }}
              aria-label="Открыть фото"
            >
              <img
                src={item.url}
                alt={item.isCover ? 'Обложка страны' : `Фото ${idx + 1}`}
                className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {item.isCover && (
                <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  Обложка
                </div>
              )}
            </button>
          ))}
        </div>

        <ImageLightbox
          images={urls}
          currentIndex={lightboxIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
        />
      </div>
    );
  }

  // Empty gallery or API error — fall back to markdown tab content (historic @gallery)
  return (
    <div className="space-y-4">
      {state.status === 'error' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {state.message}
        </div>
      )}
      <AtlasTabContent entityType="country" tabKey="gallery" title="Фотогалерея" emptyMessage="Фото пока не загружены." />
    </div>
  );
}

