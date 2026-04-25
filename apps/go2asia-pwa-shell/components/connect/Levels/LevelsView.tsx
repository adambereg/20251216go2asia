'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { AchievementsList } from './AchievementsList';
import { Button, Card, SkeletonCard } from '@go2asia/ui';
import { AlertCircle, Award, RefreshCw } from 'lucide-react';
import { useGetBadgeCatalog, useGetMyBadges, type BadgeCatalogItem, type UserBadgeItem } from '@go2asia/sdk/badges';
import type { BadgeAchievement } from '../types';

const BADGE_COPY: Record<string, { title: string; description: string; emptyHint: string; category: string }> = {
  first_quest_completed: {
    title: 'Первый квест завершён',
    description: 'Вы завершили первый квест в Go2Asia.',
    emptyHint: 'Завершите первый квест, чтобы получить этот бейдж.',
    category: 'Квесты',
  },
  first_referral_activated: {
    title: 'Первый активный реферал',
    description: 'Первый приглашённый пользователь стал активным.',
    emptyHint: 'Пригласите друга и дождитесь его активации.',
    category: 'Рефералы',
  },
  first_space_post: {
    title: 'Первый пост в Space',
    description: 'Вы сделали первую публикацию в Space Asia.',
    emptyHint: 'Опубликуйте первый пост в Space, когда эта возможность будет подключена к бейджам.',
    category: 'Space',
  },
};

function normalizeCategory(category: string | null | undefined) {
  if (!category) return 'Go2Asia';
  const normalized = category.toLowerCase();
  if (normalized.includes('quest') || normalized.includes('квест')) return 'Квесты';
  if (normalized.includes('referral') || normalized.includes('реферал')) return 'Рефералы';
  if (normalized.includes('space')) return 'Space';
  return 'Go2Asia';
}

function fromCatalogItem(item: BadgeCatalogItem, awarded?: UserBadgeItem): BadgeAchievement {
  const copy = BADGE_COPY[item.code];
  return {
    key: item.code,
    title: copy?.title ?? item.title,
    description: copy?.description ?? item.description ?? '',
    category: copy?.category ?? normalizeCategory(item.category),
    iconKey: item.iconKey,
    awardedAt: awarded?.awardedAt ?? null,
    isEarned: Boolean(awarded),
    emptyHint: copy?.emptyHint,
  };
}

function fromAwardedOnly(item: UserBadgeItem): BadgeAchievement {
  const copy = BADGE_COPY[item.badgeCode];
  return {
    key: item.badgeCode,
    title: copy?.title ?? item.title,
    description: copy?.description ?? item.description ?? '',
    category: copy?.category ?? normalizeCategory(item.category),
    iconKey: item.iconKey,
    awardedAt: item.awardedAt,
    isEarned: true,
    emptyHint: copy?.emptyHint,
  };
}

export function LevelsView() {
  const {
    data: catalogData,
    isLoading: catalogLoading,
    isError: catalogError,
    refetch: refetchCatalog,
  } = useGetBadgeCatalog();
  const {
    data: myBadgesData,
    isLoading: myBadgesLoading,
    isError: myBadgesError,
    refetch: refetchMyBadges,
  } = useGetMyBadges({ limit: 100 });

  const isLoading = catalogLoading || myBadgesLoading;
  const hasError = catalogError || myBadgesError;

  const badgesByCode = new Map((myBadgesData?.items ?? []).map((badge) => [badge.badgeCode, badge]));
  const catalogBadges = (catalogData?.items ?? [])
    .filter((badge) => badge.isActive)
    .map((badge) => fromCatalogItem(badge, badgesByCode.get(badge.code)));
  const catalogCodes = new Set(catalogBadges.map((badge) => badge.key));
  const awardedOnlyBadges = (myBadgesData?.items ?? [])
    .filter((badge) => !catalogCodes.has(badge.badgeCode))
    .map(fromAwardedOnly);
  const badges = [...catalogBadges, ...awardedOnlyBadges];
  const earnedCount = badges.filter((badge) => badge.isEarned).length;

  const handleRetry = () => {
    refetchCatalog();
    refetchMyBadges();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Ваши достижения в Go2Asia." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-slate-600 mb-4">Загружаем данные Connect…</p>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ConnectHero subtitle="Ваши достижения в Go2Asia." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <ConnectNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">Не удалось загрузить бейджи</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-2 mt-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Ваши достижения в Go2Asia." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Бейджи и достижения</h1>
          <p className="text-slate-600 mt-1">Смотрите полученные и доступные бейджи Connect.</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Получено бейджей</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{earnedCount}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            Бейджи отмечают подтверждённые действия в Go2Asia. Сейчас здесь показаны только off-chain бейджи из каталога и ваши полученные бейджи.
          </p>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Достижения</h2>
          {badges.length > 0 ? (
            <AchievementsList badges={badges} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-slate-600 font-medium">У вас пока нет бейджей.</p>
              <p className="text-sm text-slate-500 mt-1">Завершите первый квест, чтобы получить первый бейдж.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

