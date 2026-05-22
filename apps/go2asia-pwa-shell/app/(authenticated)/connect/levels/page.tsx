import type { Metadata } from 'next';
import { LevelsView } from '@/components/connect/Levels/LevelsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Badge Projection | Connect Asia | Go2Asia',
  description: 'Read-only off-chain badge projection; не receipt и не ownership surface',
};

export default function LevelsPage() {
  return <LevelsView />;
}

