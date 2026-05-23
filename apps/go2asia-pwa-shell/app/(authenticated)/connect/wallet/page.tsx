import type { Metadata } from 'next';
import { WalletPageClientWrapper } from './WalletPageClientWrapper';
import { LEGACY_ROUTE_NOTICES } from '@/lib/routeAliases';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Legacy Activity Projection Alias | Connect Asia | Go2Asia',
  description: 'Legacy route for read-only Connect activity and internal Points projection; not a financial wallet',
};

export default function WalletPage() {
  return (
    <>
      <div className="bg-slate-50 px-4 pt-4">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          {LEGACY_ROUTE_NOTICES.connectWallet}
        </div>
      </div>
      <WalletPageClientWrapper />
    </>
  );
}

