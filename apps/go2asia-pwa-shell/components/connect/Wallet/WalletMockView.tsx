'use client';

import { useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { PointsTab } from './PointsTab';
import { G2ATab } from './G2ATab';
import { NFTTab } from './NFTTab';
import { mockWalletData, mockNFTWalletData } from '../mockData';

export function WalletMockView() {
  const [activeTab, setActiveTab] = useState<'points' | 'g2a' | 'nft'>('points');

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText="MOCK DATA" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('points')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'points'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Points
            </button>
            <button
              onClick={() => setActiveTab('g2a')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'g2a'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              G2A
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'nft'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NFT
            </button>
          </div>
        </div>

        {activeTab === 'points' && <PointsTab data={mockWalletData} onLoadMore={() => {}} />}
        {activeTab === 'g2a' && <G2ATab data={mockWalletData} onLoadMore={() => {}} />}
        {activeTab === 'nft' && <NFTTab nfts={mockNFTWalletData.nfts} />}
      </div>
    </div>
  );
}

