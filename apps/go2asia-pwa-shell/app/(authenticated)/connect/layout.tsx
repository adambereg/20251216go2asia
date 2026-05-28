import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Connect Asia | Projection Activity and Points | Go2Asia',
  description:
    'Read-only projection center Go2Asia: internal Points, invitations, RF lifecycle summary and off-chain badges.',
  openGraph: {
    title: 'Connect Asia | Projection Activity and Points | Go2Asia',
    description: 'Read-only projection активности и внутренних Points Go2Asia, без owner-fact authority',
    type: 'website',
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

