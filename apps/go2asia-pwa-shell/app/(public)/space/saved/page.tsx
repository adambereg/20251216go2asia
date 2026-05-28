import type { Metadata } from 'next';
import { SavedPostsPageClient } from './SavedPostsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Сохранённое | Space Asia | Go2Asia',
  description: 'Bounded saved-items pilot for Space posts, places, events and blog posts.',
};

export default function SavedPostsPage() {
  return <SavedPostsPageClient />;
}

