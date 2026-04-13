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
        heading="Public profile baseline"
        subtitle="Публичный профиль и authored posts поверх существующих `/v1/space/profiles/*` и `/v1/space/feed/profile/*`."
      />
    </SpaceLayout>
  );
}
