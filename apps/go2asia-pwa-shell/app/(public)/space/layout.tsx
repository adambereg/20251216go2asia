import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Space Asia | Runtime Integration Shell | Go2Asia',
  description:
    'Space Asia phase-1 runtime-backed integration shell with controlled scope and explicit deferred surfaces.',
  openGraph: {
    title: 'Space Asia | Runtime Integration Shell | Go2Asia',
    description: 'Space phase-1 integration shell with explicit deferred boundaries.',
    type: 'website',
  },
};

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

