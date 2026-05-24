import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Профиль - Go2Asia',
  description: 'Профиль и social visibility в экосистеме Go2Asia',
  openGraph: {
    title: 'Профиль - Go2Asia',
    description: 'Профиль и social visibility в экосистеме Go2Asia',
    type: 'website',
  },
};

export default function ProfilePage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Профиль
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Профиль находится в поэтапной сборке. Здесь отображается social/account visibility,
        но это не удостоверение личности и не proof-система.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть Space
        </Link>
        <Link href="/space/saved" className="font-medium text-blue-700 hover:text-blue-800">
          Сохранённые в Space
        </Link>
        <Link href="/space/activity" className="font-medium text-blue-700 hover:text-blue-800">
          Активность в Space
        </Link>
        <Link href="/connect/activity" className="font-medium text-emerald-700 hover:text-emerald-800">
          Connect activity
        </Link>
      </div>
    </main>
  );
}



















