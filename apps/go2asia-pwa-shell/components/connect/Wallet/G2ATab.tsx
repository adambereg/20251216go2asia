'use client';

import { Card } from '@go2asia/ui';
import { Info } from 'lucide-react';
import type { WalletData } from '../types';

/**
 * @deprecated Future-only legacy token wallet UI.
 * Stage 6.5.5 quarantines this component as an inert explainer:
 * no amount, external transfer, fee, or address UI.
 */
interface G2ATabProps {
  data: WalletData;
  onLoadMore?: () => void;
}

export function G2ATab(_props: G2ATabProps) {
  return (
    <Card className="p-6 border border-slate-200 bg-slate-50">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">G2A future layer</h3>
          <p className="text-sm text-slate-600 mt-1">
            G2A external token flows are not part of the current Connect runtime. This placeholder is intentionally
            inert and must not be wired into active user routes.
          </p>
        </div>
      </div>
    </Card>
  );
}

