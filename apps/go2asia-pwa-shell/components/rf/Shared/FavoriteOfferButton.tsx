'use client';

import { Heart } from 'lucide-react';
import { useRfFavorites, useRfLocalVoucherOwnerState } from '@/hooks/useRfLocalContour';
import { toggleFavoriteOffer } from '@/lib/rfLocalUserState';

export function FavoriteOfferButton({ offerId }: { offerId: string }) {
  const owner = useRfLocalVoucherOwnerState();
  const { offers } = useRfFavorites(owner.ownerKey, owner.isReady);
  const active = offers.includes(offerId);

  return (
    <button
      type="button"
      disabled={!owner.isReady}
      onClick={() => {
        if (!owner.isReady) return;
        toggleFavoriteOffer(offerId, owner.ownerKey);
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-rose-300 bg-rose-50 text-rose-800'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50'
      }`}
      aria-pressed={active}
      title={
        !owner.isReady
          ? 'Проверяем текущий аккаунт перед сохранением'
          : active
            ? 'Убрать оффер из избранного'
            : 'Оффер в избранное'
      }
    >
      <Heart className={`h-3.5 w-3.5 ${active ? 'fill-current' : ''}`} strokeWidth={2} />
      {active ? 'Оффер в избранном' : 'Оффер в избранное'}
    </button>
  );
}
