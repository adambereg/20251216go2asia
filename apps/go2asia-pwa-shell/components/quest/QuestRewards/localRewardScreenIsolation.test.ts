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
});
