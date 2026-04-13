import type { Metadata } from 'next';
import { SavedPostsPageClient } from './SavedPostsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Сохранённые посты | Space Asia | Go2Asia',
  description: 'Saved posts live-surface baseline поверх reactions bookmark runtime',
};

export default function SavedPostsPage() {
  return <SavedPostsPageClient />;
}

