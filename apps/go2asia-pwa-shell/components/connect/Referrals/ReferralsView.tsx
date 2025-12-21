'use client';

import { useState, useMemo } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { InviteModal } from './InviteModal';
import { useGetReferralStats } from '@go2asia/sdk/referrals';
import { useGetReferralTree } from '@go2asia/sdk/referrals';
import type { ReferralsData, ReferralStats as ReferralStatsType, Referral } from '../types';
import { mockReferralsData } from '../mockData';
import { ReferralsContent } from './ReferralsContent';

interface ReferralsViewProps {
  initialData?: ReferralsData;
}

export function ReferralsView({ initialData }: ReferralsViewProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteKind, setInviteKind] = useState<'user' | 'business'>('user');

  // Загружаем статистику рефералов из API
  const { data: referralStatsData, isLoading: statsLoading } = useGetReferralStats();
  
  // Загружаем дерево рефералов из API
  const { data: referralTreeData, isLoading: treeLoading } = useGetReferralTree({ depth: 2 });

  // Преобразуем данные из API в формат компонента
  const data = useMemo(() => {
    if (initialData) return initialData;

    // Преобразуем статистику из API
    const stats: ReferralStatsType = referralStatsData
      ? {
          total_users: referralStatsData.totalReferrals || 0,
          total_partners: 0, // API не возвращает отдельно партнёров
          earned_points: referralStatsData.totalEarned || 0,
          earned_g2a: 0, // API не возвращает G2A отдельно
        }
      : mockReferralsData.stats;

    // Преобразуем дерево рефералов в плоский список
    const referrals: Referral[] = referralTreeData?.referrals
      ? referralTreeData.referrals.map((node): Referral => ({
          id: node.userId,
          type: 'user' as const,
          name: [node.firstName, node.lastName].filter(Boolean).join(' ') || node.email || 'Пользователь',
          avatar: undefined,
          status: node.isActive ? 'active' : 'inactive',
          earned_rewards: {
            points: 0, // TODO: получить из API если доступно
            g2a: 0,
          },
          invited_at: node.registeredAt,
          missions_completed: 0, // TODO: получить из API если доступно
          missions_total: 0,
        }))
      : mockReferralsData.referrals;

    const referralLink = referralStatsData?.referralCode
      ? `https://go2asia.space/invite/${referralStatsData.referralCode}`
      : mockReferralsData.referral_link;

    return {
      stats,
      referrals,
      referral_link: referralLink,
      referral_qr: mockReferralsData.referral_qr, // TODO: генерировать QR код
    };
  }, [referralStatsData, referralTreeData, initialData]);

  const isLoading = statsLoading || treeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Загрузка данных рефералов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />

        {/* Навигация */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>

        <ReferralsContent
          data={data}
          onInvite={(kind) => {
            setInviteKind(kind);
            setInviteModalOpen(true);
          }}
        />
      </div>

      {/* Модал приглашения */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        referralLink={data.referral_link}
        referralQR={data.referral_qr}
        kind={inviteKind}
      />
    </>
  );
}

