import type { Metadata } from 'next';
import { CommunityFeedPageClient } from './CommunityFeedPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Поток постов сообщества | Space Asia | Go2Asia',
  description: 'Social stream публикаций сообщества; discovery root остаётся на /space/community',
};

export default function CommunityFeedPage() {
  return <CommunityFeedPageClient />;
}
