'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { customInstance } from '@go2asia/sdk/mutator';
import { PROJECTION_LABELS } from '@/components/shared/projection';

type RieltMyInquiryItem = {
  id: string;
  listingId: string;
  message: string;
  status: 'new' | 'viewed' | 'closed';
  createdAt: string | null;
  closedAt: string | null;
  listing: {
    id: string;
    slug: string;
    title: string;
  };
};

type RieltMyInquiriesResponse = {
  items: RieltMyInquiryItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

function getStatusLabel(status: RieltMyInquiryItem['status']) {
  if (status === 'new') return 'Отправлен';
  if (status === 'viewed') return 'Просмотрен владельцем';
  return 'Закрыт';
}

function getStatusBadgeClass(status: RieltMyInquiryItem['status']) {
  if (status === 'new') return 'border-blue-200 bg-blue-50 text-blue-700';
  if (status === 'viewed') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return 'border-slate-200 bg-slate-100 text-slate-700';
}

export function RieltMyInquiriesClient() {
  const { isLoaded, isSignedIn } = useAuth();

  const inquiriesQuery = useQuery<RieltMyInquiriesResponse, Error>({
    queryKey: ['rielt', 'my-inquiries'],
    enabled: isLoaded && isSignedIn,
    queryFn: async () =>
      customInstance<RieltMyInquiriesResponse>(
        { method: 'GET' },
        '/v1/rielt/my/inquiries?page=1&page_size=20&sort=newest'
      ),
    staleTime: 30_000,
  });

  if (!isLoaded) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Загружаем статус запросов...
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-semibold text-amber-900">Войдите, чтобы видеть свои inquiry-запросы</h1>
          <p className="mt-2 text-sm text-amber-800">
            История запросов в Rielt является inquiry visibility surface. Это не booking confirmation и не receipt.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent('/rielt/inquiries')}`}
              className="inline-flex items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
            >
              Войти
            </Link>
            <Link
              href="/rielt"
              className="inline-flex items-center rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              Вернуться в Rielt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (inquiriesQuery.isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Загружаем историю inquiry-запросов...
        </div>
      </div>
    );
  }

  if (inquiriesQuery.isError || !inquiriesQuery.data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-900">Не удалось загрузить историю запросов</h1>
          <p className="mt-2 text-sm text-red-800">
            Попробуйте позже. Inquiry status visibility не является booking confirmation или inventory authority.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void inquiriesQuery.refetch()}
              className="inline-flex items-center rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Повторить
            </button>
            <Link
              href="/rielt/search"
              className="inline-flex items-center rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-100"
            >
              К поиску объявлений
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = inquiriesQuery.data.items;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Мои inquiry-запросы</h1>
        <p className="mt-2 text-sm text-slate-600">
          {PROJECTION_LABELS.inquiryOnly} status visibility: запросы, ответы и изменения статусов. Это не booking
          confirmation и не receipt surface.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">
            Пока нет отправленных inquiry-запросов. Найдите объект и отправьте запрос владельцу.
          </p>
          <div className="mt-4">
            <Link
              href="/rielt/search"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Перейти к поиску
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.listing.title}</p>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Создан: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span>
                {item.closedAt ? <span>Закрыт: {new Date(item.closedAt).toLocaleString()}</span> : null}
                <Link href={`/rielt/listings/${item.listing.id}`} className="text-emerald-700 hover:underline">
                  Открыть объект
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
