'use client';

import Link from 'next/link';
import { useRfMyLocalVouchers } from '@/hooks/useRfLocalContour';
import { RfLocalStorageNotice } from '@/components/rf/Shared/RfLocalStorageNotice';
import { removeMyLocalVoucher } from '@/lib/rfLocalUserState';
import { rfMyVouchersPageContent } from '@/lib/rfFirstSliceContent';

export function RfMyVouchersView() {
  const rows = useRfMyLocalVouchers();

  return (
    <div className="space-y-6">
      <RfLocalStorageNotice>{rfMyVouchersPageContent.localWarning}</RfLocalStorageNotice>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{rfMyVouchersPageContent.empty}</div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.localId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{row.title}</p>
                  <p className="text-xs text-slate-600">
                    {row.partnerDisplayName} · {rfMyVouchersPageContent.addedAt}:{' '}
                    {new Date(row.savedAt).toLocaleString('ru-RU')}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-900">
                    {rfMyVouchersPageContent.statusLocal}
                  </span>
                  <p className="mt-2 text-[11px] text-slate-500">offerId: {row.offerId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/rf/${encodeURIComponent(row.partnerId)}`}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Открыть место
                  </Link>
                  <Link
                    href={`/rf/vouchers?partner=${encodeURIComponent(row.partnerId)}`}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Офферы места
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeMyLocalVoucher(row.localId)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 hover:bg-red-100"
                  >
                    {rfMyVouchersPageContent.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу предложений
        </Link>
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу мест
        </Link>
      </div>
    </div>
  );
}
