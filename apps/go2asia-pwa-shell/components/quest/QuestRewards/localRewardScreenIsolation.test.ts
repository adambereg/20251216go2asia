import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, '../../..');

function readAppFile(relativePath: string): string {
  return readFileSync(resolve(appRoot, relativePath), 'utf8');
}

describe('local reward screen isolation', () => {
  it('keeps the legacy completion page non-authoritative', () => {
    const rewardsView = readAppFile('app/(public)/quest/[id]/complete/RewardsView.tsx');

    expect(rewardsView).not.toContain('localStorage.getItem');
    expect(rewardsView).not.toContain('calculateTotalPoints');
    expect(rewardsView).not.toContain('<PointsDisplay');
    expect(rewardsView).not.toContain('<NFTBadgeDisplay');
    expect(rewardsView).toContain('больше не ищет mock-каталог');
    expect(rewardsView).toContain('Локальное завершение не является proof/receipt');
    expect(rewardsView).toContain('Quest_outbox остаётся delivery_intent_only');
  });

  it('keeps the completion route isolated from mock quest lookup', () => {
    const page = readAppFile('app/(public)/quest/[id]/complete/page.tsx');

    expect(page).not.toContain('mockQuests');
    expect(page).not.toContain('notFound');
    expect(page).toContain('<RewardsView questId={id} />');
  });

  it('removes reward-receipt wording from directly connected Quest surfaces', () => {
    const files = [
      readAppFile('components/quest/MyQuests/CompletedQuestCard.tsx'),
      readAppFile('components/quest/QuestRewards/NFTBadgeDisplay.tsx'),
      readAppFile('components/quest/QuestCard.tsx'),
    ].join('\n');

    expect(files).not.toContain('Посмотреть награды');
    expect(files).not.toContain('Полученные бейджи');
    expect(files).not.toContain('Я получил бейдж');
    expect(files).not.toContain('NFT</span>');
  });

  it('keeps the completed quest card away from reward-proof routes and local Points totals', () => {
    const completedCard = readAppFile('components/quest/MyQuests/CompletedQuestCard.tsx');

    expect(completedCard).not.toContain('/complete');
    expect(completedCard).not.toContain('calculateTotalPoints');
    expect(completedCard).not.toContain('Локальная оценка Points');
    expect(completedCard).not.toContain('{totalPoints.toLocaleString()}');
    expect(completedCard).toContain('Только после backend-подтверждения');
    expect(completedCard).toContain('Локальный каталог не является badge_award_fact');
    expect(completedCard).toContain('Открыть runtime Quest');
  });

  it('keeps dormant reward widgets bounded as legacy/internal surfaces', () => {
    const rewardsAnimation = readAppFile('components/quest/QuestRewards/RewardsAnimation.tsx');
    const pointsDisplay = readAppFile('components/quest/QuestRewards/PointsDisplay.tsx');
    const rewardsActions = readAppFile('components/quest/QuestRewards/RewardsActions.tsx');
    const utilsIndex = readAppFile('components/quest/utils/index.ts');

    expect(rewardsAnimation).toContain('Intentionally inert');
    expect(rewardsAnimation).toContain('return null');
    expect(rewardsAnimation).not.toContain('<canvas');
    expect(rewardsAnimation).not.toContain('requestAnimationFrame');
    expect(pointsDisplay).toContain('Not a Points_row');
    expect(rewardsActions).toContain('Must not be used as reward receipt');
    expect(utilsIndex).not.toContain("export * from './rewards'");
  });

  it('keeps active Quest reward preview surfaces in a non-proof class', () => {
    const home = readAppFile('app/(public)/quest/QuestHomeClient.tsx');
    const detail = readAppFile('app/(public)/quest/[id]/QuestDetailClient.tsx');
    const runner = readAppFile('app/(public)/quest/[id]/run/QuestRunnerClient.tsx');
    const questCard = readAppFile('components/quest/QuestCard.tsx');
    const questRewards = readAppFile('components/quest/QuestDetail/QuestRewards.tsx');
    const questSteps = readAppFile('components/quest/QuestDetail/QuestSteps.tsx');
    const files = [home, detail, runner, questCard, questRewards, questSteps].join('\n');

    expect(home).toContain('PROJECTION_LABELS.preview');
    expect(home).toContain('Не Points_row');
    expect(detail).toContain('PROJECTION_LABELS.preview');
    expect(runner).toContain('PROJECTION_LABELS.preview');
    expect(questCard).toContain('badge metadata preview');
    expect(questRewards).toContain('Не badge_award_fact');
    expect(questSteps).toContain('PROJECTION_LABELS.preview');
    expect(questSteps).toContain(': до');

    expect(files).not.toContain('claim reward');
    expect(files).not.toContain('reward receipt');
    expect(files).not.toContain('NFT ownership');
    expect(files).not.toContain('earned');
    expect(files).not.toContain('awarded');
    expect(files).not.toContain('received');
    expect(files).not.toContain('получено');
    expect(files).not.toContain('начислено');
    expect(files).not.toContain('получить награду');
    expect(files).not.toContain('полученный бейдж');
    expect(files).not.toContain('XP');
    expect(files).not.toContain('leaderboard');
  });
});
