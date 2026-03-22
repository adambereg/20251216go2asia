import type { Metadata } from 'next';
import { QuestHomeClient } from './QuestHomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quest Asia - Квесты и миссии | Go2Asia',
  description: 'Проходите квесты, выполняйте миссии и получайте награды',
  openGraph: {
    title: 'Quest Asia - Квесты и миссии',
    description: 'Проходите квесты, выполняйте миссии и получайте награды',
    type: 'website',
  },
};

export default function QuestPage() {
  return <QuestHomeClient />;
}
