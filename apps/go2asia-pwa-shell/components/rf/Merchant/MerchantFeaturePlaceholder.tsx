'use client';

import Link from 'next/link';
import { Button } from '@go2asia/ui';

export function MerchantFeaturePlaceholder({
  title,
  description = 'Раздел будет доступен в следующих версиях',
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            soon
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
        </div>
        <Link href="/rf/merchant">
          <Button type="button" variant="secondary" size="sm">
            Вернуться в кабинет
          </Button>
        </Link>
      </div>
    </section>
  );
}
