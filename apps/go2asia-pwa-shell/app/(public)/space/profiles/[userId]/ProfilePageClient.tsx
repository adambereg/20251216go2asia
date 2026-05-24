'use client';

import { SpaceLayout } from '@/components/space/Shared';
import { SpaceProfileSurface } from '@/components/space/runtime/SpaceProfileSurface';

type ProfilePageClientProps = {
  userId: string;
};

export function ProfilePageClient({ userId }: ProfilePageClientProps) {
  return (
    <SpaceLayout>
      <SpaceProfileSurface
        userId={userId}
        heading="Публичный профиль"
        subtitle="Профильная social-видимость и авторские публикации в Space. Это не удостоверение личности и не verified-fact surface."
      />
    </SpaceLayout>
  );
}
