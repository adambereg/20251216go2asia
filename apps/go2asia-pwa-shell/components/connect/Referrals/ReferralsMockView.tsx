'use client';

import { useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { InviteModal } from './InviteModal';
import { mockReferralsData } from '../mockData';
import { ReferralsContent } from './ReferralsContent';

export function ReferralsMockView() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteKind, setInviteKind] = useState<'user' | 'business'>('user');

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText="MOCK DATA" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <ReferralsContent
          data={mockReferralsData}
          onInvite={(kind) => {
            setInviteKind(kind);
            setInviteModalOpen(true);
          }}
        />
      </div>

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        referralLink={mockReferralsData.referral_link}
        referralQR={mockReferralsData.referral_qr}
        kind={inviteKind}
      />
    </>
  );
}


