/**
 * Quest Asia - Legacy Badge Preview Helpers
 * Local-only off-chain badge metadata preview. Does not award badges, NFTs or owner facts.
 */

import type { NFTBadge, QuestProgress, Quest } from '../types';
import { mockNFTBadges } from '../mockQuests';

/**
 * Статистика пользователя для проверки бейджей
 */
export interface UserStats {
  questsCompleted: number;
  totalPoints: number;
  completedQuestIds: string[];
  questsByType: {
    route: number;
    checkin: number;
    content: number;
    event: number;
  };
  questsByCategory: {
    temple: number;
    food: number;
    nightlife: number;
    culture: number;
    adventure: number;
  };
  consecutiveQuests: number;
}

/**
 * Вычислить статистику пользователя из прогрессов
 */
export function calculateUserStats(
  progresses: QuestProgress[],
  quests: Quest[]
): UserStats {
  const completed = progresses.filter((p) => p.status === 'completed');
  const completedQuestIds = completed.map((p) => p.questId);

  const questsByType = {
    route: 0,
    checkin: 0,
    content: 0,
    event: 0,
  };

  const questsByCategory = {
    temple: 0,
    food: 0,
    nightlife: 0,
    culture: 0,
    adventure: 0,
  };

  completed.forEach((progress) => {
    const quest = quests.find((q) => q.id === progress.questId);
    if (quest) {
      questsByType[quest.type]++;
      // Определяем категорию по тегам/описанию (упрощённо)
      if (quest.title.toLowerCase().includes('храм') || quest.title.toLowerCase().includes('temple')) {
        questsByCategory.temple++;
      }
      if (quest.title.toLowerCase().includes('еда') || quest.title.toLowerCase().includes('food')) {
        questsByCategory.food++;
      }
      if (quest.title.toLowerCase().includes('ночь') || quest.title.toLowerCase().includes('night')) {
        questsByCategory.nightlife++;
      }
    }
  });

  // Вычисляем серийность
  const consecutiveQuests = calculateConsecutiveQuests(completed);

  // Вычисляем общие очки
  let totalPoints = 0;
  completed.forEach((progress) => {
    Object.values(progress.stepResults || {}).forEach((result) => {
      if (result.completed && result.points > 0) {
        totalPoints += result.points;
      }
    });
    // Добавляем базовые очки квеста
    const quest = quests.find((q) => q.id === progress.questId);
    if (quest) {
      totalPoints += quest.rewards.points;
    }
  });

  return {
    questsCompleted: completed.length,
    totalPoints,
    completedQuestIds,
    questsByType,
    questsByCategory,
    consecutiveQuests,
  };
}

/**
 * Вычислить количество последовательных квестов
 */
function calculateConsecutiveQuests(completed: QuestProgress[]): number {
  if (completed.length === 0) return 0;

  const sorted = [...completed]
    .filter((p) => p.completedAt)
    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = sorted[i - 1].completedAt!;
    const currDate = sorted[i].completedAt!;
    const daysDiff = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Проверить, выполнены ли условия для NFT-бейджа
 */
export function checkBadgeRequirements(
  badge: NFTBadge,
  userStats: UserStats
): boolean {
  const req = badge.requirements;

  // Проверка количества завершённых квестов
  if (req.questsCompleted && userStats.questsCompleted < req.questsCompleted) {
    return false;
  }

  // Проверка требуемых очков
  if (req.pointsRequired && userStats.totalPoints < req.pointsRequired) {
    return false;
  }

  // Проверка конкретных квестов
  if (req.specificQuests) {
    const hasAllQuests = req.specificQuests.every((questId) =>
      userStats.completedQuestIds.includes(questId)
    );
    if (!hasAllQuests) {
      return false;
    }
  }

  return true;
}

/**
 * Получить все доступные NFT-бейджи для пользователя
 */
export function getAvailableBadges(
  userStats: UserStats,
  allBadges: NFTBadge[] = mockNFTBadges
): NFTBadge[] {
  return allBadges.filter((badge) => checkBadgeRequirements(badge, userStats));
}

/**
 * Получить новые бейджи, которые пользователь только что заработал
 */
export function getNewlyEarnedBadges(
  oldStats: UserStats,
  newStats: UserStats,
  allBadges: NFTBadge[] = mockNFTBadges
): NFTBadge[] {
  const oldBadges = getAvailableBadges(oldStats, allBadges);
  const newBadges = getAvailableBadges(newStats, allBadges);

  return newBadges.filter(
    (badge) => !oldBadges.some((oldBadge) => oldBadge.id === badge.id)
  );
}

/**
 * Preview newly available badge metadata after a local state transition.
 * This does not award a badge; badge_award_fact must come from owner-backed runtime.
 */
export function checkAndAwardBadges(
  completedQuestId: string,
  oldProgresses: QuestProgress[],
  newProgresses: QuestProgress[],
  quests: Quest[]
): NFTBadge[] {
  const oldStats = calculateUserStats(oldProgresses, quests);
  const newStats = calculateUserStats(newProgresses, quests);

  const newBadges = getNewlyEarnedBadges(oldStats, newStats);

  // Legacy/internal diagnostic only. Never treat this as a badge award or proof.
  if (newBadges.length > 0) {
    console.log('Reference-only badge metadata preview:', newBadges.map((b) => b.name));
  }

  return newBadges;
}

