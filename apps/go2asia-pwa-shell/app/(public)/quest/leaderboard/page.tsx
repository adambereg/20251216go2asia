import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Рейтинг Quest Asia (deferred) | Go2Asia',
  description: 'Deferred Quest surface без leaderboard, XP или social score в текущем Path A MVP',
};

export default function LeaderboardPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Рейтинг Quest Asia планируется
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел отключён для текущего Path A MVP. Мы не показываем leaderboard, XP или social score до отдельного
        governance stage.
      </p>
    </main>
  );
}
