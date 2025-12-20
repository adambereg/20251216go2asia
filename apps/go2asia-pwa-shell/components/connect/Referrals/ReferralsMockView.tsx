'use client';

import { useState } from 'react';
import { Button, Card } from '@go2asia/ui';
import { Plus } from 'lucide-react';
import { ConnectHero, ConnectNav } from '../Shared';
import { ReferralStats } from './ReferralStats';
import { ReferralCard } from './ReferralCard';
import { InviteModal } from './InviteModal';
import { mockReferralsData } from '../mockData';

export function ReferralsMockView() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText="MOCK DATA" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Реферальная программа</h1>
              <p className="text-slate-600 mt-1">Приглашайте друзей и партнёров, получайте награды</p>
            </div>
            <Button variant="primary" onClick={() => setInviteModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Пригласить
            </Button>
          </div>

          <ReferralStats stats={mockReferralsData.stats} />

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Мои рефералы</h2>
            {mockReferralsData.referrals.length > 0 ? (
              <div className="space-y-3">
                {mockReferralsData.referrals.map((referral) => (
                  <ReferralCard key={referral.id} referral={referral} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-slate-500 mb-2">У вас пока нет рефералов</p>
                <p className="text-sm text-slate-400 mb-4">Пригласите друзей и получите бонусы!</p>
                <Button variant="primary" onClick={() => setInviteModalOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Пригласить друга
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        referralLink={mockReferralsData.referral_link}
        referralQR={mockReferralsData.referral_qr}
      />
    </>
  );
}

