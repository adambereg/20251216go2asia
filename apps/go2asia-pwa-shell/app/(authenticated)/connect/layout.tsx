import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Connect Asia | Активность и Points | Go2Asia',
  description:
    'Read-only центр активности Go2Asia: внутренние Points, приглашения, RF-сводка и off-chain бейджи where runtime-backed.',
  openGraph: {
    title: 'Connect Asia | Активность и Points | Go2Asia',
    description: 'Read-only сводка активности, внутренних Points и участия в экосистеме Go2Asia',
    type: 'website',
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

