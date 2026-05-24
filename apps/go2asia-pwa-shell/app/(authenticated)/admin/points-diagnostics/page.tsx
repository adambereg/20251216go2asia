import type { Metadata } from 'next';
import { PointsDiagnosticsJourneyView } from '@/components/admin/diagnostics/PointsDiagnosticsJourneyView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin diagnostics | Points support lookup | Go2Asia',
  description:
    'Internal-only diagnostics continuity surface for projection metadata, support lookup pointers, and owner-fact navigation.',
};

type PageProps = {
  searchParams?: Promise<{
    supportLookupKey?: string;
    projectionKind?: string;
    referenceScope?: string;
  }>;
};

export default async function AdminPointsDiagnosticsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  return (
    <PointsDiagnosticsJourneyView
      supportLookupKey={params.supportLookupKey}
      projectionKind={params.projectionKind}
      referenceScope={params.referenceScope}
    />
  );
}
