'use client';

import { Card } from '@go2asia/ui';
import { Award } from 'lucide-react';
import type { NFTBadge } from '../types';

/**
 * @deprecated Future-only legacy NFT wallet UI.
 * Current runtime uses off-chain badges, not NFT assets, spend gates, marketplaces, or on-chain ownership.
 */
interface NFTTabProps {
  nfts: NFTBadge[];
}

export function NFTTab(_props: NFTTabProps) {
  return (
    <Card className="p-6 border border-slate-200 bg-slate-50">
      <div className="flex items-start gap-3">
        <Award className="w-5 h-5 text-slate-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Future collectible compatibility</h3>
          <p className="text-sm text-slate-600 mt-1">
            NFT/on-chain badge surfaces are not part of the current Connect runtime. Current user-facing UI should use
            off-chain badges and read-only achievements only.
          </p>
        </div>
      </div>
    </Card>
  );
}

