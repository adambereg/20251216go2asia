'use client';

import { SpaceLayout } from '@/components/space/Shared';
import { SpaceProfileSurface } from '@/components/space/runtime/SpaceProfileSurface';
import { PUBLIC_PROFILE_ID } from '@/components/space/runtime/utils';

export function PostsPageClient() {
  if (!PUBLIC_PROFILE_ID) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Авторские публикации</h1>
          <p className="mt-2 text-sm text-slate-600">
            Public authored-posts baseline ещё не настроен: отсутствует
            `NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID`.
          </p>
        </section>
      </SpaceLayout>
    );
  }

  return (
    <SpaceLayout>
      <SpaceProfileSurface
        userId={PUBLIC_PROFILE_ID}
        heading="Авторские публикации"
        subtitle="Bounded authored-posts baseline через уже существующий public profile feed contract."
      />
    </SpaceLayout>
  );
}
