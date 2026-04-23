import type { Metadata } from 'next';
import { QuestHomeClient } from './QuestHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quest Asia - Квесты и миссии | Go2Asia',
  description: 'Городские маршруты, фото-миссии и пошаговые задания в Quest Asia',
  openGraph: {
    title: 'Quest Asia - Квесты и миссии',
    description: 'Городские маршруты, фото-миссии и пошаговые задания в Quest Asia',
    type: 'website',
  },
};

export default function QuestPage() {
  return <QuestHomeClient />;
}
