import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CommunityFeedPage() {
  redirect('/space/feed');
}
