'use client';

/**
 * Rielt.Market Asia - Reviews
 * Отзывы (UGC), currently disabled until backend-backed review facts exist.
 */

import { MessageSquare } from 'lucide-react';
import type { Listing } from '../types';

interface ReviewsProps {
  listing: Listing;
}

export function Reviews(_props: ReviewsProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-slate-500 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Отзывы</h2>
          <p className="text-sm text-slate-600">
            Отзывы появятся здесь только после подключения backend-backed UGC. Мы не показываем mock reviews и не
            используем бейджи вроде «проверенная бронь», потому что Rielt сейчас остаётся inquiry-only surface без
            booking/payment proof.
          </p>
        </div>
      </div>
    </div>
  );
}

