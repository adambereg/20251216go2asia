import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Ваучеры (deferred) | Space Asia | Go2Asia',
  description: 'Статусный вход к ваучерам из Space без семантики владения или прав доступа',
};

export default function VouchersPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Ваучеры (deferred)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел работает как статусный переход. Для live RF-voucher lifecycle используйте Russian Friendly.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть RF ваучеры
        </Link>
        <Link href="/space" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в Space
        </Link>
      </div>
    </main>
  );
}
