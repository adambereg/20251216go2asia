import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PRO кабинет (beta) | Russian Friendly | Go2Asia',
  description: 'Панель управления PRO-куратора',
};

export default function PRODashboardPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">PRO кабинет (beta)</h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел развивается. В следующих итерациях здесь появятся рабочие инструменты для PRO-связей, онбординга и
        сопровождения партнёрских сценариев.
      </p>
    </main>
  );
}
