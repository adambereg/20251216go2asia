import type { Metadata } from 'next';
import { PostsPageClient } from './PostsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Авторские публикации | Space Asia | Go2Asia',
  description: 'Публичный baseline авторских публикаций в Space Asia',
};

export default function MyPostsPage() {
  return <PostsPageClient />;
}
