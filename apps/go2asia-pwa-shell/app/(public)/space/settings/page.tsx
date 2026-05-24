import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Настройки (deferred) | Space Asia | Go2Asia',
  description: 'Статусный маршрут social/profile настроек без identity-proof semantics',
};

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Настройки (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел работает как статусная поверхность. Профильная social visibility пока не является
        удостоверением личности или статусом подтверждённой репутации.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/profile" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть профиль
        </Link>
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в Space
        </Link>
      </div>
    </main>
  );
}
