import type { Metadata } from 'next';
import { ReviewsListView } from '@/components/rf/Merchant/Reviews';

export const metadata: Metadata = {
  title: 'Отзывы (demo) | Кабинет партнёра | Russian Friendly',
  description: 'Demo-слой отзывов для merchant baseline без live moderation flow',
};

export default function MerchantReviewsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Раздел «Отзывы» использует demo-данные. Ответы на отзывы и связь с live review backend пока не подключены.
      </div>
      <ReviewsListView />
    </div>
  );
}

