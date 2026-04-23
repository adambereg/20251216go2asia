import type { Metadata } from 'next';
import { PostsPageClient } from './PostsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Мои публикации | Space Asia | Go2Asia',
  description: 'Ваши публикации и репосты, которые уже видны в Space Asia.',
};

export default function MyPostsPage() {
  return <PostsPageClient />;
}
