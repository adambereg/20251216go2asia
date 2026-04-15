import type { Metadata } from 'next';
import { CommunityRootPageClient } from './CommunityRootPageClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Сообщества | Space Asia | Go2Asia',
  description: 'Community root и discovery entry surface для групп и belonging structures в Space Asia',
};

export default function CommunityPage() {
  return <CommunityRootPageClient />;
}
