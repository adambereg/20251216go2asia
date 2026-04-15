'use client';

import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceProfileSurface } from '@/components/space/runtime/SpaceProfileSurface';
import { PUBLIC_PROFILE_ID } from '@/components/space/runtime/utils';

export function PostsPageClient() {
  const { user, isLoaded, isSignedIn } = useUser();
  const profileId = isSignedIn && user?.id ? user.id : PUBLIC_PROFILE_ID;

  if (!isLoaded) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Авторские публикации</h1>
          <p className="mt-2 text-sm text-slate-600">Подготавливаем профиль для authored baseline...</p>
        </section>
      </SpaceLayout>
    );
  }

  if (!profileId) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Авторские публикации</h1>
          <p className="mt-2 text-sm text-slate-600">
            Для гостевого authored baseline пока не задан representative profile. Войдите, чтобы увидеть свои публикации,
            или откройте `/space/community/feed` для общего social потока.
          </p>
        </section>
      </SpaceLayout>
    );
  }

  return (
    <SpaceLayout>
      <SpaceProfileSurface
        userId={profileId}
        heading="Авторские публикации"
        subtitle={
          isSignedIn
            ? 'Ваши авторские публикации через существующий profile feed contract.'
            : 'Representative public authored baseline через существующий profile feed contract.'
        }
      />
    </SpaceLayout>
  );
}
