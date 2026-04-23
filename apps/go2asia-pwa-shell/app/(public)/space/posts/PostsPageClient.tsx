'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { SpacePublicationsSurface } from '@/components/space/runtime/SpacePublicationsSurface';

const PUBLIC_PROFILE_ID = (process.env.NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID ?? '').trim();

export function PostsPageClient() {
  const { user, isLoaded, isSignedIn } = useUser();
  const profileId = isSignedIn && user?.id ? user.id : PUBLIC_PROFILE_ID;
  const isOwnerView = Boolean(isSignedIn && user?.id && profileId === user.id);

  if (!isLoaded) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Мои публикации</h1>
          <p className="mt-2 text-sm text-slate-600">
            Подготавливаем авторскую подборку и актуальные публикации Space Asia.
          </p>
        </section>
      </SpaceLayout>
    );
  }

  if (!profileId) {
    return (
      <SpaceLayout>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Мои публикации</h1>
          <p className="mt-2 text-sm text-slate-600">
            Войдите в аккаунт, чтобы открыть свои публикации и репосты. Пока можно вернуться в общую ленту
            Space Asia.
          </p>
          <div className="mt-4">
            <Link href="/space/feed" className="text-sm font-medium text-sky-700 hover:text-sky-800">
              Перейти в ленту
            </Link>
          </div>
        </section>
      </SpaceLayout>
    );
  }

  return (
    <SpaceLayout>
      <SpacePublicationsSurface userId={profileId} isOwnerView={isOwnerView} />
    </SpaceLayout>
  );
}
