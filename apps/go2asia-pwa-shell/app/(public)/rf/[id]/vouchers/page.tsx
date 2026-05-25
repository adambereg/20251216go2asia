import { redirect } from 'next/navigation';
import { getRfPartnerVouchersRoute } from '@/lib/routeAliases';

export const dynamic = 'force-static';

export default async function PartnerVouchersAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(getRfPartnerVouchersRoute(id));
}
