'use client';

import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { PostsPublicationsSurface } from './PostsPublicationsSurface';

const PUBLIC_PROFILE_ID = (process.env.NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID ?? '').trim();

export function PostsPageClient() {
  const { user, isLoaded, isSignedIn } = useUser();
  const profileId = isSignedIn && user?.id ? user.id : PUBLIC_PROFILE_ID;
  const isOwnerView = Boolean(isSignedIn && user?.id && profileId === user.id);

  if (!isLoaded) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Авторские публикации</h1>
          <p className="mt-2 text-sm text-slate-600">
            Подготавливаем список публикаций и репостов, которые уже видны в Space Asia.
          </p>
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
            Войдите в аккаунт, чтобы увидеть свои публикации. Если нужен общий контекст Space Asia, откройте ленту.
          </p>
        </section>
      </SpaceLayout>
    );
  }

  return (
    <SpaceLayout>
      <PostsPublicationsSurface userId={profileId} isOwnerView={isOwnerView} />
    </SpaceLayout>
  );
}
