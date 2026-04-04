'use client';

import { useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import { useRfMyLocalVouchers } from '@/hooks/useRfLocalContour';
import { addMyLocalVoucher } from '@/lib/rfLocalUserState';

export function AddToMyVouchersButton({
  offerId,
  partnerId,
  title,
  partnerDisplayName,
}: {
  offerId: string;
  partnerId: string;
  title: string;
  partnerDisplayName: string;
}) {
  const rows = useRfMyLocalVouchers();
  const exists = rows.some((r) => r.offerId === offerId);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={exists}
      onClick={() => {
        const ok = addMyLocalVoucher({ offerId, partnerId, title, partnerDisplayName });
        if (ok) {
          setJustAdded(true);
          window.setTimeout(() => setJustAdded(false), 2000);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
      title={
        exists
          ? 'Уже в списке «Мои ваучеры» (локально)'
          : 'Сохранить в список планирования в этом браузере'
      }
    >
      <BookmarkPlus className="h-3.5 w-3.5" />
      {exists ? 'Уже в «Мои ваучеры»' : justAdded ? 'Добавлено' : 'В «Мои ваучеры»'}
    </button>
  );
}
