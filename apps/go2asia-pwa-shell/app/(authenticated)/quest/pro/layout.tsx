import { QuestPROLayout } from '@/components/quest/PRO';

export const dynamic = 'force-dynamic';

export default function QuestPROConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuestPROLayout>{children}</QuestPROLayout>;
}
