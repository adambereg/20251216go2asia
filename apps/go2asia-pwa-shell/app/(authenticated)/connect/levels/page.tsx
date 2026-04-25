import type { Metadata } from 'next';
import { LevelsView } from '@/components/connect/Levels/LevelsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Бейджи и достижения | Connect Asia | Go2Asia',
  description: 'Смотрите полученные и доступные бейджи Connect Asia',
};

export default function LevelsPage() {
  return <LevelsView />;
}

