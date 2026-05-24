import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Квесты (deferred) | Space Asia | Go2Asia',
  description: 'Статусный вход к квестам из Space без reward-authority semantics',
};

export default function QuestsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Квесты (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел работает как статусный переход. Для живого сценария используйте Quest Asia.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/quest" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть Quest Asia
        </Link>
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в Space
        </Link>
      </div>
    </main>
  );
}
