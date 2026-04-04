'use client';

import { Heart } from 'lucide-react';
import { useRfFavorites } from '@/hooks/useRfLocalContour';
import { toggleFavoritePlace } from '@/lib/rfLocalUserState';

export function FavoritePlaceButton({ partnerId, label = 'Место' }: { partnerId: string; label?: string }) {
  const { places } = useRfFavorites();
  const active = places.includes(partnerId);

  return (
    <button
      type="button"
      onClick={() => toggleFavoritePlace(partnerId)}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-rose-300 bg-rose-50 text-rose-800'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      }`}
      aria-pressed={active}
      title={active ? 'Убрать из избранного' : `В избранное: ${label}`}
    >
      <Heart className={`h-3.5 w-3.5 ${active ? 'fill-current' : ''}`} strokeWidth={2} />
      {active ? 'В избранном' : 'В избранное'}
    </button>
  );
}
