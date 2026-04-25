'use client';

import { useState, useMemo } from 'react';
import { Chip } from '@go2asia/ui';
import { AchievementCard } from './AchievementCard';
import type { BadgeAchievement } from '../types';

interface AchievementsListProps {
  badges: BadgeAchievement[];
}

export function AchievementsList({ badges }: AchievementsListProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'earned' | 'available'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return Array.from(new Set(badges.map((badge) => badge.category))).filter(Boolean);
  }, [badges]);

  const filteredBadges = useMemo(() => {
    let result = [...badges];

    if (selectedStatus !== 'all') {
      result = result.filter((badge) => (selectedStatus === 'earned' ? badge.isEarned : !badge.isEarned));
    }

    if (selectedCategory !== 'all') {
      result = result.filter((badge) => badge.category === selectedCategory);
    }

    return result;
  }, [badges, selectedStatus, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Статус</h4>
          <div className="flex flex-wrap gap-2">
            {(['all', 'earned', 'available'] as const).map((status) => (
              <Chip
                key={status}
                size="sm"
                selected={selectedStatus === status}
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'all'
                  ? 'Все'
                  : status === 'earned'
                    ? 'Получен'
                    : 'Пока не получен'}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Категория</h4>
          <div className="flex flex-wrap gap-2">
            {(['all', ...categories] as const).map((category) => (
              <Chip
                key={category}
                size="sm"
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Все' : category}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredBadges.length > 0 ? (
          filteredBadges.map((badge) => (
            <AchievementCard key={badge.key} badge={badge} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>У вас пока нет бейджей.</p>
            <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
}

