import type { Metadata } from 'next';
import { PostsPageClient } from './PostsPageClient';
import { WS2_COPY } from '@/modules/space/ws2Copy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Авторские публикации | Space Asia | Go2Asia',
  description: WS2_COPY.surfaces.publicationsMeta,
};

export default function MyPostsPage() {
  return <PostsPageClient />;
}
